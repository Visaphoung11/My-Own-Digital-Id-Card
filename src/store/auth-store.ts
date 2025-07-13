import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Cookies from "js-cookie";
import { CookieName } from "@/type/cookie-enum";

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  isHydrating: boolean;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    userId?: string
  ) => void;
  logout: () => void;
  hydrate: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    accessToken: null,
    refreshToken: null,
    userId: null,
    isHydrating: true,

    setTokens: (accessToken, refreshToken, userId) => {
      Cookies.set(CookieName.ACCESS_TOKEN, accessToken);
      Cookies.set(CookieName.REFRESH_TOKEN, refreshToken);
      set(
        {
          accessToken,
          refreshToken,
          userId: userId || null,
          isHydrating: false,
        },
        false,
        "setTokens"
      );
    },

    updateTokens: (accessToken, refreshToken) => {
      Cookies.set(CookieName.ACCESS_TOKEN, accessToken);
      Cookies.set(CookieName.REFRESH_TOKEN, refreshToken);
      set(
        { accessToken, refreshToken, isHydrating: false },
        false,
        "updateTokens"
      );
    },

    logout: () => {
      Cookies.remove(CookieName.ACCESS_TOKEN);
      Cookies.remove(CookieName.REFRESH_TOKEN);
      set(
        {
          accessToken: null,
          refreshToken: null,
          userId: null,
          isHydrating: false,
        },
        false,
        "logout"
      );
    },

    clearAuth: () => {
      Cookies.remove(CookieName.ACCESS_TOKEN);
      Cookies.remove(CookieName.REFRESH_TOKEN);
      set(
        {
          accessToken: null,
          refreshToken: null,
          userId: null,
          isHydrating: false,
        },
        false,
        "clearAuth"
      );
    },

    hydrate: () => {
      const accessToken = Cookies.get(CookieName.ACCESS_TOKEN) || null;
      const refreshToken = Cookies.get(CookieName.REFRESH_TOKEN) || null;
      set(
        { accessToken, refreshToken, userId: null, isHydrating: false },
        false,
        "hydrate"
      );
    },
  }))
);

// Custom hook for better auth state management
export const useAuth = () => {
  const store = useAuthStore();

  return {
    ...store,
    isAuthenticated: !!store.accessToken && !store.isHydrating,
    isReady: !store.isHydrating,
  };
};
