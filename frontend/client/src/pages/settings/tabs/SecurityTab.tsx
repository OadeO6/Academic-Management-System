import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Shield, LogOut, History, AlertCircle } from "lucide-react";
import { useProfileSecurity, useRevokeSession } from "@/api/hooks";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateComponents";
import { toast } from "sonner";

export default function SecurityTab() {
  const { data: securityInfo, isLoading, error, refetch } = useProfileSecurity();
  const revokeSessionMutation = useRevokeSession();

  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<number | null>(null);

  const handleRevokeSession = (sessionId: number) => {
    setSessionToRevoke(sessionId);
    setShowRevokeDialog(true);
  };

  const confirmRevokeSession = () => {
    if (sessionToRevoke) {
      revokeSessionMutation.mutate({ sessionId: sessionToRevoke }, {
        onSuccess: () => {
          setShowRevokeDialog(false);
          refetch();
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Security Info...</CardTitle>
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
          <CardDescription>Failed to load security data.</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load security information"
            description="An error occurred while fetching your security details."
            error={error}
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  if (!securityInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Security Data</CardTitle>
          <CardDescription>Unable to retrieve security information.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No security information available"
            description="Your security details could not be loaded."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Privacy</CardTitle>
        <CardDescription>Manage your account security settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Two-Factor Authentication Placeholder */}
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Two-Factor Authentication (2FA)</h3>
            <p className="text-sm text-muted-foreground">
              {securityInfo.twoFactorEnabled ? "2FA is currently enabled." : "2FA is currently disabled."}
            </p>
          </div>
          <Button variant="outline" disabled>
            {securityInfo.twoFactorEnabled ? "Disable" : "Enable"}
          </Button>
        </div>

        {/* Active Sessions */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" /> Active Sessions
          </h3>
          {securityInfo.activeSessions && securityInfo.activeSessions.length > 0 ? (
            <div className="space-y-3">
              {securityInfo.activeSessions.map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{session.device} {session.isCurrent && "(Current Session)"}</p>
                    <p className="text-sm text-muted-foreground">{session.location} - {session.ipAddress}</p>
                    <p className="text-xs text-muted-foreground">Logged in: {new Date(session.loggedInAt).toLocaleString()}</p>
                  </div>
                  {!session.isCurrent && (
                    <Button variant="destructive" size="sm" onClick={() => handleRevokeSession(session.id)}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active sessions"
              description="You are not logged in on any other devices."
            />
          )}
        </div>

        {/* Recent Login History */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <History className="w-5 h-5" /> Recent Login History
          </h3>
          {securityInfo.loginHistory && securityInfo.loginHistory.length > 0 ? (
            <div className="space-y-3">
              {securityInfo.loginHistory.map((entry: any) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{entry.device}</p>
                    <p className="text-sm text-muted-foreground">{entry.location} - {entry.ipAddress}</p>
                    <p className="text-xs text-muted-foreground">Logged in: {new Date(entry.loggedInAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${entry.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No login history"
              description="No recent login attempts recorded."
            />
          )}
        </div>
      </CardContent>

      {/* Revoke Session Confirmation Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke this session? The user will be logged out from that device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevokeDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmRevokeSession} disabled={revokeSessionMutation.isPending}>
              {revokeSessionMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Revoke"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
