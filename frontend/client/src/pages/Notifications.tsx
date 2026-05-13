import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, AlertCircle, Info, Trash2 } from "lucide-react";

export default function Notifications() {
  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: "assignment",
      title: "New Assignment Posted",
      message: "Dr. Smith posted a new assignment: Programming Project 1",
      course: "CS201",
      timestamp: "2 hours ago",
      read: false,
      icon: Info,
    },
    {
      id: 2,
      type: "grade",
      title: "Grade Released",
      message: "Your assignment 'Database Design' has been graded. Score: 85/100",
      course: "CS202",
      timestamp: "5 hours ago",
      read: false,
      icon: CheckCircle2,
    },
    {
      id: 3,
      type: "attendance",
      title: "Attendance Warning",
      message: "Your attendance in CS204 is below 80%. Please attend more sessions.",
      course: "CS204",
      timestamp: "1 day ago",
      read: true,
      icon: AlertCircle,
    },
    {
      id: 4,
      type: "announcement",
      title: "Course Announcement",
      message: "The midterm exam for CS201 has been rescheduled to May 25, 2026",
      course: "CS201",
      timestamp: "2 days ago",
      read: true,
      icon: Info,
    },
    {
      id: 5,
      type: "submission",
      title: "Submission Received",
      message: "Your assignment submission for 'Web Development' has been received",
      course: "CS203",
      timestamp: "3 days ago",
      read: true,
      icon: CheckCircle2,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "assignment":
        return "bg-blue-50 border-l-blue-500";
      case "grade":
        return "bg-green-50 border-l-green-500";
      case "attendance":
        return "bg-red-50 border-l-red-500";
      case "announcement":
        return "bg-purple-50 border-l-purple-500";
      case "submission":
        return "bg-yellow-50 border-l-yellow-500";
      default:
        return "bg-slate-50 border-l-slate-500";
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "assignment":
        return "bg-blue-100 text-blue-800";
      case "grade":
        return "bg-green-100 text-green-800";
      case "attendance":
        return "bg-red-100 text-red-800";
      case "announcement":
        return "bg-purple-100 text-purple-800";
      case "submission":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-2">Stay updated with important alerts and announcements</p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-red-100 text-red-800 text-base px-3 py-1">
            {unreadCount} Unread
          </Badge>
        )}
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total", count: notifications.length, color: "bg-slate-50" },
          { label: "Unread", count: unreadCount, color: "bg-blue-50" },
          { label: "Today", count: 2, color: "bg-green-50" },
          { label: "This Week", count: 4, color: "bg-purple-50" },
        ].map((stat, i) => (
          <Card key={i} className={`${stat.color} border-0`}>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        {/* All Notifications */}
        <TabsContent value="all" className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <Card
                key={notification.id}
                className={`border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.read ? "border-2 border-blue-300" : ""
                }`}
              >
                <CardContent className="pt-6 flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getNotificationBadgeColor(notification.type)}>
                          {notification.course}
                        </Badge>
                        <span className="text-xs text-slate-500">{notification.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Unread */}
        <TabsContent value="unread" className="space-y-3">
          {notifications
            .filter((n) => !n.read)
            .map((notification) => {
              const Icon = notification.icon;
              return (
                <Card key={notification.id} className={`border-l-4 ${getNotificationColor(notification.type)}`}>
                  <CardContent className="pt-6 flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        <Icon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getNotificationBadgeColor(notification.type)}>
                            {notification.course}
                          </Badge>
                          <span className="text-xs text-slate-500">{notification.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>

        {/* Assignments */}
        <TabsContent value="assignments" className="space-y-3">
          {notifications
            .filter((n) => n.type === "assignment")
            .map((notification) => {
              const Icon = notification.icon;
              return (
                <Card key={notification.id} className={`border-l-4 ${getNotificationColor(notification.type)}`}>
                  <CardContent className="pt-6 flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Icon className="w-5 h-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getNotificationBadgeColor(notification.type)}>
                            {notification.course}
                          </Badge>
                          <span className="text-xs text-slate-500">{notification.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Assignment
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>

        {/* Grades */}
        <TabsContent value="grades" className="space-y-3">
          {notifications
            .filter((n) => n.type === "grade")
            .map((notification) => {
              const Icon = notification.icon;
              return (
                <Card key={notification.id} className={`border-l-4 ${getNotificationColor(notification.type)}`}>
                  <CardContent className="pt-6 flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Icon className="w-5 h-5 text-green-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getNotificationBadgeColor(notification.type)}>
                            {notification.course}
                          </Badge>
                          <span className="text-xs text-slate-500">{notification.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Grade
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>

        {/* Announcements */}
        <TabsContent value="announcements" className="space-y-3">
          {notifications
            .filter((n) => n.type === "announcement")
            .map((notification) => {
              const Icon = notification.icon;
              return (
                <Card key={notification.id} className={`border-l-4 ${getNotificationColor(notification.type)}`}>
                  <CardContent className="pt-6 flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Icon className="w-5 h-5 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getNotificationBadgeColor(notification.type)}>
                            {notification.course}
                          </Badge>
                          <span className="text-xs text-slate-500">{notification.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
