"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

const Page = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center px-6">
      {/* Logo and Title Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full shadow-lg">
            <Globe className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome
        </h1>
        <p className="text-gray-600 text-lg">Your journey starts here</p>
      </div>

      {/* Buttons Section */}
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => router.push("/register")}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Get Started
        </button>

        <button
          onClick={() => router.push("/register")}
          className="w-full bg-white text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg border-2 border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:border-blue-300"
        >
          Sign In
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          Join thousands of users worldwide
        </p>
      </div>
    </div>
  );
};

export default Page;
