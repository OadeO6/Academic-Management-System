import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Calendar, MessageSquare, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const navigationItems = [
    { icon: BookOpen, label: "Courses", href: "/student/dashboard" },
    { icon: FileText, label: "Assignments", href: "/student/assignments" },
    { icon: Calendar, label: "Attendance", href: "/student/attendance" },
    { icon: TrendingUp, label: "Grades", href: "/student/grades" },
    { icon: MessageSquare, label: "AI Tutor", href: "/student/tutor" },
  ];

  return (
    <DashboardLayout navigationItems={navigationItems} userRole="student">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
          <p className="text-slate-600 mt-2">Here's your academic overview for this semester</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Enrolled Courses", value: "5", icon: BookOpen, color: "bg-blue-50" },
            { label: "Pending Assignments", value: "3", icon: FileText, color: "bg-purple-50" },
            { label: "Attendance Rate", value: "92%", icon: Calendar, color: "bg-green-50" },
            { label: "Average Grade", value: "B+", icon: TrendingUp, color: "bg-orange-50" },
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
            <TabsTrigger value="courses">Enrolled Courses</TabsTrigger>
            <TabsTrigger value="assignments">Recent Assignments</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>CS{200 + i}01 - Advanced Programming</CardTitle>
                        <CardDescription>Dr. Smith • 3 Credit Units</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">85%</p>
                        <p className="text-xs text-slate-600">Current Grade</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">12/15 sessions attended</span>
                      <button onClick={() => navigate("/student/courses")} className="text-blue-600 font-medium hover:underline">View Details →</button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <div className="grid gap-4">
              {[
                { title: "Programming Project", course: "CS201", due: "2 days", status: "pending" },
                { title: "Database Design", course: "CS202", due: "5 days", status: "submitted" },
                { title: "Web Development", course: "CS203", due: "1 week", status: "graded" },
              ].map((assignment, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription>{assignment.course}</CardDescription>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          assignment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : assignment.status === "submitted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">Due in {assignment.due}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-4">
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-l-4 border-l-blue-600">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">Important Announcement {i}</CardTitle>
                        <CardDescription>Posted 2 days ago</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">
                      This is an important announcement from your lecturer. Please read carefully and take necessary
                      action.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
