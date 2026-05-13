import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Helper to create mock context for testing
 */
function createMockContext(role: "student" | "lecturer" | "hod" | "admin" = "student"): TrpcContext {
  const now = new Date();
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "test",
      role,
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Auth Router", () => {
  it("should return current user with me query", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();

    expect(user).toBeDefined();
    expect(user?.email).toBe("test@example.com");
    expect(user?.role).toBe("student");
  });

  it("should logout successfully", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result.success).toBe(true);
  });
});

describe("Student Router", () => {
  it("should reject non-student users", async () => {
    const ctx = createMockContext("lecturer");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.student.getProfile();
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should allow student to get profile", async () => {
    const ctx = createMockContext("student");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.student.getProfile();
      // May fail with NOT_FOUND if profile doesn't exist, but should not fail with FORBIDDEN
    } catch (error: any) {
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });

  it("should allow student to get enrolled courses", async () => {
    const ctx = createMockContext("student");
    const caller = appRouter.createCaller(ctx);

    const courses = await caller.student.getEnrolledCourses();

    expect(Array.isArray(courses)).toBe(true);
  });

  it("should allow student to get notifications", async () => {
    const ctx = createMockContext("student");
    const caller = appRouter.createCaller(ctx);

    const notifications = await caller.student.getNotifications();

    expect(Array.isArray(notifications)).toBe(true);
  });
});

describe("Lecturer Router", () => {
  it("should reject non-lecturer users", async () => {
    const ctx = createMockContext("student");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.lecturer.getProfile();
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should allow lecturer to get profile", async () => {
    const ctx = createMockContext("lecturer");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.lecturer.getProfile();
      // May fail with NOT_FOUND if profile doesn't exist, but should not fail with FORBIDDEN
    } catch (error: any) {
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });

  it("should allow lecturer to get assigned courses", async () => {
    const ctx = createMockContext("lecturer");
    const caller = appRouter.createCaller(ctx);

    const courses = await caller.lecturer.getAssignedCourses();

    expect(Array.isArray(courses)).toBe(true);
  });

  it("should allow lecturer to create assignment", async () => {
    const ctx = createMockContext("lecturer");
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.lecturer.createAssignment({
        courseOfferingId: 1,
        title: "Test Assignment",
        description: "Test Description",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalPoints: 100,
      });

      expect(result.success).toBe(true);
      expect(result.assignmentId).toBeDefined();
    } catch (error: any) {
      // May fail due to non-existent course, but should not fail with FORBIDDEN
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });
});

describe("HOD Router", () => {
  it("should reject non-hod users", async () => {
    const ctx = createMockContext("student");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.hod.getDepartmentOverview();
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should allow hod to get department overview", async () => {
    const ctx = createMockContext("hod");
    const caller = appRouter.createCaller(ctx);

    const overview = await caller.hod.getDepartmentOverview();

    expect(overview).toBeDefined();
    expect(Array.isArray(overview.students)).toBe(true);
    expect(Array.isArray(overview.lecturers)).toBe(true);
    expect(Array.isArray(overview.courses)).toBe(true);
  });

  it("should allow hod to get department students", async () => {
    const ctx = createMockContext("hod");
    const caller = appRouter.createCaller(ctx);

    const students = await caller.hod.getDepartmentStudents({ departmentId: 1 });

    expect(Array.isArray(students)).toBe(true);
  });

  it("should allow hod to get department lecturers", async () => {
    const ctx = createMockContext("hod");
    const caller = appRouter.createCaller(ctx);

    const lecturers = await caller.hod.getDepartmentLecturers({ departmentId: 1 });

    expect(Array.isArray(lecturers)).toBe(true);
  });
});

describe("Admin Router", () => {
  it("should reject non-admin users", async () => {
    const ctx = createMockContext("student");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.getAllUsers();
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should allow admin to get all users", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);

    const users = await caller.admin.getAllUsers();

    expect(Array.isArray(users)).toBe(true);
  });

  it("should allow admin to update user role", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.admin.updateUserRole({
        userId: 2,
        role: "lecturer",
      });

      expect(result.success).toBe(true);
    } catch (error: any) {
      // May fail due to non-existent user, but should not fail with FORBIDDEN
      expect(error.code).not.toBe("FORBIDDEN");
    }
  });
});

describe("Role-Based Access Control", () => {
  it("student cannot access lecturer endpoints", async () => {
    const ctx = createMockContext("student");
    const caller = appRouter.createCaller(ctx);

    const endpoints = [
      () => caller.lecturer.getProfile(),
      () => caller.lecturer.getAssignedCourses(),
    ];

    for (const endpoint of endpoints) {
      try {
        await endpoint();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    }
  });

  it("lecturer cannot access admin endpoints", async () => {
    const ctx = createMockContext("lecturer");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.getAllUsers();
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("hod cannot access admin endpoints", async () => {
    const ctx = createMockContext("hod");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.getAllUsers();
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});
