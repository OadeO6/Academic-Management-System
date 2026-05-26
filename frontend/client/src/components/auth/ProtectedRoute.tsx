import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import RoleLayout from "@/layouts/RoleLayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"student" | "lecturer" | "hod" | "admin">;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Normalize role to lowercase
  const userRole = user.role.toLowerCase() as "student" | "lecturer" | "hod" | "admin";

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    setLocation("/"); // Redirect to home or unauthorized page
    return null;
  }

  return <RoleLayout role={userRole}>{children}</RoleLayout>;
}
