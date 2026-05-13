import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  date,
  json,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with role-specific fields for Student, Lecturer, HOD, Admin.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  role: mysqlEnum("role", ["student", "lecturer", "hod", "admin"]).default("student").notNull(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Faculty: Top-level organizational unit
 */
export const faculties = mysqlTable("faculties", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Faculty = typeof faculties.$inferSelect;
export type InsertFaculty = typeof faculties.$inferInsert;

/**
 * Department: Organizational unit within a faculty
 */
export const departments = mysqlTable("departments", {
  id: int("id").autoincrement().primaryKey(),
  facultyId: int("facultyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  hodId: int("hodId"), // Head of Department user ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = typeof departments.$inferInsert;

/**
 * Student Profile: Extended info for students
 */
export const studentProfiles = mysqlTable("studentProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  matricNumber: varchar("matricNumber", { length: 64 }).notNull().unique(),
  departmentId: int("departmentId").notNull(),
  level: int("level").notNull(), // 100, 200, 300, 400, etc.
  levelOffset: int("levelOffset").default(0), // Offset for repeated levels
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = typeof studentProfiles.$inferInsert;

/**
 * Lecturer Profile: Extended info for lecturers
 */
export const lecturerProfiles = mysqlTable("lecturerProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  staffId: varchar("staffId", { length: 64 }).notNull().unique(),
  departmentId: int("departmentId").notNull(),
  title: varchar("title", { length: 100 }), // Dr., Prof., etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LecturerProfile = typeof lecturerProfiles.$inferSelect;
export type InsertLecturerProfile = typeof lecturerProfiles.$inferInsert;

/**
 * Academic Session: Represents an academic year (e.g., 2023/2024)
 */
export const academicSessions = mysqlTable("academicSessions", {
  id: int("id").autoincrement().primaryKey(),
  year: varchar("year", { length: 9 }).notNull().unique(), // e.g., "2023/2024"
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  isActive: boolean("isActive").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AcademicSession = typeof academicSessions.$inferSelect;
export type InsertAcademicSession = typeof academicSessions.$inferInsert;

/**
 * Semester: First or Second semester within an academic session
 */
export const semesters = mysqlTable("semesters", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  number: mysqlEnum("number", ["1", "2"]).notNull(), // Semester 1 or 2
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  isActive: boolean("isActive").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Semester = typeof semesters.$inferSelect;
export type InsertSemester = typeof semesters.$inferInsert;

/**
 * Course Definition: Blueprint for a course (e.g., CS101 - Intro to Programming)
 */
export const courseDefinitions = mysqlTable("courseDefinitions", {
  id: int("id").autoincrement().primaryKey(),
  departmentId: int("departmentId").notNull(),
  code: varchar("code", { length: 20 }).notNull(), // e.g., CS101
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  creditUnits: int("creditUnits").notNull(),
  level: int("level").notNull(), // 100, 200, 300, 400
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseDefinition = typeof courseDefinitions.$inferSelect;
export type InsertCourseDefinition = typeof courseDefinitions.$inferInsert;

/**
 * Course Offering: Specific instance of a course in a semester (e.g., CS101 in Sem 1, 2024)
 */
export const courseOfferings = mysqlTable("courseOfferings", {
  id: int("id").autoincrement().primaryKey(),
  courseDefinitionId: int("courseDefinitionId").notNull(),
  semesterId: int("semesterId").notNull(),
  lecturerId: int("lecturerId"), // Assigned lecturer
  capacity: int("capacity"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseOffering = typeof courseOfferings.$inferSelect;
export type InsertCourseOffering = typeof courseOfferings.$inferInsert;

/**
 * Course Enrollment: Student registration for a course offering
 */
export const courseEnrollments = mysqlTable("courseEnrollments", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  courseOfferingId: int("courseOfferingId").notNull(),
  enrollmentDate: timestamp("enrollmentDate").defaultNow().notNull(),
  status: mysqlEnum("status", ["active", "dropped", "completed"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;

/**
 * Course Session: Individual class session within a course offering
 */
export const courseSessions = mysqlTable("courseSessions", {
  id: int("id").autoincrement().primaryKey(),
  courseOfferingId: int("courseOfferingId").notNull(),
  sessionNumber: int("sessionNumber").notNull(), // 1st, 2nd, 3rd session, etc.
  scheduledDate: date("scheduledDate").notNull(),
  startTime: varchar("startTime", { length: 5 }), // HH:MM format
  endTime: varchar("endTime", { length: 5 }), // HH:MM format
  location: varchar("location", { length: 255 }),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled"]).default("scheduled"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseSession = typeof courseSessions.$inferSelect;
export type InsertCourseSession = typeof courseSessions.$inferInsert;

/**
 * Attendance: Record of student attendance for a session
 */
export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  sessionId: int("sessionId").notNull(),
  status: mysqlEnum("status", ["present", "absent", "excused"]).notNull(),
  markedAt: timestamp("markedAt").defaultNow().notNull(),
  markedBy: int("markedBy"), // Lecturer ID who marked attendance
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = typeof attendance.$inferInsert;

/**
 * Assignment: Assignment created by a lecturer for a course
 */
export const assignments = mysqlTable("assignments", {
  id: int("id").autoincrement().primaryKey(),
  courseOfferingId: int("courseOfferingId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate").notNull(),
  totalPoints: int("totalPoints").default(100),
  enableAiGrading: boolean("enableAiGrading").default(false),
  markingGuideUrl: varchar("markingGuideUrl", { length: 500 }), // URL to uploaded marking guide
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = typeof assignments.$inferInsert;

/**
 * Assignment Submission: Student submission for an assignment
 */
export const assignmentSubmissions = mysqlTable("assignmentSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  assignmentId: int("assignmentId").notNull(),
  studentId: int("studentId").notNull(),
  submissionUrl: varchar("submissionUrl", { length: 500 }).notNull(), // URL to submitted file
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["submitted", "graded", "returned"]).default("submitted"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type InsertAssignmentSubmission = typeof assignmentSubmissions.$inferInsert;

/**
 * Grade: Grade for an assignment submission
 */
export const grades = mysqlTable("grades", {
  id: int("id").autoincrement().primaryKey(),
  submissionId: int("submissionId").notNull().unique(),
  points: decimal("points", { precision: 5, scale: 2 }).notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  feedback: text("feedback"),
  gradedBy: int("gradedBy"), // Lecturer or AI
  gradingMethod: mysqlEnum("gradingMethod", ["manual", "ai", "ai_reviewed"]).notNull(),
  gradedAt: timestamp("gradedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Grade = typeof grades.$inferSelect;
export type InsertGrade = typeof grades.$inferInsert;

/**
 * Course Material: Lecture notes, slides, etc. uploaded by lecturer
 */
export const courseMaterials = mysqlTable("courseMaterials", {
  id: int("id").autoincrement().primaryKey(),
  courseOfferingId: int("courseOfferingId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
  visibility: mysqlEnum("visibility", ["students", "ai", "both"]).default("both"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseMaterial = typeof courseMaterials.$inferSelect;
export type InsertCourseMaterial = typeof courseMaterials.$inferInsert;

/**
 * AI Tutor Configuration: Rules and instructions for AI tutor per course
 */
export const aiTutorConfigs = mysqlTable("aiTutorConfigs", {
  id: int("id").autoincrement().primaryKey(),
  courseOfferingId: int("courseOfferingId").notNull().unique(),
  instructions: text("instructions"), // Custom instructions for the AI tutor
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiTutorConfig = typeof aiTutorConfigs.$inferSelect;
export type InsertAiTutorConfig = typeof aiTutorConfigs.$inferInsert;

/**
 * AI Chat History: Conversation history between student and AI tutor
 */
export const aiChatHistory = mysqlTable("aiChatHistory", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  courseOfferingId: int("courseOfferingId").notNull(),
  messages: json("messages").notNull(), // Array of {role, content} objects
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiChatHistory = typeof aiChatHistory.$inferSelect;
export type InsertAiChatHistory = typeof aiChatHistory.$inferInsert;

/**
 * Announcement: Course announcements posted by lecturer
 */
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  courseOfferingId: int("courseOfferingId").notNull(),
  lecturerId: int("lecturerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  postedAt: timestamp("postedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

/**
 * Announcement View: Track which students have viewed announcements
 */
export const announcementViews = mysqlTable("announcementViews", {
  id: int("id").autoincrement().primaryKey(),
  announcementId: int("announcementId").notNull(),
  studentId: int("studentId").notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnnouncementView = typeof announcementViews.$inferSelect;
export type InsertAnnouncementView = typeof announcementViews.$inferInsert;

/**
 * Notification: System notifications for users
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", [
    "assignment_created",
    "assignment_due_soon",
    "grade_released",
    "attendance_warning",
    "announcement",
    "submission_received",
    "ai_grading_ready",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  relatedEntityId: int("relatedEntityId"), // ID of related entity (assignment, course, etc.)
  relatedEntityType: varchar("relatedEntityType", { length: 50 }), // Type of related entity
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Gradebook: Aggregate view of student grades per course (cached for performance)
 */
export const gradebooks = mysqlTable("gradebooks", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  courseOfferingId: int("courseOfferingId").notNull(),
  totalPoints: decimal("totalPoints", { precision: 7, scale: 2 }).default("0"),
  totalPercentage: decimal("totalPercentage", { precision: 5, scale: 2 }).default("0"),
  letterGrade: varchar("letterGrade", { length: 2 }), // A, B, C, D, F
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Gradebook = typeof gradebooks.$inferSelect;
export type InsertGradebook = typeof gradebooks.$inferInsert;

/**
 * Relations for type safety and query optimization
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  notifications: many(notifications),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  faculty: one(faculties, {
    fields: [departments.facultyId],
    references: [faculties.id],
  }),
  courseDefinitions: many(courseDefinitions),
  studentProfiles: many(studentProfiles),
  lecturerProfiles: many(lecturerProfiles),
}));

export const courseOfferingsRelations = relations(courseOfferings, ({ one, many }) => ({
  enrollments: many(courseEnrollments),
  sessions: many(courseSessions),
  assignments: many(assignments),
  materials: many(courseMaterials),
}));

export const courseEnrollmentsRelations = relations(courseEnrollments, ({ one }) => ({
}));

export const assignmentsRelations = relations(assignments, ({ many }) => ({
  submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one }) => ({
  grade: one(grades, {
    fields: [assignmentSubmissions.id],
    references: [grades.submissionId],
  }),
}));

export const gradesRelations = relations(grades, ({ one }) => ({
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
}));
