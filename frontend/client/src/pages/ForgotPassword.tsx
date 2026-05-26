import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useForgotPassword } from "@/api/hooks";
import { toast } from "sonner";
import { Loader2, BookOpen, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPassword() {
  const forgotPasswordMutation = useForgotPassword({
    onSuccess: () => {
      toast.success("Password reset link sent to your email!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send reset link. Please try again.");
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    forgotPasswordMutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">AMS</h1>
          </div>
          <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forgotPasswordMutation.isSuccess ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 text-green-700 rounded-md text-sm">
                If an account exists for {form.getValues("email")}, you will receive a password reset link shortly.
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Reset Link
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/" className="text-sm text-primary hover:underline flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
