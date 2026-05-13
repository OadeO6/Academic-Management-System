import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function LecturerGrading() {
  // Mock submission data
  const submissions = [
    {
      id: 1,
      student: "John Doe",
      assignment: "Programming Project 1",
      course: "CS201",
      submittedDate: "2026-05-10",
      status: "submitted",
      score: null,
    },
    {
      id: 2,
      student: "Jane Smith",
      assignment: "Database Design",
      course: "CS202",
      submittedDate: "2026-05-09",
      status: "graded",
      score: 85,
    },
    {
      id: 3,
      student: "Bob Johnson",
      assignment: "Web Development",
      course: "CS203",
      submittedDate: "2026-05-08",
      status: "submitted",
      score: null,
    },
    {
      id: 4,
      student: "Alice Williams",
      assignment: "Algorithm Analysis",
      course: "CS204",
      submittedDate: "2026-05-07",
      status: "graded",
      score: 92,
    },
    {
      id: 5,
      student: "Charlie Brown",
      assignment: "System Design",
      course: "CS205",
      submittedDate: "2026-05-06",
      status: "submitted",
      score: null,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "graded":
        return <Badge className="bg-green-100 text-green-800">Graded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "graded":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const pendingCount = submissions.filter((s) => s.status === "submitted").length;
  const gradedCount = submissions.filter((s) => s.status === "graded").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Grading & Submissions</h1>
        <p className="text-slate-600 mt-2">Review and grade student submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-yellow-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Review</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Graded</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{gradedCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Submissions</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{submissions.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({gradedCount})</TabsTrigger>
          <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
        </TabsList>

        {/* Pending Submissions */}
        <TabsContent value="pending" className="space-y-3">
          {submissions
            .filter((s) => s.status === "submitted")
            .map((submission) => (
              <Card key={submission.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{submission.student}</h3>
                        <Badge className="bg-slate-100 text-slate-800">{submission.course}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{submission.assignment}</p>
                      <p className="text-xs text-slate-500">Submitted: {submission.submittedDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(submission.status)}
                      <Button className="gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Grade Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        {/* Graded Submissions */}
        <TabsContent value="graded" className="space-y-3">
          {submissions
            .filter((s) => s.status === "graded")
            .map((submission) => (
              <Card key={submission.id} className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{submission.student}</h3>
                        <Badge className="bg-green-100 text-green-800">Graded</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{submission.assignment}</p>
                      <p className="text-xs text-slate-500">Submitted: {submission.submittedDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">{submission.score}%</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View/Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        {/* All Submissions */}
        <TabsContent value="all" className="space-y-3">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">{submission.student}</h3>
                      {getStatusBadge(submission.status)}
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{submission.assignment}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{submission.course}</span>
                      <span>Submitted: {submission.submittedDate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {submission.score ? (
                      <p className="text-2xl font-bold text-slate-900">{submission.score}%</p>
                    ) : (
                      <p className="text-sm text-slate-600">Not graded</p>
                    )}
                    <Button variant="outline" size="sm" className="mt-2">
                      {submission.status === "submitted" ? "Grade" : "View"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* AI Grading Suggestion */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">AI Grading Assistant</CardTitle>
          <CardDescription>Use AI to help grade submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700 mb-4">
            Upload a marking guide or rubric to enable AI-assisted grading. The AI will analyze student submissions and provide grade suggestions for your review.
          </p>
          <Button variant="outline" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            Upload Marking Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
