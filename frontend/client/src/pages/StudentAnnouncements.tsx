/**
 * Student Announcements Page
 * Displays course announcements
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar, User, Pin, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useAnnouncements } from "@/api/hooks";
import { toast } from "sonner";
import type { AnnouncementFilterParams } from "@/api/types";

export default function StudentAnnouncements() {
  const { user } = useAuth();
  const [, params] = useLocation();

  const courseOfferingId = parseInt((params as any)?.courseOfferingId || "0");
  const [pinnedFilter, setPinnedFilter] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<number | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);


  const filterParams: AnnouncementFilterParams = {
    pinned: pinnedFilter || undefined,
  };

  // Fetch announcements
  const { data: announcements, isLoading, error, refetch } = useAnnouncements({ courseOfferingId, ...filterParams });

  // Fetch announcement details (using existing data)
  const announcementDetails = announcements?.find(a => a.id === selectedAnnouncementId);
  const isLoadingDetails = false;

  // Mark as viewed mutation (placeholder)
  const markViewedMutation = { mutate: () => {} };

  const handleViewDetails = (announcementId: number) => {
    setSelectedAnnouncementId(announcementId);
    setShowDetailDialog(true);
  };

  return (
    <>
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Course Announcements</h1>
          <p className="text-muted-foreground mt-2">Stay updated with course announcements and important notices</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={pinnedFilter ? "default" : "outline"}
            onClick={() => setPinnedFilter(!pinnedFilter)}
          >
            <Pin className="w-4 h-4 mr-2" />
            {pinnedFilter ? "Showing Pinned" : "Show Pinned"}
          </Button>
        </div>

        {/* Announcements List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
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
            title="No announcements"
            description={pinnedFilter ? "No pinned announcements yet." : "No announcements available yet."}
            icon={Bell}
          />
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className={`hover:shadow-md transition-shadow cursor-pointer ${!announcement.viewed ? "border-blue-200 bg-blue-50" : ""}`}
                onClick={() => handleViewDetails(announcement.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">{announcement.title}</h3>
                        {announcement.pinned && (
                          <Badge variant="secondary" className="flex-shrink-0">
                            <Pin className="w-3 h-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                        {!announcement.viewed && (
                          <Badge variant="default" className="flex-shrink-0">
                            New
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {announcement.body}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>By Lecturer</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
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

      {/* Announcement Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Announcement Details</DialogTitle>
            <DialogDescription>
              Read the full announcement
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : announcementDetails ? (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">{announcementDetails.title}</h3>
                  {announcementDetails.pinned && (
                    <Badge variant="secondary">
                      <Pin className="w-3 h-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Posted by Lecturer</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(announcementDetails.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {announcementDetails.body}
                </p>
              </div>

              {/* Status */}
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="text-muted-foreground">Status: </span>
                  <span className="font-semibold">{announcementDetails.viewed ? "Viewed" : "Unread"}</span>
                </p>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Announcement not found"
              description="Unable to load announcement details"
              icon={Bell}
            />
          )}
        </DialogContent>
      </Dialog>
    
    </>
  );
}
