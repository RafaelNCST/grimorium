import { Crown, Sword, Users, Heart } from "lucide-react";

export const getRoleIcon = (role: string) => {
  switch (role.toLowerCase()) {
    case "protagonista":
      return <Crown className="w-4 h-4" />;
    case "antagonista":
    case "vilao":
      return <Sword className="w-4 h-4" />;
    case "secundario":
      return <Users className="w-4 h-4" />;
    case "figurante":
      return <Heart className="w-4 h-4" />;
    default:
      return <Users className="w-4 h-4" />;
  }
};
