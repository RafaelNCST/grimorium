import { useState } from "react";

import { X, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntitySearchBar } from "@/components/entity-list/EntitySearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IFaction {
  id: string;
  name: string;
  image?: string;
}

interface PropsFactionNavigationSidebar {
  isOpen: boolean;
  onClose: () => void;
  factions: IFaction[];
  currentFactionId?: string;
  onFactionSelect: (factionId: string) => void;
}

export function FactionNavigationSidebar({
  isOpen,
  onClose,
  factions,
  currentFactionId,
  onFactionSelect,
}: PropsFactionNavigationSidebar) {
  const { t } = useTranslation(["empty-states", "factions", "common"]);
  const [searchTerm, setSearchTerm] = useState("");

  // Separate current faction from others
  const currentFaction = factions.find(
    (faction) => faction.id === currentFactionId
  );
  const otherFactions = factions.filter(
    (faction) => faction.id !== currentFactionId
  );

  const filteredOtherFactions = otherFactions.filter((faction) =>
    faction.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed left-0 top-24 bottom-0 w-80 bg-background border-r border-border shadow-lg transition-all duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">{t("factions:sidebar.title")}</h2>
          <span className="text-xs text-muted-foreground">
            ({factions.length})
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
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t("factions:page.search_placeholder")}
          maxWidth="w-full"
        />
      </div>

      {/* Current Faction */}
      {currentFaction && (
        <div className="p-2 border-b border-border bg-card">
          <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30 cursor-default">
            <Avatar className="w-10 h-10 flex-shrink-0 rounded-lg">
              <AvatarImage src={currentFaction.image} />
              <AvatarFallback className="text-sm rounded-lg">
                <Shield className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {currentFaction.name}
              </p>
              <p className="text-xs text-primary font-medium">
                {t("common:sidebar.viewing_currently")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Faction List */}
      <ScrollArea className="flex-1 h-[calc(100vh-96px-220px)]">
        <div className="p-2">
          {filteredOtherFactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{t("empty-states:entity_search.no_faction")}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredOtherFactions.map((faction) => (
                <button
                  key={faction.id}
                  onClick={() => {
                    onFactionSelect(faction.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50"
                >
                  <Avatar className="w-10 h-10 flex-shrink-0 rounded-lg">
                    <AvatarImage src={faction.image} />
                    <AvatarFallback className="text-sm rounded-lg">
                      <Shield className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {faction.name}
                    </p>
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
