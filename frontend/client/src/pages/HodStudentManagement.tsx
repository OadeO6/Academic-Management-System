/**
 * HOD Student Management Page
 * Manage student records, view details, and update level offsets
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Search, ChevronRight, Loader2, Edit2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useHODStudents, useHODStudentDetail, useUpdateLevelOffset } from "@/api/hooks";
import { toast } from "sonner";
import type { StudentFilterParams } from "@/api/types";

export default function HodStudentManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showLevelOffsetDialog, setShowLevelOffsetDialog] = useState(false);
  const [newLevelOffset, setNewLevelOffset] = useState<number>(0);


  const filterParams: StudentFilterParams = {
    query: searchQuery || undefined,
    page,
    limit: 10,
  };

  const { data: students, isLoading, error, refetch } = useHODStudents(filterParams);
  const { data: studentDetail, isLoading: isLoadingDetail } = useHODStudentDetail(selectedStudentId || 0);

  const updateLevelOffsetMutation = useUpdateLevelOffset({
    onSuccess: () => {
      toast.success("Level offset updated successfully!");
      setShowLevelOffsetDialog(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to update level offset: ${error.message}`);
    },
  });

  const handleViewDetails = (studentId: number) => {
    setSelectedStudentId(studentId);
    setShowDetailDialog(true);
  };

  const handleOpenLevelOffsetDialog = (student: any) => {
    setNewLevelOffset(student.levelOffset || 0);
    setShowLevelOffsetDialog(true);
  };

  const handleUpdateLevelOffset = () => {
    if (!selectedStudentId) return;
    updateLevelOffsetMutation.mutate({
      studentId: selectedStudentId,
      levelOffset: newLevelOffset,
    });
  };

  const studentsList = Array.isArray(students) ? students : [];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground mt-2">Manage student records and level offsets</p>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, matric number, or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load students"
            description="An error occurred while loading student records."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !studentsList || studentsList.length === 0 ? (
          <EmptyState
            title="No students found"
            description="No student records match your search criteria."
            icon={Users}
          />
        ) : (
          <div className="space-y-3">
            {studentsList.map((student: any) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{student.fullName}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                        <div>
                          <p className="text-xs">Matric Number</p>
                          <p className="font-medium">{student.matricNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs">Email</p>
                          <p className="font-medium">{student.email}</p>
                        </div>
                        <div>
                          <p className="text-xs">Department</p>
                          <p className="font-medium">{student.department}</p>
                        </div>
                        <div>
                          <p className="text-xs">Level Offset</p>
                          <p className="font-medium">{student.levelOffset}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(student.id)}
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedStudentId(student.id);
                          handleOpenLevelOffsetDialog(student);
                        }}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Update Level
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {studentsList.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing page {page}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Student Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              View complete student information and registered courses
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : studentDetail ? (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-semibold">{studentDetail.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Matric Number</p>
                    <p className="font-semibold">{studentDetail.matricNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{studentDetail.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-semibold">{studentDetail.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Admission Session</p>
                    <p className="font-semibold">{studentDetail.admissionSession}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level Offset</p>
                    <p className="font-semibold">{studentDetail.levelOffset}</p>
                  </div>
                </div>
              </div>

              {/* Registered Offerings */}
              <div>
                <h3 className="font-semibold mb-3">Registered Courses</h3>
                {studentDetail.registeredOfferings && studentDetail.registeredOfferings.length > 0 ? (
                  <div className="space-y-2">
                    {studentDetail.registeredOfferings.map((offering: any) => (
                      <div key={offering.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{offering.courseTitle}</p>
                        <div className="grid grid-cols-3 gap-2 mt-1 text-sm text-muted-foreground">
                          <p>Code: {offering.code}</p>
                          <p>Semester: {offering.semester}</p>
                          <p>Session: {offering.academicSession}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No registered courses</p>
                )}
              </div>
            </div>
          ) : (
            <EmptyState
              title="Student not found"
              description="Unable to load student details"
              icon={Users}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Level Offset Update Dialog */}
      <Dialog open={showLevelOffsetDialog} onOpenChange={setShowLevelOffsetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Level Offset</DialogTitle>
            <DialogDescription>
              Adjust the academic level offset for this student
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Level Offset</label>
              <Input
                type="number"
                min="0"
                value={newLevelOffset}
                onChange={(e) => setNewLevelOffset(Number(e.target.value))}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowLevelOffsetDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateLevelOffset}
                disabled={updateLevelOffsetMutation.isPending}
              >
                {updateLevelOffsetMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
