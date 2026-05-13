import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export default function StudentAttendance() {
  // Mock attendance data
  const courseAttendance = [
    { course: "CS201", attended: 14, total: 15, percentage: 93.3 },
    { course: "CS202", attended: 13, total: 15, percentage: 86.7 },
    { course: "CS203", attended: 15, total: 15, percentage: 100 },
    { course: "CS204", attended: 12, total: 15, percentage: 80 },
    { course: "CS205", attended: 14, total: 15, percentage: 93.3 },
  ];

  const sessionAttendance = [
    { course: "CS201", date: "2026-05-12", status: "present", time: "09:00 AM" },
    { course: "CS201", date: "2026-05-10", status: "present", time: "09:00 AM" },
    { course: "CS202", date: "2026-05-09", status: "absent", time: "10:30 AM" },
    { course: "CS203", date: "2026-05-08", status: "present", time: "02:00 PM" },
    { course: "CS204", date: "2026-05-07", status: "late", time: "11:15 AM" },
    { course: "CS205", date: "2026-05-06", status: "present", time: "09:00 AM" },
    { course: "CS201", date: "2026-05-05", status: "present", time: "09:00 AM" },
    { course: "CS202", date: "2026-05-03", status: "present", time: "10:30 AM" },
  ];

  const overallAttendance = (
    (courseAttendance.reduce((sum, c) => sum + c.attended, 0) /
      courseAttendance.reduce((sum, c) => sum + c.total, 0)) *
    100
  ).toFixed(1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "absent":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "late":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Attendance Tracking</h1>
        <p className="text-slate-600 mt-2">Monitor your attendance across all courses</p>
      </div>

      {/* Overall Attendance */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Overall Attendance</p>
              <p className="text-4xl font-bold text-slate-900 mt-1">{overallAttendance}%</p>
              <p className="text-xs text-slate-600 mt-2">
                {courseAttendance.reduce((sum, c) => sum + c.attended, 0)} out of{" "}
                {courseAttendance.reduce((sum, c) => sum + c.total, 0)} sessions attended
              </p>
            </div>
            <div className="text-right">
              {parseFloat(overallAttendance) >= 85 ? (
                <div className="text-green-600">
                  <CheckCircle2 className="w-12 h-12 mx-auto" />
                  <p className="text-sm font-medium mt-2">Good Standing</p>
                </div>
              ) : (
                <div className="text-red-600">
                  <AlertCircle className="w-12 h-12 mx-auto" />
                  <p className="text-sm font-medium mt-2">Below Target</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">By Course</TabsTrigger>
          <TabsTrigger value="sessions">Session History</TabsTrigger>
        </TabsList>

        {/* By Course Tab */}
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Course</CardTitle>
              <CardDescription>Your attendance percentage in each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseAttendance.map((course, i) => (
                  <div key={i} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-slate-900">{course.course}</p>
                        <p className="text-sm text-slate-600">
                          {course.attended} out of {course.total} sessions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">{course.percentage.toFixed(1)}%</p>
                        <Badge
                          className={
                            course.percentage >= 85
                              ? "bg-green-100 text-green-800"
                              : course.percentage >= 75
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {course.percentage >= 85 ? "Good" : course.percentage >= 75 ? "Fair" : "Poor"}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          course.percentage >= 85
                            ? "bg-green-500"
                            : course.percentage >= 75
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${course.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session History Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your attendance record for recent class sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sessionAttendance.map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(session.status)}
                      <div>
                        <p className="font-medium text-slate-900">{session.course}</p>
                        <p className="text-sm text-slate-600">{session.date} at {session.time}</p>
                      </div>
                    </div>
                    {getStatusBadge(session.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Attendance Policy */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Attendance Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <p>• Minimum attendance requirement: 85% per course</p>
          <p>• Attendance below 75% may affect your grade</p>
          <p>• Attendance below 60% may result in course failure</p>
          <p>• Contact your lecturer for excused absences</p>
        </CardContent>
      </Card>
    </div>
  );
}
