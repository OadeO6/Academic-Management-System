/**
 * Simplified API Hooks
 * 
 * These hooks provide a clean abstraction for data fetching
 * They work with the existing backend and can be extended as needed
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { APIErrorHandler } from "./client";
import type { UseQueryOptions, UseMutationOptions } from "./types";

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

export function useStudentGrades(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["student", "grades"],
    queryFn: async () => {
      try {
        return await (trpc.student.getGrades as any).query();
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useSubmitAssignment(options?: UseMutationOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { assignmentId: number; fileUrl: string }) => {
      try {
        return await (trpc.student.submitAssignment as any).mutate(data);
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "assignments"] });
      options?.onSuccess?.({});
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });
}

export function useSendAIMessage(options?: UseMutationOptions) {
  return useMutation({
    mutationFn: async (data: {
      courseOfferingId: number;
      message: string;
    }) => {
      try {
        return await (trpc.student.sendAiMessage as any).mutate(data);
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
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

export function useGradeSubmission(options?: UseMutationOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      submissionId: number;
      points: number;
      feedback?: string;
    }) => {
      try {
        return await (trpc.lecturer.gradeSubmission as any).mutate(data);
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecturer"] });
      options?.onSuccess?.({});
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });
}

/**
 * HOD HOOKS
 */

export function useHodDepartmentOverview(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["hod", "department"],
    queryFn: async () => {
      try {
        return await (trpc.hod.getDepartmentOverview as any).query();
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

export function useAdminUsers(options?: UseQueryOptions) {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      try {
        return await (trpc.admin.getAllUsers as any).query();
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useUpdateUserRole(options?: UseMutationOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      userId: number;
      role: "student" | "lecturer" | "hod" | "admin";
    }) => {
      try {
        return await (trpc.admin.updateUserRole as any).mutate(data);
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      options?.onSuccess?.({});
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });
}

/**
 * AUTH HOOKS
 */

export function useLogout(options?: UseMutationOptions) {
  return useMutation({
    mutationFn: async () => {
      try {
        return await (trpc.auth.logout as any).mutate();
      } catch (error) {
        throw APIErrorHandler.handle(error);
      }
    },
    onSuccess: () => {
      // Redirect to home page
      window.location.href = "/";
      options?.onSuccess?.({});
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
  });
}
