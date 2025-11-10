import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IRegionWithChildren } from "../types/region-types";
import { RegionHierarchyTree } from "./region-hierarchy-tree";
import { updateParentRegion, deleteRegion as deleteRegionFromDB } from "@/lib/db/regions.service";
import { useToast } from "@/hooks/use-toast";

interface HierarchyManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regions: IRegionWithChildren[];
  onRefresh: () => void;
}

export function HierarchyManagerModal({
  open,
  onOpenChange,
  regions,
  onRefresh,
}: HierarchyManagerModalProps) {
  const { t } = useTranslation("world");
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [regionToDelete, setRegionToDelete] = useState<IRegionWithChildren | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Separate regions into those with parents and without (neutral)
  const neutralRegions = regions.filter((r) => r.parentId === null);
  const allRegions = regions; // For hierarchy display

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Extract IDs
    const draggedRegionId = active.id.toString().replace("region-", "");
    const targetData = over.data.current;

    let newParentId: string | null = null;

    // Determine the new parent based on where it was dropped
    if (targetData?.type === "region-drop") {
      newParentId = targetData.regionId;
    } else if (targetData?.type === "neutral-drop") {
      newParentId = null;
    }

    // Don't do anything if dropped on itself or no change
    const draggedRegion = findRegionById(allRegions, draggedRegionId);
    if (!draggedRegion || draggedRegion.parentId === newParentId) {
      return;
    }

    // Update in database
    try {
      await updateParentRegion(draggedRegionId, newParentId);
      toast({
        title: "Success",
        description: "Region hierarchy updated successfully",
      });
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update hierarchy",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (region: IRegionWithChildren) => {
    setRegionToDelete(region);
    setConfirmName("");
  };

  const confirmDelete = async () => {
    if (!regionToDelete || confirmName !== regionToDelete.name) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteRegionFromDB(regionToDelete.id);
      toast({
        title: "Success",
        description: "Region deleted successfully",
      });
      setRegionToDelete(null);
      setConfirmName("");
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete region",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t("hierarchy_manager.title")}</DialogTitle>
            <DialogDescription>
              {t("hierarchy_manager.description")}
            </DialogDescription>
          </DialogHeader>

          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Main Hierarchy */}
                <div className="space-y-3">
                  <RegionHierarchyTree
                    regions={allRegions}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            </ScrollArea>

            <DragOverlay>
              {activeId ? (
                <div className="bg-card border border-primary rounded-md p-2 shadow-lg">
                  Dragging region...
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => onOpenChange(false)}>
              {t("hierarchy_manager.close_button")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={regionToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRegionToDelete(null);
            setConfirmName("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("delete_confirmation.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete_confirmation.message")}
              <br />
              <br />
              <strong>{t("delete_confirmation.warning")}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="confirm-name">
              {t("delete_confirmation.type_to_confirm")}
            </Label>
            <Input
              id="confirm-name"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={regionToDelete?.name || ""}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("delete_confirmation.cancel_button")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={
                !regionToDelete ||
                confirmName !== regionToDelete.name ||
                isDeleting
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting
                ? t("delete_confirmation.deleting")
                : t("delete_confirmation.delete_button")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Helper function to find a region by ID in the tree
function findRegionById(
  regions: IRegionWithChildren[],
  id: string
): IRegionWithChildren | null {
  for (const region of regions) {
    if (region.id === id) return region;
    const found = findRegionById(region.children, id);
    if (found) return found;
  }
  return null;
}
