import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Edit2, Eye } from "lucide-react";
import { useState } from "react";

export default function HodStudentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  // Mock student data
  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      matricNumber: "2024/001",
      level: 100,
      department: "Computer Science",
      gpa: 3.8,
      status: "active",
      enrolledCourses: 5,
    },
    {
      id: 2,
      name: "Bob Smith",
      matricNumber: "2024/002",
      level: 100,
      department: "Computer Science",
      gpa: 3.5,
      status: "active",
      enrolledCourses: 5,
    },
    {
      id: 3,
      name: "Charlie Davis",
      matricNumber: "2024/003",
      level: 200,
      department: "Computer Science",
      gpa: 3.2,
      status: "active",
      enrolledCourses: 6,
    },
    {
      id: 4,
      name: "Diana Wilson",
      matricNumber: "2024/004",
      level: 200,
      department: "Computer Science",
      gpa: 3.9,
      status: "active",
      enrolledCourses: 6,
    },
    {
      id: 5,
      name: "Eve Martinez",
      matricNumber: "2024/005",
      level: 300,
      department: "Computer Science",
      gpa: 3.1,
      status: "probation",
      enrolledCourses: 5,
    },
  ];

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "probation":
        return <Badge className="bg-yellow-100 text-yellow-800">Probation</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const selectedStudentData = students.find((s) => s.id === selectedStudent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Student Management</h1>
        <p className="text-slate-600 mt-2">View and manage student profiles and academic progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-0">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-slate-600">Total Students</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{students.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-0">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-slate-600">Active</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {students.filter((s) => s.status === "active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-0">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-slate-600">On Probation</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {students.filter((s) => s.status === "probation").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-0">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-slate-600">Avg GPA</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {(students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Search and manage student profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by name or matric number..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedStudent === student.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">{student.name}</p>
                          {getStatusBadge(student.status)}
                        </div>
                        <p className="text-sm text-slate-600">{student.matricNumber}</p>
                        <div className="flex gap-4 mt-2 text-xs text-slate-600">
                          <span>Level {student.level}</span>
                          <span>GPA: {student.gpa}</span>
                          <span>{student.enrolledCourses} courses</span>
                        </div>
                      </div>
                      <Eye className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Details */}
        <div>
          {selectedStudentData ? (
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Student Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Name</p>
                  <p className="font-semibold text-slate-900">{selectedStudentData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Matric Number</p>
                  <p className="font-semibold text-slate-900">{selectedStudentData.matricNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Current Level</p>
                  <p className="font-semibold text-slate-900">{selectedStudentData.level}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Department</p>
                  <p className="font-semibold text-slate-900">{selectedStudentData.department}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">GPA</p>
                  <p className="font-semibold text-slate-900">{selectedStudentData.gpa}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedStudentData.status)}</div>
                </div>
                <div className="pt-4 space-y-2">
                  <Button className="w-full gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Academic Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-slate-600">Select a student to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
