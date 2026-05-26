import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, User } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useProfile, useUpdateProfile, useUploadAvatar } from "@/api/hooks";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileTab() {
  const { user: authUser } = useAuth();
  const { data: profile, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber || "",
      });
      setAvatarPreview(profile.avatarUrl || null);
    }
  }, [profile, form]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPG, PNG, GIF are allowed.");
        return;
      }
      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }

      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = () => {
    if (selectedFile) {
      uploadAvatarMutation.mutate({ file: selectedFile });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Profile...</CardTitle>
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
          <CardDescription>Failed to load profile data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Profile Data</CardTitle>
          <CardDescription>Unable to retrieve user profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Manage your personal details and avatar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Avatar Preview" />
              ) : (
                <AvatarFallback className="text-4xl">
                  {profile.firstName.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium">
                <Upload className="mr-2 h-4 w-4" />
                Change Avatar
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <Button type="button" onClick={handleUploadAvatar} disabled={uploadAvatarMutation.isPending}>
                  {uploadAvatarMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Upload
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...form.register("firstName")} />
              {form.formState.errors.firstName && (
                <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...form.register("lastName")} />
              {form.formState.errors.lastName && (
                <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile.email} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={profile.role} readOnly className="bg-muted" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={profile.department} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" {...form.register("phoneNumber")} />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-destructive">{form.formState.errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateProfileMutation.isPending || !form.formState.isDirty}>
              {updateProfileMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <User className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
