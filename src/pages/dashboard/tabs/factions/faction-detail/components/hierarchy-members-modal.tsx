import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HierarchyMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  titleName: string;
  selectedCharacterIds: string[];
  availableCharacters: Array<{ id: string; name: string; image?: string }>;
  onSave: (titleId: string, characterIds: string[]) => void;
}

export function HierarchyMembersModal({
  isOpen,
  onClose,
  titleId,
  titleName,
  selectedCharacterIds,
  availableCharacters,
  onSave,
}: HierarchyMembersModalProps) {
  const { t } = useTranslation("faction-detail");
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelected([...selectedCharacterIds]);
    setSearchQuery("");
  }, [selectedCharacterIds, isOpen]);

  const handleToggle = (characterId: string) => {
    setSelected((prev) =>
      prev.includes(characterId)
        ? prev.filter((id) => id !== characterId)
        : [...prev, characterId]
    );
  };

  const handleSelectAll = () => {
    const filteredIds = filteredCharacters.map((c) => c.id);
    setSelected(filteredIds);
  };

  const handleDeselectAll = () => {
    setSelected([]);
  };

  const handleSave = () => {
    onSave(titleId, selected);
  };

  const filteredCharacters = availableCharacters.filter((character) =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t("hierarchy.add_characters")}</DialogTitle>
          <DialogDescription>
            {t("hierarchy.select_characters")} - {titleName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="space-y-2">
            <Input
              placeholder={t("hierarchy.select_characters")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Select/Deselect All */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={filteredCharacters.length === 0}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              disabled={selected.length === 0}
            >
              Deselect All
            </Button>
            <div className="ml-auto text-sm text-muted-foreground">
              {selected.length} selected
            </div>
          </div>

          {/* Character List */}
          <ScrollArea className="h-[400px] border rounded-md p-4">
            {filteredCharacters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t("hierarchy.no_characters")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCharacters.map((character) => {
                  const isSelected = selected.includes(character.id);
                  return (
                    <div
                      key={character.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-transparent"
                      }`}
                      onClick={() => handleToggle(character.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(character.id)}
                      />
                      <Avatar className="w-10 h-10 rounded-lg">
                        <AvatarImage
                          src={character.image}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-sm rounded-lg">
                          {character.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{character.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("hierarchy.cancel")}
          </Button>
          <Button
            variant="magical"
            className="animate-glow"
            onClick={handleSave}
          >
            {t("hierarchy.add_selected")} ({selected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
