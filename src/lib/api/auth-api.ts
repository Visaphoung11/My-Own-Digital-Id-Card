import axios from "@/lib/api/request";
import { AuthLoginType, AuthRegisterType } from "@/type/auth-type";
import { useAuthStore } from "@/store/auth-store";
import { QueryClient } from "@tanstack/react-query";

export const authRequest = () => {
  const AUTH_REGISTER = async (payload: AuthRegisterType) => {
    return await axios({
      url: "/auth/register",
      method: "POST",
      data: payload,
    });
  };

  const AUTH_LOGIN = async (payload: AuthLoginType) => {
    return await axios({
      url: "/auth/login",
      method: "POST",
      data: payload,
    });
  };

  const AUTH_LOGOUT = async () => {
    return await axios({
      url: "/auth/logout",
      method: "POST",
    });
  };

  // Helper function to handle successful authentication
  const handleAuthSuccess = (data: any, queryClient: QueryClient) => {
    if (data?.data?.accessToken && data?.data?.refreshToken) {
      const setTokens = useAuthStore.getState().setTokens;
      const userId = data?.data?.user?.id || data?.data?.userId || null;

      // Set tokens in store and cookies
      setTokens(data.data.accessToken, data.data.refreshToken, userId);

      // Clear React Query cache to ensure fresh data
      queryClient.removeQueries({ queryKey: ["profile"] });
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.clear();

      return true;
    }
    return false;
  };

  // Helper function to handle logout
  const handleLogout = (queryClient: QueryClient) => {
    const logout = useAuthStore.getState().logout;

    // Clear auth store and cookies
    logout();

    // Clear React Query cache
    queryClient.removeQueries();
    queryClient.clear();
  };

  return {
    AUTH_LOGIN,
    AUTH_REGISTER,
    AUTH_LOGOUT,
    handleAuthSuccess,
    handleLogout,
  };
};
