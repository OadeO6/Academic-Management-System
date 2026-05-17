/**
 * API Types & Contracts
 * 
 * This file defines all TypeScript interfaces for API requests and responses.
 * These types serve as contracts between frontend and backend.
 */

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "student" | "lecturer" | "hod" | "admin";
  loginMethod: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

export interface AuthResponse {
  user: User | null;
}

export interface LogoutResponse {
  success: boolean;
}

// ============================================================================
// STUDENT TYPES
// ============================================================================

export interface StudentProfile {
  id: number;
  userId: number;
  matricNumber: string;
  departmentId: number;
  level: number;
  levelOffset: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseEnrollment {
  id: number;
  studentId: number;
  courseOfferingId: number;
  enrollmentDate: Date;
  status: "active" | "dropped" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseOffering {
  id: number;
  courseDefinitionId: number;
  academicSessionId: number;
  semesterId: number;
  lecturerId: number;
  maxCapacity: number;
  currentEnrollment: number;
  status: "active" | "inactive" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseDefinition {
  id: number;
  code: string;
  title: string;
  description: string | null;
  creditUnits: number;
  departmentId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course extends CourseOffering {
  definition?: CourseDefinition;
  lecturer?: User;
}

export interface Assignment {
  id: number;
  courseOfferingId: number;
  title: string;
  description: string | null;
  dueDate: Date;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  submissionDate: Date;
  status: "pending" | "submitted" | "graded";
  fileUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Grade {
  id: number;
  studentId: number;
  courseOfferingId: number;
  assignmentId: number | null;
  points: number;
  maxPoints: number;
  percentage: number;
  letterGrade: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  id: number;
  studentId: number;
  sessionId: number;
  status: "present" | "absent" | "excused";
  markedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseSession {
  id: number;
  courseOfferingId: number;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  location: string | null;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentDashboardData {
  profile: StudentProfile;
  enrolledCourses: Course[];
  recentAssignments: Assignment[];
  upcomingGrades: Grade[];
  attendanceSummary: {
    courseId: number;
    percentage: number;
  }[];
  announcements: Announcement[];
}

export interface StudentGradesData {
  gpa: number;
  courseGrades: {
    courseId: number;
    courseName: string;
    grade: string;
    percentage: number;
  }[];
  assignmentGrades: Grade[];
  gradeDistribution: {
    letterGrade: string;
    count: number;
  }[];
}

export interface StudentAttendanceData {
  courseId: number;
  courseName: string;
  totalSessions: number;
  attendedSessions: number;
  percentage: number;
  records: AttendanceRecord[];
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIChatResponse {
  response: string;
  courseId: number;
  timestamp: Date;
}

export interface SendAIMessageRequest {
  courseOfferingId: number;
  message: string;
}

// ============================================================================
// LECTURER TYPES
// ============================================================================

export interface LecturerProfile {
  id: number;
  userId: number;
  staffId: string;
  departmentId: number;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LecturerDashboardData {
  profile: LecturerProfile;
  assignedCourses: Course[];
  pendingSubmissions: {
    assignmentId: number;
    submissionCount: number;
  }[];
  gradingQueue: {
    assignmentId: number;
    pendingCount: number;
  }[];
  recentActivity: Activity[];
}

export interface SubmissionWithStudent extends AssignmentSubmission {
  student?: User;
  assignment?: Assignment;
}

export interface GradingData {
  submission: SubmissionWithStudent;
  currentGrade: Grade | null;
  feedback: string | null;
}

export interface MarkAttendanceRequest {
  sessionId: number;
  attendance: {
    studentId: number;
    status: "present" | "absent" | "excused";
  }[];
}

export interface CreateAssignmentRequest {
  courseOfferingId: number;
  title: string;
  description?: string;
  dueDate: Date;
  totalPoints: number;
}

export interface GradeSubmissionRequest {
  submissionId: number;
  points: number;
  feedback?: string;
}

export interface LecturerAnalyticsData {
  courseId: number;
  courseName: string;
  gradeDistribution: {
    letterGrade: string;
    count: number;
  }[];
  attendanceTrend: {
    date: Date;
    percentage: number;
  }[];
  submissionStats: {
    total: number;
    submitted: number;
    graded: number;
  };
}

// ============================================================================
// HOD TYPES
// ============================================================================

export interface Department {
  id: number;
  facultyId: number;
  name: string;
  description: string | null;
  hodId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HodDashboardData {
  department: Department;
  studentCount: number;
  lecturerCount: number;
  courseCount: number;
  averageGPA: number;
  averageAttendance: number;
  recentActivity: Activity[];
}

export interface DepartmentOverviewData {
  department: Department;
  students: StudentProfile[];
  lecturers: LecturerProfile[];
  courses: CourseDefinition[];
  analytics: {
    averageGPA: number;
    averageAttendance: number;
    courseCompletion: number;
  };
}

export interface UpdateStudentLevelRequest {
  studentId: number;
  newLevel: number;
  levelOffset?: number;
}

export interface ActivateCourseRequest {
  courseOfferingId: number;
  status: "active" | "inactive";
}

export interface AssignLecturerRequest {
  courseOfferingId: number;
  lecturerId: number;
}

export interface DepartmentAnalyticsData {
  lecturerPerformance: {
    lecturerId: number;
    lecturerName: string;
    averageStudentGrade: number;
    studentSatisfaction: number;
  }[];
  studentProgress: {
    level: number;
    averageGPA: number;
    retentionRate: number;
  }[];
  coursePerformance: {
    courseId: number;
    courseName: string;
    averageGrade: number;
    completionRate: number;
  }[];
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface Faculty {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminDashboardData {
  totalUsers: number;
  userDistribution: {
    role: string;
    count: number;
  }[];
  systemHealth: {
    database: "healthy" | "warning" | "critical";
    apiServer: "healthy" | "warning" | "critical";
    fileStorage: "healthy" | "warning" | "critical";
    aiService: "healthy" | "warning" | "operational";
  };
  activeSessions: number;
  recentActivity: Activity[];
}

export interface CreateUserRequest {
  email: string;
  name: string;
  role: "student" | "lecturer" | "hod" | "admin";
  departmentId?: number;
  matricNumber?: string;
  staffId?: string;
}

export interface UpdateUserRequest {
  userId: number;
  email?: string;
  name?: string;
  role?: "student" | "lecturer" | "hod" | "admin";
}

export interface DeleteUserRequest {
  userId: number;
}

export interface AssignRoleRequest {
  userId: number;
  newRole: "student" | "lecturer" | "hod" | "admin";
}

export interface CreateFacultyRequest {
  name: string;
  description?: string;
}

export interface CreateDepartmentRequest {
  facultyId: number;
  name: string;
  description?: string;
}

export interface CreateAcademicSessionRequest {
  year: number;
  startDate: Date;
  endDate: Date;
}

export interface Semester {
  id: number;
  academicSessionId: number;
  name: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "inactive" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSemesterRequest {
  academicSessionId: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface AdminUserManagementData {
  users: User[];
  totalCount: number;
  roleDistribution: {
    role: string;
    count: number;
  }[];
}

export interface SystemSettingsData {
  general: {
    appName: string;
    appVersion: string;
    maintenanceMode: boolean;
  };
  database: {
    host: string;
    port: number;
    status: "connected" | "disconnected";
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    inAppEnabled: boolean;
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: string;
    twoFactorEnabled: boolean;
  };
}

// ============================================================================
// SHARED TYPES
// ============================================================================

export interface Notification {
  id: number;
  userId: number;
  type: "assignment" | "grade" | "attendance" | "announcement" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: number;
  courseOfferingId: number | null;
  departmentId: number | null;
  title: string;
  content: string;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: number;
  userId: number;
  type: string;
  description: string;
  timestamp: Date;
}

export interface CourseMaterial {
  id: number;
  courseOfferingId: number;
  title: string;
  description: string | null;
  fileUrl: string;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ============================================================================
// FORM REQUEST TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SubmitAssignmentRequest {
  assignmentId: number;
  fileUrl: string;
  submissionDate: Date;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

// ============================================================================
// LOADING & ERROR STATES
// ============================================================================

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

export interface UseQueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
  cacheTime?: number;
  retry?: boolean | number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export interface UseMutationOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}
