import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function StudentGrades() {
  // Mock data for grades
  const courseGrades = [
    { course: "CS201", grade: "A", percentage: 92, credits: 3 },
    { course: "CS202", grade: "B+", percentage: 85, credits: 3 },
    { course: "CS203", grade: "A-", percentage: 88, credits: 4 },
    { course: "CS204", grade: "B", percentage: 82, credits: 3 },
    { course: "CS205", grade: "A", percentage: 90, credits: 3 },
  ];

  const assignmentGrades = [
    { assignment: "Programming Project 1", course: "CS201", score: 92, total: 100, date: "2026-04-15" },
    { assignment: "Database Design", course: "CS202", score: 85, total: 100, date: "2026-04-10" },
    { assignment: "Web Development", course: "CS203", score: 88, total: 100, date: "2026-04-08" },
    { assignment: "Algorithm Analysis", course: "CS204", score: 82, total: 100, date: "2026-04-05" },
    { assignment: "System Design", course: "CS205", score: 90, total: 100, date: "2026-04-01" },
  ];

  const gradeDistribution = [
    { name: "A (90-100)", value: 40, color: "#10b981" },
    { name: "B (80-89)", value: 35, color: "#3b82f6" },
    { name: "C (70-79)", value: 20, color: "#f59e0b" },
    { name: "D (60-69)", value: 4, color: "#ef4444" },
    { name: "F (<60)", value: 1, color: "#8b5cf6" },
  ];

  const gpaData = [
    { semester: "Sem 1", gpa: 3.45 },
    { semester: "Sem 2", gpa: 3.62 },
    { semester: "Sem 3", gpa: 3.58 },
    { semester: "Sem 4", gpa: 3.71 },
    { semester: "Sem 5", gpa: 3.68 },
    { semester: "Sem 6", gpa: 3.75 },
  ];

  const calculateGPA = () => {
    const totalPoints = courseGrades.reduce((sum, course) => {
      const gradePoints = { A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, C: 2.0 };
      return sum + (gradePoints[course.grade as keyof typeof gradePoints] || 0) * course.credits;
    }, 0);
    const totalCredits = courseGrades.reduce((sum, course) => sum + course.credits, 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Grades</h1>
        <p className="text-slate-600 mt-2">View your course and assignment grades</p>
      </div>

      {/* GPA Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Current GPA</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{calculateGPA()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600">Out of 4.0</p>
                <p className="text-lg font-semibold text-green-600 mt-1">Excellent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Courses Completed</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{courseGrades.length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600">This Semester</p>
                <p className="text-lg font-semibold text-blue-600 mt-1">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg. Score</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">87.4%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600">All Courses</p>
                <p className="text-lg font-semibold text-purple-600 mt-1">Strong</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Course Grades</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Course Grades Tab */}
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Grades This Semester</CardTitle>
              <CardDescription>Your grade in each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courseGrades.map((course, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{course.course}</p>
                      <p className="text-sm text-slate-600">{course.credits} credit units</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              course.percentage >= 90
                                ? "bg-green-500"
                                : course.percentage >= 80
                                  ? "bg-blue-500"
                                  : course.percentage >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${course.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right min-w-fit">
                        <p className="text-lg font-bold text-slate-900">{course.grade}</p>
                        <p className="text-xs text-slate-600">{course.percentage}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Grades</CardTitle>
              <CardDescription>Your scores on individual assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignmentGrades.map((assignment, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{assignment.assignment}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-slate-600">{assignment.course}</p>
                        <p className="text-xs text-slate-500">Submitted: {assignment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        {assignment.score}/{assignment.total}
                      </p>
                      <p className="text-xs text-slate-600">{Math.round((assignment.score / assignment.total) * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* GPA Trend */}
            <Card>
              <CardHeader>
                <CardTitle>GPA Trend</CardTitle>
                <CardDescription>Your GPA over semesters</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gpaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" />
                    <YAxis domain={[3, 4]} />
                    <Tooltip />
                    <Bar dataKey="gpa" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Your grades across all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
