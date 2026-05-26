/**
 * HOD Dashboard Page
 * Overview of HOD management functions
 */

import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, GraduationCap, ChevronRight } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function HodDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();


  const features = [
    {
      title: "Student Management",
      description: "Manage student records and level offsets",
      icon: GraduationCap,
      href: "/hod/students",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Lecturer Management",
      description: "Manage lecturer records and assignments",
      icon: Users,
      href: "/hod/lecturers",
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Course Definitions",
      description: "Create and manage course definitions",
      icon: BookOpen,
      href: "/hod/courses",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Course Offerings",
      description: "Manage course offerings and assignments",
      icon: BookOpen,
      href: "/hod/offerings",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">HOD Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome, {user?.name || "HOD"}. Manage your academic department here.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.href} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(feature.href)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(feature.href);
                    }}
                  >
                    Go to {feature.title}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Lecturers</p>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Active Courses</p>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Active Offerings</p>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
}
