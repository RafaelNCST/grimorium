import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { type IRegionVersion } from "@/lib/db/regions.service";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  regionName: string;
  currentVersion: IRegionVersion | null;
  versionName?: string;
  totalVersions: number;
  onConfirmDelete: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  regionName,
  currentVersion,
  versionName,
  totalVersions,
  onConfirmDelete,
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation("region-detail");
  const [confirmChecked, setConfirmChecked] = useState(false);

  const isMainVersion = currentVersion?.isMain ?? false;
  const isDeletingRegion = isMainVersion;

  const handleClose = () => {
    setConfirmChecked(false);
    onClose();
  };

  const handleConfirm = () => {
    onConfirmDelete();
    setConfirmChecked(false);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl">
              {isDeletingRegion
                ? t("delete.region.title")
                : t("delete.version.title")}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-4">
            {isDeletingRegion ? (
              <>
                <p className="font-semibold text-base text-foreground">
                  {t("delete.region.step1.description", { name: regionName })}
                </p>
                <div className="bg-destructive/5 border border-destructive/20 rounded-md p-3">
                  <p className="text-sm text-destructive font-medium">
                    {t("delete.region.step1.warning")}
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold text-base text-foreground">
                  {t("delete.version.description", {
                    name: versionName,
                    regionName: regionName,
                  })}
                </p>
                <div className="bg-muted/50 border border-border rounded-md p-3">
                  <p className="text-sm text-muted-foreground">
                    {t("delete.version.info", {
                      remaining: totalVersions - 1,
                    })}
                  </p>
                </div>
              </>
            )}

            <div className="flex items-start gap-3 pt-3">
              <Checkbox
                id="confirm-delete"
                checked={confirmChecked}
                onCheckedChange={(checked) =>
                  setConfirmChecked(checked as boolean)
                }
                className="mt-1"
              />
              <label
                htmlFor="confirm-delete"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {isDeletingRegion
                  ? t("delete.region.step2.confirm")
                  : t("delete.version.confirm")}
              </label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            {t("delete.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!confirmChecked}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeletingRegion
              ? t("delete.region.step2.confirm_button")
              : t("delete.version.confirm_button")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
