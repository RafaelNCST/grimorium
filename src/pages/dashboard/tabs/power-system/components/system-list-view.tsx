import React from "react";
import { Pencil, Plus, Search, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type IPowerSystem } from "../types/power-system-types";

interface SystemListViewProps {
  systems: IPowerSystem[];
  isEditMode: boolean;
  onEditSystem: (system: IPowerSystem) => void;
  onCreateSystem: () => void;
}

export function SystemListView({
  systems,
  isEditMode,
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

  return (
    <div className="flex-1 h-full flex flex-col space-y-6 px-6 py-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("system_list.title")}</h2>
          <p className="text-muted-foreground">
            {t("system_list.description")}
          </p>
        </div>

        <Button
          variant="magical"
          size="lg"
          onClick={onCreateSystem}
          className="animate-glow"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t("system_list.new_system")}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t("system_list.search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Empty state when no filtered results */}
      {filteredSystems.length === 0 && (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              {t("system_list.no_results")}
            </p>
          </div>
        </div>
      )}

      {/* Systems Grid */}
      {filteredSystems.length > 0 && (
        <div className="grid grid-cols-1 gap-4 pb-6">
          {filteredSystems.map((system) => (
            <SystemCard
              key={system.id}
              system={system}
              isEditMode={isEditMode}
              onSelect={() => handleSystemSelect(system.id)}
              onEdit={() => onEditSystem(system)}
            />
          ))}
        </div>
      )}
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
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-primary/50 hover:shadow-[0_8px_32px_hsl(240_10%_3.9%_/_0.3),0_0_20px_hsl(263_70%_50%_/_0.3)] hover:bg-card/80"
      onClick={onSelect}
    >
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* System Icon */}
          <Avatar className="w-24 h-24 rounded-lg flex-shrink-0">
            <AvatarImage src={system.iconImage} className="object-cover" />
            <AvatarFallback className="text-xl rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10">
              <Zap className="w-12 h-12 text-purple-500/50" />
            </AvatarFallback>
          </Avatar>

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
                  className="flex-shrink-0 ml-4"
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
      </CardContent>
    </Card>
  );
}
