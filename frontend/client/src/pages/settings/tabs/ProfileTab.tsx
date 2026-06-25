import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, User, CheckCircle2 } from "lucide-react";
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
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024;

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

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 font-semibold mb-2">Unable to load profile</div>
        <p className="text-slate-600 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Avatar Section */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Photo</h3>
        <div className="flex items-center space-x-6">
          <Avatar className="h-24 w-24 ring-2 ring-primary/20">
            {avatarPreview ? (
              <AvatarImage src={avatarPreview} alt="Avatar Preview" />
            ) : (
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-primary/10">
                {profile.firstName.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-3">
            <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
              <Upload className="mr-2 h-4 w-4" />
              Choose Photo
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <Button
                type="button"
                onClick={handleUploadAvatar}
                disabled={uploadAvatarMutation.isPending}
                size="sm"
                variant="default"
                className="w-full"
              >
                {uploadAvatarMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Photo
                  </>
                )}
              </Button>
            )}
            <p className="text-xs text-slate-500">Max 5MB. JPG, PNG, or GIF</p>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              {...form.register("firstName")}
              className="bg-slate-50 border-slate-200 focus:bg-white"
            />
            {form.formState.errors.firstName && (
              <p className="text-xs text-red-600">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              {...form.register("lastName")}
              className="bg-slate-50 border-slate-200 focus:bg-white"
            />
            {form.formState.errors.lastName && (
              <p className="text-xs text-red-600">{form.formState.errors.lastName.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
            <p className="text-xs text-slate-500">Cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              {...form.register("phoneNumber")}
              className="bg-slate-50 border-slate-200 focus:bg-white"
            />
            {form.formState.errors.phoneNumber && (
              <p className="text-xs text-red-600">{form.formState.errors.phoneNumber.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Organization Information Section */}
      <div className="pb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Organization Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">Role</Label>
            <Input
              id="role"
              value={profile.role}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600 capitalize"
            />
            <p className="text-xs text-slate-500">Cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium">Department</Label>
            <Input
              id="department"
              value={profile.department}
              readOnly
              className="bg-slate-100 border-slate-200 text-slate-600"
            />
            <p className="text-xs text-slate-500">Cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-between pt-4 border-t">
        <div className="text-xs text-slate-500">
          Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "Never"}
        </div>
        <Button
          type="submit"
          disabled={updateProfileMutation.isPending || !form.formState.isDirty}
          className="gap-2"
        >
          {updateProfileMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}