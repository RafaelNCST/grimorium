import { useEffect, useState } from "react";

import { Check, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getCharactersByBookId } from "@/lib/db/characters.service";
import {
  createPowerCharacterLink,
  deletePowerCharacterLink,
  getPowerLinksByPageId,
  getPowerLinksBySectionId,
  getLinkedCharacterIdsInPageHierarchy,
  getLinkedCharacterIdsInSectionHierarchy,
} from "@/lib/db/power-system.service";
import { type ICharacter } from "@/types/character-types";

interface ManageLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  pageId?: string;
  sectionId?: string;
  onLinksChanged?: () => void;
}

export function ManageLinksModal({
  isOpen,
  onClose,
  bookId,
  pageId,
  sectionId,
  onLinksChanged,
}: ManageLinksModalProps) {
  const { t } = useTranslation("power-system");
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [linkedCharacterIds, setLinkedCharacterIds] = useState<string[]>([]);
  const [hierarchyLinkedCharacterIds, setHierarchyLinkedCharacterIds] =
    useState<string[]>([]);
  const [_isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load characters
      const chars = await getCharactersByBookId(bookId);
      setCharacters(chars);

      // Load existing links for this specific page/section
      const links = pageId
        ? await getPowerLinksByPageId(pageId)
        : sectionId
          ? await getPowerLinksBySectionId(sectionId)
          : [];

      setLinkedCharacterIds(links.map((link) => link.characterId));

      // Load all character IDs in the hierarchy to prevent duplicates
      let hierarchyIds: string[] = [];
      if (pageId) {
        hierarchyIds = await getLinkedCharacterIdsInPageHierarchy(pageId);
      } else if (sectionId) {
        hierarchyIds = await getLinkedCharacterIdsInSectionHierarchy(sectionId);
      }

      setHierarchyLinkedCharacterIds(hierarchyIds);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, bookId, pageId, sectionId]);

  const handleToggleLink = async (characterId: string) => {
    if (!pageId && !sectionId) return;

    setIsProcessing(characterId);

    try {
      const isLinked = linkedCharacterIds.includes(characterId);

      if (isLinked) {
        // Find and delete the link
        const links = pageId
          ? await getPowerLinksByPageId(pageId)
          : sectionId
            ? await getPowerLinksBySectionId(sectionId)
            : [];

        const linkToDelete = links.find(
          (link) => link.characterId === characterId
        );

        if (linkToDelete) {
          await deletePowerCharacterLink(linkToDelete.id);
          setLinkedCharacterIds((prev) =>
            prev.filter((id) => id !== characterId)
          );

          // Recalculate hierarchy linked character IDs after deletion
          let hierarchyIds: string[] = [];
          if (pageId) {
            hierarchyIds = await getLinkedCharacterIdsInPageHierarchy(pageId);
          } else if (sectionId) {
            hierarchyIds =
              await getLinkedCharacterIdsInSectionHierarchy(sectionId);
          }
          setHierarchyLinkedCharacterIds(hierarchyIds);
        }
      } else {
        // Create new link
        await createPowerCharacterLink(characterId, pageId, sectionId);
        setLinkedCharacterIds((prev) => [...prev, characterId]);

        // Recalculate hierarchy linked character IDs after creation
        let hierarchyIds: string[] = [];
        if (pageId) {
          hierarchyIds = await getLinkedCharacterIdsInPageHierarchy(pageId);
        } else if (sectionId) {
          hierarchyIds =
            await getLinkedCharacterIdsInSectionHierarchy(sectionId);
        }
        setHierarchyLinkedCharacterIds(hierarchyIds);
      }

      if (onLinksChanged) {
        onLinksChanged();
      }
    } catch (error) {
      console.error("Error toggling link:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const linkedCharacters = characters.filter((char) =>
    linkedCharacterIds.includes(char.id)
  );

  const availableCharacters = characters.filter(
    (char) => !hierarchyLinkedCharacterIds.includes(char.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {pageId ? t("links.manage_page") : t("links.manage_section")}
          </DialogTitle>
          <DialogDescription className="whitespace-normal">
            {pageId
              ? t("links.page_description")
              : t("links.section_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Linked Characters Section */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">
              {t("links.linked_characters")}
            </h3>

            {linkedCharacters.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {t("links.no_linked")}
              </p>
            ) : (
              <ScrollArea className="h-[200px] border rounded-md p-2">
                <div className="space-y-2">
                  {linkedCharacters.map((character) => (
                    <div
                      key={character.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {character.image ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={character.image} />
                        </Avatar>
                      ) : (
                        <FormImageDisplay
                          icon={User}
                          height="h-10"
                          width="w-10"
                          shape="circle"
                          iconSize="w-5 h-5"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {character.name}
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600 border-green-500/20"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {t("links.linked")}
                      </Badge>

                      <Button
                        size="sm"
                        variant="ghost-destructive"
                        onClick={() => handleToggleLink(character.id)}
                        disabled={isProcessing === character.id}
                      >
                        {t("links.remove")}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <Separator />

          {/* Available Characters Section */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary">
              {t("links.available_characters")}
            </h3>

            {availableCharacters.length === 0 ? (
              <div className="py-4 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t("links.no_characters")}
                </p>
                {characters.length > 0 &&
                  hierarchyLinkedCharacterIds.length > 0 && (
                    <p className="text-xs text-muted-foreground/80">
                      {t("links.already_linked_in_hierarchy")}
                    </p>
                  )}
              </div>
            ) : (
              <ScrollArea className="h-[200px] border rounded-md p-2">
                <div className="space-y-2">
                  {availableCharacters.map((character) => (
                    <div
                      key={character.id}
                      onClick={() => handleToggleLink(character.id)}
                      className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-black/10 dark:hover:bg-black/20 transition-colors duration-200"
                    >
                      {character.image ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={character.image} />
                        </Avatar>
                      ) : (
                        <FormImageDisplay
                          icon={User}
                          height="h-10"
                          width="w-10"
                          shape="circle"
                          iconSize="w-5 h-5"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {character.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button variant="secondary" onClick={onClose}>
              {t("actions.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
