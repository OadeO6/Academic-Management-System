/**
 * Student Grades Page
 * Displays grades for assignments and courses
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Award, BookOpen, Calendar } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useStudentCourseGrades } from "@/api/hooks";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function StudentGrades() {
  const { user } = useAuth();
  const [, params] = useLocation();

  const courseOfferingId = parseInt((params as any)?.courseOfferingId || "0");


  // Fetch grades
  const { data: grades, isLoading, error, refetch } = useStudentCourseGrades(courseOfferingId);

  // Calculate statistics
  const calculateStats = () => {
    if (!grades || grades.length === 0) {
      return { average: 0, highest: 0, lowest: 0, total: 0 };
    }

    const points = grades.map((g) => g.points);
    const average = points.reduce((a, b) => a + b, 0) / points.length;
    const highest = Math.max(...points);
    const lowest = Math.min(...points);
    const total = points.reduce((a, b) => a + b, 0);

    return { average: Math.round(average * 10) / 10, highest, lowest, total };
  };

  const stats = calculateStats();

  // Prepare chart data
  const chartData = grades?.map((grade) => ({
    name: grade.assignmentTitle || `Assignment ${grade.id}`,
    score: grade.points,
    maxScore: grade.maxPoints,
  })) || [];

  // Prepare grade distribution
  const gradeDistribution = grades?.reduce((acc: any, grade) => {
    const percentage = (grade.points / grade.maxPoints) * 100;
    let letterGrade = "F";
    if (percentage >= 90) letterGrade = "A";
    else if (percentage >= 80) letterGrade = "B";
    else if (percentage >= 70) letterGrade = "C";
    else if (percentage >= 60) letterGrade = "D";

    const existing = acc.find((item: any) => item.name === letterGrade);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: letterGrade, value: 1 });
    }
    return acc;
  }, []) || [];

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Grades</h1>
          <p className="text-muted-foreground mt-2">View your assignment grades and performance analytics</p>
        </div>

        {/* Statistics Cards */}
        {!isLoading && !error && grades && grades.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-3xl font-bold mt-1">{stats.average}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Highest Score</p>
                    <p className="text-3xl font-bold mt-1">{stats.highest}</p>
                  </div>
                  <Award className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Lowest Score</p>
                    <p className="text-3xl font-bold mt-1">{stats.lowest}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="grades" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grades">Assignment Grades</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Assignment Grades Tab */}
          <TabsContent value="grades" className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState
                title="Failed to load grades"
                description="An error occurred while loading your grades."
                error={error}
                onRetry={() => refetch()}
              />
            ) : !grades || grades.length === 0 ? (
              <EmptyState
                title="No grades available"
                description="Your assignment grades will appear here once they are graded."
                icon={Award}
              />
            ) : (
              <div className="space-y-3">
                {grades.map((grade) => {
                  const percentage = (grade.points / grade.maxPoints) * 100;
                  const getGradeColor = () => {
                    if (percentage >= 90) return "bg-green-100 text-green-800";
                    if (percentage >= 80) return "bg-blue-100 text-blue-800";
                    if (percentage >= 70) return "bg-yellow-100 text-yellow-800";
                    if (percentage >= 60) return "bg-orange-100 text-orange-800";
                    return "bg-red-100 text-red-800";
                  };

                  return (
                    <Card key={grade.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold">{grade.assignmentTitle || `Assignment ${grade.id}`}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Graded on {new Date(grade.updatedAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Score</p>
                              <p className="text-2xl font-bold">
                                {grade.points}/{grade.maxPoints}
                              </p>
                            </div>
                            <div className={`px-3 py-2 rounded-lg font-semibold text-sm ${getGradeColor()}`}>
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState
                title="Failed to load analytics"
                description="An error occurred while loading analytics."
                error={error}
                onRetry={() => refetch()}
              />
            ) : !grades || grades.length === 0 ? (
              <EmptyState
                title="No analytics available"
                description="Analytics will appear once you have graded assignments."
                icon={Award}
              />
            ) : (
              <div className="space-y-6">
                {/* Score Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Score Distribution</CardTitle>
                    <CardDescription>Your scores across all assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#3b82f6" name="Your Score" />
                        <Bar dataKey="maxScore" fill="#e5e7eb" name="Max Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Grade Distribution Pie Chart */}
                {gradeDistribution.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Grade Distribution</CardTitle>
                      <CardDescription>Distribution of your grades</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={gradeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {gradeDistribution.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    
  );
}
