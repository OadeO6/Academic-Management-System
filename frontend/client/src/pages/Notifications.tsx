/**
 * Notifications Page
 * Displays all notifications with read/unread status
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, Check, CheckCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState, SkeletonCard } from "@/components/StateComponents";
import { useNotifications, useMarkNotificationRead } from "@/api/hooks";
import { toast } from "sonner";
import type { NotificationFilterParams } from "@/api/types";

export default function Notifications() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  // Fetch all notifications
  const allNotificationsParams: NotificationFilterParams = {
    page,
    limit: 20,
  };

  const { data: allNotificationsData, isLoading: isLoadingAll, error: errorAll, refetch: refetchAll } = useNotifications(allNotificationsParams);

  // Fetch unread notifications
  const unreadNotificationsParams: NotificationFilterParams = {
    read: false,
    page: 1,
    limit: 20,
  };

  const { data: unreadNotificationsData, isLoading: isLoadingUnread, error: errorUnread, refetch: refetchUnread } = useNotifications(unreadNotificationsParams);

  // Mutations
  const markAsReadMutation = useMarkNotificationRead();
  const markAllAsReadMutation = { isPending: false, mutate: () => toast.info("Functionality coming soon") };

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const allNotifications = allNotificationsData?.notifications || [];
  const unreadNotifications = unreadNotificationsData?.notifications || [];
  const unreadCount = unreadNotificationsData?.unreadCount || 0;
  const totalCount = allNotificationsData?.totalCount || 0;

  const renderNotificationList = (notifications: any[], isLoading: boolean, error: any, refetch: any) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <ErrorState
          title="Failed to load notifications"
          description="An error occurred while loading notifications."
          error={error}
          onRetry={() => refetch()}
        />
      );
    }

    if (!notifications || notifications.length === 0) {
      return (
        <EmptyState
          title="No notifications"
          description="You have no notifications at this time."
          icon={Bell}
        />
      );
    }

    return (
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`hover:shadow-md transition-shadow ${!notification.read ? "border-blue-200 bg-blue-50" : ""}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold truncate">{notification.title}</h3>
                    {!notification.read && (
                      <Badge variant="default" className="flex-shrink-0">
                        New
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {notification.message}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {!notification.read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={markAsReadMutation.isPending}
                    className="flex-shrink-0"
                  >
                    {markAsReadMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Marking...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Mark Read
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-2">Stay updated with all your notifications</p>
          </div>
          {unreadCount > 0 && (
            <Badge className="text-base px-3 py-1">{unreadCount} Unread</Badge>
          )}
        </div>

        {/* Action Buttons */}
        {unreadCount > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Marking...
                </>
              ) : (
                <>
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark All as Read
                </>
              )}
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">
              All Notifications
              {totalCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* All Notifications Tab */}
          <TabsContent value="all" className="space-y-4">
            {renderNotificationList(allNotifications, isLoadingAll, errorAll, refetchAll)}

            {/* Pagination */}
            {allNotificationsData && allNotificationsData.totalCount > 20 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, allNotificationsData.totalCount)} of{" "}
                  {allNotificationsData.totalCount} notifications
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
                    disabled={page * 20 >= allNotificationsData.totalCount}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Unread Notifications Tab */}
          <TabsContent value="unread" className="space-y-4">
            {renderNotificationList(unreadNotifications, isLoadingUnread, errorUnread, refetchUnread)}
          </TabsContent>
        </Tabs>
      </div>
    
  );
}
