import { CookieName } from "@/type/cookie-enum";
import axios, { type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth-store";

// Extend AxiosRequestConfig to include retry flag
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Replace with your API base URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: ExtendedAxiosRequestConfig;
}

// Create a list to hold the request queue
const refreshAndRetryQueue: RetryQueueItem[] = [];

// Flag to prevent multiple token refresh requests
let isRefreshing = false;

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    // Only add Authorization header if token exists
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response data here, e.g., handling pagination
    return response.data;
  },
  async (error) => {
    const originalConfig: ExtendedAxiosRequestConfig = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalConfig._retry
    ) {
      originalConfig._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await axiosInstance({
            method: "POST",
            url: `/auth/refresh-token`,
          });

          const { accessToken, refreshToken } = response.data;

          if (accessToken) {
            // Update tokens in store and cookies
            const updateTokens = useAuthStore.getState().updateTokens;
            updateTokens(accessToken, refreshToken);

            // Update the original request's authorization header
            originalConfig.headers = originalConfig.headers || {};
            originalConfig.headers["Authorization"] = `Bearer ${accessToken}`;

            // Retry all requests in the queue with the new token
            refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
              config.headers = config.headers || {};
              config.headers["Authorization"] = `Bearer ${accessToken}`;
              axiosInstance
                .request(config)
                .then((response) => resolve(response))
                .catch((err) => reject(err));
            });

            // Clear the queue
            refreshAndRetryQueue.length = 0;

            // Retry the original request
            return await axiosInstance(originalConfig);
          }
        } catch (refreshError) {
          // Handle token refresh error
          console.error("Token refresh failed:", refreshError);

          // Clear auth store and redirect to login
          const logout = useAuthStore.getState().logout;
          logout();

          // Clear the queue
          refreshAndRetryQueue.length = 0;

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Add the original request to the queue
      return new Promise((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalConfig, resolve, reject });
      });
    }

    if (error.response && error.response.status === 403) {
      // Handle forbidden error
      console.error("Access forbidden:", error.response.data);
      return Promise.reject(error.response.data);
    }

    // Handle other error cases
    return Promise.reject(error);
  }
);

// Card API utility
export const cardRequest = () => {
  const CREATE_CARD = async (payload: any) => {
    return await axiosInstance({
      url: "/card/create-card",
      method: "POST",
      data: payload,
    });
  };

  // Add update card function
  const UPDATE_CARD = async (cardId: string, payload: any) => {
    return await axiosInstance({
      url: `/card/update-card/${cardId}`,
      method: "PUT",
      data: payload,
    });
  };

  return {
    CREATE_CARD,
    UPDATE_CARD,
  };
};

export default axiosInstance;
