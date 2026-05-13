import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, BarChart3, Plus } from "lucide-react";

export default function HodCourseManagement() {
  // Mock course data
  const courses = [
    {
      id: 1,
      code: "CS201",
      title: "Advanced Programming",
      lecturer: "Dr. Smith",
      students: 45,
      level: 200,
      status: "active",
      avgGrade: 87.3,
    },
    {
      id: 2,
      code: "CS202",
      title: "Database Systems",
      lecturer: "Prof. Johnson",
      students: 38,
      level: 200,
      status: "active",
      avgGrade: 84.1,
    },
    {
      id: 3,
      code: "CS301",
      title: "Software Engineering",
      lecturer: "Dr. Williams",
      students: 52,
      level: 300,
      status: "active",
      avgGrade: 88.7,
    },
    {
      id: 4,
      code: "CS101",
      title: "Introduction to Programming",
      lecturer: "Dr. Brown",
      students: 120,
      level: 100,
      status: "inactive",
      avgGrade: 79.2,
    },
  ];

  const activeCourses = courses.filter((c) => c.status === "active");
  const inactiveCourses = courses.filter((c) => c.status === "inactive");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Course Management</h1>
          <p className="text-slate-600 mt-2">Manage department courses and offerings</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Courses</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{activeCourses.length}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Students</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {courses.reduce((sum, c) => sum + c.students, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Grade</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {(courses.reduce((sum, c) => sum + c.avgGrade, 0) / courses.length).toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({activeCourses.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveCourses.length})</TabsTrigger>
          <TabsTrigger value="all">All ({courses.length})</TabsTrigger>
        </TabsList>

        {/* Active Courses */}
        <TabsContent value="active" className="space-y-3">
          {activeCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-blue-600">{course.code}</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-slate-600">Lecturer: {course.lecturer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{course.students}</p>
                    <p className="text-xs text-slate-600">Students</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-2 bg-slate-50 rounded text-center">
                    <p className="text-xs text-slate-600">Level</p>
                    <p className="text-lg font-bold text-slate-900">{course.level}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded text-center">
                    <p className="text-xs text-slate-600">Avg Grade</p>
                    <p className="text-lg font-bold text-slate-900">{course.avgGrade}%</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded text-center">
                    <p className="text-xs text-slate-600">Status</p>
                    <p className="text-sm font-bold text-green-600">Active</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Deactivate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Inactive Courses */}
        <TabsContent value="inactive" className="space-y-3">
          {inactiveCourses.map((course) => (
            <Card key={course.id} className="opacity-75">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-slate-600">{course.code}</span>
                      <Badge className="bg-slate-100 text-slate-800">Inactive</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-slate-600">Lecturer: {course.lecturer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{course.students}</p>
                    <p className="text-xs text-slate-600">Students</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Activate
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* All Courses */}
        <TabsContent value="all" className="space-y-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-blue-600">{course.code}</span>
                      <Badge className={course.status === "active" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}>
                        {course.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-slate-600">
                      {course.lecturer} • Level {course.level} • {course.students} students
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">Avg: {course.avgGrade}%</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
