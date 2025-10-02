import { IOrganization } from "@/types/organization-types";

interface FilterOrganizationsParams {
  organizations: IOrganization[];
  searchTerm: string;
  selectedAlignment: string;
  selectedWorld: string;
}

export function filterOrganizations({
  organizations,
  searchTerm,
  selectedAlignment,
  selectedWorld,
}: FilterOrganizationsParams): IOrganization[] {
  return organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAlignment =
      selectedAlignment === "all" || org.alignment === selectedAlignment;

    const matchesWorld = selectedWorld === "all" || org.world === selectedWorld;

    return matchesSearch && matchesAlignment && matchesWorld;
  });
}
