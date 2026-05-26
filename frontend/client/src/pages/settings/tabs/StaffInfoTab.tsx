import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Briefcase } from "lucide-react";
import { useStaffProfileInfo } from "@/api/hooks";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";

export default function StaffInfoTab() {
  const { data: staffInfo, isLoading, error, refetch } = useStaffProfileInfo();

  const getAuthStatusColor = (status: string) => {
    switch (status) {
      case "authorized":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "revoked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Staff Info...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load staff data.</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load staff information"
            description="An error occurred while fetching your staff details."
            error={error}
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  if (!staffInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Staff Data</CardTitle>
          <CardDescription>Unable to retrieve staff information.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No staff information available"
            description="Your staff details could not be loaded."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Information</CardTitle>
        <CardDescription>View your employment details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Staff ID</p>
            <p className="font-medium">{staffInfo.staffId}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Department</p>
            <p className="font-medium">{staffInfo.department}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Authorization Status</p>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getAuthStatusColor(staffInfo.authorizationStatus)}`}>
              {staffInfo.authorizationStatus}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Assigned Courses</p>
            <p className="font-medium">{staffInfo.assignedCoursesCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
