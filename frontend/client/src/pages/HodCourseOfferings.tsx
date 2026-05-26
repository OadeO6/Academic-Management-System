/**
 * HOD Course Offerings Page
 * Manage course offerings and assign lecturers
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BookOpen, Plus, Loader2, Users, Trash2, Check } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useHODCourseOfferings, useHODCourseOfferingDetail, useCreateCourseOffering, useActivateCourseOffering, useAssignLecturer, useUnassignLecturer, useHODLecturers } from "@/api/hooks";
import { toast } from "sonner";

export default function HodCourseOfferings() {
  const { user } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<number>(1); // Default to first course
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [selectedOfferingId, setSelectedOfferingId] = useState<number | null>(null);
  const [selectedLecturerId, setSelectedLecturerId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    semesterId: 1,
    academicSessionId: 1,
    maxCapacity: 50,
  });


  const { data: offerings, isLoading, error, refetch } = useHODCourseOfferings(selectedCourseId);
  const { data: offeringDetail, isLoading: isLoadingDetail } = useHODCourseOfferingDetail(selectedCourseId, selectedOfferingId || 0);
  const { data: lecturers } = useHODLecturers({ page: 1, limit: 100 });

  const createMutation = useCreateCourseOffering({
    onSuccess: () => {
      toast.success("Offering created successfully!");
      setShowCreateDialog(false);
      setFormData({ semesterId: 1, academicSessionId: 1, maxCapacity: 50 });
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to create offering: ${error.message}`);
    },
  });

  const activateMutation = useActivateCourseOffering({
    onSuccess: () => {
      toast.success("Offering activated successfully!");
      setShowActivateConfirm(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to activate offering: ${error.message}`);
    },
  });

  const assignMutation = useAssignLecturer({
    onSuccess: () => {
      toast.success("Lecturer assigned successfully!");
      setShowAssignDialog(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to assign lecturer: ${error.message}`);
    },
  });

  const unassignMutation = useUnassignLecturer({
    onSuccess: () => {
      toast.success("Lecturer unassigned successfully!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to unassign lecturer: ${error.message}`);
    },
  });

  const handleCreateOffering = () => {
    createMutation.mutate({
      courseDefinitionId: selectedCourseId,
      ...formData,
    });
  };

  const handleAssignLecturer = () => {
    if (!selectedOfferingId || !selectedLecturerId) {
      toast.error("Please select both offering and lecturer");
      return;
    }
    assignMutation.mutate({
      courseOfferingId: selectedOfferingId,
      lecturerId: selectedLecturerId,
    });
  };

  const handleActivateOffering = () => {
    if (!selectedOfferingId) return;
    activateMutation.mutate({
      courseId: selectedCourseId,
      offeringId: selectedOfferingId,
    });
  };

  const offeringsList = Array.isArray(offerings) ? offerings : [];
  const lecturersList = Array.isArray(lecturers) ? lecturers : [];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Offerings</h1>
            <p className="text-muted-foreground mt-2">Manage course offerings and lecturer assignments</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Offering
          </Button>
        </div>

        {/* Course Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Course</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              min="1"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              placeholder="Enter course ID"
            />
          </CardContent>
        </Card>

        {/* Offerings List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load offerings"
            description="An error occurred while loading course offerings."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !offeringsList || offeringsList.length === 0 ? (
          <EmptyState
            title="No offerings found"
            description="No course offerings exist for this course."
            icon={BookOpen}
          />
        ) : (
          <div className="space-y-3">
            {offeringsList.map((offering: any) => (
              <Card key={offering.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Semester</p>
                          <p className="font-semibold">{offering.semester}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Academic Session</p>
                          <p className="font-semibold">{offering.academicSession}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Lecturer</p>
                          <p className="font-semibold">{offering.lecturer?.name || "Unassigned"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Enrollment</p>
                          <p className="font-semibold">{offering.totalStudents}/{offering.maxCapacity}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${offering.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {offering.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!offering.active && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedOfferingId(offering.id);
                            setShowActivateConfirm(true);
                          }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Activate
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOfferingId(offering.id);
                          setShowAssignDialog(true);
                        }}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        {offering.lecturer ? "Change Lecturer" : "Assign Lecturer"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Offering Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Offering</DialogTitle>
            <DialogDescription>
              Add a new offering for this course
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Semester ID</label>
              <Input
                type="number"
                min="1"
                value={formData.semesterId}
                onChange={(e) => setFormData({ ...formData, semesterId: Number(e.target.value) })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Academic Session ID</label>
              <Input
                type="number"
                min="1"
                value={formData.academicSessionId}
                onChange={(e) => setFormData({ ...formData, academicSessionId: Number(e.target.value) })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Max Capacity</label>
              <Input
                type="number"
                min="1"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateOffering}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Lecturer Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Lecturer</DialogTitle>
            <DialogDescription>
              Select a lecturer to assign to this offering
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Lecturer</label>
              <select
                value={selectedLecturerId || ""}
                onChange={(e) => setSelectedLecturerId(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="">Select a lecturer...</option>
                {lecturersList.map((lecturer: any) => (
                  <option key={lecturer.id} value={lecturer.id}>
                    {lecturer.fullName} ({lecturer.staffId})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowAssignDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignLecturer}
                disabled={assignMutation.isPending}
              >
                {assignMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Assign"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activate Confirmation Dialog */}
      <AlertDialog open={showActivateConfirm} onOpenChange={setShowActivateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Offering</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate this course offering?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActivateOffering}
              disabled={activateMutation.isPending}
            >
              {activateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Activating...
                </>
              ) : (
                "Activate"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
