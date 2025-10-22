import { Globe, Mountain, MapPin } from "lucide-react";

export function getLocationIcon(type: string) {
  switch (type) {
    case "Mundo":
      return <Globe className="w-3 h-3" />;
    case "Continente":
      return <Mountain className="w-3 h-3" />;
    default:
      return <MapPin className="w-3 h-3" />;
  }
}
