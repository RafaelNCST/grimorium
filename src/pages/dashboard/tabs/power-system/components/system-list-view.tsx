import React from "react";

import { useNavigate, useParams } from "@tanstack/react-router";
import { Pencil, Plus, Search, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DisplayImage } from "@/components/displays";
import { EntityListLayout, EntityCardList } from "@/components/layouts";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EntityCardWrapper } from "@/components/ui/entity-card-wrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { type IPowerSystem } from "../types/power-system-types";

interface SystemListViewProps {
  systems: IPowerSystem[];
  isEditMode: boolean;
  isLoading?: boolean;
  onEditSystem: (system: IPowerSystem) => void;
  onCreateSystem: () => void;
}

export function SystemListView({
  systems,
  isEditMode,
  isLoading = false,
  onEditSystem,
  onCreateSystem,
}: SystemListViewProps) {
  const { t } = useTranslation("power-system");
  const navigate = useNavigate();
  const { dashboardId } = useParams({ from: "/dashboard/$dashboardId/" });
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSystemSelect = (systemId: string) => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/power-system/$systemId",
      params: { dashboardId, systemId },
    });
  };

  // Filter systems based on search query
  const filteredSystems = systems.filter((system) =>
    system.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasNoResults = filteredSystems.length === 0 && systems.length > 0;

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <EntityListLayout
        isLoading={isLoading}
        loadingText={t("loading.systems")}
        isEmpty={systems.length === 0}
        emptyState={{
          icon: Zap,
          title: t("empty_state.title"),
          description: t("empty_state.description"),
        }}
        header={{
          title: t("system_list.title"),
          description: t("system_list.description"),
          primaryAction: {
            label: t("system_list.new_system"),
            onClick: onCreateSystem,
            variant: "magical",
            icon: Plus,
            className: "animate-glow",
          },
        }}
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: t("system_list.search_placeholder"),
          maxWidth: "max-w-[50%]",
        }}
        showNoResultsState={hasNoResults}
        noResultsState={{
          icon: Search,
          title: t("system_list.no_results"),
          description: t("system_list.no_results_description"),
        }}
      >
        <EntityCardList
          layout="vertical"
          items={filteredSystems}
          renderCard={(system) => (
            <SystemCard
              key={system.id}
              system={system}
              isEditMode={isEditMode}
              onSelect={() => handleSystemSelect(system.id)}
              onEdit={() => onEditSystem(system)}
            />
          )}
        />
      </EntityListLayout>
    </div>
  );
}

interface SystemCardProps {
  system: IPowerSystem;
  isEditMode: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

function SystemCard({ system, isEditMode, onSelect, onEdit }: SystemCardProps) {
  const { t } = useTranslation("power-system");

  return (
    <EntityCardWrapper
      onClick={onSelect}
      overlayText={t("system_list.view_details")}
      contentClassName="p-5"
    >
      <div className="flex gap-4">
        {/* System Icon */}
        {system.iconImage ? (
          <Avatar className="w-24 h-24 rounded-lg flex-shrink-0">
            <AvatarImage src={system.iconImage} className="object-cover" />
          </Avatar>
        ) : (
          <DisplayImage
            icon={Zap}
            height="h-24"
            width="w-24"
            shape="square"
          />
        )}

        {/* Right side content */}
        <div className="flex-1 min-w-0 flex items-center justify-between">
          {/* Name */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {system.name}
          </h3>

          {/* Edit Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 ml-4 relative z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm font-medium">
                {t("system_list.edit_tooltip")}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </EntityCardWrapper>
  );
}
