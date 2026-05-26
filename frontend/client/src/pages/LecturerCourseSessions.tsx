/**
 * Lecturer Course Sessions Page
 * Schedule, edit, and manage class sessions
 */

import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar, Clock, MapPin, Users, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";
import { useLecturerCourseSessions, useCreateSession, useDeleteSession } from "@/api/hooks";
import { toast } from "sonner";
import type { LecturerSession, CreateSessionRequest } from "@/api/types";

export default function LecturerCourseSessions() {
  const { user } = useAuth();
  const { courseId } = useParams<{ courseId: string }>();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<LecturerSession | null>(null);
  const [formData, setFormData] = useState({
    sessionDate: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  // Fetch sessions
  const { data: sessionsData, isLoading, error, refetch } = useLecturerCourseSessions(Number(courseId));

  // Create session mutation
  const { mutate: createSession, isPending: isCreating } = useCreateSession({
    onSuccess: () => {
      toast.success("Session created successfully");
      setShowCreateDialog(false);
      setFormData({ sessionDate: "", startTime: "", endTime: "", location: "" });
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to create session");
    },
  });

  // Delete session mutation
  const { mutate: deleteSession, isPending: isDeleting } = useDeleteSession({
    onSuccess: () => {
      toast.success("Session deleted successfully");
      setShowDeleteDialog(false);
      setSelectedSession(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete session");
    },
  });

  const handleCreateSession = () => {
    if (!formData.sessionDate || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const sessionDateTime = new Date(`${formData.sessionDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.sessionDate}T${formData.endTime}`);

    if (sessionDateTime >= endDateTime) {
      toast.error("End time must be after start time");
      return;
    }

    createSession({
      courseOfferingId: Number(courseId),
      sessionDate: sessionDateTime,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedSession) return;

    deleteSession({
      courseOfferingId: Number(courseId),
      sessionId: selectedSession.id,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-600">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-600">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const sessions = sessionsData?.sessions || [];

  return (
    <>
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Class Sessions</h1>
            <p className="text-muted-foreground mt-2">Schedule and manage class sessions</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Class Session</DialogTitle>
                <DialogDescription>
                  Create a new class session
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Session Date *</label>
                  <Input
                    type="date"
                    value={formData.sessionDate}
                    onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Time *</label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Time *</label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="e.g., Room 101, Lecture Hall A"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleCreateSession}
                  disabled={isCreating}
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Schedule Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sessions List */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load sessions"
            description="An error occurred while loading class sessions."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !sessions || sessions.length === 0 ? (
          <EmptyState
            title="No sessions scheduled"
            description="Schedule your first class session to get started."
            icon={Calendar}
          />
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">
                          {new Date(session.sessionDate).toLocaleDateString()}
                        </h4>
                        {getStatusBadge(session.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{session.startTime} - {session.endTime}</span>
                        </div>
                        {session.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{session.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{session.attendanceCount} attended</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        Mark Attendance
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedSession(session);
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
            <AlertDialogTitle>Delete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the session on {selectedSession && new Date(selectedSession.sessionDate).toLocaleDateString()}? This action cannot be undone.
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
