import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Calendar, FileText } from "lucide-react";

export default function StudentCourses() {
  // Mock course data
  const enrolledCourses = [
    {
      id: 1,
      code: "CS201",
      title: "Advanced Programming",
      lecturer: "Dr. Smith",
      credits: 3,
      grade: "A",
      percentage: 92,
      attendance: "14/15",
      sessions: 15,
      materials: 12,
      assignments: 5,
    },
    {
      id: 2,
      code: "CS202",
      title: "Database Systems",
      lecturer: "Prof. Johnson",
      credits: 3,
      grade: "B+",
      percentage: 85,
      attendance: "13/15",
      sessions: 15,
      materials: 10,
      assignments: 4,
    },
    {
      id: 3,
      code: "CS203",
      title: "Web Development",
      lecturer: "Dr. Williams",
      credits: 4,
      grade: "A-",
      percentage: 88,
      attendance: "15/15",
      sessions: 15,
      materials: 14,
      assignments: 6,
    },
    {
      id: 4,
      code: "CS204",
      title: "Algorithm Analysis",
      lecturer: "Dr. Brown",
      credits: 3,
      grade: "B",
      percentage: 82,
      attendance: "12/15",
      sessions: 15,
      materials: 11,
      assignments: 5,
    },
    {
      id: 5,
      code: "CS205",
      title: "System Design",
      lecturer: "Prof. Davis",
      credits: 3,
      grade: "A",
      percentage: 90,
      attendance: "14/15",
      sessions: 15,
      materials: 13,
      assignments: 5,
    },
  ];

  const totalCredits = enrolledCourses.reduce((sum, course) => sum + course.credits, 0);
  const avgGrade = (
    enrolledCourses.reduce((sum, course) => sum + course.percentage, 0) / enrolledCourses.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
        <p className="text-slate-600 mt-2">View your enrolled courses and course materials</p>
      </div>

      {/* Course Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Enrolled Courses</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{enrolledCourses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Credits</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalCredits}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Average Grade</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{avgGrade}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">Excellent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* All Courses */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-600">{course.code}</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {course.credits} credits
                        </span>
                      </div>
                      <CardTitle className="mt-2">{course.title}</CardTitle>
                      <CardDescription>Instructor: {course.lecturer}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-slate-900">{course.grade}</p>
                      <p className="text-sm text-slate-600">{course.percentage}%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-slate-50 rounded">
                      <p className="text-xs text-slate-600">Attendance</p>
                      <p className="text-lg font-semibold text-slate-900 mt-1">{course.attendance}</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded">
                      <p className="text-xs text-slate-600">Sessions</p>
                      <p className="text-lg font-semibold text-slate-900 mt-1">{course.sessions}</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded">
                      <p className="text-xs text-slate-600">Materials</p>
                      <p className="text-lg font-semibold text-slate-900 mt-1">{course.materials}</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded">
                      <p className="text-xs text-slate-600">Assignments</p>
                      <p className="text-lg font-semibold text-slate-900 mt-1">{course.assignments}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Materials
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Users className="w-4 h-4 mr-2" />
                      Classmates
                    </Button>
                    <Button className="flex-1">View Course</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Active Courses */}
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {enrolledCourses.slice(0, 3).map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-600">{course.code}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Active</span>
                      </div>
                      <CardTitle className="mt-2">{course.title}</CardTitle>
                      <CardDescription>Instructor: {course.lecturer}</CardDescription>
                    </div>
                    <Button>View Course</Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed Courses */}
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {enrolledCourses.slice(3).map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-green-600">{course.code}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span>
                      </div>
                      <CardTitle className="mt-2">{course.title}</CardTitle>
                      <CardDescription>Final Grade: {course.grade} ({course.percentage}%)</CardDescription>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
