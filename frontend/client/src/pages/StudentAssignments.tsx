import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function StudentAssignments() {
  // Mock assignment data
  const assignments = [
    {
      id: 1,
      title: "Programming Project 1",
      course: "CS201",
      description: "Build a simple calculator application",
      dueDate: "2026-05-20",
      status: "pending",
      submittedDate: null,
      grade: null,
      totalPoints: 100,
    },
    {
      id: 2,
      title: "Database Design",
      course: "CS202",
      description: "Design a database schema for an e-commerce system",
      dueDate: "2026-05-18",
      status: "submitted",
      submittedDate: "2026-05-17",
      grade: null,
      totalPoints: 100,
    },
    {
      id: 3,
      title: "Web Development",
      course: "CS203",
      description: "Create a responsive website using React",
      dueDate: "2026-05-15",
      status: "graded",
      submittedDate: "2026-05-14",
      grade: 88,
      totalPoints: 100,
    },
    {
      id: 4,
      title: "Algorithm Analysis",
      course: "CS204",
      description: "Analyze and implement sorting algorithms",
      dueDate: "2026-05-10",
      status: "graded",
      submittedDate: "2026-05-09",
      grade: 82,
      totalPoints: 100,
    },
    {
      id: 5,
      title: "System Design",
      course: "CS205",
      description: "Design a scalable microservices architecture",
      dueDate: "2026-05-22",
      status: "pending",
      submittedDate: null,
      grade: null,
      totalPoints: 100,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case "submitted":
        return <Badge className="bg-purple-100 text-purple-800">Submitted</Badge>;
      case "graded":
        return <Badge className="bg-green-100 text-green-800">Graded</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "submitted":
        return <FileText className="w-5 h-5 text-purple-600" />;
      case "graded":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();
  const daysUntilDue = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const submittedAssignments = assignments.filter((a) => a.status === "submitted");
  const gradedAssignments = assignments.filter((a) => a.status === "graded");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
        <p className="text-slate-600 mt-2">View and manage your course assignments</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{pendingAssignments.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Submitted</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{submittedAssignments.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Graded</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{gradedAssignments.length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
        </TabsList>

        {/* All Assignments */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>{assignment.course}</CardDescription>
                    </div>
                    {getStatusBadge(assignment.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{assignment.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-600">Due Date</p>
                      <p className="text-sm font-medium text-slate-900">{assignment.dueDate}</p>
                      {!isOverdue(assignment.dueDate) && assignment.status === "pending" && (
                        <p className="text-xs text-blue-600">
                          {daysUntilDue(assignment.dueDate)} days remaining
                        </p>
                      )}
                    </div>
                    {assignment.status === "graded" && (
                      <div className="text-right">
                        <p className="text-xs text-slate-600">Your Grade</p>
                        <p className="text-2xl font-bold text-slate-900">{assignment.grade}</p>
                        <p className="text-xs text-slate-600">/ {assignment.totalPoints}</p>
                      </div>
                    )}
                    {assignment.status === "pending" && (
                      <Button className="gap-2">
                        <Upload className="w-4 h-4" />
                        Submit
                      </Button>
                    )}
                    {assignment.status === "submitted" && (
                      <Button variant="outline">View Submission</Button>
                    )}
                    {assignment.status === "graded" && (
                      <Button variant="outline">View Feedback</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pending */}
        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.length > 0 ? (
            <div className="grid gap-4">
              {pendingAssignments.map((assignment) => (
                <Card key={assignment.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription>{assignment.course}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{assignment.dueDate}</p>
                        <p className="text-xs text-blue-600">
                          {daysUntilDue(assignment.dueDate)} days left
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">{assignment.description}</p>
                      <Button className="gap-2">
                        <Upload className="w-4 h-4" />
                        Submit Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-slate-600">No pending assignments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Submitted */}
        <TabsContent value="submitted" className="space-y-4">
          {submittedAssignments.length > 0 ? (
            <div className="grid gap-4">
              {submittedAssignments.map((assignment) => (
                <Card key={assignment.id} className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription>{assignment.course}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">Submitted</p>
                        <p className="text-xs text-slate-600">{assignment.submittedDate}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">Awaiting grading...</p>
                      <Button variant="outline">View Submission</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-slate-600">No submitted assignments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Graded */}
        <TabsContent value="graded" className="space-y-4">
          {gradedAssignments.length > 0 ? (
            <div className="grid gap-4">
              {gradedAssignments.map((assignment) => (
                <Card key={assignment.id} className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription>{assignment.course}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">{assignment.grade}%</p>
                        <p className="text-xs text-slate-600">Graded</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">Graded on {assignment.submittedDate}</p>
                      <Button variant="outline">View Feedback</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-slate-600">No graded assignments yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
