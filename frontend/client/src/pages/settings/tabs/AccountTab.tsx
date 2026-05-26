import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAccountInfo } from "@/api/hooks";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";

export default function AccountTab() {
  const { data: accountInfo, isLoading, error } = useAccountInfo();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Account Info...</CardTitle>
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
          <CardDescription>Failed to load account data.</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load account information"
            description="An error occurred while fetching your account details."
            error={error}
            onRetry={() => { /* Implement retry logic if needed */ }}
          />
        </CardContent>
      </Card>
    );
  }

  if (!accountInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Account Data</CardTitle>
          <CardDescription>Unable to retrieve account information.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No account information available"
            description="Your account details could not be loaded."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>View your account details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Account Creation Date</p>
            <p className="font-medium">{new Date(accountInfo.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Last Login Date</p>
            <p className="font-medium">{new Date(accountInfo.lastLoginAt).toLocaleDateString()} {new Date(accountInfo.lastLoginAt).toLocaleTimeString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Account Status</p>
            <p className="font-medium capitalize">{accountInfo.status}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Login Method</p>
            <p className="font-medium capitalize">{accountInfo.loginMethod}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
