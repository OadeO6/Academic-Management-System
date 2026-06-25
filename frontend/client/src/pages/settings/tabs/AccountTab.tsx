import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useProfileSecurity, useRevokeSession } from "@/api/hooks";
import { Shield, Smartphone, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function SecurityTab() {
  const { data: settings, isLoading, error } = useProfileSecurity();
  const revokeMutation = useRevokeSession();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(false);

  useEffect(() => {
    if (settings) {
      setTwoFactorEnabled(settings.twoFactorEnabled || false);
      setLoginNotifications(settings.loginNotifications || false);
    }
  }, [settings]);

  const handleTwoFactorChange = (value: boolean) => {
    setTwoFactorEnabled(value);
    toast.success(`Two-factor authentication ${value ? "enabled" : "disabled"}`);
  };

  const handleLoginNotificationsChange = (value: boolean) => {
    setLoginNotifications(value);
    toast.success(`Login notifications ${value ? "enabled" : "disabled"}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <p className="text-slate-600">Unable to load security settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-green-800">
          <p className="font-medium mb-1">Your account is secure</p>
          <p className="text-green-700">Continue below to enhance your security further.</p>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="pb-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-600 mt-1">
                Add an extra layer of security by requiring a code from your phone when logging in.
              </p>
            </div>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleTwoFactorChange}
          />
        </div>
        {twoFactorEnabled && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 ml-11">
            <p className="text-sm text-blue-800">
              <strong>Status:</strong> Two-factor authentication is enabled on your account.
            </p>
          </div>
        )}
      </div>

      {/* Login Notifications */}
      <div className="pb-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Login Notifications</h3>
              <p className="text-sm text-slate-600 mt-1">
                Get notified when someone logs into your account from a new device.
              </p>
            </div>
          </div>
          <Switch
            checked={loginNotifications}
            onCheckedChange={handleLoginNotificationsChange}
          />
        </div>
        {loginNotifications && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 ml-11">
            <p className="text-sm text-purple-800">
              <strong>Status:</strong> You'll receive email notifications for new logins.
            </p>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="pb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Active Sessions
        </h3>
        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-slate-900">Current Session</p>
                <p className="text-sm text-slate-600 mt-1">This browser</p>
                <p className="text-xs text-slate-500 mt-2">Last active: Now</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-slate-900 mb-3">Security Tips:</p>
        <ul className="text-sm text-slate-700 space-y-2">
          <li className="flex gap-2">
            <span>•</span>
            <span>Keep your password unique and change it regularly</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Enable two-factor authentication for added protection</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Review your active sessions and log out from unknown devices</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Never share your credentials with anyone</span>
          </li>
        </ul>
      </div>
    </div>
  );
}