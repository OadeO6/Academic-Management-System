/**
 * HOD Course Definitions Page
 * Manage course definitions with full CRUD operations
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BookOpen, Search, ChevronRight, Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useHODCourseDefinitions, useHODCourseDefinitionDetail, useCreateCourseDefinition, useUpdateCourseDefinition, useDeleteCourseDefinition } from "@/api/hooks";
import { toast } from "sonner";
import type { CourseDefinitionFilterParams } from "@/api/types";

export default function HodCourseDefinitions() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    creditUnits: 0,
    description: "",
    departmentId: 0,
  });


  const filterParams: CourseDefinitionFilterParams = {
    query: searchQuery || undefined,
    page,
    limit: 10,
  };

  const { data: courses, isLoading, error, refetch } = useHODCourseDefinitions(filterParams);
  const { data: courseDetail, isLoading: isLoadingDetail } = useHODCourseDefinitionDetail(selectedCourseId || 0);

  const createMutation = useCreateCourseDefinition({
    onSuccess: () => {
      toast.success("Course created successfully!");
      setShowCreateDialog(false);
      setFormData({ title: "", code: "", creditUnits: 0, description: "", departmentId: 0 });
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to create course: ${error.message}`);
    },
  });

  const updateMutation = useUpdateCourseDefinition({
    onSuccess: () => {
      toast.success("Course updated successfully!");
      setShowDetailDialog(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to update course: ${error.message}`);
    },
  });

  const deleteMutation = useDeleteCourseDefinition({
    onSuccess: () => {
      toast.success("Course deleted successfully!");
      setShowDeleteConfirm(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to delete course: ${error.message}`);
    },
  });

  const handleViewDetails = (courseId: number) => {
    setSelectedCourseId(courseId);
    setShowDetailDialog(true);
  };

  const handleCreateCourse = () => {
    if (!formData.title || !formData.code) {
      toast.error("Please fill in all required fields");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleUpdateCourse = () => {
    if (!selectedCourseId) return;
    updateMutation.mutate({
      courseId: selectedCourseId,
      data: formData,
    });
  };

  const handleDeleteCourse = () => {
    if (!courseToDelete) return;
    deleteMutation.mutate(courseToDelete);
  };

  const coursesList = Array.isArray(courses) ? courses : [];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Definitions</h1>
            <p className="text-muted-foreground mt-2">Manage course definitions and offerings</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by course name or code..."
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

        {/* Courses List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load courses"
            description="An error occurred while loading course definitions."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !coursesList || coursesList.length === 0 ? (
          <EmptyState
            title="No courses found"
            description="No course definitions match your search criteria."
            icon={BookOpen}
          />
        ) : (
          <div className="space-y-3">
            {coursesList.map((course: any) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-muted-foreground">
                        <div>
                          <p className="text-xs">Code</p>
                          <p className="font-medium">{course.code}</p>
                        </div>
                        <div>
                          <p className="text-xs">Credit Units</p>
                          <p className="font-medium">{course.creditUnits}</p>
                        </div>
                        <div>
                          <p className="text-xs">Offerings</p>
                          <p className="font-medium">{course.offeringsCount || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(course.id)}
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {coursesList.length > 0 && (
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

      {/* Create Course Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Add a new course definition to the system
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Course Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction to Computer Science"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Course Code *</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., CS101"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Credit Units</label>
              <Input
                type="number"
                min="0"
                value={formData.creditUnits}
                onChange={(e) => setFormData({ ...formData, creditUnits: Number(e.target.value) })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Course description..."
                className="mt-1"
                rows={4}
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
                onClick={handleCreateCourse}
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

      {/* Course Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
            <DialogDescription>
              View and edit course information
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : courseDetail ? (
            <div className="space-y-6">
              {/* Course Info */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Course Title</p>
                    <p className="font-semibold">{courseDetail.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Course Code</p>
                    <p className="font-semibold">{courseDetail.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Units</p>
                    <p className="font-semibold">{courseDetail.creditUnits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-semibold">{courseDetail.department}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {courseDetail.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm leading-relaxed">{courseDetail.description}</p>
                </div>
              )}

              {/* Offerings */}
              <div>
                <h3 className="font-semibold mb-3">Course Offerings</h3>
                {courseDetail.offerings && courseDetail.offerings.length > 0 ? (
                  <div className="space-y-2">
                    {courseDetail.offerings.map((offering: any) => (
                      <div key={offering.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Semester: {offering.semester}</p>
                            <p className="text-sm text-muted-foreground">Session: {offering.academicSession}</p>
                            <p className="text-sm text-muted-foreground">Lecturer: {offering.lecturerName || "Unassigned"}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${offering.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {offering.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No offerings created yet</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setCourseToDelete(selectedCourseId);
                    setShowDeleteConfirm(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Course
                </Button>
                <Button
                  onClick={() => setShowDetailDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Course not found"
              description="Unable to load course details"
              icon={BookOpen}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
