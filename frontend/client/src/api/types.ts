/**
 * API Types & Contracts
 * 
 * This file defines all TypeScript interfaces for API requests and responses.
 * These types serve as contracts between frontend and backend.
 */

import { UseQueryOptions as TanStackUseQueryOptions, UseMutationOptions as TanStackUseMutationOptions } from "@tanstack/react-query";

// Re-export query options for convenience in hooks
export type UseQueryOptions<TData = any, TError = any> = TanStackUseQueryOptions<TData, TError>;
export type UseMutationOptions<TData = any, TError = any, TVariables = any> = TanStackUseMutationOptions<TData, TError, TVariables>;

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterStudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  matric_num: string;
  admission_session: string;
  department_id: number;
}

export interface RegisterStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  staff_id: string;
  department_id: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
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

export interface CourseFilterParams {
  query?: string;
  level?: number;
  departmentId?: number;
  page?: number;
  limit?: number;
}

export interface CourseListingResponse {
  courses: Course[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface CourseDetailResponse {
  course: Course;
  isRegistered: boolean;
}

export interface RegisterCourseRequest {
  courseOfferingId: number;
}

export interface RegisterCourseResponse {
  success: boolean;
  message: string;
  enrollment?: CourseEnrollment;
}

export interface DropCourseRequest {
  courseOfferingId: number;
}

export interface DropCourseResponse {
  success: boolean;
  message: string;
}

export interface RegisteredCourse extends Course {
  enrollmentStatus: string;
  grade?: string;
}

export interface RegisteredCourseFilterParams {
  status?: "active" | "dropped" | "completed";
  page?: number;
  limit?: number;
}

export interface CourseMaterial {
  id: number;
  courseOfferingId: number;
  title: string;
  description: string | null;
  fileUrl: string;
  uploadedAt: Date;
  visibility: "students_only" | "ai_only" | "both";
}

export interface CourseMaterialFilterParams {
  courseOfferingId: number;
  type?: string;
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

export interface AssignmentDetail extends Assignment {
  courseName: string;
  submission?: AssignmentSubmission;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  submissionDate: Date;
  status: "pending" | "submitted" | "graded";
  fileUrl: string | null;
  score?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentSubmissionRequest {
  assignmentId: number;
  file: File;
}

export interface AssignmentSubmissionResponse {
  success: boolean;
  submission: AssignmentSubmission;
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

export interface GradeDetail extends Grade {
  courseName: string;
  assignmentTitle?: string;
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

export interface AttendanceRecordDetail extends AttendanceRecord {
  sessionDate: Date;
  courseName: string;
}

export interface AttendanceSummary {
  courseId: number;
  courseName: string;
  totalSessions: number;
  attendedSessions: number;
  percentage: number;
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

export interface CourseSessionDetail extends CourseSession {
  courseName: string;
}

export interface Announcement {
  id: number;
  courseOfferingId: number;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnnouncementFilterParams {
  courseOfferingId: number;
  pinned?: boolean;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Date;
}

export interface NotificationFilterParams {
  read?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationListingResponse {
  notifications: Notification[];
  totalCount: number;
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

export interface LecturerCourse {
  id: number;
  title: string;
  code: string;
  level: string;
  totalStudents: number;
  sessionsCount: number;
  tasksCount: number;
  active: boolean;
  lecturerId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LecturerCourseDetail extends LecturerCourse {
  description: string;
}

export interface LecturerCourseFilterParams {
  query?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface LecturerCourseListingResponse {
  courses: LecturerCourse[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface CourseStudent {
  id: number;
  userId: number;
  name: string;
  email: string;
  registrationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CourseStudentFilterParams {
  query?: string;
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  limit?: number;
}

export interface CourseStudentListingResponse {
  students: CourseStudent[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface ApproveStudentRequest {
  courseOfferingId: number;
  studentId: number;
}

export interface ApproveStudentResponse {
  success: boolean;
  message: string;
}

export interface LecturerMaterial {
  id: number;
  courseOfferingId: number;
  title: string;
  description: string | null;
  fileUrl: string;
  uploadedAt: Date;
  visibility: 'students_only' | 'ai_only' | 'both';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMaterialRequest {
  courseOfferingId: number;
  title: string;
  description?: string;
  file: File;
  visibility: 'students_only' | 'ai_only' | 'both';
}

export interface UpdateMaterialRequest {
  courseOfferingId: number;
  materialId: number;
  title?: string;
  description?: string;
  visibility?: 'students_only' | 'ai_only' | 'both';
}

export interface DeleteMaterialRequest {
  courseOfferingId: number;
  materialId: number;
}

export interface MaterialResponse {
  success: boolean;
  message: string;
}

export type TaskType = 'mcq' | 'free_text' | 'document_upload';

export interface TaskQuestion {
  id?: number;
  type: TaskType;
  questionText: string;
  options?: string[];
  correctAnswer?: string | number;
  maxScore: number;
}

export interface Task {
  id: number;
  courseOfferingId: number;
  title: string;
  description: string;
  dueDate: Date;
  totalPoints: number;
  status: 'draft' | 'published' | 'archived';
  questions: TaskQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  courseOfferingId: number;
  title: string;
  description: string;
  dueDate: Date;
  totalPoints: number;
  questions: TaskQuestion[];
}

export interface UpdateTaskRequest {
  courseOfferingId: number;
  taskId: number;
  title?: string;
  description?: string;
  dueDate?: Date;
  totalPoints?: number;
  status?: 'draft' | 'published' | 'archived';
  questions?: TaskQuestion[];
}

export interface DeleteTaskRequest {
  courseOfferingId: number;
  taskId: number;
}

export interface TaskListingResponse {
  tasks: Task[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface Submission {
  id: number;
  taskId: number;
  studentId: number;
  studentName: string;
  submissionDate: Date;
  status: 'submitted' | 'graded' | 'pending_grade';
  score: number | null;
  feedback: string | null;
  answers: any;
  fileUrl?: string;
}

export interface SubmissionDetail extends Submission {
  assignmentTitle: string;
  maxPoints: number;
  questions: TaskQuestion[];
}

export interface GradeSubmissionRequest {
  courseOfferingId: number;
  taskId: number;
  submissionId: number;
  score: number;
  feedback?: string;
  gradedBy: number;
}

export interface GradeSubmissionResponse {
  success: boolean;
  message: string;
}

export interface LecturerSession {
  id: number;
  courseOfferingId: number;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  location: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  attendanceCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LecturerSessionDetail extends LecturerSession {
  description?: string;
}

export interface CreateSessionRequest {
  courseOfferingId: number;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
}

export interface UpdateSessionRequest {
  courseOfferingId: number;
  sessionId: number;
  sessionDate?: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
}

export interface DeleteSessionRequest {
  courseOfferingId: number;
  sessionId: number;
}

export interface SessionListingResponse {
  sessions: LecturerSession[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface LecturerAttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  status: 'present' | 'absent' | 'excused';
  markedAt: Date;
}

export interface SessionAttendance {
  sessionId: number;
  sessionDate: Date;
  students: LecturerAttendanceRecord[];
}

export interface MarkAttendanceBulkRequest {
  courseOfferingId: number;
  sessionId: number;
  attendance: { studentId: number; status: 'present' | 'absent' | 'excused'; }[];
}

export interface MarkAttendanceResponse {
  success: boolean;
  message: string;
}

export interface GradebookEntry {
  studentId: number;
  studentName: string;
  studentEmail: string;
  totalScore: number;
  totalMaxScore: number;
  overallPercentage: number;
  overallLetterGrade: string;
  assignmentScores: { taskId: number; score: number | null; maxScore: number; }[];
  lecturerNotes?: string;
}

export interface GradebookResponse {
  gradebook: GradebookEntry[];
  totalStudents: number;
}

export interface UpdateGradebookEntryRequest {
  courseOfferingId: number;
  studentId: number;
  assignmentScores?: { taskId: number; score: number | null; }[];
  lecturerNotes?: string;
}

export interface LecturerAnnouncement {
  id: number;
  courseOfferingId: number;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLecturerAnnouncementRequest {
  courseOfferingId: number;
  title: string;
  body: string;
  pinned?: boolean;
}

export interface UpdateLecturerAnnouncementRequest {
  courseOfferingId: number;
  announcementId: number;
  title?: string;
  body?: string;
  pinned?: boolean;
}

export interface DeleteLecturerAnnouncementRequest {
  courseOfferingId: number;
  announcementId: number;
}

export interface LecturerAnnouncementListingResponse {
  announcements: LecturerAnnouncement[];
  totalCount: number;
  page: number;
  limit: number;
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

export interface Activity {
  id: number;
  userId: number;
  action: string;
  details: string;
  timestamp: Date;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// HOD Student Management
export interface StudentListingItem {
  id: number;
  fullName: string;
  matricNumber: string;
  email: string;
  department: string;
  admissionSession: string;
  levelOffset: number;
}

export interface StudentDetail extends StudentListingItem {
  registeredOfferings: { id: number; courseTitle: string; code: string; semester: string; academicSession: string }[];
}

export interface UpdateLevelOffsetRequest {
  levelOffset: number;
}

export interface StudentFilterParams {
  query?: string;
  departmentId?: number;
  levelOffset?: number;
  page?: number;
  limit?: number;
}

// HOD Lecturer Management
export interface LecturerListingItem {
  id: number;
  fullName: string;
  staffId: string;
  email: string;
  department: string;
  authorizationStatus: 'pending' | 'authorized' | 'revoked';
}

export interface LecturerDetail extends LecturerListingItem {
  assignedOfferings: { id: number; courseTitle: string; code: string; semester: string; academicSession: string }[];
}

export interface LecturerFilterParams {
  query?: string;
  departmentId?: number;
  authorizationStatus?: 'pending' | 'authorized' | 'revoked';
  page?: number;
  limit?: number;
}

// HOD Course Definitions
export interface CourseDefinitionListingItem {
  id: number;
  title: string;
  code: string;
  creditUnits: number;
  department: string;
  offeringsCount: number;
}

export interface CourseDefinitionDetail extends CourseDefinitionListingItem {
  description: string;
  offerings: { id: number; semester: string; academicSession: string; lecturerName: string; active: boolean }[];
}

export interface CreateCourseDefinitionRequest {
  title: string;
  code: string;
  creditUnits: number;
  description?: string;
  departmentId: number;
}

export interface UpdateCourseDefinitionRequest {
  title?: string;
  code?: string;
  creditUnits?: number;
  description?: string;
  departmentId?: number;
}

export interface CourseDefinitionFilterParams {
  query?: string;
  departmentId?: number;
  page?: number;
  limit?: number;
}

// HOD Course Offerings
export interface CourseOfferingDetailItem {
  id: number;
  semester: string;
  academicSession: string;
  lecturer: { id: number; name: string } | null;
  totalStudents: number;
  maxCapacity: number;
  active: boolean;
}

export interface CreateCourseOfferingRequest {
  courseDefinitionId: number;
  semesterId: number;
  academicSessionId: number;
  maxCapacity: number;
}

export interface ActivateCourseOfferingRequest {
  courseOfferingId: number;
}

// HOD Lecturer Assignment
export interface AssignLecturerRequest {
  courseOfferingId: number;
  lecturerId: number;
}

export interface UnassignLecturerRequest {
  courseOfferingId: number;
  lecturerId: number;
}

// =============================================================================
// Shared User Settings / Profile Management Types
// =============================================================================

// Profile Tab
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'lecturer' | 'hod' | 'admin';
  department: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface UploadAvatarPayload {
  file: File;
}

// Account Tab
export interface UserAccountInfo {
  createdAt: string;
  lastLoginAt: string;
  status: 'active' | 'inactive' | 'suspended';
  loginMethod: 'email' | 'google' | 'github';
}

// Password Tab
export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Security Tab
export interface ActiveSession {
  id: number;
  device: string;
  location: string;
  ipAddress: string;
  loggedInAt: string;
  isCurrent: boolean;
}

export interface LoginHistoryEntry {
  id: number;
  device: string;
  location: string;
  ipAddress: string;
  loggedInAt: string;
  status: 'success' | 'failure';
}

export interface UserSecurityInfo {
  activeSessions: ActiveSession[];
  loginHistory: LoginHistoryEntry[];
  twoFactorEnabled: boolean;
}

export interface RevokeSessionPayload {
  sessionId: number;
}

// Student-specific Info Tab
export interface StudentProfileInfo {
  matricNumber: string;
  admissionSession: string;
  currentLevel: number;
  department: string;
}

// Staff-specific Info Tab (Lecturer, HOD)
export interface StaffProfileInfo {
  staffId: string;
  authorizationStatus: 'authorized' | 'pending' | 'revoked';
  department: string;
  assignedCoursesCount: number;
}
