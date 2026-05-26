/**
 * Lecturer Gradebook Page
 * View and manage student grades
 */

import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Edit, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";
import { useGradebook, useUpdateGradebookEntry } from "@/api/hooks";
import { toast } from "sonner";
import type { GradebookEntry } from "@/api/types";

export default function LecturerGradebook() {
  const { user } = useAuth();
  const { courseId } = useParams<{ courseId: string }>();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<GradebookEntry | null>(null);
  const [editData, setEditData] = useState({
    lecturerNotes: "",
  });

  // Fetch gradebook
  const { data: gradebookData, isLoading, error, refetch } = useGradebook(Number(courseId));

  // Update gradebook entry mutation
  const { mutate: updateEntry, isPending: isUpdating } = useUpdateGradebookEntry({
    onSuccess: () => {
      toast.success("Gradebook entry updated successfully");
      setShowEditDialog(false);
      setSelectedStudent(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to update gradebook entry");
    },
  });

  const handleOpenEdit = (student: GradebookEntry) => {
    setSelectedStudent(student);
    setEditData({
      lecturerNotes: student.lecturerNotes || "",
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedStudent) return;

    updateEntry({
      courseOfferingId: Number(courseId),
      studentId: selectedStudent.studentId,
      lecturerNotes: editData.lecturerNotes,
    });
  };

  const getLetterGradeBadge = (grade: string) => {
    switch (grade) {
      case "A":
        return <Badge className="bg-green-600">A</Badge>;
      case "B":
        return <Badge className="bg-blue-600">B</Badge>;
      case "C":
        return <Badge className="bg-yellow-600">C</Badge>;
      case "D":
        return <Badge className="bg-orange-600">D</Badge>;
      case "F":
        return <Badge className="bg-red-600">F</Badge>;
      default:
        return <Badge>{grade}</Badge>;
    }
  };

  const entries = gradebookData?.gradebook || [];
  const averageScore = entries.length > 0
    ? (entries.reduce((sum, e) => sum + (e.totalScore / e.totalMaxScore * 100), 0) / entries.length).toFixed(2)
    : 0;

  return (
    <>
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Gradebook</h1>
          <p className="text-muted-foreground mt-2">View and manage student grades</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold mt-2">{entries.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Class Average</p>
              <p className="text-3xl font-bold mt-2">{averageScore}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Highest Score</p>
              <p className="text-3xl font-bold mt-2">
                {entries.length > 0
                  ? Math.max(...entries.map(e => (e.totalScore / e.totalMaxScore * 100))).toFixed(0)
                  : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gradebook Table */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load gradebook"
            description="An error occurred while loading the gradebook."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !entries || entries.length === 0 ? (
          <EmptyState
            title="No grades available"
            description="No student grades have been recorded yet."
            icon={BookOpen}
          />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-semibold">Student Name</th>
                      <th className="text-left py-2 px-2 font-semibold">Email</th>
                      <th className="text-center py-2 px-2 font-semibold">Score</th>
                      <th className="text-center py-2 px-2 font-semibold">Percentage</th>
                      <th className="text-center py-2 px-2 font-semibold">Grade</th>
                      <th className="text-center py-2 px-2 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.studentId} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2 font-medium">{entry.studentName}</td>
                        <td className="py-3 px-2 text-muted-foreground">{entry.studentEmail}</td>
                        <td className="py-3 px-2 text-center">
                          {entry.totalScore} / {entry.totalMaxScore}
                        </td>
                        <td className="py-3 px-2 text-center font-semibold">
                          {entry.overallPercentage.toFixed(2)}%
                        </td>
                        <td className="py-3 px-2 text-center">
                          {getLetterGradeBadge(entry.overallLetterGrade)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEdit(entry)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student Grade</DialogTitle>
            <DialogDescription>
              Update grades and notes for {selectedStudent?.studentName}
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Student</p>
                <p className="font-semibold">{selectedStudent.studentName}</p>
                <p className="text-sm text-muted-foreground mt-2">Email</p>
                <p className="text-sm">{selectedStudent.studentEmail}</p>
              </div>

              {/* Current Scores */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-semibold mb-2">Current Scores</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Score:</span>
                    <span className="font-semibold">{selectedStudent.totalScore} / {selectedStudent.totalMaxScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Percentage:</span>
                    <span className="font-semibold">{selectedStudent.overallPercentage.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grade:</span>
                    <span className="font-semibold">{selectedStudent.overallLetterGrade}</span>
                  </div>
                </div>
              </div>

              {/* Lecturer Notes */}
              <div>
                <label className="text-sm font-medium">Lecturer Notes</label>
                <Textarea
                  placeholder="Add notes about this student's performance..."
                  value={editData.lecturerNotes}
                  onChange={(e) => setEditData({ ...editData, lecturerNotes: e.target.value })}
                  rows={4}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSaveEdit}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    
    </>
  );
}
