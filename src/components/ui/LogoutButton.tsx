"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authRequest } from "@/lib/api/auth-api";
import { useAuth } from "@/store/auth-store";

const LogoutButton = () => {
  const { AUTH_LOGOUT, handleLogout } = authRequest();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clearAuth } = useAuth();

  const handleLogoutClick = async () => {
    try {
      await AUTH_LOGOUT();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      // Clear auth store, cookies, and React Query cache
      handleLogout(queryClient);

      // Also clear auth state using the new method
      clearAuth();

      // Redirect to login page
      router.push("/login");
    }
  };

  return (
    <Button onClick={handleLogoutClick} className="bg-red-500 text-white">
      Logout
    </Button>
  );
};

export default LogoutButton;
