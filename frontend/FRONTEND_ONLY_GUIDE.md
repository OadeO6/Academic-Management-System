# Academic Management System - Frontend-Only Guide

## Overview

This is a **production-grade frontend application** built with React 19, Tailwind CSS 4, and tRPC. The application is designed to work independently without backend APIs and gracefully handles API unavailability.

**Status**: Frontend-only architecture complete. Ready for backend integration.

---

## Project Structure

```
client/src/
├── app/                    # Application entry point
├── pages/                  # Page components (15 pages)
├── layouts/                # Layout components (DashboardLayout)
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui components
│   └── StateComponents.tsx # Loading/Empty/Error states
├── features/               # Feature-specific components
├── hooks/                  # Custom React hooks
├── api/                    # API integration layer
│   ├── types.ts           # API type definitions
│   ├── client.ts          # API client configuration
│   └── hooks.ts           # React Query hooks
├── services/               # Business logic services
├── state/                  # State management
├── utils/                  # Utility functions
├── config/                 # Configuration files
├── contexts/               # React contexts
├── lib/                    # Library setup (tRPC)
├── _core/                  # Core utilities
├── const.ts                # Constants
├── index.css               # Global styles
├── main.tsx                # Entry point
└── App.tsx                 # Root component
```

---

## Architecture

### Frontend-Only Design

The application is built to run independently:

1. **No Backend Required**: All pages render with loading/empty/error states
2. **Graceful Degradation**: Missing APIs don't crash the app
3. **State Management**: Uses React Query for data fetching and caching
4. **Type Safety**: Full TypeScript support with proper typing

### State Handling Pattern

Every page follows this pattern:

```tsx
// 1. Check loading state
if (isLoading) return <LoadingState />;

// 2. Check error state
if (error) return <ErrorState onRetry={...} />;

// 3. Check empty state
if (!data || data.length === 0) return <EmptyState />;

// 4. Render data
return <div>{/* render data */}</div>;
```

### State Components

Four reusable state components handle all UI states:

- **LoadingState**: Shows spinner while data loads
- **EmptyState**: Shows when no data available
- **ErrorState**: Shows when API error occurs
- **ApiUnavailableState**: Shows when backend is offline

---

## Running Locally

### Prerequisites

- Node.js 22+
- pnpm 10+

### Installation

```bash
# Extract the ZIP file
unzip ams-project-restructured.zip
cd ams-project

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### Available Routes

**Public Routes**:
- `/` - Home page (login/signup)

**Student Routes** (requires student role):
- `/student/dashboard` - Student dashboard
- `/student/courses` - Enrolled courses
- `/student/grades` - Grades view
- `/student/attendance` - Attendance tracking
- `/student/assignments` - Assignments
- `/student/tutor` - AI tutor

**Lecturer Routes** (requires lecturer role):
- `/lecturer/dashboard` - Lecturer dashboard
- `/lecturer/courses` - Course management
- `/lecturer/grading` - Grading interface
- `/lecturer/attendance` - Attendance marking

**HOD Routes** (requires hod role):
- `/hod/dashboard` - HOD dashboard
- `/hod/students` - Student management
- `/hod/courses` - Course management

**Admin Routes** (requires admin role):
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/settings` - System settings

**Shared Routes**:
- `/notifications` - Notifications center
- `/404` - Not found page

---

## Pages Overview

### Student Pages (6 pages)

1. **StudentDashboard** - Overview with quick stats
2. **StudentCourses** - Enrolled courses list
3. **StudentGrades** - Grade tracking
4. **StudentAttendance** - Attendance percentage
5. **StudentAssignments** - Assignment submissions
6. **StudentTutor** - AI tutoring interface

### Lecturer Pages (4 pages)

1. **LecturerDashboard** - Overview
2. **LecturerCourseManagement** - Course management
3. **LecturerGrading** - Student grading
4. **LecturerAttendance** - Attendance marking

### HOD Pages (3 pages)

1. **HodDashboard** - Department overview
2. **HodStudentManagement** - Student management
3. **HodCourseManagement** - Course offerings

### Admin Pages (3 pages)

1. **AdminDashboard** - System overview
2. **AdminUserManagement** - User management
3. **AdminSystemSettings** - System configuration

### Shared Pages (2 pages)

1. **Home** - Landing page
2. **Notifications** - Notification center

---

## Backend Integration

### Current Status

- ✅ Frontend architecture complete
- ✅ State management ready
- ✅ API integration layer prepared
- ❌ Backend APIs not implemented
- ❌ Database not connected

### Required Backend Endpoints

The backend team must implement these tRPC procedures:

#### Authentication

```
GET /api/trpc/auth.me - Get current user
POST /api/trpc/auth.logout - Logout user
```

#### Student Endpoints

```
GET /api/trpc/student.getProfile - Get student profile
GET /api/trpc/student.getEnrolledCourses - Get enrolled courses
GET /api/trpc/student.getCourseStats - Get course statistics
GET /api/trpc/student.getGrades - Get student grades
GET /api/trpc/student.getAttendance - Get attendance records
GET /api/trpc/student.getAssignments - Get assignments
POST /api/trpc/student.submitAssignment - Submit assignment
GET /api/trpc/student.getTutorChat - Get tutor chat history
POST /api/trpc/student.sendTutorMessage - Send message to tutor
```

#### Lecturer Endpoints

```
GET /api/trpc/lecturer.getProfile - Get lecturer profile
GET /api/trpc/lecturer.getAssignedCourses - Get assigned courses
GET /api/trpc/lecturer.getCourseStudents - Get course students
POST /api/trpc/lecturer.createAssignment - Create assignment
GET /api/trpc/lecturer.getSubmissions - Get submissions
POST /api/trpc/lecturer.gradeSubmission - Grade submission
POST /api/trpc/lecturer.markAttendance - Mark attendance
GET /api/trpc/lecturer.getCourseAnalytics - Get course analytics
```

#### HOD Endpoints

```
GET /api/trpc/hod.getDepartmentOverview - Get department overview
GET /api/trpc/hod.getStudents - Get department students
GET /api/trpc/hod.getCourses - Get department courses
GET /api/trpc/hod.getLecturers - Get department lecturers
GET /api/trpc/hod.getAnalytics - Get departmental analytics
```

#### Admin Endpoints

```
GET /api/trpc/admin.getUsers - Get all users
POST /api/trpc/admin.createUser - Create user
POST /api/trpc/admin.updateUser - Update user
POST /api/trpc/admin.deleteUser - Delete user
GET /api/trpc/admin.getFaculties - Get faculties
POST /api/trpc/admin.createFaculty - Create faculty
GET /api/trpc/admin.getDepartments - Get departments
POST /api/trpc/admin.createDepartment - Create department
GET /api/trpc/admin.getSessions - Get academic sessions
POST /api/trpc/admin.createSession - Create session
GET /api/trpc/admin.getSystemHealth - Get system health
```

### API Integration Steps

1. **Backend Implementation**:
   - Implement all required tRPC procedures
   - Connect to database
   - Implement RBAC middleware

2. **Frontend Integration**:
   - Update `client/src/api/hooks.ts` with actual API calls
   - Replace TODO comments with real tRPC calls
   - Test each page with real data

3. **Testing**:
   - Test all routes with different user roles
   - Verify error handling
   - Test loading states

---

## Development Guidelines

### Adding a New Page

1. Create page in `client/src/pages/PageName.tsx`
2. Use the PAGE_TEMPLATE.tsx as reference
3. Import state components
4. Add navigation items
5. Add API integration notice
6. Test with EmptyState

### Adding a New Feature

1. Create feature folder in `client/src/features/`
2. Add components specific to that feature
3. Add hooks in `client/src/hooks/`
4. Add API calls in `client/src/api/hooks.ts`
5. Export from feature index

### Styling

- Use Tailwind CSS 4 utilities
- Use shadcn/ui components for consistency
- Follow the design system in `client/src/index.css`
- Use semantic colors (bg-background, text-foreground)

### State Management

- Use React Query for server state
- Use React Context for app state
- Use useState for component state
- Avoid prop drilling

---

## Dependencies

### Core Dependencies

- **react** 19.2.1 - UI library
- **react-dom** 19.2.1 - DOM rendering
- **@tanstack/react-query** 5.90.2 - Server state management
- **@trpc/client** 11.6.0 - tRPC client
- **@trpc/react-query** 11.6.0 - tRPC React integration
- **wouter** 3.3.5 - Routing
- **zod** 4.1.12 - Schema validation

### UI Dependencies

- **@radix-ui/*** - Headless UI components
- **tailwindcss** 4.1.14 - Utility CSS
- **lucide-react** 0.453.0 - Icons
- **recharts** 2.15.2 - Charts
- **sonner** 2.0.7 - Toast notifications
- **framer-motion** 12.23.22 - Animations

### Development Dependencies

- **vite** 7.1.7 - Build tool
- **typescript** 5.9.3 - Type checking
- **tailwindcss** 4.1.14 - Styling
- **prettier** 3.6.2 - Code formatting

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_TRPC_URL=http://localhost:3000/api/trpc

# OAuth Configuration
VITE_APP_ID=your_app_id
VITE_OAUTH_PORTAL_URL=https://oauth.example.com

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

---

## Troubleshooting

### Dev Server Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### TypeScript Errors

```bash
# Type check
pnpm check

# Fix formatting
pnpm format
```

### Routes Not Loading

- Check that page component is exported
- Verify route is added in `App.tsx`
- Check browser console for errors

### API Calls Not Working

- Verify backend server is running
- Check API endpoint URLs in `.env.local`
- Check browser Network tab for requests
- Verify CORS headers from backend

---

## Performance Optimization

### Code Splitting

Routes are automatically code-split by Vite. Each page loads only when accessed.

### Caching

React Query caches data with these defaults:
- Stale time: 5 minutes
- Cache time: 10 minutes
- Retry attempts: 1

### Image Optimization

- Use WebP format when possible
- Lazy load images below the fold
- Use responsive images with srcset

---

## Security

### Authentication

- Uses Manus OAuth 2.0
- Session stored in httpOnly cookie
- CSRF protection enabled
- Automatic logout on 401 errors

### Data Protection

- All API calls use HTTPS
- Credentials included in requests
- XSS protection via React
- CSRF tokens in forms

---

## Deployment

### Build for Production

```bash
pnpm build
```

This creates an optimized build in `dist/public/`.

### Deployment Options

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **Docker**: Build Docker image with Node.js
- **Traditional Server**: Serve static files from `dist/public/`

---

## Support & Feedback

For issues or questions:

1. Check the troubleshooting section
2. Review the API integration guide
3. Check browser console for errors
4. Contact the development team

---

## License

MIT License - See LICENSE file for details

---

**Last Updated**: May 16, 2026  
**Version**: 2.0 (Frontend-Only)  
**Status**: Production-Ready for Backend Integration
