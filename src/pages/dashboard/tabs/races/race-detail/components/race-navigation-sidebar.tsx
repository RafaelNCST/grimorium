import { useState } from "react";

import { Search, X, List, FolderTree } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { type IRace, type IRaceGroup } from "@/pages/dashboard/tabs/races/types/race-types";

interface RaceNavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRaceId: string;
  allRaces: IRace[];
  raceGroups: IRaceGroup[];
  onRaceSelect: (raceId: string) => void;
}

export function RaceNavigationSidebar({
  isOpen,
  onClose,
  currentRaceId,
  allRaces,
  raceGroups,
  onRaceSelect,
}: RaceNavigationSidebarProps) {
  const { t } = useTranslation("race-detail");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "groups">("all");

  const filteredRaces = allRaces.filter((race) =>
    race.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRaceClick = (raceId: string) => {
    onRaceSelect(raceId);
    onClose();
  };

  const RaceCard = ({ race }: { race: IRace }) => {
    const isActive = race.id === currentRaceId;

    return (
      <div
        onClick={() => handleRaceClick(race.id)}
        className={`p-3 rounded-lg cursor-pointer transition-all ${
          isActive
            ? "bg-primary/10 border-2 border-primary shadow-md"
            : "hover:bg-muted/50 border-2 border-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            {race?.image && (
              <AvatarImage src={race.image} className="object-cover" />
            )}
            <AvatarFallback>
              {race.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p
              className={`font-semibold text-sm truncate ${
                isActive ? "text-primary" : ""
              }`}
            >
              {race.name}
            </p>
            {race.scientificName && (
              <p className="text-xs text-muted-foreground italic truncate">
                {race.scientificName}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed left-0 top-[32px] bottom-0 w-[400px] bg-background border-r border-border shadow-lg transition-all duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <h2 className="font-semibold text-lg">{t("sidebar.title")}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-border bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("sidebar.search_placeholder")}
            className="pl-10"
          />
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="p-4 border-b border-border bg-card">
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "all" | "groups")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              {t("sidebar.view_all")}
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              {t("sidebar.view_by_groups")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-32px-260px)]">
        <div className="p-4">
          {viewMode === "all" && (
            <div className="space-y-2">
              {filteredRaces.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t("sidebar.no_races_found")}</p>
                </div>
              ) : (
                filteredRaces.map((race) => (
                  <RaceCard key={race.id} race={race} />
                ))
              )}
            </div>
          )}

          {viewMode === "groups" && (
            <div className="space-y-2">
              {raceGroups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t("sidebar.no_groups_found")}</p>
                </div>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {raceGroups.map((group) => {
                    const groupRaces = allRaces.filter(
                      (race) =>
                        race.groupId === group.id &&
                        race.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    );

                    if (groupRaces.length === 0 && searchQuery) return null;

                    return (
                      <AccordionItem
                        key={group.id}
                        value={group.id}
                        className="border-b"
                      >
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-2">
                            <FolderTree className="w-4 h-4 text-primary" />
                            <span className="font-semibold">
                              {group.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({groupRaces.length})
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                          {groupRaces.map((race) => (
                            <RaceCard key={race.id} race={race} />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}

                  {/* Ungrouped races */}
                  {allRaces.filter(
                    (race) =>
                      !race.groupId &&
                      race.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  ).length > 0 && (
                    <AccordionItem value="ungrouped" className="border-b">
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                          <List className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-muted-foreground">
                            {t("sidebar.ungrouped")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (
                            {
                              allRaces.filter(
                                (race) =>
                                  !race.groupId &&
                                  race.name
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                              ).length
                            }
                            )
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pt-2">
                        {allRaces
                          .filter(
                            (race) =>
                              !race.groupId &&
                              race.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                          )
                          .map((race) => (
                            <RaceCard key={race.id} race={race} />
                          ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
