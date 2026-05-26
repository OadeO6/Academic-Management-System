/**
 * Lecturer Dashboard Page
 * Overview of lecturer activities and courses
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { BookOpen, Award, Users, FileText, Calendar, Bell, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useLecturerCourses } from "@/api/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LecturerDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Fetch courses to show on dashboard
  const { data: coursesData, isLoading, error, refetch } = useLecturerCourses({ limit: 3 });


  const actionCards = [
    {
      title: "Course Management",
      description: "Manage your courses and materials",
      icon: BookOpen,
      href: "/lecturer/courses",
      color: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50",
    },
    {
      title: "Tasks & Grading",
      description: "Manage assignments and grade students",
      icon: Award,
      href: "/lecturer/courses", // Link to courses first to select one
      color: "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-950/50",
    },
    {
      title: "Attendance",
      description: "Track and manage student attendance",
      icon: Users,
      href: "/lecturer/courses", // Link to courses first to select one
      color: "bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-950/50",
    },
  ];

  const courses = coursesData?.courses || [];

  return (
    
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name || "Lecturer"}</h1>
          <p className="text-muted-foreground mt-2">Manage your courses, students, and academic activities</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actionCards.map((card) => (
            <Card
              key={card.title}
              className={`${card.color} border-0 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}
              onClick={() => navigate(card.href)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <card.icon className="w-6 h-6 text-primary" />
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Recent Courses</h2>
            <Button variant="link" onClick={() => navigate("/lecturer/courses")}>View All</Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Failed to load courses"
              description="An error occurred while loading your courses."
              error={error}
              onRetry={() => refetch()}
            />
          ) : courses.length === 0 ? (
            <EmptyState
              title="No courses assigned"
              description="You have no courses assigned to you yet."
              icon={BookOpen}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant={course.active ? "default" : "secondary"}>
                        {course.active ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{course.code}</span>
                    </div>
                    <CardTitle className="text-lg mt-2 line-clamp-1">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">{course.totalStudents}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tasks:</span>
                        <span className="font-medium">{course.tasksCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sessions:</span>
                        <span className="font-medium">{course.sessionsCount}</span>
                      </div>
                      <div className="pt-2 grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/lecturer/courses/${course.id}/students`)}>
                          Students
                        </Button>
                        <Button size="sm" onClick={() => navigate(`/lecturer/courses/${course.id}/tasks`)}>
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Integration Status */}
        <Card className="border-dashed bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You can manage students, upload materials, create assignments, and track attendance by selecting a course from your list.
            </p>
          </CardContent>
        </Card>
      </div>
    
  );
}
