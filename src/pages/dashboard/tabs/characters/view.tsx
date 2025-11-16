import { useState } from "react";

import { Plus, Users, Filter, Search as SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntityListLayout, EntityCardList } from "@/components/layouts";
import { CreateCharacterModal } from "@/components/modals/create-character-modal";
import { ICharacter, ICharacterFormData } from "@/types/character-types";

import { CharacterCard } from "./components/character-card";
import { createRoleFilterRows } from "./helpers/role-filter-config";

interface IRoleStats {
  total: number;
  protagonist: number;
  antagonist: number;
  secondary: number;
  villain: number;
  extra: number;
}

interface CharactersViewProps {
  bookId: string;
  characters: ICharacter[];
  filteredCharacters: ICharacter[];
  roleStats: IRoleStats;
  searchTerm: string;
  selectedRoles: string[];
  onSearchTermChange: (term: string) => void;
  onRoleFilterChange: (role: string) => void;
  onClearFilters: () => void;
  onCharacterCreated: (character: ICharacter) => void;
  onCharacterClick: (characterId: string) => void;
}

export function CharactersView({
  bookId,
  characters,
  filteredCharacters,
  roleStats,
  searchTerm,
  selectedRoles,
  onSearchTermChange,
  onRoleFilterChange,
  onClearFilters,
  onCharacterCreated,
  onCharacterClick,
}: CharactersViewProps) {
  const { t } = useTranslation(["characters", "create-character"]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCharacter = (formData: ICharacterFormData) => {
    const newCharacter: ICharacter = {
      id: crypto.randomUUID(),
      ...formData,
      qualities: [],
      createdAt: new Date().toISOString(),
    };

    onCharacterCreated(newCharacter);
    setIsModalOpen(false);
  };

  // Configure filter rows
  const filterRows = createRoleFilterRows(roleStats, t);

  // Determine which empty state to show
  const hasNoResults = filteredCharacters.length === 0 && characters.length > 0;
  const hasSearch = searchTerm.trim().length > 0;
  const hasFilters = selectedRoles.length > 0;

  return (
    <>
      <EntityListLayout
        isLoading={false}
        isEmpty={characters.length === 0}
        emptyState={{
          icon: Users,
          title: t("characters:empty_state.no_characters"),
          description: t("characters:empty_state.no_characters_description"),
        }}
        header={{
          title: t("characters:page.title"),
          description: t("characters:page.description"),
          primaryAction: {
            label: t("characters:page.new_character"),
            onClick: () => setIsModalOpen(true),
            variant: "magical",
            icon: Plus,
            className: "animate-glow",
          },
        }}
        filters={{
          totalCount: roleStats.total,
          totalLabel: t("characters:page.total_badge"),
          selectedFilters: selectedRoles,
          filterRows: filterRows,
          onFilterToggle: onRoleFilterChange,
          onClearFilters: onClearFilters,
        }}
        search={{
          value: searchTerm,
          onChange: onSearchTermChange,
          placeholder: t("characters:page.search_placeholder"),
          maxWidth: "max-w-[50%]",
        }}
        showNoResultsState={hasNoResults}
        noResultsState={{
          icon: hasFilters ? Filter : SearchIcon,
          title: hasFilters
            ? t("characters:empty_state.no_role_characters", {
                role: selectedRoles
                  .map((role) => t(`create-character:role.${role}`) as string)
                  .join(", ")
                  .toLowerCase(),
              })
            : t("characters:empty_state.no_results"),
          description: hasFilters
            ? t("characters:empty_state.no_role_characters_description")
            : t("characters:empty_state.no_results_description"),
        }}
      >
        <EntityCardList
          items={filteredCharacters}
          renderCard={(character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={onCharacterClick}
            />
          )}
          gridCols={{ sm: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }}
        />
      </EntityListLayout>

      <CreateCharacterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateCharacter}
        bookId={bookId}
      />
    </>
  );
}
