import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, Lock, Shield, GraduationCap, Briefcase, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import ProfileTab from "./tabs/ProfileTab";
import AccountTab from "./tabs/AccountTab";
import PasswordTab from "./tabs/PasswordTab";
import SecurityTab from "./tabs/SecurityTab";
import StudentInfoTab from "./tabs/StudentInfoTab";
import StaffInfoTab from "./tabs/StaffInfoTab";

export default function SettingsPage() {
  const { user } = useAuth();

  const defaultTabs = [
    { value: "profile", label: "Profile", icon: User, component: <ProfileTab /> },
    { value: "account", label: "Account", icon: LayoutDashboard, component: <AccountTab /> },
    { value: "password", label: "Password", icon: Lock, component: <PasswordTab /> },
    { value: "security", label: "Security", icon: Shield, component: <SecurityTab /> },
  ];

  let roleSpecificTab = null;
  if (user?.role === "student") {
    roleSpecificTab = { value: "student-info", label: "Student Info", icon: GraduationCap, component: <StudentInfoTab /> };
  } else if (user?.role === "lecturer" || user?.role === "hod") {
    roleSpecificTab = { value: "staff-info", label: "Staff Info", icon: Briefcase, component: <StaffInfoTab /> };
  }

  const tabs = roleSpecificTab ? [...defaultTabs, roleSpecificTab] : defaultTabs;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
