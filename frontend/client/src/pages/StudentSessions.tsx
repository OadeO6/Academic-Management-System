/**
 * Student Class Sessions Page
 * Displays class sessions and attendance status
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useCourseSessions, useSessionDetails } from "@/api/hooks";

export default function StudentSessions() {
  const { user } = useAuth();
  const [, params] = useLocation();

  const courseOfferingId = parseInt((params as any)?.courseOfferingId || "0");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);


  // Fetch sessions
  const { data: sessions, isLoading, error, refetch } = useCourseSessions(courseOfferingId);

  // Fetch session details
  const { data: sessionDetails, isLoading: isLoadingDetails } = useSessionDetails(courseOfferingId, selectedSessionId || 0);

  // Filter sessions
  const filteredSessions = statusFilter
    ? sessions?.filter((s) => s.status === statusFilter)
    : sessions;

  const handleViewDetails = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setShowDetailDialog(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAttendanceIcon = (status?: string) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "absent":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "excused":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <>
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Class Sessions</h1>
          <p className="text-muted-foreground mt-2">View scheduled sessions and your attendance status</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sessions</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Sessions List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load sessions"
            description="An error occurred while loading class sessions."
            error={error}
            onRetry={() => refetch()}
          />
        ) : !filteredSessions || filteredSessions.length === 0 ? (
          <EmptyState
            title="No sessions available"
            description={statusFilter ? "No sessions match the selected filter." : "No class sessions scheduled yet."}
            icon={Calendar}
          />
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((session) => (
              <Card
                key={session.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDetails(session.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(session.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Session {session.id}</h3>
                          <Badge className={`flex-shrink-0 ${getStatusColor(session.status)}`}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(session.sessionDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{session.startTime} - {session.endTime}</span>
                          </div>
                          {session.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{session.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Session Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>
              View session information and your attendance status
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : sessionDetails ? (
            <div className="space-y-6">
              {/* Session Info */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Session Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{new Date(sessionDetails.sessionDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold capitalize">{sessionDetails.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Time</p>
                    <p className="font-semibold">{sessionDetails.startTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Time</p>
                    <p className="font-semibold">{sessionDetails.endTime}</p>
                  </div>
                </div>

                {sessionDetails.location && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{sessionDetails.location}</p>
                  </div>
                )}
              </div>

              {/* Attendance Status */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getAttendanceIcon(sessionDetails.attendanceStatus)}
                  <div>
                    <p className="text-sm text-muted-foreground">Your Attendance</p>
                    <p className="font-semibold capitalize">
                      {sessionDetails.attendanceStatus || "Not Marked"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Session not found"
              description="Unable to load session details"
              icon={Calendar}
            />
          )}
        </DialogContent>
      </Dialog>
    
    </>
  );
}
