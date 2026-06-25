import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Lock, Shield, GraduationCap, Briefcase, ArrowLeft, Home } from "lucide-react";
import ProfileTab from "./tabs/ProfileTab";
import AccountTab from "./tabs/AccountTab";
import PasswordTab from "./tabs/PasswordTab";
import SecurityTab from "./tabs/SecurityTab";
import StudentInfoTab from "./tabs/StudentInfoTab";
import StaffInfoTab from "./tabs/StaffInfoTab";
import AdminInfoTab from "./tabs/AdminInfoTab";

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  component: React.ReactNode;
}

export default function SettingsPage() {
  const { user: authUser } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("profile");

  console.log("SettingsPage mounted, user:", authUser);
  console.log("Current location:", location);

  // Extract role from current URL path
  // Supports both role-prefixed paths (/student/settings) and shared path (/settings)
  const getRoleFromPath = (): string | null => {
    const match = location.match(/^\/(student|lecturer|hod|admin)\//);
    return match ? match[1] : null;
  };

  // Determine dashboard path based on role from URL or auth user
  const getDashboardPath = (): string => {
    // First, try to extract role from URL path (preferred method)
    const roleFromPath = getRoleFromPath();
    if (roleFromPath) {
      console.log("Role determined from URL path:", roleFromPath);
      return `/${roleFromPath}/dashboard`;
    }

    // Fallback to auth user role if available
    const role = authUser?.role;
    if (role) {
      console.log("Role determined from authUser:", role);
      switch (role) {
        case "student":
          return "/student/dashboard";
        case "lecturer":
          return "/lecturer/dashboard";
        case "hod":
          return "/hod/dashboard";
        case "admin":
          return "/admin/dashboard";
      }
    }
    
    // Last resort - log warning and redirect to home
    console.warn("Could not determine user role, redirecting to home");
    return "/";
  };

  const handleBackToDashboard = () => {
    const path = getDashboardPath();
    console.log("Navigating to:", path);
    setLocation(path);
  };

  // Validate that user is accessing settings through the correct role-specific path
  useEffect(() => {
    const roleFromPath = getRoleFromPath();
    const roleFromAuth = authUser?.role;

    // If no role in path and we have an auth user, redirect to role-specific settings
    if (!roleFromPath && roleFromAuth) {
      const correctPath = `/${roleFromAuth}/settings`;
      console.log("Redirecting to role-specific settings:", correctPath);
      setLocation(correctPath);
    }
  }, [authUser, location, setLocation]);

  // Determine which role-specific section to show
  // Use role from URL first, then fall back to auth user role
  const roleFromPath = getRoleFromPath();
  const effectiveRole = roleFromPath || authUser?.role;

  const sections: SettingsSection[] = [
    {
      id: "profile",
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      description: "Manage your personal details and avatar",
      component: <ProfileTab />,
    },
    {
      id: "account",
      label: "Account",
      icon: <Briefcase className="h-5 w-5" />,
      description: "Update your account information",
      component: <AccountTab />,
    },
    {
      id: "password",
      label: "Password",
      icon: <Lock className="h-5 w-5" />,
      description: "Change your password",
      component: <PasswordTab />,
    },
    {
      id: "security",
      label: "Security",
      icon: <Shield className="h-5 w-5" />,
      description: "Manage your security settings",
      component: <SecurityTab />,
    },
  ];

  // Add role-specific section
  let roleSpecificSection: SettingsSection | null = null;
  if (effectiveRole === "student") {
    roleSpecificSection = {
      id: "student-info",
      label: "Student Info",
      icon: <GraduationCap className="h-5 w-5" />,
      description: "View your student information",
      component: <StudentInfoTab />,
    };
  } else if (effectiveRole === "lecturer" || effectiveRole === "hod") {
    roleSpecificSection = {
      id: "staff-info",
      label: "Staff Info",
      icon: <Briefcase className="h-5 w-5" />,
      description: "View your staff information",
      component: <StaffInfoTab />,
    };
  } else if (effectiveRole === "admin") {
    roleSpecificSection = {
      id: "admin-info",
      label: "Admin Info",
      icon: <Shield className="h-5 w-5" />,
      description: "View your administrator information",
      component: <AdminInfoTab />,
    };
  }

  const allSections = roleSpecificSection ? [...sections, roleSpecificSection] : sections;
  const activeTab = allSections.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToDashboard}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500">Manage your account and preferences</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToDashboard}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Settings Menu</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-1 px-4 pb-4">
                      {allSections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 group flex items-start gap-3 ${
                            activeSection === section.id
                              ? "bg-blue-600 text-white shadow-md"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <div
                            className={`mt-0.5 ${
                              activeSection === section.id
                                ? "text-white"
                                : "text-slate-400 group-hover:text-slate-600"
                            }`}
                          >
                            {section.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-medium text-sm ${
                                activeSection === section.id ? "text-white" : ""
                              }`}
                            >
                              {section.label}
                            </div>
                            <div
                              className={`text-xs ${
                                activeSection === section.id
                                  ? "text-blue-50"
                                  : "text-slate-500"
                              }`}
                            >
                              {section.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* User Role Badge */}
              <Card className="mt-4 border shadow-sm bg-blue-50">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-600 mb-1">YOUR ROLE</p>
                    <p className="text-lg font-bold text-slate-900 capitalize">
                      {effectiveRole || "User"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab ? (
              <div className="animate-fadeIn">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {activeTab.icon}
                    </div>
                    {activeTab.label}
                  </h2>
                  <p className="text-slate-600 text-sm mt-2">{activeTab.description}</p>
                </div>

                <div className="bg-white rounded-lg border shadow-sm p-6">
                  {activeTab.component}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">No section selected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
