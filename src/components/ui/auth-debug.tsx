"use client";

import { useAuth } from "@/store/auth-store";
import { useQueryClient } from "@tanstack/react-query";

const AuthDebug = () => {
  const { accessToken, userId, isAuthenticated, isReady } = useAuth();
  const queryClient = useQueryClient();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Ready: {isReady ? "✅" : "❌"}</div>
        <div>Authenticated: {isAuthenticated ? "✅" : "❌"}</div>
        <div>Token: {accessToken ? "✅" : "❌"}</div>
        <div>User ID: {userId || "None"}</div>
        <div>
          Token Preview:{" "}
          {accessToken ? `${accessToken.slice(0, 20)}...` : "None"}
        </div>
        <button
          onClick={() => queryClient.clear()}
          className="mt-2 px-2 py-1 bg-red-600 rounded text-xs"
        >
          Clear Cache
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;
