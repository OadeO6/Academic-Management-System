/**
 * Shared Frontend Types
 * Frontend-only type definitions for API contracts and UI state
 */

// User Roles
export type UserRole = "student" | "lecturer" | "hod" | "admin";

// User Types
export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  loginMethod: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

// Student Types
export interface StudentProfile {
  id: number;
  userId: number;
  matricNumber: string;
  departmentId: number;
  level: number;
  levelOffset: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseEnrollment {
  id: number;
  studentId: number;
  courseOfferingId: number;
  enrollmentDate: Date;
  status: "active" | "dropped" | "completed" | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseOffering {
  id: number;
  courseDefinitionId: number;
  semesterId: number;
  lecturerId: number | null;
  capacity: number | null;
  isActive: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: number;
  courseOfferingId: number;
  title: string;
  description: string | null;
  dueDate: Date;
  totalPoints: number | null;
  enableAiGrading: boolean | null;
  markingGuideUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Grade {
  id: number;
  submissionId: number;
  points: string;
  percentage: string;
  feedback: string | null;
  gradedBy: number | null;
  gradingMethod: "manual" | "ai" | "ai_reviewed";
  gradedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId: number | null;
  relatedEntityType: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export * from "./_core/errors";
