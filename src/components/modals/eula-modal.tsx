/**
 * EULA Modal (End User License Agreement)
 *
 * Termos de uso e licença do Grimorium
 */

import { Shield, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EULAModalProps {
  open: boolean;
  onClose: () => void;
}

export function EULAModal({ open, onClose }: EULAModalProps) {
  const { t } = useTranslation("eula");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-3xl z-[200] max-h-[90vh]"
        overlayClassName="z-[195]"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-3">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[50vh] w-full rounded-md border p-6">
          <div className="space-y-6 text-sm">
            {/* Introduction */}
            <div>
              <h3 className="font-semibold text-base mb-2">{t("intro.title")}</h3>
              <p className="text-muted-foreground">{t("intro.text")}</p>
            </div>

            {/* License Grant */}
            <div>
              <h3 className="font-semibold text-base mb-2">
                {t("license_grant.title")}
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>{t("license_grant.item1")}</li>
                <li>{t("license_grant.item2")}</li>
                <li>{t("license_grant.item3")}</li>
              </ul>
            </div>

            {/* Restrictions */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h3 className="font-semibold text-base mb-2 text-destructive">
                    {t("restrictions.title")}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>{t("restrictions.item1")}</li>
                    <li>{t("restrictions.item2")}</li>
                    <li>{t("restrictions.item3")}</li>
                    <li>{t("restrictions.item4")}</li>
                    <li>{t("restrictions.item5")}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Account Sharing */}
            <div>
              <h3 className="font-semibold text-base mb-2">
                {t("account_sharing.title")}
              </h3>
              <p className="text-muted-foreground mb-2">
                {t("account_sharing.text")}
              </p>
              <p className="text-muted-foreground font-medium">
                {t("account_sharing.warning")}
              </p>
            </div>

            {/* Trial Period */}
            <div>
              <h3 className="font-semibold text-base mb-2">
                {t("trial.title")}
              </h3>
              <p className="text-muted-foreground">{t("trial.text")}</p>
            </div>

            {/* Termination */}
            <div>
              <h3 className="font-semibold text-base mb-2">
                {t("termination.title")}
              </h3>
              <p className="text-muted-foreground">{t("termination.text")}</p>
            </div>

            {/* No Warranty */}
            <div>
              <h3 className="font-semibold text-base mb-2">
                {t("warranty.title")}
              </h3>
              <p className="text-muted-foreground">{t("warranty.text")}</p>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-base mb-2">
                {t("support.title")}
              </h3>
              <p className="text-muted-foreground">{t("support.text")}</p>
            </div>

            {/* Final */}
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground italic">
                {t("footer")}
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
