import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, TrendingUp, Settings } from "lucide-react";
import { useLocation } from "wouter";

export default function HodDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const navigationItems = [
    { icon: BookOpen, label: "Courses", href: "/hod/courses" },
    { icon: Users, label: "Students", href: "/hod/students" },
    { icon: TrendingUp, label: "Analytics", href: "/hod/dashboard" },
    { icon: Settings, label: "Department", href: "/hod/dashboard" },
  ];

  return (
    <DashboardLayout navigationItems={navigationItems} userRole="hod">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Department Overview</h1>
          <p className="text-slate-600 mt-2">Monitor department performance and manage operations</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: "542", icon: Users, color: "bg-blue-50" },
            { label: "Active Lecturers", value: "24", icon: Users, color: "bg-purple-50" },
            { label: "Courses Offered", value: "48", icon: BookOpen, color: "bg-green-50" },
            { label: "Avg. GPA", value: "3.45", icon: TrendingUp, color: "bg-orange-50" },
          ].map((stat, i) => (
            <Card key={i} className={`${stat.color} border-0`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Department Overview</TabsTrigger>
            <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Courses */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Courses This Semester</CardTitle>
                  <CardDescription>12 courses across all levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[100, 200, 300, 400].map((level) => (
                    <div key={level} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm font-medium">Level {level}</span>
                      <span className="text-sm text-slate-600">{3} courses</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Student Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Distribution</CardTitle>
                  <CardDescription>By academic level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { level: "100 Level", count: 145, color: "bg-blue-100" },
                    { level: "200 Level", count: 132, color: "bg-purple-100" },
                    { level: "300 Level", count: 156, color: "bg-green-100" },
                    { level: "400 Level", count: 109, color: "bg-orange-100" },
                  ].map((item) => (
                    <div key={item.level} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.level}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.count / 156) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lecturers Tab */}
          <TabsContent value="lecturers" className="space-y-4">
            <div className="grid gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Dr. Lecturer Name {i}</CardTitle>
                        <CardDescription>Staff ID: LEC{1000 + i}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{3 + i} Courses</p>
                        <p className="text-xs text-slate-600">This Semester</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">Avg. Student Rating: 4.5/5.0</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { grade: "A (90-100)", percentage: 25 },
                    { grade: "B (80-89)", percentage: 35 },
                    { grade: "C (70-79)", percentage: 25 },
                    { grade: "D (60-69)", percentage: 12 },
                    { grade: "F (<60)", percentage: 3 },
                  ].map((item) => (
                    <div key={item.grade} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.grade}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Avg. Attendance", value: "87%" },
                    { label: "Pass Rate", value: "94%" },
                    { label: "Graduation Rate", value: "92%" },
                    { label: "Employment Rate", value: "88%" },
                  ].map((metric, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm text-slate-600">{metric.label}</span>
                      <span className="text-sm font-semibold text-slate-900">{metric.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
