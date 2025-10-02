import { Shield, Swords, Crown, Building } from "lucide-react";

import { OrganizationType } from "@/types/organization-types";

export function getOrganizationIcon(type: OrganizationType) {
  switch (type) {
    case "Militar":
      return <Shield className="w-4 h-4" />;
    case "Culto":
      return <Swords className="w-4 h-4" />;
    case "Comercial":
      return <Crown className="w-4 h-4" />;
    case "Mágica":
      return <Swords className="w-4 h-4" />;
    case "Religiosa":
      return <Crown className="w-4 h-4" />;
    case "Governamental":
      return <Building className="w-4 h-4" />;
    default:
      return <Building className="w-4 h-4" />;
  }
}
