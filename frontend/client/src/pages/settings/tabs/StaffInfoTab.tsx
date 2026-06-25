import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStaffProfileInfo } from "@/api/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AlertCircle, Briefcase } from "lucide-react";

export default function StaffInfoTab() {
  const { data: staffInfo, isLoading, error } = useStaffProfileInfo();
  const [info, setInfo] = useState({
    staffId: "",
    designation: "",
    department: "",
    officeLocation: "",
    officePhone: "",
    employmentStatus: "active",
  });

  useEffect(() => {
    if (staffInfo) {
      setInfo({
        staffId: staffInfo.staffId || "",
        designation: staffInfo.designation || "",
        department: staffInfo.department || "",
        officeLocation: staffInfo.officeLocation || "",
        officePhone: staffInfo.officePhone || "",
        employmentStatus: staffInfo.employmentStatus || "active",
      });
    }
  }, [staffInfo]);

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
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-900">Error loading staff info</p>
          <p className="text-sm text-red-800">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Employment Status */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Employment Status
        </h3>
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium text-slate-600">Current Status</Label>
              <p className="text-lg font-semibold text-slate-900 mt-2 capitalize">
                {info.employmentStatus}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
              {info.employmentStatus}
            </span>
          </div>
        </Card>
      </div>

      {/* Staff Information */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Staff Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="staffId" className="text-sm font-medium">
              Staff ID
            </Label>
            <Input
              id="staffId"
              value={info.staffId}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation" className="text-sm font-medium">
              Designation
            </Label>
            <Input
              id="designation"
              value={info.designation}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Department Information */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Department Information</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium">
              Department
            </Label>
            <Input
              id="department"
              value={info.department}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Office Information */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Office Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="officeLocation" className="text-sm font-medium">
              Office Location
            </Label>
            <Input
              id="officeLocation"
              value={info.officeLocation}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="officePhone" className="text-sm font-medium">
              Office Phone
            </Label>
            <Input
              id="officePhone"
              type="tel"
              value={info.officePhone}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          For changes to your staff information, please contact the Human Resources department.
        </p>
      </div>
    </div>
  );
}