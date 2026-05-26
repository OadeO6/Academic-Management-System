/**
 * Student Attendance Page
 * Displays attendance records and summary statistics
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, Users, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useStudentCourseAttendance } from "@/api/hooks";

const COLORS = ["#10b981", "#ef4444", "#f59e0b"];

export default function StudentAttendance() {
  const { user } = useAuth();
  const [, params] = useLocation();

  const courseOfferingId = parseInt((params as any)?.courseOfferingId || "0");


  // Fetch attendance
  const { data: attendanceData, isLoading, error, refetch } = useStudentCourseAttendance(courseOfferingId);

  const records = attendanceData?.records || [];
  const summary = attendanceData?.summary;

  // Prepare chart data
  const chartData = records.map((record, index) => ({
    date: new Date(record.createdAt).toLocaleDateString(),
    status: record.status,
  }));

  // Prepare summary chart data
  const summaryChartData = summary ? [
    { name: "Present", value: summary.present, fill: "#10b981" },
    { name: "Absent", value: summary.absent, fill: "#ef4444" },
  ] : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "absent":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "excused":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "excused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Attendance</h1>
          <p className="text-muted-foreground mt-2">View your attendance records and statistics</p>
        </div>

        {/* Summary Cards */}
        {!isLoading && !error && summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                    <p className="text-3xl font-bold mt-1">{summary.total}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Present</p>
                    <p className="text-3xl font-bold mt-1 text-green-600">{summary.present}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Absent</p>
                    <p className="text-3xl font-bold mt-1 text-red-600">{summary.absent}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    <p className="text-3xl font-bold mt-1">{summary.percentage}%</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="records" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="records">Attendance Records</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Attendance Records Tab */}
          <TabsContent value="records" className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState
                title="Failed to load attendance"
                description="An error occurred while loading your attendance records."
                error={error}
                onRetry={() => refetch()}
              />
            ) : !records || records.length === 0 ? (
              <EmptyState
                title="No attendance records"
                description="Your attendance records will appear here once sessions are recorded."
                icon={Calendar}
              />
            ) : (
              <div className="space-y-3">
                {records.map((record) => (
                  <Card key={record.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          {getStatusIcon(record.status)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold">
                              {record.sessionTitle || `Session - ${new Date(record.sessionDate || record.createdAt).toLocaleDateString()}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(record.sessionDate || record.createdAt).toLocaleDateString()} at{" "}
                              {new Date(record.markedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
            ) : !records || records.length === 0 ? (
              <EmptyState
                title="No analytics available"
                description="Analytics will appear once you have attendance records."
                icon={Calendar}
              />
            ) : (
              <div className="space-y-6">
                {/* Attendance Summary Pie Chart */}
                {summaryChartData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance Summary</CardTitle>
                      <CardDescription>Your attendance distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={summaryChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {summaryChartData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Attendance Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Trend</CardTitle>
                    <CardDescription>Your attendance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {records.slice(0, 10).map((record) => (
                        <div key={record.id} className="flex items-center justify-between">
                          <span className="text-sm">
                            {new Date(record.sessionDate || record.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            <span className="text-sm font-semibold capitalize">{record.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    
  );
}
