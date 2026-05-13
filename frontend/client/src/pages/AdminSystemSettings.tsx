import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Settings, Database, Bell, Shield } from "lucide-react";

export default function AdminSystemSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-600 mt-2">Configure system-wide settings and preferences</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">System Name</label>
                <Input defaultValue="Academic Management System" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Institution Name</label>
                <Input defaultValue="University of Excellence" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">System Email</label>
                <Input type="email" defaultValue="system@university.edu" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Support Email</label>
                <Input type="email" defaultValue="support@university.edu" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Academic Session</label>
                <Input defaultValue="2024/2025" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Current Semester</label>
                <Input defaultValue="First Semester" />
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>Manage database operations and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-slate-900 mb-2">Database Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-600">Connected and Healthy</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900 mb-3">Database Operations</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Backup Database
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Restore from Backup
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Optimize Database
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600">
                    Clear Cache
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Last Backup:</strong> 2026-05-12 at 02:30 AM
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  <strong>Database Size:</strong> 2.4 GB
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-600">Send notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">In-App Notifications</p>
                  <p className="text-sm text-slate-600">Show notifications in application</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">SMS Notifications</p>
                  <p className="text-sm text-slate-600">Send SMS for critical alerts</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Daily Digest</p>
                  <p className="text-sm text-slate-600">Send daily summary emails</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage system security and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-600">Require 2FA for admin accounts</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Session Timeout</p>
                  <p className="text-sm text-slate-600">Auto-logout after 30 minutes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">IP Whitelist</p>
                  <p className="text-sm text-slate-600">Restrict admin access by IP</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">SSL Certificate</p>
                  <p className="text-sm text-slate-600">Enforce HTTPS connections</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-slate-600">
                  <strong>SSL Status:</strong> Valid until 2025-12-31
                </p>
              </div>

              <Button>Save Security Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Recent system activities and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { action: "User created", user: "Admin", time: "2 hours ago" },
                  { action: "Course updated", user: "HOD", time: "4 hours ago" },
                  { action: "System backup", user: "System", time: "6 hours ago" },
                  { action: "Settings changed", user: "Admin", time: "1 day ago" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{log.action}</p>
                      <p className="text-slate-600">by {log.user}</p>
                    </div>
                    <p className="text-slate-500">{log.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
