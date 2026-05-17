/**
 * LecturerDashboard.tsx
 * All data loaded from backend APIs
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";
import { BookOpen, Award, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Page() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const navigationItems: any[] = [];
  const isLoading = false;
  const data: any = null;
  const error: any = null;

  if (isLoading) return <DashboardLayout navigationItems={navigationItems} userRole="lecturer"><LoadingState message="Loading..." /></DashboardLayout>;
  if (error) return <DashboardLayout navigationItems={navigationItems} userRole="lecturer"><ErrorState title="Error" description="Failed to load data." error={error} onRetry={() => window.location.reload()} /></DashboardLayout>;

  const actionCards = [
    {
      title: "Course Management",
      description: "Manage your courses and materials",
      icon: BookOpen,
      href: "/lecturer/management",
      color: "bg-blue-50 hover:bg-blue-100",
    },
    {
      title: "Grading",
      description: "Grade assignments and exams",
      icon: Award,
      href: "/lecturer/grading",
      color: "bg-purple-50 hover:bg-purple-100",
    },
    {
      title: "Attendance",
      description: "Track and manage student attendance",
      icon: Users,
      href: "/lecturer/attendance",
      color: "bg-green-50 hover:bg-green-100",
    },
  ];

  return (
    <DashboardLayout navigationItems={navigationItems} userRole="lecturer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your courses, grades, and attendance</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actionCards.map((card) => (
            <Card
              key={card.href}
              className={`${card.color} border-0 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105`}
              onClick={() => navigate(card.href)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <card.icon className="w-6 h-6 text-muted-foreground" />
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Content Area */}
        {!data || data.length === 0 ? <EmptyState title="No data" description="Data will appear here once backend is connected." /> : <div>{/* Render data */}</div>}
        <Card className="border-dashed bg-muted/50">
          <CardHeader><CardTitle className="text-base">Backend Integration Required</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">Implement required endpoints.</p></CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
