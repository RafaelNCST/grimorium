import { memo } from "react";

import { Plus, Search, Users, Filter, SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/empty-state";
import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import { CreateFactionModal } from "@/components/modals/create-faction-modal/index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type IFaction,
  type IFactionFormData,
  type FactionStatus,
  type FactionType,
} from "@/types/faction-types";

import { FactionCard } from "./components/faction-card";

interface PropsFactionsView {
  factions: IFaction[];
  filteredFactions: IFaction[];
  searchTerm: string;
  selectedStatuses: string[];
  selectedTypes: string[];
  statusStats: Record<FactionStatus, number>;
  typeStats: Record<FactionType, number>;
  showCreateModal: boolean;
  onSearchTermChange: (term: string) => void;
  onStatusFilterChange: (status: string) => void;
  onTypeFilterChange: (type: string) => void;
  onClearFilters: () => void;
  onShowCreateModalChange: (show: boolean) => void;
  onNavigateToFaction: (factionId: string) => void;
  onCreateFaction: (factionData: IFactionFormData) => void;
}

const FactionsViewComponent = function FactionsView({
  factions,
  filteredFactions,
  searchTerm,
  selectedStatuses,
  selectedTypes,
  statusStats,
  typeStats,
  showCreateModal,
  onSearchTermChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onClearFilters,
  onShowCreateModalChange,
  onNavigateToFaction,
  onCreateFaction,
}: PropsFactionsView) {
  const { t } = useTranslation(["factions", "create-faction"]);

  const totalFactions = factions.length;

  // Empty state when no factions exist
  if (totalFactions === 0) {
    return (
      <div className="flex-1 h-full flex flex-col space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t("factions:page.title")}</h2>
            <p className="text-muted-foreground">
              {t("factions:page.description")}
            </p>
          </div>
          <Button
            variant="magical"
            size="lg"
            onClick={() => onShowCreateModalChange(true)}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t("factions:page.new_faction")}
          </Button>
        </div>

        <EmptyState
          icon={Users}
          title={t("factions:empty_state.no_factions")}
          description={t("factions:empty_state.no_factions_description")}
        />

        <CreateFactionModal
          open={showCreateModal}
          onClose={() => onShowCreateModalChange(false)}
          onConfirm={onCreateFaction}
        />
      </div>
    );
  }

  // Get status badge class based on status colors from constants
  const getStatusBadgeClass = (statusValue: string) => {
    const statusData = FACTION_STATUS_CONSTANT.find(
      (s) => s.value === statusValue
    );
    const isActive = selectedStatuses.includes(statusValue);

    if (!statusData) return "";

    // Map colors to badge colors using direct color names
    if (isActive) {
      // Active state - full color background
      if (statusValue === "active") return "!bg-green-500 !text-black !border-green-500";
      if (statusValue === "weakened") return "!bg-yellow-500 !text-black !border-yellow-500";
      if (statusValue === "dissolved") return "!bg-red-500 !text-black !border-red-500";
      if (statusValue === "reformed") return "!bg-blue-500 !text-black !border-blue-500";
      if (statusValue === "apex") return "!bg-purple-500 !text-black !border-purple-500";
    }

    // Inactive state - subtle background
    if (statusValue === "active") return `${statusData.bgColorClass} ${statusData.colorClass} hover:!bg-green-500 hover:!text-black hover:!border-green-500`;
    if (statusValue === "weakened") return `${statusData.bgColorClass} ${statusData.colorClass} hover:!bg-yellow-500 hover:!text-black hover:!border-yellow-500`;
    if (statusValue === "dissolved") return `${statusData.bgColorClass} ${statusData.colorClass} hover:!bg-red-500 hover:!text-black hover:!border-red-500`;
    if (statusValue === "reformed") return `${statusData.bgColorClass} ${statusData.colorClass} hover:!bg-blue-500 hover:!text-black hover:!border-blue-500`;
    if (statusValue === "apex") return `${statusData.bgColorClass} ${statusData.colorClass} hover:!bg-purple-500 hover:!text-black hover:!border-purple-500`;

    return "";
  };

  // Get type badge class based on type colors from constants
  const getTypeBadgeClass = (typeValue: string) => {
    const typeData = FACTION_TYPES_CONSTANT.find((t) => t.value === typeValue);
    const isActive = selectedTypes.includes(typeValue);

    if (!typeData) return "";

    // Map colors to badge colors using direct color names
    if (isActive) {
      // Active state - full color background
      if (typeValue === "commercial") return "!bg-emerald-500 !text-black !border-emerald-500";
      if (typeValue === "military") return "!bg-red-500 !text-black !border-red-500";
      if (typeValue === "magical") return "!bg-purple-500 !text-black !border-purple-500";
      if (typeValue === "religious") return "!bg-yellow-500 !text-black !border-yellow-500";
      if (typeValue === "cult") return "!bg-indigo-500 !text-black !border-indigo-500";
      if (typeValue === "tribal") return "!bg-orange-500 !text-black !border-orange-500";
      if (typeValue === "racial") return "!bg-cyan-500 !text-black !border-cyan-500";
      if (typeValue === "governmental") return "!bg-blue-500 !text-black !border-blue-500";
      if (typeValue === "revolutionary") return "!bg-rose-500 !text-black !border-rose-500";
      if (typeValue === "academic") return "!bg-teal-500 !text-black !border-teal-500";
      if (typeValue === "royalty") return "!bg-amber-500 !text-black !border-amber-500";
      if (typeValue === "mercenary") return "!bg-slate-500 !text-black !border-slate-500";
    }

    // Inactive state - subtle background
    if (typeValue === "commercial") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-emerald-500 hover:!text-black hover:!border-emerald-500`;
    if (typeValue === "military") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-red-500 hover:!text-black hover:!border-red-500`;
    if (typeValue === "magical") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-purple-500 hover:!text-black hover:!border-purple-500`;
    if (typeValue === "religious") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-yellow-500 hover:!text-black hover:!border-yellow-500`;
    if (typeValue === "cult") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-indigo-500 hover:!text-black hover:!border-indigo-500`;
    if (typeValue === "tribal") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-orange-500 hover:!text-black hover:!border-orange-500`;
    if (typeValue === "racial") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-cyan-500 hover:!text-black hover:!border-cyan-500`;
    if (typeValue === "governmental") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-blue-500 hover:!text-black hover:!border-blue-500`;
    if (typeValue === "revolutionary") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-rose-500 hover:!text-black hover:!border-rose-500`;
    if (typeValue === "academic") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-teal-500 hover:!text-black hover:!border-teal-500`;
    if (typeValue === "royalty") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-amber-500 hover:!text-black hover:!border-amber-500`;
    if (typeValue === "mercenary") return `${typeData.bgColorClass} ${typeData.colorClass} hover:!bg-slate-500 hover:!text-black hover:!border-slate-500`;

    return "";
  };

  const handleStatusClick = (statusValue: string) => {
    onStatusFilterChange(statusValue);
  };

  const handleTypeClick = (typeValue: string) => {
    onTypeFilterChange(typeValue);
  };

  return (
    <div className="flex-1 h-full flex flex-col space-y-6">
      {/* Header with status and type counters */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("factions:page.title")}</h2>
          <p className="text-muted-foreground">
            {t("factions:page.description")}
          </p>

          {/* Total Badge */}
          <div className="flex items-center gap-4 mt-2">
            <Badge
              className={`cursor-pointer border transition-colors ${
                selectedStatuses.length === 0 && selectedTypes.length === 0
                  ? "!bg-primary !text-white !border-primary"
                  : "bg-background text-foreground border-border hover:!bg-primary hover:!text-white hover:!border-primary"
              }`}
              onClick={onClearFilters}
            >
              {totalFactions} {t("factions:page.total_badge")}
            </Badge>
          </div>

          {/* Status Counters */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {FACTION_STATUS_CONSTANT.map((status) => {
              const count = statusStats[status.value as FactionStatus] || 0;

              const StatusIcon = status.icon;

              return (
                <Badge
                  key={status.value}
                  className={`cursor-pointer border transition-colors ${getStatusBadgeClass(status.value)}`}
                  onClick={() => handleStatusClick(status.value)}
                >
                  <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                  {count} {t(`create-faction:status.${status.value}`)}
                </Badge>
              );
            })}
          </div>

          {/* Type Counters */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {FACTION_TYPES_CONSTANT.map((type) => {
              const count = typeStats[type.value as FactionType] || 0;

              const TypeIcon = type.icon;

              return (
                <Badge
                  key={type.value}
                  className={`cursor-pointer border transition-colors ${getTypeBadgeClass(type.value)}`}
                  onClick={() => handleTypeClick(type.value)}
                >
                  <TypeIcon className="w-3.5 h-3.5 mr-1.5" />
                  {count} {t(`create-faction:faction_type.${type.value}`)}
                </Badge>
              );
            })}
          </div>
        </div>

        <Button
          variant="magical"
          size="lg"
          onClick={() => onShowCreateModalChange(true)}
          className="animate-glow"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t("factions:page.new_faction")}
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t("factions:page.search_placeholder")}
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Empty state when no filtered results */}
      {filteredFactions.length === 0 && (
        <EmptyState
          icon={
            searchTerm !== ""
              ? SearchX
              : selectedStatuses.length > 0 || selectedTypes.length > 0
                ? Filter
                : Users
          }
          title={t("factions:empty_state.no_factions_found")}
          description={t("factions:empty_state.no_factions_found_description")}
        />
      )}

      {/* Factions Grid */}
      {filteredFactions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 pb-6">
          {filteredFactions.map((faction) => (
            <FactionCard
              key={faction.id}
              faction={faction}
              onClick={onNavigateToFaction}
            />
          ))}
        </div>
      )}

      <CreateFactionModal
        open={showCreateModal}
        onClose={() => onShowCreateModalChange(false)}
        onConfirm={onCreateFaction}
      />
    </div>
  );
};

export const FactionsView = memo(FactionsViewComponent);
