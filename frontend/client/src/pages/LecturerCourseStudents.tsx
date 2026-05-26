/**
 * Lecturer Course Students Page
 * Manage and approve student registrations for a course
 */

import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Users, Search, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useCourseStudents, useApproveStudent } from "@/api/hooks";
import { toast } from "sonner";
import type { CourseStudentFilterParams, CourseStudent } from "@/api/types";

export default function LecturerCourseStudents() {
  const { user } = useAuth();
  const { courseId } = useParams<{ courseId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | undefined>();
  const [selectedStudent, setSelectedStudent] = useState<CourseStudent | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject" | null>(null);

  const filterParams: CourseStudentFilterParams = {
    query: searchQuery || undefined,
    status: statusFilter,
    page: 1,
    limit: 50,
  };

  // Fetch students
  const { data: studentsData, isLoading, error, refetch } = useCourseStudents(Number(courseId), filterParams);

  // Approve student mutation
  const { mutate: approveStudent, isPending: isApprovingStudent } = useApproveStudent({
    onSuccess: () => {
      toast.success("Student status updated successfully");
      setShowApprovalDialog(false);
      setSelectedStudent(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to update student status");
    },
  });

  const students = studentsData?.students || [];

  const handleApprovalAction = (student: CourseStudent, action: "approve" | "reject") => {
    setSelectedStudent(student);
    setApprovalAction(action);
    setShowApprovalDialog(true);
  };

  const handleConfirmApproval = () => {
    if (!selectedStudent || !approvalAction) return;

    approveStudent({
      courseOfferingId: Number(courseId),
      studentId: selectedStudent.userId,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-600">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <>
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Course Students</h1>
          <p className="text-muted-foreground mt-2">Manage student registrations and approvals</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                onClick={() => setStatusFilter(statusFilter === "pending" ? undefined : "pending")}
              >
                Pending ({students.filter(s => s.status === "pending").length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load students"
            description="An error occurred while loading course students."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !students || students.length === 0 ? (
          <EmptyState
            title="No students found"
            description="No students match your search criteria."
            icon={Users}
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
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{student.name}</h4>
                        {getStatusIcon(student.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Registered: {new Date(student.registrationDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(student.status)}
                      {student.status === "pending" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprovalAction(student, "approve")}
                            disabled={isApprovingStudent}
                          >
                            {isApprovingStudent ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApprovalAction(student, "reject")}
                            disabled={isApprovingStudent}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Approval Confirmation Dialog */}
      <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {approvalAction === "approve" ? "Approve Student" : "Reject Student"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {approvalAction === "approve"
                ? `Are you sure you want to approve ${selectedStudent?.name}?`
                : `Are you sure you want to reject ${selectedStudent?.name}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 text-sm">
            <p><strong>Student:</strong> {selectedStudent?.name}</p>
            <p><strong>Email:</strong> {selectedStudent?.email}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmApproval}
              className={approvalAction === "reject" ? "bg-destructive" : ""}
            >
              {approvalAction === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    
    </>
  );
}
