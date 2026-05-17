# Role-Based Authentication & Access Control (RBAC) in AMS

## Overview

The Academic Management System implements a **multi-tier role-based authentication system** that ensures users can only access resources and perform actions appropriate to their role. The system uses **Manus OAuth 2.0** for authentication combined with **JWT session tokens** and **tRPC middleware** for authorization.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER LOGIN FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User clicks "Login" → Redirected to Manus OAuth Portal     │
│  2. User authenticates with Manus → Authorization code issued  │
│  3. Browser redirected to /api/oauth/callback with code        │
│  4. Backend exchanges code for access token                    │
│  5. Backend fetches user info from Manus                       │
│  6. User record created/updated in database with role          │
│  7. JWT session token created and set as httpOnly cookie       │
│  8. User redirected to home page                               │
│  9. Frontend fetches auth.me to get current user + role        │
│  10. Role-based routes rendered based on user.role             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Database Schema - User & Role Definition

**File**: `drizzle/schema.ts`

```typescript
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  role: mysqlEnum("role", ["student", "lecturer", "hod", "admin"])
    .default("student")
    .notNull(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
```

**Key Points:**
- **openId**: Unique identifier from Manus OAuth (immutable)
- **role**: Enum with four values: `student`, `lecturer`, `hod`, `admin`
- **loginMethod**: Tracks authentication provider (e.g., "manus")
- **lastSignedIn**: Updated on every login for audit trails

**Role-Specific Profiles:**
- `studentProfiles`: Matric number, department, academic level
- `lecturerProfiles`: Staff ID, department, academic title
- No separate tables for HOD/Admin (roles stored in `users.role`)

---

### 2. Authentication Flow - OAuth & Session Management

**File**: `server/_core/sdk.ts` (Core authentication service)

#### Step 1: OAuth Code Exchange
```typescript
async exchangeCodeForToken(code: string, redirectUri: string) {
  // Exchange authorization code for access token
  const response = await axios.post(
    `${this.baseURL}/ExchangeToken`,
    { code, redirectUri },
    { timeout: AXIOS_TIMEOUT_MS }
  );
  return response.data.access_token;
}
```

#### Step 2: Fetch User Information
```typescript
async getUserInfo(accessToken: string) {
  // Retrieve user details from OAuth provider
  const response = await axios.get(
    `${this.baseURL}/GetUserInfo`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: AXIOS_TIMEOUT_MS,
    }
  );
  return response.data; // { openId, name, email, ... }
}
```

#### Step 3: Create Session Token
```typescript
async createSessionToken(payload: SessionPayload) {
  // Create JWT signed with JWT_SECRET
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("365d")
    .sign(new TextEncoder().encode(this.jwtSecret));
  return token;
}
```

#### Step 4: Verify Session Token
```typescript
async verifySessionToken(token: string) {
  // Verify JWT signature and expiration
  const verified = await jwtVerify(
    token,
    new TextEncoder().encode(this.jwtSecret)
  );
  return verified.payload as SessionPayload;
}
```

**File**: `server/_core/oauth.ts` (OAuth callback handler)

```typescript
export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req, res) => {
    const { code, state } = req.query;
    
    // 1. Exchange code for token
    const accessToken = await sdk.exchangeCodeForToken(code, redirectUri);
    
    // 2. Fetch user info
    const userInfo = await sdk.getUserInfo(accessToken);
    
    // 3. Upsert user in database
    await upsertUser({
      openId: userInfo.openId,
      name: userInfo.name,
      email: userInfo.email,
      loginMethod: "manus",
      lastSignedIn: new Date(),
    });
    
    // 4. Create session token
    const sessionToken = await sdk.createSessionToken({
      openId: userInfo.openId,
      iat: Date.now(),
    });
    
    // 5. Set httpOnly cookie
    res.cookie(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ONE_YEAR_MS,
    });
    
    // 6. Redirect to home
    res.redirect("/");
  });
}
```

---

### 3. Request Context & User Extraction

**File**: `server/_core/context.ts`

```typescript
export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Extract user from session cookie
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
```

**How `authenticateRequest` Works:**
1. Reads `app_session_id` cookie from request
2. Verifies JWT signature and expiration
3. Extracts `openId` from JWT payload
4. Looks up user in database by `openId`
5. Updates `lastSignedIn` timestamp
6. Returns authenticated `User` object (including `role`)

---

### 4. Authorization Middleware - tRPC Procedures

**File**: `server/_core/trpc.ts`

```typescript
// Base procedure (no auth required)
export const publicProcedure = t.procedure;

// Requires authenticated user
const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ 
      code: "UNAUTHORIZED", 
      message: "Please login (10001)" 
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Type-narrowed to non-null
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

// Requires admin role
export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ 
        code: "FORBIDDEN", 
        message: "You do not have required permission (10002)" 
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
```

---

### 5. Role-Specific Procedures

**File**: `server/routers.ts`

```typescript
/**
 * Role-based procedure creators
 */
const studentProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "student") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Student access required" });
  }
  return next({ ctx });
});

const lecturerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "lecturer") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Lecturer access required" });
  }
  return next({ ctx });
});

const hodProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "hod") {
    throw new TRPCError({ code: "FORBIDDEN", message: "HOD access required" });
  }
  return next({ ctx });
});

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
```

**Example Usage:**

```typescript
export const appRouter = router({
  student: router({
    // Only accessible by students
    getProfile: studentProcedure.query(async ({ ctx }) => {
      const profile = await getStudentProfile(ctx.user.id);
      return profile;
    }),

    // Get enrolled courses (student-specific)
    getEnrolledCourses: studentProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      return await db
        .select()
        .from(courseEnrollments)
        .where(eq(courseEnrollments.studentId, ctx.user.id));
    }),
  }),

  lecturer: router({
    // Only accessible by lecturers
    getAssignedCourses: lecturerProcedure.query(async ({ ctx }) => {
      const profile = await getLecturerProfile(ctx.user.id);
      // Return courses assigned to this lecturer
    }),
  }),

  admin: router({
    // Only accessible by admins
    createUser: adminProcedure
      .input(z.object({ email: z.string(), role: z.enum([...]) }))
      .mutation(async ({ input }) => {
        // Create new user
      }),
  }),
});
```

---

### 6. Frontend Authentication & Authorization

**File**: `client/src/_core/hooks/useAuth.ts`

```typescript
export function useAuth(options?: UseAuthOptions) {
  // Fetch current authenticated user from backend
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Logout mutation
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  // Logout function
  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);

  // Return auth state
  return {
    user: meQuery.data ?? null,           // User object with role
    loading: meQuery.isLoading,           // Loading state
    error: meQuery.error,                 // Error state
    isAuthenticated: Boolean(meQuery.data), // Boolean check
    logout,                               // Logout function
  };
}
```

**File**: `client/src/App.tsx` (Role-based routing)

```typescript
function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Authenticated routes
  if (user) {
    return (
      <Switch>
        {/* Student routes */}
        <Route path="/student/dashboard" component={StudentDashboard} />
        <Route path="/student/courses" component={StudentCourses} />
        <Route path="/student/grades" component={StudentGrades} />
        
        {/* Lecturer routes */}
        <Route path="/lecturer/dashboard" component={LecturerDashboard} />
        <Route path="/lecturer/management" component={LecturerCourseManagement} />
        
        {/* HOD routes */}
        <Route path="/hod/dashboard" component={HodDashboard} />
        <Route path="/hod/students" component={HodStudentManagement} />
        
        {/* Admin routes */}
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/users" component={AdminUserManagement} />
        
        {/* Shared routes */}
        <Route path="/notifications" component={Notifications} />
      </Switch>
    );
  }

  // Public routes
  return (
    <Switch>
      <Route path="/" component={Home} />
    </Switch>
  );
}
```

---

### 7. Global Error Handling

**File**: `client/src/main.tsx`

```typescript
// Global error handler for unauthorized requests
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "error" && event.error instanceof TRPCClientError) {
    if (event.error.message === UNAUTHED_ERR_MSG) {
      // Redirect to login
      window.location.href = getLoginUrl();
    }
  }
});
```

**File**: `client/src/main.tsx` (tRPC client setup)

```typescript
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      // CRITICAL: Send cookies with every request
      fetch: async (input, init?) => {
        return fetch(input, {
          ...init,
          credentials: "include", // Attach session cookie
        });
      },
    }),
  ],
});
```

---

## Four User Roles & Their Capabilities

### 1. **Student** (`role: "student"`)

**Database Profile**: `studentProfiles` table
- Matric number (unique identifier)
- Department assignment
- Academic level (100, 200, 300, 400)
- Level offset (for repeated levels)

**Accessible Routes**:
- `/student/dashboard` - Overview, recent courses, announcements
- `/student/courses` - Enrolled courses with materials
- `/student/grades` - GPA, grade distribution, semester trends
- `/student/attendance` - Per-course attendance tracking
- `/student/assignments` - Assignment submission and tracking
- `/student/tutor` - AI tutoring interface

**API Access** (via `studentProcedure`):
- `student.getProfile()` - Fetch own profile
- `student.getEnrolledCourses()` - List enrolled courses
- `student.getCourseAssignments()` - Get assignments for a course
- `student.getCourseAttendance()` - Get attendance records
- `student.getGrades()` - Fetch grades
- `student.submitAssignment()` - Submit assignment
- `student.chatWithTutor()` - AI tutoring

---

### 2. **Lecturer** (`role: "lecturer"`)

**Database Profile**: `lecturerProfiles` table
- Staff ID (unique identifier)
- Department assignment
- Academic title (Dr., Prof., etc.)

**Accessible Routes**:
- `/lecturer/dashboard` - Courses, submissions, grading queue
- `/lecturer/management` - Course details, student lists, sessions
- `/lecturer/grading` - Submission review and grading
- `/lecturer/attendance` - Session tracking and reports

**API Access** (via `lecturerProcedure`):
- `lecturer.getProfile()` - Fetch own profile
- `lecturer.getAssignedCourses()` - List assigned courses
- `lecturer.getCourseStudents()` - Get enrolled students
- `lecturer.createSession()` - Schedule class session
- `lecturer.markAttendance()` - Record attendance
- `lecturer.createAssignment()` - Create assignment
- `lecturer.getSubmissions()` - Get student submissions
- `lecturer.gradeSubmission()` - Grade and provide feedback
- `lecturer.getAIGradingSuggestions()` - AI-assisted grading

---

### 3. **HOD** (`role: "hod"`)

**Database Link**: `departments.hodId` (references `users.id`)
- Head of a specific department
- Inherits lecturer capabilities
- Department-wide oversight

**Accessible Routes**:
- `/hod/dashboard` - Department overview, analytics
- `/hod/students` - Student management and profiles
- `/hod/courses` - Course management and offerings

**API Access** (via `hodProcedure`):
- `hod.getDepartmentOverview()` - Department statistics
- `hod.getDepartmentStudents()` - All students in department
- `hod.getDepartmentLecturers()` - All lecturers in department
- `hod.getDepartmentCourses()` - All courses offered
- `hod.updateStudentLevel()` - Manage student progression
- `hod.activateCourse()` - Activate/deactivate course offering
- `hod.assignLecturerToCourse()` - Assign lecturer to course
- `hod.getDepartmentAnalytics()` - Performance metrics

---

### 4. **Admin** (`role: "admin"`)

**Database Link**: No specific profile table (system-wide access)
- Full system access
- User management
- System configuration

**Accessible Routes**:
- `/admin/dashboard` - System overview, health status
- `/admin/users` - User management (CRUD)
- `/admin/settings` - System configuration

**API Access** (via `adminProcedure`):
- `admin.createUser()` - Create new user
- `admin.updateUser()` - Update user details
- `admin.deleteUser()` - Delete user
- `admin.assignRole()` - Change user role
- `admin.createFaculty()` - Create faculty
- `admin.createDepartment()` - Create department
- `admin.createAcademicSession()` - Create academic session
- `admin.getSystemHealth()` - System status
- `admin.getSystemAnalytics()` - System-wide metrics

---

## Security Features

### 1. **httpOnly Cookies**
- Session tokens stored in `httpOnly` cookies (not accessible via JavaScript)
- Prevents XSS attacks from stealing tokens

### 2. **JWT Signing**
- Tokens signed with `JWT_SECRET` (server-side only)
- Signature verified on every request
- Prevents token tampering

### 3. **HTTPS Enforcement**
- `secure` flag set on cookies (only transmitted over HTTPS)
- `sameSite: "none"` for cross-site requests

### 4. **Session Expiration**
- Tokens expire after 365 days
- `lastSignedIn` updated on each login for audit trails

### 5. **Role-Based Middleware**
- Every API endpoint validates user role
- Unauthorized access returns `FORBIDDEN` error
- No fallback or bypass mechanisms

### 6. **Credential Inclusion**
- Frontend sends `credentials: "include"` with all requests
- Ensures session cookie attached to API calls

---

## Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATED REQUEST                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Frontend calls tRPC procedure                              │
│     trpc.student.getEnrolledCourses.useQuery()                │
│                                                                 │
│  2. HTTP request sent with credentials: "include"             │
│     Cookie: app_session_id=<JWT_TOKEN>                        │
│                                                                 │
│  3. Express middleware receives request                        │
│                                                                 │
│  4. createContext() called:                                    │
│     - Reads app_session_id cookie                             │
│     - Calls sdk.authenticateRequest(req)                      │
│     - Verifies JWT signature                                  │
│     - Extracts openId from JWT                                │
│     - Looks up user in database                               │
│     - Returns User object with role                           │
│                                                                 │
│  5. tRPC middleware chain executed:                           │
│     - studentProcedure checks ctx.user.role === "student"     │
│     - If not student → throws FORBIDDEN error                 │
│     - If student → proceeds to query handler                  │
│                                                                 │
│  6. Query handler executes:                                    │
│     - Uses ctx.user.id to fetch enrolled courses              │
│     - Returns data to frontend                                │
│                                                                 │
│  7. Frontend receives data and updates UI                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Testing RBAC

The AMS includes comprehensive Vitest tests for RBAC:

**File**: `server/routers.test.ts`

```typescript
describe("Role-Based Access Control", () => {
  it("student cannot access lecturer procedures", async () => {
    const studentCtx = createStudentContext();
    const caller = appRouter.createCaller(studentCtx);
    
    expect(() => caller.lecturer.getAssignedCourses())
      .rejects.toThrow("Lecturer access required");
  });

  it("admin can access all procedures", async () => {
    const adminCtx = createAdminContext();
    const caller = appRouter.createCaller(adminCtx);
    
    const result = await caller.admin.createUser({
      email: "test@university.edu",
      role: "student",
    });
    
    expect(result).toBeDefined();
  });
});
```

---

## Configuration & Environment Variables

**Required Environment Variables**:

```bash
# OAuth Configuration
VITE_APP_ID=<your-manus-app-id>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# Session Security
JWT_SECRET=<your-256-bit-secret>

# Database
DATABASE_URL=mysql://user:password@host:3306/ams_db
```

---

## Best Practices for Extending RBAC

### 1. **Creating New Role-Specific Procedures**

```typescript
// Define the procedure
const newRoleProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "new_role") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

// Use in router
export const appRouter = router({
  newRole: router({
    someAction: newRoleProcedure.query(async ({ ctx }) => {
      // Implementation
    }),
  }),
});
```

### 2. **Adding Role-Based Routes**

```typescript
// In App.tsx
if (user?.role === "new_role") {
  return (
    <Switch>
      <Route path="/new-role/dashboard" component={NewRoleDashboard} />
      {/* Other routes */}
    </Switch>
  );
}
```

### 3. **Checking Role in Components**

```typescript
function MyComponent() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminOnlyFeature />;
  }

  return <PublicFeature />;
}
```

### 4. **Database Queries with Role Context**

```typescript
// Use ctx.user.role to filter data
const lecturerCourses = await db
  .select()
  .from(courseOfferings)
  .where(eq(courseOfferings.lecturerId, ctx.user.id));
```

---

## Summary

The AMS RBAC system provides:

✅ **Multi-tier authentication** via Manus OAuth 2.0  
✅ **Secure session management** with JWT and httpOnly cookies  
✅ **Role-based API access** via tRPC middleware  
✅ **Role-based routing** on the frontend  
✅ **Four distinct user roles** with specific capabilities  
✅ **Comprehensive error handling** for unauthorized access  
✅ **Audit trails** via lastSignedIn timestamps  
✅ **Extensible architecture** for adding new roles  

This architecture ensures that users can only access resources and perform actions appropriate to their role, maintaining security and data integrity across the entire system.
