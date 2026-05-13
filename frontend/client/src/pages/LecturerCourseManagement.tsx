import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Calendar, BarChart3, Settings } from "lucide-react";

export default function LecturerCourseManagement() {
  // Mock course data
  const courses = [
    {
      id: 1,
      code: "CS201",
      title: "Advanced Programming",
      students: 45,
      sessions: 15,
      assignments: 5,
      avgGrade: 87.3,
      attendance: 89.5,
    },
    {
      id: 2,
      code: "CS202",
      title: "Database Systems",
      students: 38,
      sessions: 15,
      assignments: 4,
      avgGrade: 84.1,
      attendance: 85.2,
    },
    {
      id: 3,
      code: "CS203",
      title: "Web Development",
      students: 52,
      sessions: 15,
      assignments: 6,
      avgGrade: 88.7,
      attendance: 92.1,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Course Management</h1>
          <p className="text-slate-600 mt-2">Manage your courses and student progress</p>
        </div>
        <Button className="gap-2">
          <FileText className="w-4 h-4" />
          Create Course
        </Button>
      </div>

      {/* Course Cards */}
      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-600">{course.code}</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <CardTitle className="mt-2">{course.title}</CardTitle>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-50 rounded">
                  <Users className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">Students</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{course.students}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <Calendar className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">Sessions</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{course.sessions}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <FileText className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">Assignments</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{course.assignments}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <BarChart3 className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">Avg Grade</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{course.avgGrade}%</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <p className="text-xs text-slate-600">Attendance</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{course.attendance}%</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  View Students
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Sessions
                </Button>
                <Button variant="outline" className="flex-1">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button className="flex-1">Gradebook</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Details Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
              <CardDescription>Select a course to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Select a course from the cards above to view detailed information</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student List</CardTitle>
              <CardDescription>Manage enrolled students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Student {i}</p>
                      <p className="text-sm text-slate-600">student{i}@university.edu</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">Grade: A-</p>
                      <p className="text-xs text-slate-600">Attendance: 95%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Management</CardTitle>
              <CardDescription>Create and manage course assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2">
                <FileText className="w-4 h-4" />
                Create New Assignment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Analytics</CardTitle>
              <CardDescription>Performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Analytics data will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
