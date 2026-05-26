# Frontend Authentication System - Implementation Guide

## Quick Start

### Installation
```bash
cd "frontend Testing"
pnpm install
npm run dev
```

### Build
```bash
npm run build
```

### Type Check
```bash
npm run check
```

## Project Structure

```
frontend Testing/
├── client/src/
│   ├── pages/
│   │   ├── Register.tsx          ✨ NEW - Registration page (Student/Staff tabs)
│   │   ├── Login.tsx             ✨ NEW - Login page (Student/Staff tabs)
│   │   ├── ForgotPassword.tsx    ✨ NEW - Forgot password page
│   │   ├── ResetPassword.tsx     ✨ NEW - Reset password page
│   │   ├── Home.tsx              ✏️ UPDATED - Landing page with auth links
│   │   ├── StudentDashboard.tsx
│   │   ├── LecturerDashboard.tsx
│   │   ├── HodDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── components/
│   │   └── ui/                   (All existing components preserved)
│   ├── api/
│   │   ├── hooks.ts              ✏️ UPDATED - Added auth hooks
│   │   ├── types.ts              ✏️ UPDATED - Added auth types
│   │   └── client.ts
│   ├── App.tsx                   ✏️ UPDATED - Added auth routes
│   └── main.tsx
├── shared/
│   ├── types.ts
│   └── const.ts
└── package.json
```

## New Routes

### Public Routes (No Authentication Required)
```
GET  /                    - Landing page
GET  /register            - Registration page
GET  /login               - Login page
GET  /forgot-password     - Forgot password page
GET  /reset-password      - Reset password page
```

### Protected Routes (Authentication Required)
```
GET  /student/dashboard   - Student dashboard
GET  /lecturer/dashboard  - Lecturer dashboard
GET  /hod/dashboard       - HOD dashboard
GET  /admin/dashboard     - Admin dashboard
```

## Page Components

### Register.tsx
**Purpose**: Allow students and staff to create new accounts

**Tabs**:
- **Student Tab**
  - First Name (required, min 2 chars)
  - Last Name (required, min 2 chars)
  - Email (required, valid email)
  - Matric Number (required, min 5 chars)
  - Admission Session (required, min 4 chars)
  - Department (required, dropdown)
  - Password (required, min 8 chars)
  - Confirm Password (required, must match)

- **Staff Tab**
  - First Name (required, min 2 chars)
  - Last Name (required, min 2 chars)
  - Email (required, valid email)
  - Staff ID (required, min 3 chars)
  - Department (required, dropdown)
  - Role (required, dropdown: Lecturer/HOD/Admin) - Frontend-only
  - Password (required, min 8 chars)
  - Confirm Password (required, must match)

**API Calls**:
```typescript
// Student registration
useRegisterStudent().mutate({
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  matric_num: string,
  admission_session: string,
  department_id: number
})

// Staff registration
useRegisterStaff().mutate({
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  staff_id: string,
  department_id: number
})
```

### Login.tsx
**Purpose**: Allow students and staff to sign in

**Tabs**:
- **Student Tab**
  - Email or Matric Number (required, min 3 chars)
  - Password (required)
  - "Forgot password?" link

- **Staff Tab**
  - Email or Staff ID (required, min 3 chars)
  - Password (required)
  - "Forgot password?" link

**API Calls**:
```typescript
useLogin().mutate({
  email: string,  // identifier (email or matric/staff ID)
  password: string
})
```

**Redirect Logic**:
- admin → `/admin/dashboard`
- hod → `/hod/dashboard`
- lecturer → `/lecturer/dashboard`
- student → `/student/dashboard`

### ForgotPassword.tsx
**Purpose**: Request a password reset link

**Fields**:
- Email (required, valid email)

**API Calls**:
```typescript
useForgotPassword().mutate({
  email: string
})
```

**Response**:
- Success: Display confirmation message
- Error: Show error toast

### ResetPassword.tsx
**Purpose**: Reset password using a token

**Fields**:
- Reset Token (required)
- New Password (required, min 8 chars)
- Confirm Password (required, must match)

**API Calls**:
```typescript
useResetPassword().mutate({
  token: string,
  newPassword: string
})
```

**Redirect**:
- Success → `/login`

## API Hooks

### useLogin()
```typescript
const mutation = useLogin({
  onSuccess: (data) => { /* handle success */ },
  onError: (error) => { /* handle error */ }
});

mutation.mutate({
  email: string,
  password: string
});
```

### useRegisterStudent()
```typescript
const mutation = useRegisterStudent({
  onSuccess: (data) => { /* handle success */ },
  onError: (error) => { /* handle error */ }
});

mutation.mutate({
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  matric_num: string,
  admission_session: string,
  department_id: number
});
```

### useRegisterStaff()
```typescript
const mutation = useRegisterStaff({
  onSuccess: (data) => { /* handle success */ },
  onError: (error) => { /* handle error */ }
});

mutation.mutate({
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  staff_id: string,
  department_id: number
});
```

### useForgotPassword()
```typescript
const mutation = useForgotPassword({
  onSuccess: (data) => { /* handle success */ },
  onError: (error) => { /* handle error */ }
});

mutation.mutate({
  email: string
});
```

### useResetPassword()
```typescript
const mutation = useResetPassword({
  onSuccess: (data) => { /* handle success */ },
  onError: (error) => { /* handle error */ }
});

mutation.mutate({
  token: string,
  newPassword: string
});
```

## Form Validation

All forms use **React Hook Form** with **Zod** for validation.

### Validation Rules

**Student Registration**:
- firstName: min 2 characters
- lastName: min 2 characters
- email: valid email format
- password: min 8 characters
- confirmPassword: must match password
- matric_num: min 5 characters
- admission_session: min 4 characters
- department_id: required

**Staff Registration**:
- firstName: min 2 characters
- lastName: min 2 characters
- email: valid email format
- password: min 8 characters
- confirmPassword: must match password
- staff_id: min 3 characters
- department_id: required
- role: required (frontend-only)

**Login**:
- identifier: min 3 characters
- password: required

**Forgot Password**:
- email: valid email format

**Reset Password**:
- token: required
- newPassword: min 8 characters
- confirmPassword: must match newPassword

## UI Components Used

### From Existing Library
- `Button` - Submit, navigation buttons
- `Input` - Text fields
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` - Form wrapper
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` - Card layout
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` - Tab navigation
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` - Dropdown selector
- `Spinner` - Loading indicator
- `Link` (from wouter) - Navigation links
- `toast` (from sonner) - Notifications

### Icons (lucide-react)
- `Eye`, `EyeOff` - Password visibility toggle
- `Loader2` - Loading spinner
- `BookOpen` - Logo/branding
- `ArrowLeft` - Back navigation

## Styling

All pages use **Tailwind CSS** with the existing theme system.

### Color Scheme
- Primary: Blue (#2563eb)
- Background: Slate-50 (#f8fafc)
- Cards: White with shadow
- Text: Foreground/Muted-foreground

### Responsive Design
- Mobile: Full width with padding
- Tablet: Centered card (max-w-md)
- Desktop: Centered card (max-w-md)

## State Management

### Form State
- Managed by **React Hook Form**
- Validation by **Zod**
- Error display inline with field labels

### API State
- Managed by **React Query** (via tRPC)
- Loading state: `mutation.isPending`
- Error handling: `mutation.isError`
- Success handling: `mutation.isSuccess`

### Auth State
- Managed by `useAuth()` hook
- Currently returns demo user (frontend-only)
- Should be updated to use actual auth response

## Error Handling

### Validation Errors
- Displayed inline below each field
- Automatic clearing when user corrects input
- Red text color (#ef4444)

### API Errors
- Displayed as toast notifications
- Error message from server or generic fallback
- Auto-dismiss after 5 seconds

### Network Errors
- Handled by React Query retry logic
- User-friendly error messages
- Retry button in toast

## Loading States

### Form Submission
- Submit button disabled during API call
- Loading spinner appears in button
- Button text remains visible

### Page Loading
- Full-page loader while auth is being checked
- Smooth transition to content

## Toast Notifications

Using **Sonner** library:

```typescript
// Success
toast.success("Registration successful! Please login.");

// Error
toast.error("Registration failed. Please try again.");

// Info
toast.info("Check your email for reset link");
```

## Password Management

### Show/Hide Toggle
- Eye icon button on password fields
- Toggles between `type="password"` and `type="text"`
- Preserves input value during toggle

### Confirmation
- Separate field for password confirmation
- Validation ensures both fields match
- Error message if they don't match

## Navigation Flow

### Unauthenticated User
```
Home (/) 
  ↓
  ├→ Sign In → Login (/login)
  │            ↓
  │            ├→ Forgot Password → ForgotPassword (/forgot-password)
  │            │                    ↓
  │            │                    Reset Password (/reset-password)
  │            │
  │            └→ Don't have account? → Register (/register)
  │
  └→ Register → Register (/register)
                ↓
                Already have account? → Login (/login)
```

### Authenticated User
```
Home (/)
  ↓
  Redirect to Dashboard
  ├→ Student → /student/dashboard
  ├→ Lecturer → /lecturer/dashboard
  ├→ HOD → /hod/dashboard
  └→ Admin → /admin/dashboard
```

## Backend Integration Checklist

- [ ] Implement `POST /api/auth/login` endpoint
- [ ] Implement `POST /api/auth/register-student` endpoint
- [ ] Implement `POST /api/auth/register-staff` endpoint
- [ ] Implement `POST /api/auth/forgot-password` endpoint
- [ ] Implement `POST /api/auth/reset-password` endpoint
- [ ] Ensure endpoints return proper error messages
- [ ] Implement token generation and validation
- [ ] Implement email sending for password reset
- [ ] Add CORS headers if needed
- [ ] Add rate limiting for auth endpoints
- [ ] Add input validation on backend
- [ ] Add logging for auth events

## Testing

### Manual Testing
1. Visit `/register` and test student registration
2. Visit `/register` and switch to staff tab
3. Visit `/login` and test student login
4. Visit `/login` and switch to staff tab
5. Test "Forgot password?" link
6. Test password reset flow
7. Test form validation errors
8. Test loading states
9. Test responsive design on mobile

### Automated Testing
- Add unit tests for form validation
- Add integration tests for API calls
- Add E2E tests for user flows

## Troubleshooting

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && pnpm install`
- Clear build cache: `rm -rf dist`
- Run type check: `npm run check`

### Runtime Errors
- Check browser console for errors
- Verify API endpoints are correct
- Check network requests in DevTools
- Verify tRPC router configuration

### Form Not Submitting
- Check form validation errors
- Verify API endpoint is accessible
- Check network tab for failed requests
- Verify mutation hook is properly initialized

---

**Last Updated**: May 20, 2026
**Version**: 1.0.0
