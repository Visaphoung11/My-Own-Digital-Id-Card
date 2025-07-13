// components/profile-card/modern-card.tsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Mail, Phone, Globe, MapPin, Download, Instagram } from "lucide-react";
import { Button } from "../ui/button";
import { CardItem } from "@/type/card-type";
import { IUser } from "@/type/user-type";
import Link from "next/link";
import { BackgroundGradient } from "../ui/background-gradient";
const ModernCard = ({
  me,
  card,
  idx,
}: {
  me: IUser;
  card: CardItem;
  idx: number;
}) => {
  return (
    <BackgroundGradient containerClassName="max-w-sm mx-auto">
      <Card className="relative max-w-sm mx-auto bg-gradient-to-b from-indigo-700 via-purple-700 to-fuchsia-700 text-white rounded-3xl shadow-2xl">
        {/* Edit Button */}
        <Link href={`/update-card/${card.id}`}>
          <Button
            size="sm"
            variant="outline"
            className="absolute top-4 right-4 border-white text-white hover:bg-white/10 bg-white/20"
          >
            Edit
          </Button>
        </Link>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
              <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {me?.data?.user_name}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{me?.data?.full_name}</h1>
            <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-medium">
              {card.job}
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-sm">{card.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm font-medium">
            <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center">
              <Phone className="text-yellow-300 mb-1" />
              <p>Call Me</p>
              <p>{card.phone}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center">
              <Mail className="text-pink-300 mb-1" />
              <p>Email Me</p>
              <p className="break-all">{me?.data?.email}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center">
              <Globe className="text-blue-300 mb-1" />
              <p>Visit</p>
              <p>{card.web_site}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center">
              <MapPin className="text-green-300 mb-1" />
              <p>Find Me</p>
              <p>{card.address}</p>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-orange-300 via-pink-300 to-purple-400 text-black font-bold shadow-lg">
            <Download className="w-4 h-4 mr-2" />
            Save My Contact
          </Button>

          <div className="bg-white/10 text-center rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-2">
            <Instagram className="text-orange-500 w-4 h-4" />
            Instagram
          </div>
        </CardContent>
      </Card>
    </BackgroundGradient>
  );
};

export default ModernCard;
