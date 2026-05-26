/**
 * Lecturer Session Attendance Page
 * Mark and manage student attendance for a session
 */

import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Check, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";
import { useSessionAttendance, useMarkAttendanceBulk } from "@/api/hooks";
import { toast } from "sonner";

export default function LecturerSessionAttendance() {
  const { user } = useAuth();
  const { courseId, sessionId } = useParams<{ courseId: string; sessionId: string }>();
  const [attendance, setAttendance] = useState<Record<number, "present" | "absent" | "excused">>({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch session attendance
  const { data: sessionData, isLoading, error, refetch } = useSessionAttendance(Number(courseId), Number(sessionId));

  // Mark attendance mutation
  const { mutate: markAttendance, isPending: isMarking } = useMarkAttendanceBulk({
    onSuccess: () => {
      toast.success("Attendance marked successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to mark attendance");
    },
  });

  const handleToggleAttendance = (studentId: number, status: "present" | "absent" | "excused") => {
    setAttendance({
      ...attendance,
      [studentId]: attendance[studentId] === status ? "absent" : status,
    });
  };

  const handleSaveAttendance = () => {
    const attendanceList = sessionData?.students.map((student) => ({
      studentId: student.studentId,
      status: attendance[student.studentId] || "absent",
    })) || [];

    markAttendance({
      courseOfferingId: Number(courseId),
      sessionId: Number(sessionId),
      attendance: attendanceList,
    });
  };

  const handleMarkAll = (status: "present" | "absent") => {
    const newAttendance: Record<number, "present" | "absent" | "excused"> = {};
    sessionData?.students.forEach((student) => {
      newAttendance[student.studentId] = status;
    });
    setAttendance(newAttendance);
  };

  const students = sessionData?.students || [];
  const presentCount = Object.values(attendance).filter(s => s === "present").length;
  const absentCount = Object.values(attendance).filter(s => s === "absent").length;
  const excusedCount = Object.values(attendance).filter(s => s === "excused").length;

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Mark Attendance</h1>
          <p className="text-muted-foreground mt-2">
            Session: {sessionData && new Date(sessionData.sessionDate).toLocaleDateString()}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold mt-2">{students.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="text-3xl font-bold mt-2 text-green-600">{presentCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="text-3xl font-bold mt-2 text-red-600">{absentCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Excused</p>
              <p className="text-3xl font-bold mt-2 text-yellow-600">{excusedCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleMarkAll("present")}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark All Present
              </Button>
              <Button
                variant="outline"
                onClick={() => handleMarkAll("absent")}
              >
                <X className="w-4 h-4 mr-2" />
                Mark All Absent
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attendance List */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load attendance"
            description="An error occurred while loading session attendance."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !students || students.length === 0 ? (
          <EmptyState
            title="No students in this session"
            description="No students are enrolled in this course."
            icon={Loader2}
          />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{student.studentName}</h4>
                      <p className="text-sm text-muted-foreground">ID: {student.studentId}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={attendance[student.studentId] === "present" ? "default" : "outline"}
                        onClick={() => handleToggleAttendance(student.studentId, "present")}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[student.studentId] === "absent" ? "destructive" : "outline"}
                        onClick={() => handleToggleAttendance(student.studentId, "absent")}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Absent
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[student.studentId] === "excused" ? "secondary" : "outline"}
                        onClick={() => handleToggleAttendance(student.studentId, "excused")}
                      >
                        Excused
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        {students.length > 0 && (
          <Button
            className="w-full"
            size="lg"
            onClick={handleSaveAttendance}
            disabled={isMarking}
          >
            {isMarking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
            Save Attendance
          </Button>
        )}
      </div>
    
  );
}
