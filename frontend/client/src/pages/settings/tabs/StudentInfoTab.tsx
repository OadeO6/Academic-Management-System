import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentProfileInfo } from "@/api/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AlertCircle, GraduationCap } from "lucide-react";

export default function StudentInfoTab() {
  const { data: studentInfo, isLoading, error } = useStudentProfileInfo();
  const [info, setInfo] = useState({
    studentId: "",
    registrationNumber: "",
    programme: "",
    year: "",
    gpa: "",
    enrollmentStatus: "active",
  });

  useEffect(() => {
    if (studentInfo) {
      setInfo({
        studentId: studentInfo.studentId || "",
        registrationNumber: studentInfo.registrationNumber || "",
        programme: studentInfo.programme || "",
        year: studentInfo.year || "",
        gpa: studentInfo.gpa || "",
        enrollmentStatus: studentInfo.enrollmentStatus || "active",
      });
    }
  }, [studentInfo]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-900">Error loading student info</p>
          <p className="text-sm text-red-800">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Academic Status */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Academic Status
        </h3>
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium text-slate-600">Enrollment Status</Label>
              <p className="text-lg font-semibold text-slate-900 mt-2 capitalize">
                {info.enrollmentStatus}
              </p>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600">Current GPA</Label>
              <p className="text-lg font-semibold text-slate-900 mt-2">
                {info.gpa || "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Student Information */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Student Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-sm font-medium">
              Student ID
            </Label>
            <Input
              id="studentId"
              value={info.studentId}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regNumber" className="text-sm font-medium">
              Registration Number
            </Label>
            <Input
              id="regNumber"
              value={info.registrationNumber}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Academic Program */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Academic Program</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="programme" className="text-sm font-medium">
              Programme
            </Label>
            <Input
              id="programme"
              value={info.programme}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-medium">
              Year of Study
            </Label>
            <Input
              id="year"
              value={info.year}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          For changes to your student information, please contact your department office or academic advisor.
        </p>
      </div>
    </div>
  );
}