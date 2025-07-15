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
import axios from "axios";
import ProfileFormForModal from "@/components/ProfileFormForModal";

export default function Profile() {
  const { PROFILE } = userRequest();
  const { accessToken, userId, isReady, isAuthenticated } = useAuth();
  const router = useRouter();
  const { CREATE_CARD, UPDATE_CARD } = cardRequest();
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
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);

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

  // Avatar upload state (must be after 'me' is declared)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (me?.data?.avatar) {
      setAvatarUrl(me.data.avatar);
    }
  }, [me?.data?.avatar]);

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

  // Add mutation for updating card
  const updateCardMutation = useMutation({
    mutationFn: async (payload: any) => {
      const cardId = me?.data?.idCard?.[0]?.id;
      if (!cardId) throw new Error("No card");
      return UPDATE_CARD(cardId, payload);
    },
    onSuccess: () => {
      refetch();
      setShowEditForm(false);
      alert("Profile updated!");
    },
    onError: () => {
      alert("Failed to update profile");
    },
  });

  // Only redirect if ready and not authenticated
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.push("/login");
    }
  }, [isReady, isAuthenticated, router]);

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

  // Helper to create a blank social link
  const blankSocial = () => ({
    platform: "",
    icon: "https://cdns-icons-png.flaticon.com/512/15047/15047435.png",
    url: "",
  });

  // Open edit form and prefill with current card/profile data
  const handleEditClick = () => {
    const card = me?.data?.idCard?.[0];
    setEditFormData({
      avatar: avatarUrl,
      gender: card?.gender || "male",
      dob: card?.dob || "1995-06-15",
      address: card?.address || "",
      phone: card?.phone || "",
      nationality: card?.nationality || "CAMBODIAN",
      card_type: card?.card_type || "Modern",
      social:
        card?.socialLinks && card.socialLinks.length > 0
          ? card.socialLinks.map((s) => ({
              id: s.id,
              platform: s.platform,
              icon: s.icon,
              url: s.url,
            }))
          : [blankSocial()],
    });
    setShowEditForm(true);
  };

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
                    <AvatarImage src={avatarUrl} alt={me?.data?.user_name} />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {me?.data?.user_name}
                    </AvatarFallback>
                  </Avatar>
                  {/* Image upload input */}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer border border-gray-300"
                  >
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        const formData = new FormData();
                        formData.append("image", file);
                        try {
                          const res = await axios.post(
                            "/api/v1/upload/upload-image",
                            formData,
                            {
                              headers: {
                                "Content-Type": "multipart/form-data",
                              },
                            }
                          );
                          setAvatarUrl(res.data.url);
                        } catch (err) {
                          alert("Failed to upload image");
                        } finally {
                          setUploading(false);
                        }
                      }}
                      disabled={uploading}
                    />
                    <span className="text-xs">
                      {uploading ? "Uploading..." : "✏️"}
                    </span>
                  </label>
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
            <Button
              variant="outline"
              className="text-pink-500 border-pink-400"
              onClick={handleEditClick}
            >
              Edit
            </Button>
            <LogoutButton />
          </div>

          {/* Create Card Modal/Form */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create Card</h2>
                {/* --- Begin robust form replacement --- */}
                <ProfileFormForModal
                  onSuccess={() => {
                    setShowCreateForm(false);
                    refetch();
                  }}
                  createCardMutation={createCardMutation}
                  me={me}
                />
                {/* --- End robust form replacement --- */}
              </div>
            </div>
          )}

          {/* Edit Card Modal/Form */}
          {showEditForm && (
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Card</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // Prepare payload for backend
                    const payload = { ...editFormData };
                    if (!payload.avatar) delete payload.avatar;
                    updateCardMutation.mutate(payload);
                  }}
                  className="space-y-4"
                >
                  {/* Avatar preview removed. No upload functionality. */}
                  <div>
                    <label className="block font-medium">Gender</label>
                    <select
                      className="w-full border rounded p-2"
                      value={editFormData?.gender || "male"}
                      onChange={(e) =>
                        setEditFormData((f: any) => ({
                          ...f,
                          gender: e.target.value,
                        }))
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
                      value={editFormData?.dob || ""}
                      onChange={(e) =>
                        setEditFormData((f: any) => ({
                          ...f,
                          dob: e.target.value,
                        }))
                      }
                      title="Date of Birth"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Address</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={editFormData?.address || ""}
                      onChange={(e) =>
                        setEditFormData((f: any) => ({
                          ...f,
                          address: e.target.value,
                        }))
                      }
                      title="Address"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Phone</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={editFormData?.phone || ""}
                      onChange={(e) =>
                        setEditFormData((f: any) => ({
                          ...f,
                          phone: e.target.value,
                        }))
                      }
                      title="Phone"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Nationality</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={editFormData?.nationality || ""}
                      onChange={(e) =>
                        setEditFormData((f: any) => ({
                          ...f,
                          nationality: e.target.value,
                        }))
                      }
                      title="Nationality"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Card Type</label>
                    <select
                      className="w-full border rounded p-2"
                      value={editFormData?.card_type || "Modern"}
                      onChange={(e) =>
                        setEditFormData((f: any) => ({
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
                  {/* Social Links Dynamic List */}
                  <div>
                    <label className="block font-medium mb-2">
                      Social Links
                    </label>
                    {editFormData?.social?.map((social: any, idx: number) => (
                      <div key={idx} className="flex gap-2 mb-2 items-center">
                        <input
                          type="text"
                          className="border rounded p-2 flex-1"
                          placeholder="Platform"
                          value={social.platform}
                          onChange={(e) =>
                            setEditFormData((f: any) => {
                              const updated = [...f.social];
                              updated[idx].platform = e.target.value;
                              return { ...f, social: updated };
                            })
                          }
                        />
                        <input
                          type="text"
                          className="border rounded p-2 flex-1"
                          placeholder="URL"
                          value={social.url}
                          onChange={(e) =>
                            setEditFormData((f: any) => {
                              const updated = [...f.social];
                              updated[idx].url = e.target.value;
                              return { ...f, social: updated };
                            })
                          }
                        />
                        <input
                          type="text"
                          className="border rounded p-2 flex-1"
                          placeholder="Icon URL"
                          value={social.icon}
                          onChange={(e) =>
                            setEditFormData((f: any) => {
                              const updated = [...f.social];
                              updated[idx].icon = e.target.value;
                              return { ...f, social: updated };
                            })
                          }
                        />
                        <button
                          type="button"
                          className="text-red-500 px-2"
                          onClick={() =>
                            setEditFormData((f: any) => ({
                              ...f,
                              social: f.social.filter(
                                (_: any, i: number) => i !== idx
                              ),
                            }))
                          }
                          title="Remove Social"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="bg-pink-200 text-pink-700 px-3 py-1 rounded mt-2"
                      onClick={() =>
                        setEditFormData((f: any) => ({
                          ...f,
                          social: [...f.social, blankSocial()],
                        }))
                      }
                    >
                      + Add Social
                    </button>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEditForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-pink-500 text-white">
                      {updateCardMutation.isPending ? "Saving..." : "Save"}
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
