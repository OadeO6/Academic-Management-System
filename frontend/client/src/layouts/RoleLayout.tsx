import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  studentNavigation, 
  lecturerNavigation, 
  hodNavigation, 
  adminNavigation 
} from "@/config/navigation";

interface RoleLayoutProps {
  children: React.ReactNode;
  role: "student" | "lecturer" | "hod" | "admin";
}

const navigationMap = {
  student: studentNavigation,
  lecturer: lecturerNavigation,
  hod: hodNavigation,
  admin: adminNavigation,
};

export default function RoleLayout({ children, role }: RoleLayoutProps) {
  const navigationItems = navigationMap[role].map(item => ({
    ...item,
    href: item.path
  }));

  return (
    <DashboardLayout 
      userRole={role} 
      navigationItems={navigationItems}
    >
      {children}
    </DashboardLayout>
  );
}
