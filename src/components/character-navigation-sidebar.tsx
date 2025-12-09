import { useState } from "react";

import { X, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntitySearchBar } from "@/components/entity-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ICharacter {
  id: string;
  name: string;
  image?: string;
}

interface PropsCharacterNavigationSidebar {
  isOpen: boolean;
  onClose: () => void;
  characters: ICharacter[];
  currentCharacterId?: string;
  onCharacterSelect: (characterId: string) => void;
}

export function CharacterNavigationSidebar({
  isOpen,
  onClose,
  characters,
  currentCharacterId,
  onCharacterSelect,
}: PropsCharacterNavigationSidebar) {
  const { t } = useTranslation(["empty-states", "characters", "common"]);
  const [searchTerm, setSearchTerm] = useState("");

  // Separate current character from others
  const currentCharacter = characters.find(
    (char) => char.id === currentCharacterId
  );
  const otherCharacters = characters.filter(
    (char) => char.id !== currentCharacterId
  );

  const filteredOtherCharacters = otherCharacters.filter((char) =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Users className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">{t("characters:sidebar.title")}</h2>
          <span className="text-xs text-muted-foreground">
            ({characters.length})
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
          placeholder={t("characters:page.search_placeholder")}
          maxWidth="w-full"
        />
      </div>

      {/* Current Character */}
      {currentCharacter && (
        <div className="p-2 border-b border-border bg-card">
          <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30 cursor-default">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={currentCharacter.image} />
              <AvatarFallback className="text-sm">
                {currentCharacter.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {currentCharacter.name}
              </p>
              <p className="text-xs text-primary font-medium">
                {t("common:sidebar.viewing_currently")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Character List */}
      <ScrollArea className="flex-1 h-[calc(100vh-104px-220px)]">
        <div className="p-2">
          {filteredOtherCharacters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{t("empty-states:entity_search.no_character")}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredOtherCharacters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => {
                    onCharacterSelect(character.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50"
                >
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={character.image} />
                    <AvatarFallback className="text-sm">
                      {character.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {character.name}
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
