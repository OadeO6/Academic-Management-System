/**
 * Student Assignments Page
 * Displays assignments for enrolled courses with submission functionality
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileText, Calendar, AlertCircle, CheckCircle2, Clock, Loader2, Upload } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useStudentCourseAssignments, useSubmitAssignment } from "@/api/hooks";
import { toast } from "sonner";

export default function StudentAssignments() {
  const { user } = useAuth();
  const [, params] = useLocation();

  const courseOfferingId = parseInt((params as any)?.courseOfferingId || "0");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submissionType, setSubmissionType] = useState<"mcq" | "free_text" | "document_upload">("free_text");
  const [answer, setAnswer] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  // Fetch assignments
  const { data: assignments, isLoading, error, refetch } = useStudentCourseAssignments(courseOfferingId);

  // Fetch assignment details (using existing data)
  const assignmentDetails = assignments?.find(a => a.id === selectedAssignmentId);
  const isLoadingDetails = false;

  // Submit assignment mutation
  const submitMutation = useSubmitAssignment({
    onSuccess: () => {
      toast.success("Assignment submitted successfully!");
      setShowSubmitDialog(false);
      setAnswer("");
      setSelectedFile(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to submit: ${error.message}`);
    },
  });

  const handleViewDetails = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId);
    setShowDetailDialog(true);
  };

  const handleOpenSubmit = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId);
    setShowSubmitDialog(true);
  };

  const handleSubmitAssignment = () => {
    if (submissionType === "free_text" && !answer.trim()) {
      toast.error("Please enter your answer");
      return;
    }

    if (submissionType === "document_upload" && !selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (selectedFile) {
      submitMutation.mutate({
        assignmentId: selectedAssignmentId || 0,
        file: selectedFile,
      });
    } else {
      toast.error("Please select a file to upload");
    }
  };

  const isOverdue = (dueDate: Date) => new Date(dueDate) < new Date();
  const isDueSoon = (dueDate: Date) => {
    const now = new Date();
    const due = new Date(dueDate);
    const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDue <= 24 && hoursUntilDue > 0;
  };

  const getStatusIcon = (submission: any) => {
    if (!submission) return <Clock className="w-5 h-5 text-yellow-600" />;
    if (submission.status === "graded") return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (submission.status === "submitted") return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
    return <Clock className="w-5 h-5 text-yellow-600" />;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Assignments</h1>
          <p className="text-muted-foreground mt-2">View and submit your course assignments</p>
        </div>

        {/* Assignments List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load assignments"
            description="An error occurred while loading your assignments."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !assignments || assignments.length === 0 ? (
          <EmptyState
            title="No assignments"
            description="You have no assignments for this course yet."
            icon={FileText}
          />
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const overdue = isOverdue(assignment.dueDate);
              const dueSoon = isDueSoon(assignment.dueDate);

              return (
                <Card key={assignment.id} className={`hover:shadow-md transition-shadow ${overdue ? "border-red-200 bg-red-50" : ""}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(assignment)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg">{assignment.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {assignment.description || "No description"}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-3">
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className={dueSoon || overdue ? "font-semibold text-red-600" : ""}>
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-muted-foreground">Max Score:</span>
                                <span className="font-semibold">{assignment.totalPoints}</span>
                              </div>
                            </div>

                            {overdue && (
                              <div className="flex items-center gap-2 mt-3 p-2 bg-red-100 rounded text-sm text-red-800">
                                <AlertCircle className="w-4 h-4" />
                                <span>This assignment is overdue</span>
                              </div>
                            )}

                            {dueSoon && !overdue && (
                              <div className="flex items-center gap-2 mt-3 p-2 bg-yellow-100 rounded text-sm text-yellow-800">
                                <AlertCircle className="w-4 h-4" />
                                <span>Due soon!</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(assignment.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleOpenSubmit(assignment.id)}
                          disabled={overdue}
                        >
                          {overdue ? "Overdue" : "Submit"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Assignment Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
            <DialogDescription>
              Review assignment requirements and submission details
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : assignmentDetails ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">{assignmentDetails.title}</h3>
                <p className="text-muted-foreground mt-2">{assignmentDetails.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-semibold">{new Date(assignmentDetails.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Score</p>
                  <p className="font-semibold">{assignmentDetails.totalPoints}</p>
                </div>
              </div>

              {assignmentDetails.submission && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Submission Status: </span>
                    <span className="font-semibold capitalize">{assignmentDetails.submission.status}</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="Assignment not found"
              description="Unable to load assignment details"
              icon={FileText}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Submit Assignment Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              Choose your submission type and provide your answer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Submission Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">Submission Type</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    name="submissionType"
                    value="mcq"
                    checked={submissionType === "mcq"}
                    onChange={(e) => setSubmissionType(e.target.value as any)}
                  />
                  <span>Multiple Choice</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    name="submissionType"
                    value="free_text"
                    checked={submissionType === "free_text"}
                    onChange={(e) => setSubmissionType(e.target.value as any)}
                  />
                  <span>Free Text</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    name="submissionType"
                    value="document_upload"
                    checked={submissionType === "document_upload"}
                    onChange={(e) => setSubmissionType(e.target.value as any)}
                  />
                  <span>Document Upload</span>
                </label>
              </div>
            </div>

            {/* Free Text Input */}
            {submissionType === "free_text" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Your Answer</label>
                <Textarea
                  placeholder="Enter your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                />
              </div>
            )}

            {/* File Upload */}
            {submissionType === "document_upload" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Upload Document</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-semibold">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedFile ? selectedFile.name : "PDF, DOC, DOCX up to 10MB"}
                    </p>
                  </label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              className="w-full"
              onClick={handleSubmitAssignment}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Assignment"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
