import { Shield, Sword, Skull } from "lucide-react";

export function getThreatLevelIcon(threatLevel: string) {
  switch (threatLevel) {
    case "inexistente":
      return Shield;
    case "baixo":
      return Shield;
    case "médio":
      return Sword;
    case "mortal":
      return Skull;
    case "apocalíptico":
      return Skull;
    default:
      return Shield;
  }
}
