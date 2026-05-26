import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, GraduationCap } from "lucide-react";
import { useStudentProfileInfo } from "@/api/hooks";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";

export default function StudentInfoTab() {
  const { data: studentInfo, isLoading, error, refetch } = useStudentProfileInfo();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Student Info...</CardTitle>
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
          <CardDescription>Failed to load student data.</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load student information"
            description="An error occurred while fetching your student details."
            error={error}
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  if (!studentInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Student Data</CardTitle>
          <CardDescription>Unable to retrieve student information.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No student information available"
            description="Your student details could not be loaded."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
        <CardDescription>View your academic details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Matric Number</p>
            <p className="font-medium">{studentInfo.matricNumber}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Admission Session</p>
            <p className="font-medium">{studentInfo.admissionSession}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Level</p>
            <p className="font-medium">{studentInfo.currentLevel}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Department</p>
            <p className="font-medium">{studentInfo.department}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
