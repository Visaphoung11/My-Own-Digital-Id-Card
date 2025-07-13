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

export default function Profile() {
  const { PROFILE } = userRequest();
  const { data: me, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => PROFILE(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1>Loading...</h1>
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
            <Link href="/create-card">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                Create Card
              </Button>
            </Link>
            <Link href={`/update-card/${me?.data?.idCard?.[0]?.id ?? ""}`}>
              <Button
                variant="outline"
                className="text-pink-500 border-pink-400"
              >
                Edit
              </Button>
            </Link>
          </div>

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
