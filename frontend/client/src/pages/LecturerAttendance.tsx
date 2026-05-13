import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, TrendingUp } from "lucide-react";

export default function LecturerAttendance() {
  // Mock session data
  const sessions = [
    {
      id: 1,
      course: "CS201",
      date: "2026-05-12",
      time: "09:00 AM",
      present: 42,
      absent: 2,
      late: 1,
      total: 45,
    },
    {
      id: 2,
      course: "CS201",
      date: "2026-05-10",
      time: "09:00 AM",
      present: 44,
      absent: 1,
      late: 0,
      total: 45,
    },
    {
      id: 3,
      course: "CS202",
      date: "2026-05-09",
      time: "10:30 AM",
      present: 36,
      absent: 2,
      late: 0,
      total: 38,
    },
    {
      id: 4,
      course: "CS203",
      date: "2026-05-08",
      time: "02:00 PM",
      present: 50,
      absent: 1,
      late: 1,
      total: 52,
    },
  ];

  const getAttendancePercentage = (present: number, total: number) => {
    return ((present / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendance Management</h1>
          <p className="text-slate-600 mt-2">Mark and track student attendance</p>
        </div>
        <Button className="gap-2">
          <Calendar className="w-4 h-4" />
          Mark Attendance
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Attendance</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">89.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Sessions Held</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{sessions.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Students</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">180</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
          <TabsTrigger value="courses">By Course</TabsTrigger>
          <TabsTrigger value="students">Student Report</TabsTrigger>
        </TabsList>

        {/* Recent Sessions */}
        <TabsContent value="recent" className="space-y-3">
          {sessions.map((session) => {
            const attendancePercent = getAttendancePercentage(session.present, session.total);
            return (
              <Card key={session.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{session.course}</h3>
                        <Badge className="bg-slate-100 text-slate-800">
                          {session.date} at {session.time}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">{attendancePercent}%</p>
                      <p className="text-xs text-slate-600">
                        {session.present}/{session.total} present
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-2 bg-green-50 rounded text-center">
                      <p className="text-xs text-slate-600">Present</p>
                      <p className="text-lg font-bold text-green-600">{session.present}</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded text-center">
                      <p className="text-xs text-slate-600">Absent</p>
                      <p className="text-lg font-bold text-red-600">{session.absent}</p>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded text-center">
                      <p className="text-xs text-slate-600">Late</p>
                      <p className="text-lg font-bold text-yellow-600">{session.late}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button className="flex-1">Edit Attendance</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* By Course */}
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Course</CardTitle>
              <CardDescription>Overall attendance statistics for each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["CS201", "CS202", "CS203"].map((course, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900">{course}</p>
                      <p className="text-sm font-semibold text-slate-900">89.2%</p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "89.2%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Report */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance Report</CardTitle>
              <CardDescription>Individual student attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Student {i}</p>
                      <p className="text-xs text-slate-600">CS201</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">14/15 (93.3%)</p>
                      <Badge className="bg-green-100 text-green-800 text-xs mt-1">Good</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export */}
      <Card className="bg-slate-50 border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Export Attendance Records</p>
              <p className="text-sm text-slate-600 mt-1">Download attendance data as CSV or PDF</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Export CSV</Button>
              <Button>Export PDF</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
