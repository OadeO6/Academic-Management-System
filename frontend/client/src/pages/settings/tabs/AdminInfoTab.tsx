import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield, Info } from "lucide-react";

// Placeholder for useAdminProfileInfo hook since it's not yet available in the API
const useAdminProfileInfo = () => {
  return {
    data: {
      adminId: "ADM-2024-001",
      accessLevel: "Super Admin",
      permissions: "Full System Access",
      privileges: "Tier 1",
      systemAssignment: "Global Infrastructure",
      status: "active"
    },
    isLoading: false,
    error: null
  };
};

export default function AdminInfoTab() {
  const { data: adminInfo, isLoading, error } = useAdminProfileInfo();
  const [info, setInfo] = useState({
    adminId: "",
    accessLevel: "",
    permissions: "",
    privileges: "",
    systemAssignment: "",
    status: "active",
  });

  useEffect(() => {
    if (adminInfo) {
      setInfo({
        adminId: adminInfo.adminId || "",
        accessLevel: adminInfo.accessLevel || "",
        permissions: adminInfo.permissions || "",
        privileges: adminInfo.privileges || "",
        systemAssignment: adminInfo.systemAssignment || "",
        status: adminInfo.status || "active",
      });
    }
  }, [adminInfo]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5">⚠️</div>
        <div>
          <p className="font-medium text-red-900">Error loading admin info</p>
          <p className="text-sm text-red-800">{(error as any).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          System Access Status
        </h3>
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium text-slate-600">Account Status</Label>
              <p className="text-lg font-semibold text-slate-900 mt-2 capitalize">
                {info.status}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {info.status}
            </span>
          </div>
        </Card>
      </div>

      {/* Admin Identification */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Admin Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="adminId" className="text-sm font-medium">
              Admin ID
            </Label>
            <Input
              id="adminId"
              value={info.adminId}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessLevel" className="text-sm font-medium">
              Access Level
            </Label>
            <Input
              id="accessLevel"
              value={info.accessLevel}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Permissions & Privileges */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Permissions & Privileges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="permissions" className="text-sm font-medium">
              Permissions Overview
            </Label>
            <Input
              id="permissions"
              value={info.permissions}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="privileges" className="text-sm font-medium">
              Admin Privileges Level
            </Label>
            <Input
              id="privileges"
              value={info.privileges}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* System Assignment */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">System Assignment</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="systemAssignment" className="text-sm font-medium">
              Department/System Assignment
            </Label>
            <Input
              id="systemAssignment"
              value={info.systemAssignment}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          Administrator profiles are managed by the System Security Office. Contact the IT Director for changes to access levels or permissions.
        </p>
      </div>
    </div>
  );
}
