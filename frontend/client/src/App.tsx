import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import RoleLayout from "./layouts/RoleLayout";

// Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourses from "./pages/StudentCourses";
import StudentGrades from "./pages/StudentGrades";
import StudentAttendance from "./pages/StudentAttendance";
import StudentAssignments from "./pages/StudentAssignments";
import StudentTutor from "./pages/StudentTutor";
import StudentMaterials from "./pages/StudentMaterials";
import StudentAnnouncements from "./pages/StudentAnnouncements";
import StudentSessions from "./pages/StudentSessions";
import LecturerDashboard from "./pages/LecturerDashboard";
import LecturerCourses from "./pages/LecturerCourses";
import LecturerCourseStudents from "./pages/LecturerCourseStudents";
import LecturerCourseMaterials from "./pages/LecturerCourseMaterials";
import LecturerCourseTasks from "./pages/LecturerCourseTasks";
import LecturerTaskSubmissions from "./pages/LecturerTaskSubmissions";
import LecturerCourseSessions from "./pages/LecturerCourseSessions";
import LecturerSessionAttendance from "./pages/LecturerSessionAttendance";
import LecturerGradebook from "./pages/LecturerGradebook";
import LecturerAnnouncements from "./pages/LecturerAnnouncements";
import HodDashboard from "./pages/HodDashboard";
import HodStudentManagement from "./pages/HodStudentManagement";
import HodLecturerManagement from "./pages/HodLecturerManagement";
import HodCourseDefinitions from "./pages/HodCourseDefinitions";
import HodCourseOfferings from "./pages/HodCourseOfferings";
import HodCourseManagement from "./pages/HodCourseManagement";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminSystemSettings from "./pages/AdminSystemSettings";
import Notifications from "./pages/Notifications";
import SettingsPage from "./pages/settings/SettingsPage";
import ScaffoldPage from "./pages/ScaffoldPage";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />

      {/* Student Routes */}
      <Route path="/student/:rest*">
        <RoleLayout role="student">
          <Switch>
            <Route path="/student/dashboard" component={StudentDashboard} />
            <Route path="/student/courses" component={StudentCourses} />
            <Route path="/student/grades" component={StudentGrades} />
            <Route path="/student/attendance" component={StudentAttendance} />
            <Route path="/student/assignments" component={StudentAssignments} />
            <Route path="/student/tutor" component={StudentTutor} />
            <Route path="/student/courses/:courseOfferingId/materials" component={StudentMaterials} />
            <Route path="/student/courses/:courseOfferingId/assignments" component={StudentAssignments} />
            <Route path="/student/courses/:courseOfferingId/grades" component={StudentGrades} />
            <Route path="/student/courses/:courseOfferingId/announcements" component={StudentAnnouncements} />
            <Route path="/student/courses/:courseOfferingId/attendance" component={StudentAttendance} />
            <Route path="/student/courses/:courseOfferingId/sessions" component={StudentSessions} />
            <Route path="/student/settings" component={SettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </RoleLayout>
      </Route>

      {/* Lecturer Routes */}
      <Route path="/lecturer/:rest*">
        <RoleLayout role="lecturer">
          <Switch>
            <Route path="/lecturer/dashboard" component={LecturerDashboard} />
            <Route path="/lecturer/courses" component={LecturerCourses} />
            <Route path="/lecturer/courses/:courseId/students" component={LecturerCourseStudents} />
            <Route path="/lecturer/courses/:courseId/materials" component={LecturerCourseMaterials} />
            <Route path="/lecturer/courses/:courseId/tasks" component={LecturerCourseTasks} />
            <Route path="/lecturer/courses/:courseId/tasks/:taskId/submissions" component={LecturerTaskSubmissions} />
            <Route path="/lecturer/courses/:courseId/sessions" component={LecturerCourseSessions} />
            <Route path="/lecturer/courses/:courseId/sessions/:sessionId/attendance" component={LecturerSessionAttendance} />
            <Route path="/lecturer/courses/:courseId/gradebook" component={LecturerGradebook} />
            <Route path="/lecturer/courses/:courseId/announcements" component={LecturerAnnouncements} />
            <Route path="/lecturer/gradebook" component={LecturerGradebook} />
            <Route path="/lecturer/sessions" component={LecturerCourseSessions} />
            <Route path="/lecturer/attendance" component={LecturerSessionAttendance} />
            <Route path="/lecturer/submissions" component={LecturerTaskSubmissions} />
            <Route path="/lecturer/grading" component={LecturerGradebook} />
            <Route path="/lecturer/settings" component={SettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </RoleLayout>
      </Route>

      {/* HOD Routes */}
      <Route path="/hod/:rest*">
        <RoleLayout role="hod">
          <Switch>
            <Route path="/hod/dashboard" component={HodDashboard} />
            <Route path="/hod/students" component={HodStudentManagement} />
            <Route path="/hod/lecturers" component={HodLecturerManagement} />
            <Route path="/hod/courses" component={HodCourseDefinitions} />
            <Route path="/hod/offerings" component={HodCourseOfferings} />
            <Route path="/hod/course-management" component={HodCourseManagement} />
            <Route path="/hod/settings" component={SettingsPage} />
            <Route path="/hod/overview">
              <ScaffoldPage title="Department Overview" description="Detailed overview of department performance and metrics." />
            </Route>
            <Route path="/hod/reports">
              <ScaffoldPage title="Department Reports" description="Generate and view academic and administrative reports." />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </RoleLayout>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/:rest*">
        <RoleLayout role="admin">
          <Switch>
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/admin/users" component={AdminUserManagement} />
            <Route path="/admin/settings" component={SettingsPage} />
            <Route path="/admin/faculties">
              <ScaffoldPage title="Faculty Management" description="Manage university faculties and their metadata." />
            </Route>
            <Route path="/admin/departments">
              <ScaffoldPage title="Department Management" description="Configure and manage academic departments." />
            </Route>
            <Route path="/admin/academic-sessions">
              <ScaffoldPage title="Academic Sessions" description="Manage academic calendars, sessions, and semesters." />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </RoleLayout>
      </Route>

      {/* Shared Routes */}
      <Route path="/notifications">
        <Notifications />
      </Route>

      {/* Fallback */}
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