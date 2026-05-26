/**
 * Lecturer Course Materials Page
 * Upload, edit, and manage course materials
 */

import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Trash2, Edit, Loader2, Download } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";
import { useLecturerCourseMaterials, useCreateMaterial, useUpdateMaterial, useDeleteMaterial } from "@/api/hooks";
import { toast } from "sonner";
import type { LecturerMaterial, CreateMaterialRequest } from "@/api/types";

export default function LecturerCourseMaterials() {
  const { user } = useAuth();
  const { courseId } = useParams<{ courseId: string }>();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<LecturerMaterial | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null as File | null,
    visibility: "students_only" as "students_only" | "ai_only" | "both",
  });

  // Fetch materials
  const { data: materials, isLoading, error, refetch } = useLecturerCourseMaterials(Number(courseId));

  // Create material mutation
  const { mutate: createMaterial, isPending: isCreating } = useCreateMaterial({
    onSuccess: () => {
      toast.success("Material uploaded successfully");
      setShowUploadDialog(false);
      setFormData({ title: "", description: "", file: null, visibility: "students_only" });
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to upload material");
    },
  });

  // Delete material mutation
  const { mutate: deleteMaterial, isPending: isDeleting } = useDeleteMaterial({
    onSuccess: () => {
      toast.success("Material deleted successfully");
      setShowDeleteDialog(false);
      setSelectedMaterial(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete material");
    },
  });

  const handleUpload = () => {
    if (!formData.title || !formData.file) {
      toast.error("Please fill in all required fields");
      return;
    }

    createMaterial({
      courseOfferingId: Number(courseId),
      title: formData.title,
      description: formData.description,
      file: formData.file,
      visibility: formData.visibility,
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedMaterial) return;

    deleteMaterial({
      courseOfferingId: Number(courseId),
      materialId: selectedMaterial.id,
    });
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case "students_only":
        return <Badge variant="outline">Students Only</Badge>;
      case "ai_only":
        return <Badge variant="secondary">AI Only</Badge>;
      case "both":
        return <Badge>Both</Badge>;
      default:
        return <Badge>{visibility}</Badge>;
    }
  };

  return (
    <>
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Materials</h1>
            <p className="text-muted-foreground mt-2">Upload and manage course materials</p>
          </div>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Course Material</DialogTitle>
                <DialogDescription>
                  Add new course materials for your students
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="Material title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Optional description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">File *</label>
                  <Input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  />
                  {formData.file && <p className="text-xs text-muted-foreground mt-1">{formData.file.name}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium">Visibility *</label>
                  <Select value={formData.visibility} onValueChange={(value: any) => setFormData({ ...formData, visibility: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="students_only">Students Only</SelectItem>
                      <SelectItem value="ai_only">AI Only</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  onClick={handleUpload}
                  disabled={isCreating}
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                  Upload
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Materials List */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load materials"
            description="An error occurred while loading course materials."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !materials || materials.length === 0 ? (
          <EmptyState
            title="No materials uploaded"
            description="Upload course materials to get started."
            icon={FileText}
          />
        ) : (
          <div className="space-y-2">
            {materials.map((material) => (
              <Card key={material.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-medium">{material.title}</h4>
                      </div>
                      {material.description && (
                        <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {getVisibilityBadge(material.visibility)}
                        <span className="text-xs text-muted-foreground">
                          Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(material.fileUrl, "_blank")}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedMaterial(material);
                          setShowDeleteDialog(true);
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedMaterial?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    
    </>
  );
}
