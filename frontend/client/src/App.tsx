import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourses from "./pages/StudentCourses";
import StudentGrades from "./pages/StudentGrades";
import StudentAttendance from "./pages/StudentAttendance";
import StudentAssignments from "./pages/StudentAssignments";
import StudentTutor from "./pages/StudentTutor";
import LecturerDashboard from "./pages/LecturerDashboard";
import LecturerCourseManagement from "./pages/LecturerCourseManagement";
import LecturerGrading from "./pages/LecturerGrading";
import LecturerAttendance from "./pages/LecturerAttendance";
import HodDashboard from "./pages/HodDashboard";
import HodStudentManagement from "./pages/HodStudentManagement";
import HodCourseManagement from "./pages/HodCourseManagement";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminSystemSettings from "./pages/AdminSystemSettings";
import Notifications from "./pages/Notifications";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Role-based routing
  if (user) {
    return (
      <Switch>
        <Route path="/student/dashboard" component={StudentDashboard} />
        <Route path="/student/courses" component={StudentCourses} />
        <Route path="/student/grades" component={StudentGrades} />
        <Route path="/student/attendance" component={StudentAttendance} />
        <Route path="/student/assignments" component={StudentAssignments} />
        <Route path="/student/tutor" component={StudentTutor} />
        <Route path="/lecturer/dashboard" component={LecturerDashboard} />
        <Route path="/lecturer/management" component={LecturerCourseManagement} />
        <Route path="/lecturer/grading" component={LecturerGrading} />
        <Route path="/lecturer/attendance" component={LecturerAttendance} />
        <Route path="/hod/dashboard" component={HodDashboard} />
        <Route path="/hod/students" component={HodStudentManagement} />
        <Route path="/hod/courses" component={HodCourseManagement} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/users" component={AdminUserManagement} />
        <Route path="/admin/settings" component={AdminSystemSettings} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/" component={Home} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Public routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
