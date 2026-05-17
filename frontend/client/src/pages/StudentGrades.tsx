/**
 * Student Grades Page
 * Displays course grades, assignment grades, and GPA tracking
 * All data loaded from backend APIs
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";

export default function StudentGrades() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // TODO: Replace with actual API calls
  // const { data: courseGrades, isLoading: gradesLoading } = trpc.student.getGrades.useQuery();
  // const { data: assignmentGrades, isLoading: assignmentsLoading } = trpc.student.getAssignmentGrades.useQuery();
  // const { data: gpaHistory, isLoading: gpaLoading } = trpc.student.getGPAHistory.useQuery();

  const navigationItems = [
    { icon: TrendingUp, label: "Grades", href: "/student/grades" },
  ];

  const isLoading = false;
  const courseGrades: any = null;
  const assignmentGrades: any = null;
  const gpaHistory: any = null;
  const error = null;

  if (isLoading) {
    return (
      <DashboardLayout navigationItems={navigationItems} userRole="student">
        <LoadingState message="Loading your grades..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout navigationItems={navigationItems} userRole="student">
        <ErrorState
          title="Failed to load grades"
          description="An error occurred while loading your grades."
          error={error}
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navigationItems={navigationItems} userRole="student">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/student/dashboard")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Grades</h1>
          <p className="text-muted-foreground mt-2">View your course grades and academic performance</p>
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Course Grades</TabsTrigger>
            <TabsTrigger value="assignments">Assignment Grades</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Course Grades Tab */}
          <TabsContent value="courses">
            {!courseGrades || courseGrades.length === 0 ? (
              <EmptyState
                title="No course grades available"
                description="Your course grades will appear here once the backend API is connected."
                icon={TrendingUp}
              />
            ) : (
              <div className="space-y-4">
                {courseGrades.map((course: any) => (
                  <Card key={course.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{course.code} - {course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.credits} credits</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold">{course.grade}</p>
                          <p className="text-sm text-muted-foreground">{course.percentage}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Assignment Grades Tab */}
          <TabsContent value="assignments">
            {!assignmentGrades || assignmentGrades.length === 0 ? (
              <EmptyState
                title="No assignment grades available"
                description="Your assignment grades will appear here once the backend API is connected."
                icon={TrendingUp}
              />
            ) : (
              <div className="space-y-4">
                {assignmentGrades.map((assignment: any) => (
                  <Card key={assignment.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">{assignment.course}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{assignment.score}/{assignment.total}</p>
                          <p className="text-sm text-muted-foreground">{Math.round((assignment.score/assignment.total)*100)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <EmptyState
                    title="Analytics not available"
                    description="Grade distribution charts will appear here once the backend API is connected."
                    icon={TrendingUp}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GPA Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <EmptyState
                    title="GPA history not available"
                    description="Your GPA trend will appear here once the backend API is connected."
                    icon={TrendingUp}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* API Integration Notice */}
        <Card className="border-dashed bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Backend Integration Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Implement these endpoints:</p>
            <div className="space-y-2 text-xs font-mono bg-muted p-2 rounded">
              <div>GET /api/trpc/student.getGrades</div>
              <div>GET /api/trpc/student.getAssignmentGrades</div>
              <div>GET /api/trpc/student.getGPAHistory</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
