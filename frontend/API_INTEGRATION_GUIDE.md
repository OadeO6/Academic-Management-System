# API Integration Guide - AMS Frontend Restructuring

**Status**: Frontend restructuring in progress  
**Goal**: Prepare frontend for seamless backend integration  
**Date**: May 16, 2026

---

## Overview

This document outlines the frontend restructuring for production readiness. The frontend is being refactored to:

1. **Remove all mock data** (215+ hardcoded data points)
2. **Create proper API abstraction layers** for clean backend integration
3. **Implement comprehensive error/loading/empty states**
4. **Restructure folder organization** for maintainability
5. **Prepare for real backend API integration**

---

## Current Status

### ✅ Completed

- [x] Comprehensive codebase analysis (FRONTEND_ANALYSIS.md)
- [x] API types and contracts defined (client/src/api/types.ts)
- [x] API client configuration with interceptors (client/src/api/client.ts)
- [x] Error handling service (APIErrorHandler)
- [x] Request/response interceptors
- [x] Retry logic with exponential backoff
- [x] API configuration management

### 🔄 In Progress

- [ ] Remove all mock data from components
- [ ] Implement proper loading states
- [ ] Implement empty states
- [ ] Implement error boundaries
- [ ] Create reusable data display components
- [ ] Restructure folder organization
- [ ] Fix routing and navigation

### ⏳ Pending

- [ ] Complete API hooks implementation
- [ ] Wire components to real APIs
- [ ] End-to-end testing
- [ ] Production hardening
- [ ] Documentation completion

---

## API Layer Architecture

### File Structure

```
client/src/api/
├── types.ts           # TypeScript interfaces for all API contracts
├── client.ts          # Centralized API client with interceptors
├── hooks.ts           # React hooks for data fetching
└── endpoints.ts       # (To be created) API endpoint definitions
```

### Key Components

#### 1. **API Types** (`client/src/api/types.ts`)

Defines TypeScript interfaces for all API requests and responses:

```typescript
// User types
export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "student" | "lecturer" | "hod" | "admin";
  // ... other fields
}

// Student-specific types
export interface StudentProfile { ... }
export interface CourseEnrollment { ... }
export interface Assignment { ... }
export interface Grade { ... }

// Lecturer-specific types
export interface LecturerProfile { ... }
export interface SubmissionWithStudent { ... }

// HOD-specific types
export interface Department { ... }
export interface DepartmentAnalyticsData { ... }

// Admin-specific types
export interface Faculty { ... }
export interface AdminDashboardData { ... }

// Shared types
export interface Notification { ... }
export interface APIResponse<T> { ... }
export interface PaginatedResponse<T> { ... }
```

#### 2. **API Client** (`client/src/api/client.ts`)

Provides centralized API client with:

- **Environment-based URLs**: Configurable API endpoints
- **Request Interceptors**: Add auth tokens, headers, request IDs
- **Response Interceptors**: Handle 401/403/5xx errors
- **Error Handling**: Transform errors into user-friendly messages
- **Retry Logic**: Exponential backoff for failed requests
- **Timeout Management**: Configurable timeouts for different request types
- **File Upload Support**: Dedicated upload method with FormData handling

```typescript
// Usage example
import { apiClient, API_CONFIG } from "@/api/client";

// GET request
const users = await apiClient.get("/api/users");

// POST request
const result = await apiClient.post("/api/assignments", assignmentData);

// File upload
const uploadResult = await apiClient.upload("/api/files", file);

// Error handling
try {
  const data = await apiClient.get("/api/data");
} catch (error) {
  const apiError = APIErrorHandler.handle(error);
  const userMessage = APIErrorHandler.getMessageForUser(apiError);
  console.error(userMessage);
}
```

#### 3. **API Hooks** (`client/src/api/hooks.ts`)

Custom React hooks for data fetching with React Query:

```typescript
// Student hooks
export function useStudentProfile(options?: UseQueryOptions)
export function useStudentEnrolledCourses(options?: UseQueryOptions)
export function useStudentCourseDetails(courseOfferingId: number, options?: UseQueryOptions)
export function useStudentCourseAssignments(courseOfferingId: number, options?: UseQueryOptions)
export function useStudentCourseAttendance(courseOfferingId: number, options?: UseQueryOptions)
export function useStudentGrades(options?: UseQueryOptions)
export function useSubmitAssignment(options?: UseMutationOptions)
export function useSendAIMessage(options?: UseMutationOptions)

// Lecturer hooks
export function useLecturerProfile(options?: UseQueryOptions)
export function useLecturerAssignedCourses(options?: UseQueryOptions)
export function useGradeSubmission(options?: UseMutationOptions)

// HOD hooks
export function useHodDepartmentOverview(options?: UseQueryOptions)

// Admin hooks
export function useAdminUsers(options?: UseQueryOptions)
export function useUpdateUserRole(options?: UseMutationOptions)

// Auth hooks
export function useLogout(options?: UseMutationOptions)
```

**Usage Example**:

```typescript
import { useStudentEnrolledCourses } from "@/api/hooks";

function StudentCoursesPage() {
  const { data: courses, isLoading, error } = useStudentEnrolledCourses();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!courses?.length) return <EmptyState />;

  return (
    <div>
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

---

## Backend Integration Checklist

### Required tRPC Procedures

#### Student Routes

```typescript
// ✅ Implemented
student.getProfile()                    // Get student profile
student.getEnrolledCourses()            // Get enrolled courses
student.getCourseDetails(offeringId)    // Get course details
student.getCourseAssignments(courseOfferingId)  // Get assignments
student.getCourseAttendance(courseOfferingId)   // Get attendance
student.getGrades()                     // Get grades
student.submitAssignment(assignmentId, fileUrl) // Submit assignment
student.sendAiMessage(courseOfferingId, message) // Send AI message

// ❌ To be implemented
student.getAssignmentSubmissions()      // Get student's submissions
student.getAssignmentFeedback(submissionId)     // Get feedback on submission
student.getCourseMaterials(courseOfferingId)    // Get course materials
student.getUpcomingAssignments()        // Get upcoming assignments
student.getGradeHistory()               // Get grade history
```

#### Lecturer Routes

```typescript
// ✅ Implemented
lecturer.getProfile()                   // Get lecturer profile
lecturer.getAssignedCourses()           // Get assigned courses
lecturer.gradeSubmission(submissionId, points, feedback) // Grade submission

// ❌ To be implemented
lecturer.getCourseStudents(courseOfferingId)    // Get course students
lecturer.getSubmissions(courseOfferingId)       // Get submissions for grading
lecturer.createAssignment(courseOfferingId, title, dueDate, points)
lecturer.createSession(courseOfferingId, date, time, location)
lecturer.markAttendance(sessionId, attendance[])
lecturer.getSessionAttendance(sessionId)
lecturer.getCourseAnalytics(courseOfferingId)   // Grade distribution, attendance trends
lecturer.getGradebook(courseOfferingId)         // Full gradebook
lecturer.exportGradebook(courseOfferingId, format) // Export to CSV/PDF
lecturer.uploadCourseMaterial(courseOfferingId, file)
```

#### HOD Routes

```typescript
// ✅ Implemented
hod.getDepartmentOverview()             // Department stats
hod.getDepartmentStudents(departmentId) // Get students
hod.getDepartmentLecturers(departmentId) // Get lecturers

// ❌ To be implemented
hod.getDepartmentCourses(departmentId)  // Get courses
hod.updateStudentLevel(studentId, newLevel, levelOffset)
hod.activateCourseOffering(courseOfferingId, status)
hod.assignLecturerToCourse(courseOfferingId, lecturerId)
hod.getDepartmentAnalytics(departmentId) // Performance metrics
hod.getLecturerPerformance(lecturerId)  // Lecturer analytics
hod.getStudentProgress(studentId)       // Student progress report
```

#### Admin Routes

```typescript
// ✅ Implemented
admin.getAllUsers()                     // Get all users
admin.updateUserRole(userId, newRole)   // Update user role

// ❌ To be implemented
admin.createUser(email, name, role, departmentId, matricNumber, staffId)
admin.updateUser(userId, email, name)
admin.deleteUser(userId)
admin.createFaculty(name, description)
admin.updateFaculty(facultyId, name, description)
admin.deleteFaculty(facultyId)
admin.createDepartment(facultyId, name, description)
admin.updateDepartment(departmentId, name, description)
admin.deleteDepartment(departmentId)
admin.createAcademicSession(year, startDate, endDate)
admin.createSemester(academicSessionId, name, startDate, endDate)
admin.activateSemester(semesterId)
admin.getSystemHealth()                 // Database, API, storage, AI service status
admin.getSystemSettings()               // System configuration
admin.updateSystemSettings(settings)    // Update configuration
```

#### Shared Routes

```typescript
// ✅ Implemented
auth.me()                               // Get current user
auth.logout()                           // Logout

// ❌ To be implemented
notifications.getNotifications()        // Get user notifications
notifications.markAsRead(notificationId)
notifications.deleteNotification(notificationId)
notifications.getNotificationPreferences()
notifications.updateNotificationPreferences(preferences)
announcements.getAnnouncements(courseOfferingId)
announcements.createAnnouncement(courseOfferingId, title, content)
announcements.deleteAnnouncement(announcementId)
```

---

## Mock Data Removal Strategy

### Current State: 215+ Mock Data Points

All pages currently contain hardcoded data. The removal strategy:

1. **Identify mock data** in each component
2. **Replace with API hook** that fetches real data
3. **Add loading state** while data is fetching
4. **Add empty state** when no data is available
5. **Add error state** when API call fails

### Example: StudentDashboard.tsx

**Before** (Mock Data):

```typescript
// Hardcoded mock data
{[1, 2, 3].map((i) => (
  <Card key={i}>
    <CardTitle>CS{200 + i}01 - Advanced Programming</CardTitle>
    <CardDescription>Dr. Smith • 3 Credit Units</CardDescription>
    <p className="text-sm font-semibold">85%</p>
  </Card>
))}
```

**After** (Real Data):

```typescript
import { useStudentEnrolledCourses } from "@/api/hooks";

function StudentDashboard() {
  const { data: courses, isLoading, error } = useStudentEnrolledCourses();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!courses?.length) return <EmptyState message="No enrolled courses" />;

  return (
    <div className="grid gap-4">
      {courses.map((enrollment) => (
        <CourseCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  );
}
```

---

## Component State Management

### Loading States

Use React Query's `isLoading` state:

```typescript
if (isLoading) {
  return <LoadingSkeleton />;
}
```

### Empty States

Check if data array is empty:

```typescript
if (!data?.length) {
  return <EmptyStateComponent message="No data available" />;
}
```

### Error States

Use React Query's `error` state:

```typescript
if (error) {
  return <ErrorBoundary error={error} />;
}
```

### Success States

Render actual data:

```typescript
return (
  <div>
    {data.map(item => (
      <ItemComponent key={item.id} item={item} />
    ))}
  </div>
);
```

---

## Environment Configuration

### Environment Variables

```bash
# .env.local
VITE_API_URL=http://localhost:3000
VITE_TRPC_URL=http://localhost:3000/api/trpc
VITE_APP_ID=your-app-id
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
```

### API Configuration

```typescript
// client/src/api/client.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  TRPC_URL: import.meta.env.VITE_TRPC_URL || "http://localhost:3000/api/trpc",
  REQUEST_TIMEOUT: 30000,
  UPLOAD_TIMEOUT: 120000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  CACHE_TIME: 5 * 60 * 1000,
  STALE_TIME: 1 * 60 * 1000,
};
```

---

## Error Handling Strategy

### API Error Handler

```typescript
import { APIErrorHandler } from "@/api/client";

try {
  const data = await apiClient.get("/api/data");
} catch (error) {
  const apiError = APIErrorHandler.handle(error);
  const userMessage = APIErrorHandler.getMessageForUser(apiError);
  
  if (APIErrorHandler.isRetryable(apiError)) {
    // Retry the request
  } else {
    // Show error to user
    toast.error(userMessage);
  }
}
```

### Error Boundary Component

```typescript
import { ErrorBoundary } from "@/components/ErrorBoundary";

<ErrorBoundary>
  <StudentDashboard />
</ErrorBoundary>
```

---

## Testing Strategy

### Unit Tests

Test API hooks with React Testing Library:

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useStudentEnrolledCourses } from "@/api/hooks";

test("useStudentEnrolledCourses fetches data", async () => {
  const { result } = renderHook(() => useStudentEnrolledCourses());

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual([...]);
});
```

### Integration Tests

Test complete data flow:

```typescript
test("StudentDashboard displays courses", async () => {
  render(<StudentDashboard />);

  await waitFor(() => {
    expect(screen.getByText("Course Name")).toBeInTheDocument();
  });
});
```

---

## Performance Optimization

### Query Caching

```typescript
// Automatically cached for 5 minutes
const { data } = useStudentEnrolledCourses({
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});
```

### Pagination

```typescript
// For large datasets
const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
  queryKey: ["students"],
  queryFn: ({ pageParam = 1 }) =>
    apiClient.get(`/api/students?page=${pageParam}`),
  getNextPageParam: (lastPage) => lastPage.nextPage,
});
```

### Prefetching

```typescript
const queryClient = useQueryClient();

queryClient.prefetchQuery({
  queryKey: ["student", "courses"],
  queryFn: () => trpc.student.getEnrolledCourses.query(),
});
```

---

## Next Steps

1. **Complete API hooks** for all endpoints
2. **Remove mock data** from all components
3. **Implement loading/empty/error states**
4. **Create reusable components** for data display
5. **Restructure folder organization**
6. **Add comprehensive error handling**
7. **Implement caching strategy**
8. **Write unit and integration tests**
9. **Performance optimization**
10. **Production hardening**

---

## Backend Partner Checklist

For backend team implementing the APIs:

- [ ] Implement all required tRPC procedures
- [ ] Add input validation with Zod
- [ ] Add error handling with proper HTTP status codes
- [ ] Add pagination support for list endpoints
- [ ] Add filtering and sorting support
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Add response caching headers
- [ ] Add CORS configuration
- [ ] Write API documentation
- [ ] Write integration tests
- [ ] Performance test with load testing

---

## Questions & Support

For integration questions, refer to:

1. **FRONTEND_ANALYSIS.md** - Detailed codebase analysis
2. **RBAC_DOCUMENTATION.md** - Authentication and authorization
3. **API Types** - `client/src/api/types.ts`
4. **API Client** - `client/src/api/client.ts`
5. **API Hooks** - `client/src/api/hooks.ts`

---

**Last Updated**: May 16, 2026  
**Version**: 1.0  
**Status**: In Progress
