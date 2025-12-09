import { useState } from "react";

import { X, Dna } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntitySearchBar } from "@/components/entity-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type IRace } from "@/pages/dashboard/tabs/races/types/race-types";

interface RaceNavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRaceId: string;
  allRaces: IRace[];
  onRaceSelect: (raceId: string) => void;
}

export function RaceNavigationSidebar({
  isOpen,
  onClose,
  currentRaceId,
  allRaces,
  onRaceSelect,
}: RaceNavigationSidebarProps) {
  const { t } = useTranslation(["race-detail", "races"]);
  const [searchQuery, setSearchQuery] = useState("");

  // Separate current race from others
  const currentRace = allRaces.find((race) => race.id === currentRaceId);
  const otherRaces = allRaces.filter((race) => race.id !== currentRaceId);

  const filteredOtherRaces = otherRaces.filter((race) =>
    race.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`fixed left-0 top-[104px] bottom-0 w-80 bg-background border-r border-border shadow-lg transition-all duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">{t("sidebar.title")}</h2>
          <span className="text-xs text-muted-foreground">
            ({allRaces.length})
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border bg-card">
        <EntitySearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("races:search_placeholder")}
          maxWidth="w-full"
        />
      </div>

      {/* Current Race */}
      {currentRace && (
        <div className="p-2 border-b border-border bg-card">
          <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30 cursor-default">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={currentRace.image} className="object-cover" />
              <AvatarFallback className="text-sm">
                {currentRace.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{currentRace.name}</p>
              <p className="text-xs text-primary font-medium">
                {t("sidebar.viewing_currently")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Race List */}
      <ScrollArea className="flex-1 h-[calc(100vh-104px-220px)]">
        <div className="p-2">
          {filteredOtherRaces.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Dna className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{t("sidebar.no_races_found")}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredOtherRaces.map((race) => (
                <button
                  key={race.id}
                  onClick={() => {
                    onRaceSelect(race.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50"
                >
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={race.image} className="object-cover" />
                    <AvatarFallback className="text-sm">
                      {race.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{race.name}</p>
                    {race.scientificName && (
                      <p className="text-xs text-muted-foreground italic truncate">
                        {race.scientificName}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
