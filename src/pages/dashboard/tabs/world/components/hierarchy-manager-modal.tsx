import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IRegionWithChildren } from "../types/region-types";
import { RegionHierarchyTree } from "./region-hierarchy-tree";
import {
  deleteRegion as deleteRegionFromDB,
  moveRegion,
  reorderRegions,
} from "@/lib/db/regions.service";
import { useToast } from "@/hooks/use-toast";
import { DeleteEntityModal, type IEntityVersion } from "@/components/modals/delete-entity-modal";

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
  const [regionToDelete, setRegionToDelete] = useState<IRegionWithChildren | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = (region: IRegionWithChildren) => {
    setRegionToDelete(region);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setRegionToDelete(null);
  };

  const confirmDelete = async () => {
    if (!regionToDelete) {
      return;
    }

    try {
      await deleteRegionFromDB(regionToDelete.id);
      toast({
        title: t("delete_confirmation.success_title"),
        description: t("delete_confirmation.success_message"),
      });
      handleDeleteModalClose();
      onRefresh();
    } catch (error) {
      toast({
        title: t("delete_confirmation.error_title"),
        description: t("delete_confirmation.error_message"),
        variant: "destructive",
      });
    }
  };

  const handleMoveRegion = async (regionId: string, newParentId: string | null) => {
    try {
      await moveRegion(regionId, newParentId);
      // Don't call onRefresh() - rely on optimistic updates for smooth UX
    } catch (error: any) {
      toast({
        title: t("hierarchy_manager.move_error_title"),
        description: error.message || t("hierarchy_manager.move_error_message"),
        variant: "destructive",
      });
      // Only refresh on error to restore correct state
      onRefresh();
    }
  };

  const handleReorderRegions = async (regionIds: string[], parentId: string | null) => {
    try {
      await reorderRegions(regionIds, parentId);
    } catch (error: any) {
      toast({
        title: t("hierarchy_manager.reorder_error_title"),
        description: error.message || t("hierarchy_manager.reorder_error_message"),
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t("hierarchy_manager.title")}</DialogTitle>
            <DialogDescription>
              {t("hierarchy_manager.description")}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4 overflow-auto">
            <div className="space-y-6">
              <div className="space-y-3">
                <RegionHierarchyTree
                  regions={regions}
                  onDelete={handleDelete}
                  onMoveRegion={handleMoveRegion}
                  onReorderRegions={handleReorderRegions}
                />
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {t("hierarchy_manager.close_button")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - Rendered independently to avoid z-index/size conflicts */}
      {showDeleteModal && (
        <DeleteEntityModal<IEntityVersion>
          isOpen={showDeleteModal}
          onClose={handleDeleteModalClose}
          entityName={regionToDelete?.name || ""}
          entityType="region"
          currentVersion={{ isMain: true }}
          totalVersions={1}
          onConfirmDelete={confirmDelete}
          i18nNamespace="world"
        />
      )}
    </>
  );
}
