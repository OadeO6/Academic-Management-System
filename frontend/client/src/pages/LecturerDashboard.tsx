import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, BarChart3, FileText, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function LecturerDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const navigationItems = [
    { icon: BookOpen, label: "Courses", href: "/lecturer/management" },
    { icon: Users, label: "Attendance", href: "/lecturer/attendance" },
    { icon: FileText, label: "Grading", href: "/lecturer/grading" },
    { icon: BarChart3, label: "Analytics", href: "/lecturer/analytics" },
  ];

  return (
    <DashboardLayout navigationItems={navigationItems} userRole="lecturer">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
            <p className="text-slate-600 mt-2">Manage your courses and student progress</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Assignment
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Active Courses", value: "4", icon: BookOpen, color: "bg-blue-50" },
            { label: "Total Students", value: "142", icon: Users, color: "bg-purple-50" },
            { label: "Pending Submissions", value: "18", icon: FileText, color: "bg-orange-50" },
            { label: "Avg. Class Grade", value: "B+", icon: BarChart3, color: "bg-green-50" },
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
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
            <TabsTrigger value="grading">Grading Queue</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>CS{200 + i}01 - Advanced Programming</CardTitle>
                        <CardDescription>Semester 1 • 142 Students</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">4/15 Sessions</p>
                        <p className="text-xs text-slate-600">Completed</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">18 pending assignments</span>
                      <button onClick={() => navigate("/lecturer/management")} className="text-blue-600 font-medium hover:underline">Manage →</button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-4">
            <div className="grid gap-4">
              {[
                { student: "John Doe", assignment: "Programming Project", submitted: "2 hours ago", status: "submitted" },
                { student: "Jane Smith", assignment: "Database Design", submitted: "5 hours ago", status: "submitted" },
                { student: "Bob Johnson", assignment: "Web Development", submitted: "1 day ago", status: "submitted" },
              ].map((submission, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{submission.student}</CardTitle>
                        <CardDescription>{submission.assignment}</CardDescription>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Submitted
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">Submitted {submission.submitted}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Grading Queue Tab */}
          <TabsContent value="grading" className="space-y-4">
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">Assignment {i} - Grading Pending</CardTitle>
                        <CardDescription>12 submissions waiting for review</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        Grade Now
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
