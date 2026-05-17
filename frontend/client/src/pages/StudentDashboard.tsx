/**
 * Student Dashboard Page
 * Main landing page for students showing overview of courses and recent activity
 * All data is loaded from backend APIs
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Calendar, MessageSquare, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const navigationItems = [
    { icon: BookOpen, label: "Courses", href: "/student/dashboard" },
    { icon: FileText, label: "Assignments", href: "/student/assignments" },
    { icon: Calendar, label: "Attendance", href: "/student/attendance" },
    { icon: TrendingUp, label: "Grades", href: "/student/grades" },
    { icon: MessageSquare, label: "AI Tutor", href: "/student/tutor" },
  ];

  // Show loading state while auth is being verified
  if (authLoading) {
    return (
      <DashboardLayout navigationItems={navigationItems} userRole="student">
        <LoadingState message="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navigationItems={navigationItems} userRole="student">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || "Student"}!</h1>
          <p className="text-muted-foreground mt-2">
            Here's your academic overview for this semester
          </p>
        </div>

        {/* Quick Stats - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Enrolled Courses", icon: BookOpen, color: "bg-blue-50" },
            { label: "Pending Assignments", icon: FileText, color: "bg-purple-50" },
            { label: "Attendance Rate", icon: Calendar, color: "bg-green-50" },
            { label: "Average Grade", icon: TrendingUp, color: "bg-orange-50" },
          ].map((stat, i) => (
            <Card key={i} className={`${stat.color} border-0`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">-</p>
                    <p className="text-xs text-muted-foreground">Loading...</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-muted-foreground/40" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Enrolled Courses</TabsTrigger>
            <TabsTrigger value="assignments">Recent Assignments</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          {/* Courses Tab - API Ready */}
          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-4">
              <EmptyState
                title="No courses loaded"
                description="Enrolled courses will appear here once the backend API is connected."
                icon={BookOpen}
                action={{
                  label: "View Courses",
                  onClick: () => navigate("/student/courses"),
                }}
              />
            </div>
          </TabsContent>

          {/* Assignments Tab - API Ready */}
          <TabsContent value="assignments" className="space-y-4">
            <div className="grid gap-4">
              <EmptyState
                title="No assignments loaded"
                description="Recent assignments will appear here once the backend API is connected."
                icon={FileText}
                action={{
                  label: "View All Assignments",
                  onClick: () => navigate("/student/assignments"),
                }}
              />
            </div>
          </TabsContent>

          {/* Announcements Tab - API Ready */}
          <TabsContent value="announcements" className="space-y-4">
            <div className="grid gap-4">
              <EmptyState
                title="No announcements"
                description="Course announcements will appear here once the backend API is connected."
                icon={MessageSquare}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* API Integration Notice */}
        <Card className="border-dashed bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Backend Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This dashboard is ready for backend API integration. The backend team should implement the following endpoints:
            </p>
            <ul className="text-sm text-muted-foreground mt-4 space-y-2 ml-4 list-disc">
              <li>GET /api/trpc/student.getProfile - Get student profile</li>
              <li>GET /api/trpc/student.getEnrolledCourses - Get enrolled courses</li>
              <li>GET /api/trpc/student.getCourseAssignments - Get course assignments</li>
              <li>GET /api/trpc/student.getGrades - Get student grades</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
