import { useState } from "react";

import { X, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Character {
  id: string;
  name: string;
  image?: string;
}

interface PropsCharacterSelector {
  characters: Character[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function CharacterSelector({
  characters,
  selectedIds,
  onChange,
}: PropsCharacterSelector) {
  const { t } = useTranslation("create-plot-arc");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCharacters = characters.filter((c) =>
    selectedIds.includes(c.id)
  );
  const availableCharacters = characters.filter(
    (c) => !selectedIds.includes(c.id)
  );

  // Filter available characters by search query
  const filteredCharacters = availableCharacters.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (characterId: string) => {
    if (!selectedIds.includes(characterId)) {
      onChange([...selectedIds, characterId]);
      setSearchQuery(""); // Clear search after selection
    }
  };

  const handleRemove = (characterId: string) => {
    onChange(selectedIds.filter((id) => id !== characterId));
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {t("modal.important_characters")}
        </Label>
        {selectedCharacters.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {selectedCharacters.length}{" "}
            {selectedCharacters.length === 1
              ? t("modal.selected_singular")
              : t("modal.selected_plural")}
          </span>
        )}
      </div>

      {characters.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg bg-muted/20">
          <p className="text-sm">{t("modal.no_characters_available")}</p>
        </div>
      ) : (
        <>
          {availableCharacters.length > 0 && (
            <Select onValueChange={handleAdd}>
              <SelectTrigger>
                <SelectValue placeholder={t("modal.select_character")} />
              </SelectTrigger>
              <SelectContent>
                {/* Search input inside dropdown */}
                <div className="px-2 pb-2 pt-1 border-b sticky top-0 bg-popover z-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder={t("modal.search_character")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                {/* Characters list */}
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredCharacters.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Nenhum resultado encontrado
                    </div>
                  ) : (
                    filteredCharacters.map((character) => (
                      <SelectItem
                        key={character.id}
                        value={character.id}
                        className="py-3 cursor-pointer focus:!bg-primary/10 focus:!text-foreground hover:!bg-primary/10"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={character.image}
                              alt={character.name}
                            />
                            <AvatarFallback className="text-xs !text-foreground">
                              {getInitials(character.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{character.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
          )}

          {selectedCharacters.length > 0 && (
            <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-wrap gap-3">
                {selectedCharacters.map((character) => (
                  <div
                    key={character.id}
                    className="relative group flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={character.image} alt={character.name} />
                      <AvatarFallback className="text-xs">
                        {getInitials(character.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {character.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-1"
                      onClick={() => handleRemove(character.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedCharacters.length === 0 && characters.length > 0 && (
            <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
              <p className="text-sm">{t("modal.no_characters_selected")}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
