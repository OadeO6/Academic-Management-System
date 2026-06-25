import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Award, 
  Users, 
  Settings, 
  Bell, 
  Sparkles,
  GraduationCap,
  FileText,
  ClipboardList,
  Building2,
  UserCog,
  History
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: any;
  path: string;
}

export const studentNavigation: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
  { label: "Courses", icon: BookOpen, path: "/student/courses" },
  { label: "Assignments", icon: ClipboardList, path: "/student/assignments" },
  { label: "Attendance", icon: Calendar, path: "/student/attendance" },
  { label: "Grades", icon: Award, path: "/student/grades" },
  { label: "AI Tutor", icon: Sparkles, path: "/student/tutor" },
  { label: "Settings", icon: Settings, path: "/student/settings" },
];

export const lecturerNavigation: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/lecturer/dashboard" },
  { label: "My Courses", icon: BookOpen, path: "/lecturer/courses" },
  { label: "Sessions", icon: Calendar, path: "/lecturer/sessions" },
  { label: "Attendance", icon: Users, path: "/lecturer/attendance" },
  { label: "Grading", icon: Award, path: "/lecturer/grading" },
  { label: "Gradebook", icon: FileText, path: "/lecturer/gradebook" },
  { label: "Submissions", icon: ClipboardList, path: "/lecturer/submissions" },
  { label: "Settings", icon: Settings, path: "/lecturer/settings" },
];

export const hodNavigation: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/hod/dashboard" },
  { label: "Department", icon: Building2, path: "/hod/overview" },
  { label: "Courses", icon: BookOpen, path: "/hod/courses" },
  { label: "Lecturers", icon: Users, path: "/hod/lecturers" },
  { label: "Students", icon: GraduationCap, path: "/hod/students" },
  { label: "Reports", icon: FileText, path: "/hod/reports" },
  { label: "Settings", icon: Settings, path: "/hod/settings" },
];

export const adminNavigation: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Users", icon: UserCog, path: "/admin/users" },
  { label: "Faculties", icon: Building2, path: "/admin/faculties" },
  { label: "Departments", icon: Building2, path: "/admin/departments" },
  { label: "Sessions", icon: History, path: "/admin/academic-sessions" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];
