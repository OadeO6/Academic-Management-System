import React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import RoleLayout from "@/layouts/RoleLayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"student" | "lecturer" | "hod" | "admin">;
}

/**
 * DEVELOPMENT AUTH BYPASS
 *
 * Enables:
 * - unrestricted navigation
 * - all dashboard pages
 * - sidebar rendering
 * - nested routes
 * - role layouts
 *
 * Disable before production.
 */
const DEV_BYPASS_AUTH = true;

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const auth = useAuth();

  // DEVELOPMENT MODE
  if (DEV_BYPASS_AUTH) {
    const devRole: "student" | "lecturer" | "hod" | "admin" = "admin";

    return (
      <RoleLayout role={devRole}>
        {children}
      </RoleLayout>
    );
  }

  // PRODUCTION MODE
  const { user, loading, isAuthenticated } = auth;

  if (loading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userRole = user.role.toLowerCase() as
    | "student"
    | "lecturer"
    | "hod"
    | "admin";

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return null;
  }

  return (
    <RoleLayout role={userRole}>
      {children}
    </RoleLayout>
  );
}