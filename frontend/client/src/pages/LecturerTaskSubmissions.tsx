/**
 * Lecturer Task Submissions Page
 * View and grade student submissions
 */

import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, CheckCircle, Clock, Loader2, Download } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";
import { useTaskSubmissions, useSubmissionDetail, useGradeSubmission } from "@/api/hooks";
import { toast } from "sonner";
import type { Submission } from "@/api/types";

export default function LecturerTaskSubmissions() {
  const { user } = useAuth();
  const { courseId, taskId } = useParams<{ courseId: string; taskId: string }>();
  const [showGradingDialog, setShowGradingDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradingData, setGradingData] = useState({
    score: 0,
    feedback: "",
  });

  // Fetch submissions
  const { data: submissions, isLoading, error, refetch } = useTaskSubmissions(Number(courseId), Number(taskId));

  // Fetch submission detail
  const { data: submissionDetail, isLoading: isLoadingDetail } = useSubmissionDetail(
    Number(courseId),
    Number(taskId),
    selectedSubmission?.id || 0
  );

  // Grade submission mutation
  const { mutate: gradeSubmission, isPending: isGrading } = useGradeSubmission({
    onSuccess: () => {
      toast.success("Submission graded successfully");
      setShowGradingDialog(false);
      setSelectedSubmission(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to grade submission");
    },
  });

  const handleOpenGrading = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradingData({
      score: Number(submission.score) || 0,
      feedback: submission.feedback || "",
    });
    setShowGradingDialog(true);
  };

  const handleSubmitGrade = () => {
    if (!selectedSubmission) return;

    gradeSubmission({
      courseOfferingId: Number(courseId),
      taskId: Number(taskId),
      submissionId: selectedSubmission.id,
      score: gradingData.score,
      feedback: gradingData.feedback,
      gradedBy: user?.id || 0,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return <Badge className="bg-green-600">Graded</Badge>;
      case "submitted":
        return <Badge className="bg-blue-600">Submitted</Badge>;
      case "pending_grade":
        return <Badge className="bg-yellow-600">Pending Grade</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending_grade":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const submissionsList = submissions || [];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Task Submissions</h1>
          <p className="text-muted-foreground mt-2">Review and grade student submissions</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Submissions</p>
              <p className="text-3xl font-bold mt-2">{submissionsList.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Graded</p>
              <p className="text-3xl font-bold mt-2 text-green-600">
                {submissionsList.filter(s => s.status === "graded").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pending Grade</p>
              <p className="text-3xl font-bold mt-2 text-yellow-600">
                {submissionsList.filter(s => s.status === "pending_grade").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load submissions"
            description="An error occurred while loading task submissions."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !submissionsList || submissionsList.length === 0 ? (
          <EmptyState
            title="No submissions yet"
            description="Students haven't submitted this task yet."
            icon={FileText}
          />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {submissionsList.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{submission.studentName}</h4>
                        {getStatusIcon(submission.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                      </p>
                      {submission.score !== null && (
                        <p className="text-sm font-semibold mt-1">
                          Score: {submission.score}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(submission.status)}
                      {submission.fileUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(submission.fileUrl, "_blank")}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleOpenGrading(submission)}
                      >
                        {submission.status === "graded" ? "Re-grade" : "Grade"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Grading Dialog */}
      <Dialog open={showGradingDialog} onOpenChange={setShowGradingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              Review and grade {selectedSubmission?.studentName}'s submission
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : submissionDetail ? (
            <div className="space-y-6">
              {/* Submission Details */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Student</p>
                <p className="font-semibold">{submissionDetail.studentName}</p>
                <p className="text-sm text-muted-foreground mt-2">Submitted</p>
                <p className="text-sm">{new Date(submissionDetail.submissionDate).toLocaleString()}</p>
              </div>

              {/* Answers Preview */}
              {submissionDetail.answers && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-semibold mb-2">Answers</p>
                  <div className="text-sm space-y-2">
                    {typeof submissionDetail.answers === "object" ? (
                      Object.entries(submissionDetail.answers).map(([key, value]) => (
                        <div key={key} className="p-2 bg-background rounded">
                          <p className="text-xs text-muted-foreground">{key}</p>
                          <p className="text-sm">{String(value)}</p>
                        </div>
                      ))
                    ) : (
                      <p>{String(submissionDetail.answers)}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Grading Form */}
              <div className="space-y-4 border-t pt-4">
                <div>
                  <label className="text-sm font-medium">Score (out of {submissionDetail.maxPoints}) *</label>
                  <Input
                    type="number"
                    min="0"
                    max={submissionDetail.maxPoints}
                    value={gradingData.score}
                    onChange={(e) => setGradingData({ ...gradingData, score: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Feedback</label>
                  <Textarea
                    placeholder="Provide feedback to the student..."
                    value={gradingData.feedback}
                    onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
                    rows={4}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSubmitGrade}
                  disabled={isGrading}
                >
                  {isGrading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Submit Grade
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Submission not found"
              description="Unable to load submission details"
              icon={FileText}
            />
          )}
        </DialogContent>
            </Dialog>
    </>
  );
}
