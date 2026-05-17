/**
 * Student Courses Page
 * Displays enrolled courses with details
 * All data loaded from backend APIs
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Calendar, FileText } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";

export default function StudentCourses() {
  const { user } = useAuth();

  const navigationItems = [
    { icon: BookOpen, label: "Courses", href: "/student/courses" },
    { icon: FileText, label: "Assignments", href: "/student/assignments" },
    { icon: Calendar, label: "Attendance", href: "/student/attendance" },
  ];

  // TODO: Replace with actual API call
  // const { data: courses, isLoading, error } = trpc.student.getEnrolledCourses.useQuery();

  const isLoading = false;
  const courses = null;
  const error = null;

  if (isLoading) {
    return (
      <DashboardLayout navigationItems={navigationItems} userRole="student">
        <LoadingState message="Loading your courses..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout navigationItems={navigationItems} userRole="student">
        <ErrorState
          title="Failed to load courses"
          description="An error occurred while loading your enrolled courses."
          error={error}
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navigationItems={navigationItems} userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground mt-2">View your enrolled courses and course materials</p>
        </div>

        {/* Course Summary - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                  <p className="text-3xl font-bold mt-1">-</p>
                </div>
                <BookOpen className="w-8 h-8 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-3xl font-bold mt-1">-</p>
                </div>
                <Calendar className="w-8 h-8 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Grade</p>
                  <p className="text-3xl font-bold mt-1">-</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* All Courses */}
          <TabsContent value="all" className="space-y-4">
            <EmptyState
              title="No courses loaded"
              description="Your enrolled courses will appear here once the backend API is connected."
              icon={BookOpen}
            />
          </TabsContent>

          {/* Active Courses */}
          <TabsContent value="active" className="space-y-4">
            <EmptyState
              title="No active courses"
              description="Active courses will appear here once the backend API is connected."
              icon={BookOpen}
            />
          </TabsContent>

          {/* Completed Courses */}
          <TabsContent value="completed" className="space-y-4">
            <EmptyState
              title="No completed courses"
              description="Completed courses will appear here once the backend API is connected."
              icon={BookOpen}
            />
          </TabsContent>
        </Tabs>

        {/* API Integration Notice */}
        <Card className="border-dashed bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Backend Integration Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Implement the following backend endpoints:
            </p>
            <div className="space-y-2">
              <code className="text-xs bg-muted p-2 rounded block font-mono">
                GET /api/trpc/student.getEnrolledCourses
              </code>
              <code className="text-xs bg-muted p-2 rounded block font-mono">
                GET /api/trpc/student.getCourseStats
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
