import {
  Store,
  Swords,
  Wand2,
  Church,
  Eye,
  Users,
  Shield,
  Building2,
  Flame,
  GraduationCap,
  Crown,
  Coins,
  Castle,
  Flag,
  MapPin,
  Sparkles,
} from "lucide-react";

import { FactionType } from "@/types/faction-types";

export function getFactionIcon(type: FactionType) {
  switch (type) {
    case "commercial":
      return <Store className="w-4 h-4" />;
    case "military":
      return <Swords className="w-4 h-4" />;
    case "magical":
      return <Wand2 className="w-4 h-4" />;
    case "religious":
      return <Church className="w-4 h-4" />;
    case "cult":
      return <Eye className="w-4 h-4" />;
    case "tribal":
      return <Users className="w-4 h-4" />;
    case "racial":
      return <Shield className="w-4 h-4" />;
    case "governmental":
      return <Building2 className="w-4 h-4" />;
    case "revolutionary":
      return <Flame className="w-4 h-4" />;
    case "academic":
      return <GraduationCap className="w-4 h-4" />;
    case "royalty":
      return <Crown className="w-4 h-4" />;
    case "mercenary":
      return <Coins className="w-4 h-4" />;
    case "kingdom":
      return <Castle className="w-4 h-4" />;
    case "empire":
      return <Flag className="w-4 h-4" />;
    case "country":
      return <MapPin className="w-4 h-4" />;
    case "divine":
      return <Sparkles className="w-4 h-4" />;
    default:
      return <Building2 className="w-4 h-4" />;
  }
}
