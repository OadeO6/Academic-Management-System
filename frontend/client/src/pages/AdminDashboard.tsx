import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building2, Users, Settings, BarChart3, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const navigationItems = [
    { icon: Building2, label: "Faculties", href: "/admin/dashboard" },
    { icon: Building2, label: "Departments", href: "/admin/dashboard" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <DashboardLayout navigationItems={navigationItems} userRole="admin">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">System Administration</h1>
            <p className="text-slate-600 mt-2">Manage the entire academic management system</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Entity
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: "2,847", icon: Users, color: "bg-blue-50" },
            { label: "Faculties", value: "8", icon: Building2, color: "bg-purple-50" },
            { label: "Departments", value: "42", icon: Building2, color: "bg-green-50" },
            { label: "Active Sessions", value: "3", icon: BarChart3, color: "bg-orange-50" },
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
        <Tabs defaultValue="system" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="system">System Overview</TabsTrigger>
            <TabsTrigger value="faculties">Faculties</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="sessions">Academic Sessions</TabsTrigger>
          </TabsList>

          {/* System Overview Tab */}
          <TabsContent value="system" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Current system status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Database", status: "Healthy", color: "text-green-600" },
                    { label: "API Server", status: "Healthy", color: "text-green-600" },
                    { label: "File Storage", status: "Healthy", color: "text-green-600" },
                    { label: "AI Service", status: "Operational", color: "text-green-600" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <span className={`text-sm font-medium ${item.color}`}>{item.status}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* User Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>By role</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { role: "Students", count: 2100, color: "bg-blue-100" },
                    { role: "Lecturers", count: 600, color: "bg-purple-100" },
                    { role: "HODs", count: 42, color: "bg-green-100" },
                    { role: "Admins", count: 5, color: "bg-orange-100" },
                  ].map((item) => (
                    <div key={item.role} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.role}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.count / 2100) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Faculties Tab */}
          <TabsContent value="faculties" className="space-y-4">
            <div className="grid gap-4">
              {[
                "Faculty of Science",
                "Faculty of Engineering",
                "Faculty of Arts",
                "Faculty of Social Sciences",
                "Faculty of Medicine",
                "Faculty of Law",
                "Faculty of Business",
                "Faculty of Education",
              ].map((faculty, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{faculty}</CardTitle>
                        <CardDescription>{5 + i} departments</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{250 + i * 50} Students</p>
                        <p className="text-xs text-slate-600">Active</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{25 + i} Lecturers</span>
                      <span className="text-blue-600 font-medium">Manage →</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="grid gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">User {i}</CardTitle>
                        <CardDescription>user{i}@university.edu</CardDescription>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {["Student", "Lecturer", "HOD", "Admin", "Student"][i - 1]}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Joined 3 months ago</span>
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Academic Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            <div className="grid gap-4">
              {[
                { year: "2025/2026", status: "Active", color: "bg-green-100 text-green-800" },
                { year: "2024/2025", status: "Completed", color: "bg-slate-100 text-slate-800" },
                { year: "2023/2024", status: "Archived", color: "bg-slate-100 text-slate-800" },
              ].map((session, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Academic Session {session.year}</CardTitle>
                        <CardDescription>2 semesters</CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${session.color}`}>
                        {session.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Semester 1 & 2</span>
                      <Button size="sm" variant="ghost">
                        Manage
                      </Button>
                    </div>
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
