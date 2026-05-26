/**
 * Simplified API Hooks
 * 
 * These hooks provide a clean abstraction for data fetching
 * They work with the existing backend and can be extended as needed
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { APIErrorHandler, apiClient } from "./client";
import type { 
  UseQueryOptions, 
  UseMutationOptions, 
  CourseFilterParams, 
  CourseListingResponse, 
  CourseDetailResponse, 
  RegisterCourseRequest, 
  RegisterCourseResponse, 
  DropCourseRequest, 
  DropCourseResponse, 
  RegisteredCourseFilterParams, 
  CourseMaterialFilterParams, 
  CourseMaterial, 
  Assignment, 
  AssignmentDetail, 
  AssignmentSubmissionRequest, 
  AssignmentSubmissionResponse, 
  GradeDetail, 
  AnnouncementFilterParams, 
  Announcement, 
  AttendanceRecordDetail, 
  AttendanceSummary, 
  CourseSession, 
  CourseSessionDetail, 
  NotificationFilterParams, 
  NotificationListingResponse, 
  LecturerCourseFilterParams,
  LecturerCourseListingResponse,
  LecturerCourseDetail,
  CourseStudentFilterParams,
  CourseStudentListingResponse,
  ApproveStudentRequest,
  ApproveStudentResponse,
  LecturerMaterial,
  CreateMaterialRequest,
  UpdateMaterialRequest,
  DeleteMaterialRequest,
  MaterialResponse,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  DeleteTaskRequest,
  TaskListingResponse,
  Submission,
  SubmissionDetail,
  GradeSubmissionRequest,
  GradeSubmissionResponse,
  LecturerSession,
  LecturerSessionDetail,
  CreateSessionRequest,
  UpdateSessionRequest,
  DeleteSessionRequest,
  SessionListingResponse,
  SessionAttendance,
  MarkAttendanceBulkRequest,
  MarkAttendanceResponse,
  GradebookResponse,
  UpdateGradebookEntryRequest,
  LecturerAnnouncement,
  CreateLecturerAnnouncementRequest,
  DeleteLecturerAnnouncementRequest,
  LecturerAnnouncementListingResponse,
  StudentListingItem,
  StudentDetail,
  UpdateLevelOffsetRequest,
  StudentFilterParams,
  LecturerListingItem,
  LecturerDetail,
  LecturerFilterParams,
  CourseDefinitionListingItem,
  CourseDefinitionDetail,
  CreateCourseDefinitionRequest,
  UpdateCourseDefinitionRequest,
  CourseDefinitionFilterParams,
  CourseOfferingDetailItem,
  CreateCourseOfferingRequest,
  ActivateCourseOfferingRequest,
  AssignLecturerRequest,
  UnassignLecturerRequest,
  RegisterStudentRequest,
  RegisterStaffRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserProfile,
  UpdateProfilePayload,
  UploadAvatarPayload,
  UserAccountInfo,
  ChangePasswordPayload,
  UserSecurityInfo,
  RevokeSessionPayload,
  StudentProfileInfo,
  StaffProfileInfo
} from "./types";

/**
 * STUDENT HOOKS
 */

export function useStudentProfile(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["student", "profile"],
    queryFn: async () => {
      try {
        return await (trpc.student.getProfile as any).query();
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useStudentEnrolledCourses(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["student", "courses"],
    queryFn: async () => {
      try {
        return await (trpc.student.getEnrolledCourses as any).query();
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useStudentCourseDetails(
  courseOfferingId: number,
  options?: UseQueryOptions
) {
  return useQuery({
    queryKey: ["student", "course", courseOfferingId],
    queryFn: async () => {
      try {
        return await (trpc.student.getCourseDetails as any).query({
          offeringId: courseOfferingId,
        });
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    enabled: !!courseOfferingId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useStudentCourseAssignments(
  courseOfferingId: number,
  options?: UseQueryOptions
) {
  return useQuery({
    queryKey: ["student", "assignments", courseOfferingId],
    queryFn: async () => {
      try {
        return await (trpc.student.getCourseAssignments as any).query({
          courseOfferingId,
        });
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    enabled: !!courseOfferingId,
    staleTime: 3 * 60 * 1000,
    ...options,
  });
}

export function useStudentCourseAttendance(
  courseOfferingId: number,
  options?: UseQueryOptions
) {
  return useQuery({
    queryKey: ["student", "attendance", courseOfferingId],
    queryFn: async () => {
      try {
        return await (trpc.student.getCourseAttendance as any).query({
          courseOfferingId,
        });
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    enabled: !!courseOfferingId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * LECTURER HOOKS
 */

export function useLecturerProfile(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["lecturer", "profile"],
    queryFn: async () => {
      try {
        return await (trpc.lecturer.getProfile as any).query();
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useLecturerAssignedCourses(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["lecturer", "courses"],
    queryFn: async () => {
      try {
        return await (trpc.lecturer.getAssignedCourses as any).query();
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * ADMIN HOOKS
 */

export function useAdminDashboardStats(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      try {
        return await (trpc.admin.getDashboardStats as any).query();
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    staleTime: 1 * 60 * 1000,
    ...options,
  });
}

export function useAdminUsers(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      try {
        return await (trpc.admin.getUsers as any).query();
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * AUTH HOOKS
 */

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: any) => {
      try {
        return await (trpc.auth.login as any).mutate(credentials);
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await (trpc.auth.register as any).mutate(data);
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
  });
}

export function useRegisterStudent(
  options?: UseMutationOptions<any, Error, RegisterStudentRequest>
) {
  return useMutation<any, Error, RegisterStudentRequest>({
    mutationFn: (data: RegisterStudentRequest) =>
      apiClient.post("/api/auth/register/student", data),
    ...options,
  });
}

export function useRegisterStaff(
  options?: UseMutationOptions<any, Error, RegisterStaffRequest>
) {
  return useMutation<any, Error, RegisterStaffRequest>({
    mutationFn: (data: RegisterStaffRequest) =>
      apiClient.post("/api/auth/register/staff", data),
    ...options,
  });
}

export function useForgotPassword(
  options?: UseMutationOptions<any, Error, ForgotPasswordRequest>
) {
  return useMutation<any, Error, ForgotPasswordRequest>({
    mutationFn: (data: ForgotPasswordRequest) =>
      apiClient.post("/api/auth/forgot-password", data),
    ...options,
  });
}

export function useResetPassword(
  options?: UseMutationOptions<any, Error, ResetPasswordRequest>
) {
  return useMutation<any, Error, ResetPasswordRequest>({
    mutationFn: (data: ResetPasswordRequest) =>
      apiClient.post("/api/auth/reset-password", data),
    ...options,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        return await (trpc.auth.logout as any).mutate();
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/";
    },
  });
}

/**
 * CORE MODULE HOOKS (Fetch-based)
 */

// Available Courses
export function useAvailableCourses(params: CourseFilterParams, options?: UseQueryOptions<CourseListingResponse>) {
  return useQuery({
    queryKey: ["courses", "available", params],
    queryFn: () => apiClient.get<CourseListingResponse>("/api/student/courses/available", { params } as any),
    ...options,
  });
}

export function useCourseDetail(courseOfferingId: number, options?: UseQueryOptions<CourseDetailResponse>) {
  return useQuery({
    queryKey: ["courses", "detail", courseOfferingId],
    queryFn: () => apiClient.get<CourseDetailResponse>(`/api/student/courses/${courseOfferingId}`),
    enabled: !!courseOfferingId,
    ...options,
  });
}

export function useRegisterCourse(options?: UseMutationOptions<RegisterCourseResponse, Error, RegisterCourseRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterCourseRequest) => 
      apiClient.post<RegisterCourseResponse>("/api/student/courses/register", { courseOfferingId: data.courseOfferingId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    ...options,
  });
}

export function useDropCourse(options?: UseMutationOptions<DropCourseResponse, Error, DropCourseRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DropCourseRequest) => 
      apiClient.post<DropCourseResponse>("/api/student/courses/drop", { courseOfferingId: data.courseOfferingId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    ...options,
  });
}

// Registered Courses
export function useRegisteredCourses(params: RegisteredCourseFilterParams, options?: UseQueryOptions<CourseListingResponse>) {
  return useQuery({
    queryKey: ["courses", "registered", params],
    queryFn: () => apiClient.get<CourseListingResponse>("/api/student/courses/registered", { params } as any),
    ...options,
  });
}

// Materials
export function useCourseMaterials(courseOfferingId: number, options?: UseQueryOptions<CourseMaterial[]>) {
  return useQuery({
    queryKey: ["materials", courseOfferingId],
    queryFn: () => apiClient.get<CourseMaterial[]>(`/api/student/courses/${courseOfferingId}/materials`),
    enabled: !!courseOfferingId,
    ...options,
  });
}

export function useDownloadMaterial() {
  return useMutation({
    mutationFn: async ({ materialId, courseOfferingId }: { materialId: number; courseOfferingId: number }) => {
      const response = await fetch(`/api/student/courses/${courseOfferingId}/materials/${materialId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `material-${materialId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  });
}

// Assignments
export function useStudentAssignments(options?: UseQueryOptions<AssignmentDetail[]>) {
  return useQuery({
    queryKey: ["assignments", "student"],
    queryFn: () => apiClient.get<AssignmentDetail[]>("/api/student/assignments"),
    ...options,
  });
}

export function useSubmitAssignment(options?: UseMutationOptions<AssignmentSubmissionResponse, Error, { assignmentId: number; file: File }>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, file }: { assignmentId: number; file: File }) => 
      apiClient.upload<AssignmentSubmissionResponse>(`/api/student/assignments/${assignmentId}/submit`, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
    ...options,
  });
}

// Grades
export function useStudentGrades(options?: UseQueryOptions<GradeDetail[]>) {
  return useQuery({
    queryKey: ["grades", "student"],
    queryFn: () => apiClient.get<GradeDetail[]>("/api/student/grades"),
    ...options,
  });
}

// Announcements
export function useAnnouncements(params: AnnouncementFilterParams, options?: UseQueryOptions<Announcement[]>) {
  return useQuery({
    queryKey: ["announcements", params],
    queryFn: () => apiClient.get<Announcement[]>(`/api/student/courses/${params.courseOfferingId}/announcements`),
    ...options,
  });
}

// Attendance
export function useAttendanceRecords(options?: UseQueryOptions<AttendanceRecordDetail[]>) {
  return useQuery({
    queryKey: ["attendance", "student"],
    queryFn: () => apiClient.get<AttendanceRecordDetail[]>("/api/student/attendance"),
    ...options,
  });
}

export function useAttendanceSummary(options?: UseQueryOptions<AttendanceSummary[]>) {
  return useQuery({
    queryKey: ["attendance", "summary"],
    queryFn: () => apiClient.get<AttendanceSummary[]>("/api/student/attendance/summary"),
    ...options,
  });
}

// Student Course Grades
export function useStudentCourseGrades(courseOfferingId: number, options?: UseQueryOptions<GradeDetail[]>) {
  return useQuery({
    queryKey: ["grades", "student", courseOfferingId],
    queryFn: () => apiClient.get<GradeDetail[]>(`/api/student/courses/${courseOfferingId}/grades`),
    enabled: !!courseOfferingId,
    ...options,
  });
}

// Sessions
export function useCourseSessions(courseOfferingId: number, options?: UseQueryOptions<CourseSessionDetail[]>) {
  return useQuery({
    queryKey: ["sessions", courseOfferingId],
    queryFn: () => apiClient.get<CourseSessionDetail[]>(`/api/student/courses/${courseOfferingId}/sessions`),
    enabled: !!courseOfferingId,
    ...options,
  });
}

// Session Details
export function useSessionDetails(courseOfferingId: number, sessionId: number, options?: UseQueryOptions<CourseSessionDetail>) {
  return useQuery({
    queryKey: ["sessions", courseOfferingId, sessionId],
    queryFn: () => apiClient.get<CourseSessionDetail>(`/api/student/courses/${courseOfferingId}/sessions/${sessionId}`),
    enabled: !!courseOfferingId && !!sessionId,
    ...options,
  });
}

// Notifications
export function useNotifications(params: NotificationFilterParams, options?: UseQueryOptions<NotificationListingResponse>) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => apiClient.get<NotificationListingResponse>("/api/notifications", { params } as any),
    ...options,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) => 
      apiClient.post(`/api/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * LECTURER CORE MODULE HOOKS (Fetch-based)
 */

// Assigned Courses
export function useLecturerCourses(params: LecturerCourseFilterParams, options?: UseQueryOptions<LecturerCourseListingResponse>) {
  return useQuery({
    queryKey: ["lecturer", "courses", params],
    queryFn: () => apiClient.get<LecturerCourseListingResponse>("/api/lecturer/courses", { params } as any),
    ...options,
  });
}

export function useLecturerCourseDetail(courseOfferingId: number, options?: UseQueryOptions<LecturerCourseDetail>) {
  return useQuery({
    queryKey: ["lecturer", "courses", courseOfferingId],
    queryFn: () => apiClient.get<LecturerCourseDetail>(`/api/lecturer/courses/${courseOfferingId}`),
    enabled: !!courseOfferingId,
    ...options,
  });
}

// Student Management
export function useCourseStudents(courseOfferingId: number, params: CourseStudentFilterParams, options?: UseQueryOptions<CourseStudentListingResponse>) {
  return useQuery({
    queryKey: ["lecturer", "courses", courseOfferingId, "students", params],
    queryFn: () => apiClient.get<CourseStudentListingResponse>(`/api/lecturer/courses/${courseOfferingId}/students`, { params } as any),
    enabled: !!courseOfferingId,
    ...options,
  });
}

export function useApproveStudent(options?: UseMutationOptions<ApproveStudentResponse, Error, ApproveStudentRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ApproveStudentRequest) => 
      apiClient.post<ApproveStudentResponse>(`/api/lecturer/courses/${data.courseOfferingId}/students/${data.studentId}/approve`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "students"] });
    },
    ...options,
  });
}

// Materials Management
export function useLecturerCourseMaterials(courseOfferingId: number, options?: UseQueryOptions<LecturerMaterial[]>) {
  return useQuery({
    queryKey: ["lecturer", "courses", courseOfferingId, "materials"],
    queryFn: () => apiClient.get<LecturerMaterial[]>(`/api/lecturer/courses/${courseOfferingId}/materials`),
    enabled: !!courseOfferingId,
    ...options,
  });
}

export function useCreateMaterial(options?: UseMutationOptions<MaterialResponse, Error, CreateMaterialRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMaterialRequest) => 
      apiClient.upload<MaterialResponse>(`/api/lecturer/courses/${data.courseOfferingId}/materials`, data.file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "materials"] });
    },
    ...options,
  });
}

export function useUpdateMaterial(options?: UseMutationOptions<MaterialResponse, Error, UpdateMaterialRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateMaterialRequest) => 
      apiClient.patch<MaterialResponse>(`/api/lecturer/courses/${data.courseOfferingId}/materials/${data.materialId}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "materials"] });
    },
    ...options,
  });
}

export function useDeleteMaterial(options?: UseMutationOptions<MaterialResponse, Error, DeleteMaterialRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteMaterialRequest) => 
      apiClient.delete<MaterialResponse>(`/api/lecturer/courses/${data.courseOfferingId}/materials/${data.materialId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "materials"] });
    },
    ...options,
  });
}

// Task Management
export function useLecturerCourseTasks(courseOfferingId: number, options?: UseQueryOptions<TaskListingResponse>) {
  return useQuery({
    queryKey: ["lecturer", "courses", courseOfferingId, "tasks"],
    queryFn: () => apiClient.get<TaskListingResponse>(`/api/lecturer/courses/${courseOfferingId}/tasks`),
    enabled: !!courseOfferingId,
    ...options,
  });
}

export function useCreateTask(options?: UseMutationOptions<Task, Error, CreateTaskRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskRequest) => 
      apiClient.post<Task>(`/api/lecturer/courses/${data.courseOfferingId}/tasks`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "tasks"] });
    },
    ...options,
  });
}

export function useUpdateTask(options?: UseMutationOptions<Task, Error, UpdateTaskRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTaskRequest) => 
      apiClient.patch<Task>(`/api/lecturer/courses/${data.courseOfferingId}/tasks/${data.taskId}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "tasks"] });
    },
    ...options,
  });
}

export function useDeleteTask(options?: UseMutationOptions<MaterialResponse, Error, DeleteTaskRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteTaskRequest) => 
      apiClient.delete<MaterialResponse>(`/api/lecturer/courses/${data.courseOfferingId}/tasks/${data.taskId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "tasks"] });
    },
    ...options,
  });
}

// Submissions & Grading
export function useTaskSubmissions(courseOfferingId: number, taskId: number, options?: UseQueryOptions<Submission[]>) {
  return useQuery({
    queryKey: ["lecturer", "courses", courseOfferingId, "tasks", taskId, "submissions"],
    queryFn: () => apiClient.get<Submission[]>(`/api/lecturer/courses/${courseOfferingId}/tasks/${taskId}/submissions`),
    enabled: !!courseOfferingId && !!taskId,
    ...options,
  });
}

export function useSubmissionDetail(courseOfferingId: number, taskId: number, submissionId: number, options?: UseQueryOptions<SubmissionDetail>) {
  return useQuery({
    queryKey: ["lecturer", "courses", courseOfferingId, "tasks", taskId, "submissions", submissionId],
    queryFn: () => apiClient.get<SubmissionDetail>(`/api/lecturer/courses/${courseOfferingId}/tasks/${taskId}/submissions/${submissionId}`),
    enabled: !!courseOfferingId && !!taskId && !!submissionId,
    ...options,
  });
}

export function useGradeSubmission(options?: UseMutationOptions<GradeSubmissionResponse, Error, GradeSubmissionRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GradeSubmissionRequest) => 
      apiClient.post<GradeSubmissionResponse>(`/api/lecturer/courses/${data.courseOfferingId}/tasks/${data.taskId}/submissions/${data.submissionId}/grade`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "tasks", variables.taskId, "submissions"] });
    },
    ...options,
  });
}

// Session Management
export function useLecturerCourseSessions(courseOfferingId: number, options?: UseQueryOptions<SessionListingResponse>) {
  return useQuery({
    queryKey: ["lecturer", "courses", courseOfferingId, "sessions"],
    queryFn: () => apiClient.get<SessionListingResponse>(`/api/lecturer/courses/${courseOfferingId}/sessions`),
    enabled: !!courseOfferingId,
    ...options,
  });
}

export function useCreateSession(options?: UseMutationOptions<LecturerSession, Error, CreateSessionRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSessionRequest) => 
      apiClient.post<LecturerSession>(`/api/lecturer/courses/${data.courseOfferingId}/sessions`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "sessions"] });
    },
    ...options,
  });
}

export function useUpdateSession(options?: UseMutationOptions<LecturerSession, Error, UpdateSessionRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSessionRequest) => 
      apiClient.patch<LecturerSession>(`/api/lecturer/courses/${data.courseOfferingId}/sessions/${data.sessionId}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "sessions"] });
    },
    ...options,
  });
}

export function useDeleteSession(options?: UseMutationOptions<MaterialResponse, Error, DeleteSessionRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteSessionRequest) => 
      apiClient.delete<MaterialResponse>(`/api/lecturer/courses/${data.courseOfferingId}/sessions/${data.sessionId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "sessions"] });
    },
    ...options,
  });
}

// Attendance Management
export function useSessionAttendance(courseOfferingId: number, sessionId: number, options?: UseQueryOptions<SessionAttendance>) {
  return useQuery({
    queryKey: ["lecturer", "courses", courseOfferingId, "sessions", sessionId, "attendance"],
    queryFn: () => apiClient.get<SessionAttendance>(`/api/lecturer/courses/${courseOfferingId}/sessions/${sessionId}/attendance`),
    enabled: !!courseOfferingId && !!sessionId,
    ...options,
  });
}

export function useMarkAttendanceBulk(options?: UseMutationOptions<MarkAttendanceResponse, Error, MarkAttendanceBulkRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MarkAttendanceBulkRequest) => 
      apiClient.post<MarkAttendanceResponse>(`/api/lecturer/courses/${data.courseOfferingId}/sessions/${data.sessionId}/attendance`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "sessions", variables.sessionId, "attendance"] });
    },
    ...options,
  });
}

// Gradebook
export function useGradebook(courseOfferingId: number, options?: UseQueryOptions<GradebookResponse>) {
  return useQuery({
    queryKey: ["lecturer", "courses", courseOfferingId, "gradebook"],
    queryFn: () => apiClient.get<GradebookResponse>(`/api/lecturer/courses/${courseOfferingId}/gradebook`),
    enabled: !!courseOfferingId,
    ...options,
  });
}

export function useUpdateGradebookEntry(options?: UseMutationOptions<MaterialResponse, Error, UpdateGradebookEntryRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGradebookEntryRequest) => 
      apiClient.patch<MaterialResponse>(`/api/lecturer/courses/${data.courseOfferingId}/gradebook/students/${data.studentId}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "gradebook"] });
    },
    ...options,
  });
}

// Announcements Management
export function useLecturerAnnouncements(courseOfferingId: number, options?: UseQueryOptions<LecturerAnnouncementListingResponse>) {
  return useQuery({
    queryKey: ["lecturer", "courses", courseOfferingId, "announcements"],
    queryFn: () => apiClient.get<LecturerAnnouncementListingResponse>(`/api/lecturer/courses/${courseOfferingId}/announcements`),
    enabled: !!courseOfferingId,
    ...options,
  });
}

export function useCreateLecturerAnnouncement(options?: UseMutationOptions<LecturerAnnouncement, Error, CreateLecturerAnnouncementRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLecturerAnnouncementRequest) => 
      apiClient.post<LecturerAnnouncement>(`/api/lecturer/courses/${data.courseOfferingId}/announcements`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "announcements"] });
    },
    ...options,
  });
}

export function useDeleteLecturerAnnouncement(options?: UseMutationOptions<MaterialResponse, Error, DeleteLecturerAnnouncementRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteLecturerAnnouncementRequest) => 
      apiClient.delete<MaterialResponse>(`/api/lecturer/courses/${data.courseOfferingId}/announcements/${data.announcementId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturer", "courses", variables.courseOfferingId, "announcements"] });
    },
    ...options,
  });
}

// HOD Student Management
export function useHODStudents(params: StudentFilterParams, options?: UseQueryOptions<StudentListingItem[]>) {
  return useQuery({
    queryKey: ["hod", "students", params],
    queryFn: () => apiClient.get<StudentListingItem[]>("/api/hod/students", { params } as any),
    ...options,
  });
}

export function useHODStudentDetail(studentId: number, options?: UseQueryOptions<StudentDetail>) {
  return useQuery({
    queryKey: ["hod", "students", studentId],
    queryFn: () => apiClient.get<StudentDetail>(`/api/hod/students/${studentId}`),
    enabled: !!studentId,
    ...options,
  });
}

export function useUpdateLevelOffset(options?: UseMutationOptions<any, Error, { studentId: number; levelOffset: number }>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, levelOffset }) =>
      apiClient.patch(`/api/hod/students/${studentId}/level-offset`, { levelOffset }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hod", "students"] });
    },
    ...options,
  });
}

// HOD Lecturer Management
export function useHODLecturers(params: LecturerFilterParams, options?: UseQueryOptions<LecturerListingItem[]>) {
  return useQuery({
    queryKey: ["hod", "lecturers", params],
    queryFn: () => apiClient.get<LecturerListingItem[]>("/api/hod/lecturers", { params } as any),
    ...options,
  });
}

export function useHODLecturerDetail(lecturerId: number, options?: UseQueryOptions<LecturerDetail>) {
  return useQuery({
    queryKey: ["hod", "lecturers", lecturerId],
    queryFn: () => apiClient.get<LecturerDetail>(`/api/hod/lecturers/${lecturerId}`),
    enabled: !!lecturerId,
    ...options,
  });
}

// HOD Course Definitions
export function useHODCourseDefinitions(params: CourseDefinitionFilterParams, options?: UseQueryOptions<CourseDefinitionListingItem[]>) {
  return useQuery({
    queryKey: ["hod", "courseDefinitions", params],
    queryFn: () => apiClient.get<CourseDefinitionListingItem[]>("/api/hod/courses", { params } as any),
    ...options,
  });
}

export function useHODCourseDefinitionDetail(courseId: number, options?: UseQueryOptions<CourseDefinitionDetail>) {
  return useQuery({
    queryKey: ["hod", "courseDefinitions", courseId],
    queryFn: () => apiClient.get<CourseDefinitionDetail>(`/api/hod/courses/${courseId}`),
    enabled: !!courseId,
    ...options,
  });
}

export function useCreateCourseDefinition(options?: UseMutationOptions<any, Error, CreateCourseDefinitionRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseDefinitionRequest) =>
      apiClient.post("/api/hod/courses", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hod", "courseDefinitions"] });
    },
    ...options,
  });
}

export function useUpdateCourseDefinition(options?: UseMutationOptions<any, Error, { courseId: number; data: UpdateCourseDefinitionRequest }>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }) =>
      apiClient.patch(`/api/hod/courses/${courseId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hod", "courseDefinitions"] });
      queryClient.invalidateQueries({ queryKey: ["hod", "courseDefinitions", "detail"] });
    },
    ...options,
  });
}

export function useDeleteCourseDefinition(options?: UseMutationOptions<any, Error, number>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: number) =>
      apiClient.delete(`/api/hod/courses/${courseId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hod", "courseDefinitions"] });
    },
    ...options,
  });
}

// HOD Course Offerings
export function useHODCourseOfferings(courseId: number, options?: UseQueryOptions<CourseOfferingDetailItem[]>) {
  return useQuery({
    queryKey: ["hod", "courseOfferings", courseId],
    queryFn: () => apiClient.get<CourseOfferingDetailItem[]>(`/api/hod/courses/${courseId}/offerings`),
    enabled: !!courseId,
    ...options,
  });
}

export function useHODCourseOfferingDetail(courseId: number, offeringId: number, options?: UseQueryOptions<CourseOfferingDetailItem>) {
  return useQuery({
    queryKey: ["hod", "courseOfferings", courseId, offeringId],
    queryFn: () => apiClient.get<CourseOfferingDetailItem>(`/api/hod/courses/${courseId}/offerings/${offeringId}`),
    enabled: !!courseId && !!offeringId,
    ...options,
  });
}

export function useCreateCourseOffering(options?: UseMutationOptions<any, Error, CreateCourseOfferingRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseOfferingRequest) =>
      apiClient.post(`/api/hod/courses/${data.courseDefinitionId}/offerings`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hod", "courseOfferings", variables.courseDefinitionId] });
      queryClient.invalidateQueries({ queryKey: ["hod", "courseDefinitions"] });
    },
    ...options,
  });
}

export function useActivateCourseOffering(options?: UseMutationOptions<any, Error, { courseId: number; offeringId: number }>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, offeringId }) =>
      apiClient.patch(`/api/hod/courses/${courseId}/offerings/${offeringId}/activate`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hod", "courseOfferings", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["hod", "courseOfferings", variables.courseId, variables.offeringId] });
    },
    ...options,
  });
}

// HOD Lecturer Assignment
export function useAssignLecturer(options?: UseMutationOptions<any, Error, AssignLecturerRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignLecturerRequest) =>
      apiClient.post(`/api/hod/courses/${data.courseOfferingId}/offerings/${data.courseOfferingId}/assign`, { lecturerId: data.lecturerId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hod", "courseOfferings", variables.courseOfferingId] });
      queryClient.invalidateQueries({ queryKey: ["hod", "lecturers"] });
    },
    ...options,
  });
}

export function useUnassignLecturer(options?: UseMutationOptions<any, Error, UnassignLecturerRequest>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UnassignLecturerRequest) =>
      apiClient.delete(`/api/hod/courses/${data.courseOfferingId}/offerings/${data.courseOfferingId}/assign/${data.lecturerId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hod", "courseOfferings", variables.courseOfferingId] });
      queryClient.invalidateQueries({ queryKey: ["hod", "lecturers"] });
    },
    ...options,
  });
}

// =============================================================================
// Shared User Settings / Profile Management Hooks
// =============================================================================

// Profile Tab
export function useProfile(options?: UseQueryOptions<UserProfile>) {
  return useQuery<UserProfile, Error>({
    queryKey: ["profile"],
    queryFn: () => apiClient.get<UserProfile>("/api/auth/profile"),
    ...options,
  });
}

export function useUpdateProfile(options?: UseMutationOptions<UserProfile, Error, UpdateProfilePayload>) {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error, UpdateProfilePayload>({
    mutationFn: (data) => apiClient.patch<UserProfile>("/api/auth/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
    ...options,
  });
}

export function useUploadAvatar(options?: UseMutationOptions<UserProfile, Error, UploadAvatarPayload>) {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error, UploadAvatarPayload>({
    mutationFn: (data) => apiClient.upload<UserProfile>("/api/auth/profile/avatar", data.file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Avatar uploaded successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to upload avatar: ${error.message}`);
    },
    ...options,
  });
}

// Account Tab
export function useAccountInfo(options?: UseQueryOptions<UserAccountInfo>) {
  return useQuery<UserAccountInfo, Error>({
    queryKey: ["accountInfo"],
    queryFn: () => apiClient.get<UserAccountInfo>("/api/auth/account"),
    ...options,
  });
}

// Password Tab
export function useChangePassword(options?: UseMutationOptions<void, Error, ChangePasswordPayload>) {
  return useMutation<void, Error, ChangePasswordPayload>({
    mutationFn: (data) => apiClient.post<void>("/api/auth/change-password", data),
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to change password: ${error.message}`);
    },
    ...options,
  });
}

// Security Tab
export function useProfileSecurity(options?: UseQueryOptions<UserSecurityInfo>) {
  return useQuery<UserSecurityInfo, Error>({
    queryKey: ["profileSecurity"],
    queryFn: () => apiClient.get<UserSecurityInfo>("/api/auth/security"),
    ...options,
  });
}

export function useRevokeSession(options?: UseMutationOptions<void, Error, RevokeSessionPayload>) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, RevokeSessionPayload>({
    mutationFn: (data) => apiClient.post<void>(`/api/auth/security/sessions/${data.sessionId}/revoke`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileSecurity"] });
      toast.success("Session revoked successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to revoke session: ${error.message}`);
    },
    ...options,
  });
}

// Student-specific Info Tab
export function useStudentProfileInfo(options?: UseQueryOptions<StudentProfileInfo>) {
  return useQuery<StudentProfileInfo, Error>({
    queryKey: ["studentProfileInfo"],
    queryFn: () => apiClient.get<StudentProfileInfo>("/api/student/profile/info"),
    ...options,
  });
}

// Staff-specific Info Tab (Lecturer, HOD)
export function useStaffProfileInfo(options?: UseQueryOptions<StaffProfileInfo>) {
  return useQuery<StaffProfileInfo, Error>({
    queryKey: ["staffProfileInfo"],
    queryFn: () => apiClient.get<StaffProfileInfo>("/api/lecturer/profile/info"),
    ...options,
  });
}
