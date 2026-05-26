/**
 * Home Page - Landing Page
 * Entry point for unauthenticated users
 * Shows login/signup options based on user role
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart3, Settings } from "lucide-react";
import { useLocation, Link } from "wouter";
import { LoadingState } from "@/components/StateComponents";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Show loading state while auth is being checked
  if (loading) {
    return <LoadingState message="Checking authentication..." />;
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    const dashboardMap: Record<string, string> = {
      student: "/student/dashboard",
      lecturer: "/lecturer/dashboard",
      hod: "/hod/dashboard",
      admin: "/admin/dashboard",
    };
    const dashboard = dashboardMap[user.role.toLowerCase()] || "/student/dashboard";
    navigate(dashboard);
    return <LoadingState message="Redirecting to dashboard..." />;
  }

  // Unauthenticated - show login options
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold">Academic Management System</h1>
          </div>
          <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Register</Link>
          </Button>
        </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Academic Management System
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A comprehensive platform for managing courses, grades, attendance, and academic activities.
        </p>
        <Button
          size="lg"
          asChild
          className="gap-2"
        >
          <Link href="/login">Get Started</Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold mb-12 text-center">For Different Roles</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              title: "Students",
              description: "View courses, grades, attendance, and submit assignments",
              icon: Users,
              color: "bg-blue-50",
            },
            {
              title: "Lecturers",
              description: "Manage courses, grade assignments, and track attendance",
              icon: BookOpen,
              color: "bg-purple-50",
            },
            {
              title: "HOD",
              description: "Oversee departments, courses, and student progress",
              icon: BarChart3,
              color: "bg-green-50",
            },
            {
              title: "Admin",
              description: "Manage system configuration and user accounts",
              icon: Settings,
              color: "bg-orange-50",
            },
          ].map((feature, i) => (
            <Card key={i} className={`${feature.color} border-0`}>
              <CardHeader>
                <feature.icon className="w-8 h-8 mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardHeader>
            <CardTitle>Ready to get started?</CardTitle>
            <CardDescription>Sign in with your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              asChild
            >
              <Link href="/login">Sign In Now</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
          <p>Academic Management System © 2026. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
