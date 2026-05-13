import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getDb,
  getStudentProfile,
  getStudentEnrolledCourses,
  getLecturerProfile,
  getLecturerAssignedCourses,
  getDepartmentById,
  getCourseOfferingById,
  getUserNotifications,
} from "./db";
import { eq } from "drizzle-orm";
import {
  users,
  studentProfiles,
  lecturerProfiles,
  courseEnrollments,
  courseOfferings,
  courseSessions,
  assignments,
  assignmentSubmissions,
  grades,
  attendance,
  notifications,
  announcements,
  courseMaterials,
  aiChatHistory,
  aiTutorConfigs,
} from "../drizzle/schema";

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

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  /**
   * Student Routes
   */
  student: router({
    // Get student profile
    getProfile: studentProcedure.query(async ({ ctx }) => {
      const profile = await getStudentProfile(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Student profile not found" });
      }
      return profile;
    }),

    // Get enrolled courses
    getEnrolledCourses: studentProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const enrollments = await db
        .select()
        .from(courseEnrollments)
        .where(eq(courseEnrollments.studentId, ctx.user.id));

      return enrollments;
    }),

    // Get course details
    getCourseDetails: studentProcedure.input(z.object({ offeringId: z.number() })).query(async ({ input }) => {
      const offering = await getCourseOfferingById(input.offeringId);
      if (!offering) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      }
      return offering;
    }),

    // Get assignments for a course
    getCourseAssignments: studentProcedure
      .input(z.object({ courseOfferingId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return await db
          .select()
          .from(assignments)
          .where(eq(assignments.courseOfferingId, input.courseOfferingId));
      }),

    // Get attendance for a course
    getCourseAttendance: studentProcedure
      .input(z.object({ courseOfferingId: z.number() }))
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        // Get all sessions for the course
        const sessions = await db
          .select()
          .from(courseSessions)
          .where(eq(courseSessions.courseOfferingId, input.courseOfferingId));

        // Get attendance records for student
        const attendanceRecords = await db
          .select()
          .from(attendance)
          .where(eq(attendance.studentId, ctx.user.id));

        return { sessions, attendance: attendanceRecords };
      }),

    // Get grades
    getGrades: studentProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return await db
        .select()
        .from(grades)
        .innerJoin(assignmentSubmissions, eq(grades.submissionId, assignmentSubmissions.id))
        .where(eq(assignmentSubmissions.studentId, ctx.user.id));
    }),

    // Get notifications
    getNotifications: studentProcedure.query(async ({ ctx }) => {
      return await getUserNotifications(ctx.user.id, 50);
    }),

    // Mark notification as read
    markNotificationAsRead: studentProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        await db
          .update(notifications)
          .set({ isRead: true })
          .where(eq(notifications.id, input.notificationId));

        return { success: true };
      }),

    // Submit assignment
    submitAssignment: studentProcedure
      .input(z.object({ assignmentId: z.number(), submissionUrl: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db.insert(assignmentSubmissions).values({
          assignmentId: input.assignmentId,
          studentId: ctx.user.id,
          submissionUrl: input.submissionUrl,
          status: "submitted",
        });

        return { success: true, submissionId: result[0] };
      }),

    // Get AI tutor chat history
    getAiChatHistory: studentProcedure
      .input(z.object({ courseOfferingId: z.number() }))
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db
          .select()
          .from(aiChatHistory)
          .where(
            eq(aiChatHistory.studentId, ctx.user.id) && eq(aiChatHistory.courseOfferingId, input.courseOfferingId)
          );

        return result.length > 0 ? result[0] : null;
      }),

    // Send message to AI tutor
    sendAiMessage: studentProcedure
      .input(z.object({ courseOfferingId: z.number(), message: z.string() }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Implement AI tutor integration
        return { success: true, response: "AI response placeholder" };
      }),
  }),

  /**
   * Lecturer Routes
   */
  lecturer: router({
    // Get lecturer profile
    getProfile: lecturerProcedure.query(async ({ ctx }) => {
      const profile = await getLecturerProfile(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lecturer profile not found" });
      }
      return profile;
    }),

    // Get assigned courses
    getAssignedCourses: lecturerProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return await db.select().from(courseOfferings).where(eq(courseOfferings.lecturerId, ctx.user.id));
    }),

    // Create assignment
    createAssignment: lecturerProcedure
      .input(
        z.object({
          courseOfferingId: z.number(),
          title: z.string(),
          description: z.string().optional(),
          dueDate: z.date(),
          totalPoints: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db.insert(assignments).values({
          courseOfferingId: input.courseOfferingId,
          title: input.title,
          description: input.description,
          dueDate: new Date(input.dueDate),
          totalPoints: input.totalPoints || 100,
        });

        return { success: true, assignmentId: result[0] };
      }),

    // Get course sessions
    getCourseSessions: lecturerProcedure
      .input(z.object({ courseOfferingId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return await db
          .select()
          .from(courseSessions)
          .where(eq(courseSessions.courseOfferingId, input.courseOfferingId));
      }),

    // Mark attendance
    markAttendance: lecturerProcedure
      .input(
        z.object({
          sessionId: z.number(),
          studentId: z.number(),
          status: z.enum(["present", "absent", "excused"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        await db.insert(attendance).values({
          studentId: input.studentId,
          sessionId: input.sessionId,
          status: input.status,
          markedBy: ctx.user.id,
        });

        return { success: true };
      }),

    // Get submissions for assignment
    getAssignmentSubmissions: lecturerProcedure
      .input(z.object({ assignmentId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return await db
          .select()
          .from(assignmentSubmissions)
          .where(eq(assignmentSubmissions.assignmentId, input.assignmentId));
      }),

    // Grade submission
    gradeSubmission: lecturerProcedure
      .input(
        z.object({
          submissionId: z.number(),
          points: z.number(),
          feedback: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const percentage = input.points; // Points already represent percentage

        await db.insert(grades).values({
          submissionId: input.submissionId,
          points: String(input.points),
          percentage: String(percentage),
          feedback: input.feedback,
          gradedBy: ctx.user.id,
          gradingMethod: "manual",
        });

        await db
          .update(assignmentSubmissions)
          .set({ status: "graded" })
          .where(eq(assignmentSubmissions.id, input.submissionId));

        return { success: true };
      }),

    // Post announcement
    postAnnouncement: lecturerProcedure
      .input(
        z.object({
          courseOfferingId: z.number(),
          title: z.string(),
          content: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db.insert(announcements).values({
          courseOfferingId: input.courseOfferingId,
          lecturerId: ctx.user.id,
          title: input.title,
          content: input.content,
        });

        return { success: true, announcementId: result[0] };
      }),

    // Upload course material
    uploadCourseMaterial: lecturerProcedure
      .input(
        z.object({
          courseOfferingId: z.number(),
          title: z.string(),
          fileUrl: z.string(),
          visibility: z.enum(["students", "ai", "both"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const result = await db.insert(courseMaterials).values({
          courseOfferingId: input.courseOfferingId,
          title: input.title,
          fileUrl: input.fileUrl,
          visibility: input.visibility || "both",
        });

        return { success: true, materialId: result[0] };
      }),
  }),

  /**
   * HOD Routes
   */
  hod: router({
    // Get department overview
    getDepartmentOverview: hodProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // TODO: Get HOD's department ID and fetch overview data
      return { students: [], lecturers: [], courses: [] };
    }),

    // Get all students in department
    getDepartmentStudents: hodProcedure
      .input(z.object({ departmentId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return await db
          .select()
          .from(studentProfiles)
          .where(eq(studentProfiles.departmentId, input.departmentId));
      }),

    // Get all lecturers in department
    getDepartmentLecturers: hodProcedure
      .input(z.object({ departmentId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        return await db
          .select()
          .from(lecturerProfiles)
          .where(eq(lecturerProfiles.departmentId, input.departmentId));
      }),
  }),

  /**
   * Admin Routes
   */
  admin: router({
    // Get all users
    getAllUsers: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return await db.select().from(users);
    }),

    // Update user role
    updateUserRole: adminProcedure
      .input(z.object({ userId: z.number(), role: z.enum(["student", "lecturer", "hod", "admin"]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
