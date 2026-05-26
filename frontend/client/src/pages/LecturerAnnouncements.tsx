/**
 * Lecturer Announcements Page
 * Create, edit, and manage course announcements
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
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Plus, Trash2, Edit, Loader2, Pin } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";
import { useLecturerAnnouncements, useCreateLecturerAnnouncement, useDeleteLecturerAnnouncement } from "@/api/hooks";
import { toast } from "sonner";
import type { LecturerAnnouncement } from "@/api/types";

export default function LecturerAnnouncements() {
  const { user } = useAuth();
  const { courseId } = useParams<{ courseId: string }>();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<LecturerAnnouncement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    pinned: false,
  });

  // Fetch announcements
  const { data: announcementsData, isLoading, error, refetch } = useLecturerAnnouncements(Number(courseId));

  // Create announcement mutation
  const { mutate: createAnnouncement, isPending: isCreating } = useCreateLecturerAnnouncement({
    onSuccess: () => {
      toast.success("Announcement created successfully");
      setShowCreateDialog(false);
      setFormData({ title: "", body: "", pinned: false });
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to create announcement");
    },
  });

  // Delete announcement mutation
  const { mutate: deleteAnnouncement, isPending: isDeleting } = useDeleteLecturerAnnouncement({
    onSuccess: () => {
      toast.success("Announcement deleted successfully");
      setShowDeleteDialog(false);
      setSelectedAnnouncement(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete announcement");
    },
  });

  const handleCreateAnnouncement = () => {
    if (!formData.title || !formData.body) {
      toast.error("Please fill in all required fields");
      return;
    }

    createAnnouncement({
      courseOfferingId: Number(courseId),
      title: formData.title,
      body: formData.body,
      pinned: formData.pinned,
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedAnnouncement) return;

    deleteAnnouncement({
      courseOfferingId: Number(courseId),
      announcementId: selectedAnnouncement.id,
    });
  };

  const announcements = announcementsData?.announcements || [];
  const pinnedAnnouncements = announcements.filter(a => a.pinned);
  const regularAnnouncements = announcements.filter(a => !a.pinned);

  return (
    <>
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Announcements</h1>
            <p className="text-muted-foreground mt-2">Create and manage course announcements</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogDescription>
                  Post a new announcement to your students
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="Announcement title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Message *</label>
                  <Textarea
                    placeholder="Write your announcement..."
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    rows={6}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pinned"
                    checked={formData.pinned}
                    onCheckedChange={(checked) => setFormData({ ...formData, pinned: checked as boolean })}
                  />
                  <label htmlFor="pinned" className="text-sm font-medium cursor-pointer">
                    Pin this announcement to the top
                  </label>
                </div>

                <Button
                  className="w-full"
                  onClick={handleCreateAnnouncement}
                  disabled={isCreating}
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Post Announcement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Announcements List */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load announcements"
            description="An error occurred while loading announcements."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !announcements || announcements.length === 0 ? (
          <EmptyState
            title="No announcements yet"
            description="Create your first announcement to get started."
            icon={Bell}
          />
        ) : (
          <div className="space-y-4">
            {/* Pinned Announcements */}
            {pinnedAnnouncements.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-muted-foreground">Pinned</h2>
                {pinnedAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Pin className="w-4 h-4 text-yellow-600" />
                            <h4 className="font-semibold">{announcement.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{announcement.body}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Posted: {new Date(announcement.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedAnnouncement(announcement);
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

            {/* Regular Announcements */}
            {regularAnnouncements.length > 0 && (
              <div className="space-y-2">
                {pinnedAnnouncements.length > 0 && <h2 className="text-sm font-semibold text-muted-foreground mt-4">Recent</h2>}
                {regularAnnouncements.map((announcement) => (
                  <Card key={announcement.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{announcement.title}</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{announcement.body}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Posted: {new Date(announcement.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedAnnouncement(announcement);
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
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedAnnouncement?.title}"? This action cannot be undone.
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
