import { useState, useCallback, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import { IOrganization } from "@/types/organization-types";

import { calculateTotalByAlignment } from "./utils/calculators/calculate-total-by-alignment";
import { filterOrganizations } from "./utils/filters/filter-organizations";
import { OrganizationsView } from "./view";

interface PropsOrganizationsTab {
  bookId: string;
}

export function OrganizationsTab({ bookId }: PropsOrganizationsTab) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlignment, setSelectedAlignment] = useState<string>("all");
  const [selectedWorld, setSelectedWorld] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);

  const alignments = useMemo(() => ["all", "Bem", "Neutro", "Caótico"], []);
  const worlds = useMemo(() => ["all", "Aethermoor"], []);

  const filteredOrganizations = useMemo(
    () =>
      filterOrganizations({
        organizations,
        searchTerm,
        selectedAlignment,
        selectedWorld,
      }),
    [organizations, searchTerm, selectedAlignment, selectedWorld]
  );

  const totalByAlignment = useMemo(
    () => calculateTotalByAlignment(organizations),
    [organizations]
  );

  const handleCreateOrganization = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleOrganizationCreated = useCallback(
    (newOrganization: IOrganization) => {
      setOrganizations((prev) => [...prev, newOrganization]);
    },
    []
  );

  const handleOrganizationClick = useCallback(
    (orgId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/organization/$orgId",
        params: { dashboardId: bookId, orgId },
      });
    },
    [navigate, bookId]
  );

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSelectedAlignmentChange = useCallback((alignment: string) => {
    setSelectedAlignment(alignment);
  }, []);

  const handleSelectedWorldChange = useCallback((world: string) => {
    setSelectedWorld(world);
  }, []);

  const handleShowCreateModalChange = useCallback((show: boolean) => {
    setShowCreateModal(show);
  }, []);

  return (
    <OrganizationsView
      bookId={bookId}
      organizations={organizations}
      filteredOrganizations={filteredOrganizations}
      totalByAlignment={totalByAlignment}
      searchTerm={searchTerm}
      selectedAlignment={selectedAlignment}
      selectedWorld={selectedWorld}
      showCreateModal={showCreateModal}
      alignments={alignments}
      worlds={worlds}
      onSearchTermChange={handleSearchTermChange}
      onSelectedAlignmentChange={handleSelectedAlignmentChange}
      onSelectedWorldChange={handleSelectedWorldChange}
      onShowCreateModalChange={handleShowCreateModalChange}
      onCreateOrganization={handleCreateOrganization}
      onOrganizationCreated={handleOrganizationCreated}
      onOrganizationClick={handleOrganizationClick}
    />
  );
}
