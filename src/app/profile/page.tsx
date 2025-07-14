"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { userRequest } from "@/lib/api/user-api";
import {
  User,
  Mail,
  Heart,
  MoreVertical,
  Dribbble,
  Twitter,
} from "lucide-react";
import { CardItem } from "@/type/card-type";
import CorporateCard from "@/components/profile-card/corporate-card";
import MinimalCard from "@/components/profile-card/minimal-card";
import ModernCard from "@/components/profile-card/modern-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/ui/LogoutButton";
import { useAuth } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { cardRequest } from "@/lib/api/request";
import { useState } from "react";

export default function Profile() {
  const { PROFILE } = userRequest();
  const { accessToken, userId, isReady, isAuthenticated } = useAuth();
  const router = useRouter();
  const { CREATE_CARD } = cardRequest();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    gender: "male",
    dob: "1995-06-15",
    address: "",
    phone: "",
    nationality: "CAMBODIAN",
    card_type: "Modern",
    social: [
      {
        platform: "facebook",
        icon: "https://cdns-icons-png.flaticon.com/512/15047/15047435.png",
        url: "",
      },
    ],
  });

  const createCardMutation = useMutation({
    mutationFn: (payload: any) => CREATE_CARD(payload),
    onSuccess: () => {
      setShowCreateForm(false);
      refetch();
    },
    onError: (err) => {
      alert("Failed to create card");
    },
  });

  // Only redirect if ready and not authenticated
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.push("/login");
    }
  }, [isReady, isAuthenticated, router]);

  const {
    data: me,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile", accessToken, userId],
    queryFn: async () => PROFILE(),
    enabled: isAuthenticated && isReady,
    retry: false,
    staleTime: 0, // Always consider data stale to ensure fresh data
    gcTime: 0, // Don't cache the data
  });

  // Show loading state while not ready
  if (!isReady) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1>Loading profile...</h1>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-4">
            Error loading profile
          </h1>
          <p className="text-gray-600 mb-4">Please try logging in again</p>
          <div className="space-x-4">
            <Button onClick={() => refetch()}>Retry</Button>
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading if no data yet
  if (!me?.data) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1>Loading profile data...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[-10rem] bg-gray-800">
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-sm bg-gray-300 rounded-3xl shadow-xl relative px-6 pt-8 pb-6 space-y-4">
          {/* Top Buttons */}
          <div className="absolute top-4 right-4 text-gray-500 flex items-center gap-2">
            <Heart className="inline-block mr-2 w-4 h-4" />
            <MoreVertical className="inline-block w-4 h-4" />
          </div>

          {/* Avatar */}
          <div className="relative px-6 pb-6">
            {/* Avatar  */}
            <div className="flex justify-center -mt-14 mb-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage
                      src={me?.data?.avatar}
                      alt={me?.data?.user_name}
                    />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {me?.data?.user_name}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            {/* user info  */}
            <div className="text-center space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {me?.data?.full_name}
                </h1>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <User className="h-4 w-4" />@{me?.data?.user_name}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />@{me?.data?.email}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-2">
            {me?.data?.idCard?.length < 3 && (
              <Button
                className="bg-pink-500 hover:bg-pink-600 text-white"
                onClick={() => setShowCreateForm(true)}
              >
                Create Card
              </Button>
            )}
            <Link href={`/update-card/${me?.data?.idCard?.[0]?.id ?? ""}`}>
              <Button
                variant="outline"
                className="text-pink-500 border-pink-400"
              >
                Edit
              </Button>
            </Link>
            <LogoutButton />
          </div>

          {/* Create Card Modal/Form */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create Card</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createCardMutation.mutate({
                      ...formData,
                      email: me?.data?.email,
                      password: "123456", // or prompt for password if needed
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block font-medium">Gender</label>
                    <select
                      className="w-full border rounded p-2"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, gender: e.target.value }))
                      }
                      title="Gender"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, dob: e.target.value }))
                      }
                      title="Date of Birth"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Address</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, address: e.target.value }))
                      }
                      title="Address"
                      placeholder="Enter your address"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Phone</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, phone: e.target.value }))
                      }
                      title="Phone"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Nationality</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={formData.nationality}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          nationality: e.target.value,
                        }))
                      }
                      title="Nationality"
                      placeholder="Enter your nationality"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Card Type</label>
                    <select
                      className="w-full border rounded p-2"
                      value={formData.card_type}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          card_type: e.target.value,
                        }))
                      }
                      title="Card Type"
                    >
                      <option value="Modern">Modern</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Minimal">Minimal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium">Social Platform</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={formData.social[0].platform}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          social: [
                            { ...f.social[0], platform: e.target.value },
                          ],
                        }))
                      }
                      title="Social Platform"
                      placeholder="Enter social platform"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Social URL</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={formData.social[0].url}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          social: [{ ...f.social[0], url: e.target.value }],
                        }))
                      }
                      title="Social URL"
                      placeholder="Enter social URL"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-pink-500 text-white">
                      {createCardMutation.isPending ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Social Icons */}
          <div className="grid grid-cols-3 gap-2 text-center mt-4">
            <div>
              <div className="w-10 h-10 mx-auto bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
                <Dribbble className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-gray-800">12.8k</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div>
              <div className="w-10 h-10 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                {/* Behance icon is not available in lucide-react, so you may want to use a placeholder or remove it */}
                <span className="font-bold text-lg">B</span>
              </div>
              <p className="text-sm font-bold text-gray-800">12.8k</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div>
              <div className="w-10 h-10 mx-auto bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
                <Twitter className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-gray-800">12.8k</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-md mx-auto p-4 mt-[-200px]">
        <div className="grid grid-cols-1 gap-4">
          {me?.data?.idCard?.map((card: CardItem, idx: number) => {
            return (
              <div key={idx}>
                {card.card_type === "Corporate" && (
                  <CorporateCard me={me} card={card} idx={idx} />
                )}
                {card.card_type === "Modern" && (
                  <ModernCard me={me} card={card} idx={idx} />
                )}
                {card.card_type === "Minimal" && (
                  <MinimalCard me={me} card={card} idx={idx} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
