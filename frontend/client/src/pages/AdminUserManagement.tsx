import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Edit2, Trash2, Plus } from "lucide-react";
import { useState } from "react";

export default function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock user data
  const users = [
    { id: 1, name: "John Doe", email: "john@university.edu", role: "admin", status: "active", joinDate: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@university.edu", role: "hod", status: "active", joinDate: "2024-02-20" },
    { id: 3, name: "Dr. Wilson", email: "wilson@university.edu", role: "lecturer", status: "active", joinDate: "2024-03-10" },
    { id: 4, name: "Prof. Brown", email: "brown@university.edu", role: "lecturer", status: "active", joinDate: "2024-01-05" },
    { id: 5, name: "Alice Johnson", email: "alice@university.edu", role: "student", status: "active", joinDate: "2024-04-01" },
    { id: 6, name: "Bob Smith", email: "bob@university.edu", role: "student", status: "inactive", joinDate: "2024-04-01" },
    { id: 7, name: "Charlie Davis", email: "charlie@university.edu", role: "student", status: "active", joinDate: "2024-04-01" },
    { id: 8, name: "Diana Wilson", email: "diana@university.edu", role: "hod", status: "active", joinDate: "2024-02-15" },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-800",
      hod: "bg-purple-100 text-purple-800",
      lecturer: "bg-blue-100 text-blue-800",
      student: "bg-green-100 text-green-800",
    };
    return <Badge className={colors[role] || ""}>{role}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-slate-100 text-slate-800">Inactive</Badge>
    );
  };

  const usersByRole = {
    admin: users.filter((u) => u.role === "admin").length,
    hod: users.filter((u) => u.role === "hod").length,
    lecturer: users.filter((u) => u.role === "lecturer").length,
    student: users.filter((u) => u.role === "student").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-2">Manage system users and assign roles</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-blue-50 border-0">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-slate-600">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-0">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-slate-600">Admins</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{usersByRole.admin}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-0">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-slate-600">HODs</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{usersByRole.hod}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-0">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-slate-600">Lecturers</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{usersByRole.lecturer}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-0">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-slate-600">Students</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{usersByRole.student}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({users.length})</TabsTrigger>
          <TabsTrigger value="admin">Admins ({usersByRole.admin})</TabsTrigger>
          <TabsTrigger value="hod">HODs ({usersByRole.hod})</TabsTrigger>
          <TabsTrigger value="lecturer">Lecturers ({usersByRole.lecturer})</TabsTrigger>
          <TabsTrigger value="student">Students ({usersByRole.student})</TabsTrigger>
        </TabsList>

        {/* All Users */}
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      <p className="text-xs text-slate-500 mt-1">Joined: {user.joinDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admins */}
        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Administrators</CardTitle>
              <CardDescription>System administrators with full access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users
                  .filter((u) => u.role === "admin")
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HODs */}
        <TabsContent value="hod" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Heads of Department</CardTitle>
              <CardDescription>Department administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users
                  .filter((u) => u.role === "hod")
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lecturers */}
        <TabsContent value="lecturer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lecturers</CardTitle>
              <CardDescription>Teaching staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users
                  .filter((u) => u.role === "lecturer")
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students */}
        <TabsContent value="student" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Enrolled students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users
                  .filter((u) => u.role === "student")
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(user.status)}
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
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
