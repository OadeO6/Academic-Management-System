import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useChangePassword } from "@/api/hooks";
import { toast } from "sonner";
import { useState } from "react";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function PasswordTab() {
  const changePasswordMutation = useChangePassword();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    changePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Password Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Keep your password secure</p>
          <p className="text-amber-700">Use a strong, unique password that you don't use elsewhere.</p>
        </div>
      </div>

      {/* Current Password */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Password</h3>
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-sm font-medium">
            Current Password
          </Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="Enter your current password"
            {...form.register("currentPassword")}
            className="bg-slate-50 border-slate-200 focus:bg-white"
          />
          {form.formState.errors.currentPassword && (
            <p className="text-xs text-red-600">{form.formState.errors.currentPassword.message}</p>
          )}
        </div>
      </div>

      {/* New Password */}
      <div className="pb-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">New Password</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter a strong password"
              {...form.register("newPassword")}
              className="bg-slate-50 border-slate-200 focus:bg-white"
            />
            {form.formState.errors.newPassword && (
              <p className="text-xs text-red-600">{form.formState.errors.newPassword.message}</p>
            )}
            <p className="text-xs text-slate-500">At least 8 characters recommended</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your new password"
              {...form.register("confirmPassword")}
              className="bg-slate-50 border-slate-200 focus:bg-white"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Password Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 mb-3">Strong password includes:</p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ At least 8 characters</li>
          <li>✓ Mix of uppercase and lowercase letters</li>
          <li>✓ Numbers and special characters</li>
          <li>✓ Not your username or previous passwords</li>
        </ul>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="gap-2"
        >
          {changePasswordMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Updating...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Update Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}