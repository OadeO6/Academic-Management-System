import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { BookOpen, Users, BarChart3, Zap, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect authenticated users to their dashboard
  if (user && !loading) {
    const dashboardPaths = {
      student: "/student/dashboard",
      lecturer: "/lecturer/dashboard",
      hod: "/hod/dashboard",
      admin: "/admin/dashboard",
    };
    navigate(dashboardPaths[user.role as keyof typeof dashboardPaths] || "/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200/50 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">AMS</span>
          </div>
          <Button asChild variant="default" size="sm">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                Academic Excellence Made Simple
              </h1>
              <p className="text-xl text-slate-600">
                A sophisticated platform designed for students, lecturers, and administrators to collaborate seamlessly
                and achieve academic success.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-2">
                <a href={getLoginUrl()}>
                  Get Started <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#features">Learn More</a>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4 text-sm text-slate-600">
              <div>
                <div className="font-semibold text-slate-900">4 Roles</div>
                <div>Student, Lecturer, HOD, Admin</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">AI-Powered</div>
                <div>Smart tutoring & grading</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200/50">
              <div className="space-y-4">
                <div className="h-12 bg-blue-200/30 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200/50 rounded w-3/4" />
                  <div className="h-3 bg-slate-200/50 rounded w-1/2" />
                </div>
                <div className="pt-4 space-y-3">
                  <div className="h-10 bg-blue-500/10 rounded-lg" />
                  <div className="h-10 bg-purple-500/10 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need for seamless academic management in one elegant platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: BookOpen,
              title: "Course Management",
              description: "Organize courses, materials, and sessions effortlessly",
            },
            {
              icon: Users,
              title: "Collaboration",
              description: "Connect students, lecturers, and administrators",
            },
            {
              icon: Zap,
              title: "AI Tutoring",
              description: "Smart AI-powered tutoring and automatic grading",
            },
            {
              icon: BarChart3,
              title: "Analytics",
              description: "Comprehensive insights into academic performance",
            },
          ].map((feature, i) => (
            <Card key={i} className="border-slate-200/50 hover:border-blue-200/50 transition-colors">
              <CardHeader>
                <feature.icon className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Tailored for Every Role</h2>
          <p className="text-lg text-slate-600">Each user gets a customized experience designed for their needs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              role: "Student",
              description: "Track courses, grades, attendance, and interact with AI tutors",
              color: "from-blue-500/10 to-blue-600/10",
              border: "border-blue-200/50",
            },
            {
              role: "Lecturer",
              description: "Manage courses, grade assignments, and track student progress",
              color: "from-purple-500/10 to-purple-600/10",
              border: "border-purple-200/50",
            },
            {
              role: "HOD",
              description: "Oversee department operations and monitor performance metrics",
              color: "from-green-500/10 to-green-600/10",
              border: "border-green-200/50",
            },
            {
              role: "Admin",
              description: "Configure system settings and manage all organizational data",
              color: "from-orange-500/10 to-orange-600/10",
              border: "border-orange-200/50",
            },
          ].map((item, i) => (
            <Card key={i} className={`bg-gradient-to-br ${item.color} border-slate-200/50 hover:border-slate-300/50 transition-colors`}>
              <CardHeader>
                <CardTitle className="text-lg">{item.role}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/50">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto">
            Join thousands of students and educators using AMS to transform academic management
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <a href={getLoginUrl()}>
              Sign In Now <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-slate-50/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-900">AMS</span>
            </div>
            <p className="text-sm text-slate-600">© 2026 Academic Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
