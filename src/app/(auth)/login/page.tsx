"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authRequest } from "@/lib/api/auth-api";
import { AuthLoginType } from "@/type/auth-type";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";
import { useEffect } from "react";

const LoginSchema = z.object({
  user_name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

const Login = () => {
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const { AUTH_LOGIN, handleAuthSuccess } = authRequest();
  const { isAuthenticated, isReady } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isReady && isAuthenticated) {
      navigate.push("/profile");
    }
  }, [isReady, isAuthenticated, navigate]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      user_name: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: AuthLoginType) => AUTH_LOGIN(payload),
    onSuccess: (data) => {
      if (handleAuthSuccess(data, queryClient)) {
        // Navigate to profile page
        navigate.push("/profile");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    console.log(data, "===data login");
    mutate(data);
  };

  // Show loading while auth state is being determined
  if (!isReady) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md shadow-lg rounded-2xl p-4 mt-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="user_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting" : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
