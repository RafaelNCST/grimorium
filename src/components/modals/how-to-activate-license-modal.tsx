/**
 * How to Activate License Modal
 *
 * Modal explicativo sobre como ativar a licença e se tornar Cavaleiro
 */

import { useState } from "react";

import { Sword, ShoppingCart, Mail, Key, ArrowRight, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { open as openUrl } from "@tauri-apps/plugin-shell";

import { ActivateLicenseModal } from "@/components/modals/activate-license-modal";
import { EULAModal } from "@/components/modals/eula-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HowToActivateLicenseModalProps {
  open: boolean;
  onClose: () => void;
}

export function HowToActivateLicenseModal({
  open,
  onClose,
}: HowToActivateLicenseModalProps) {
  const { t } = useTranslation("license");
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showEULA, setShowEULA] = useState(false);

  const handlePurchase = async () => {
    // TODO: Replace with actual purchase URL
    await openUrl("https://grimorium.com/purchase");
    onClose();
  };

  const handleActivate = () => {
    onClose();
    setShowActivateModal(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl z-[200]" overlayClassName="z-[195]">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center mb-4">
              <Sword className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-center text-2xl">
              {t("how_to_activate.title")}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t("how_to_activate.subtitle")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-base">
                  {t("how_to_activate.step1_title")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("how_to_activate.step1_description")}
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-muted-foreground mx-auto" />

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-base">
                  {t("how_to_activate.step2_title")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("how_to_activate.step2_description")}
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-muted-foreground mx-auto" />

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-base">
                  {t("how_to_activate.step3_title")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("how_to_activate.step3_description")}
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 border border-border mt-6">
              <p className="text-sm text-muted-foreground text-center">
                {t("how_to_activate.note")}
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowEULA(true)}
              className="sm:mr-auto"
            >
              <FileText className="w-4 h-4 mr-2" />
              {t("how_to_activate.view_terms")}
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="secondary" onClick={onClose}>
                {t("how_to_activate.close")}
              </Button>
              <Button variant="magical" onClick={handleActivate}>
                <Key className="w-4 h-4 mr-2" />
                {t("how_to_activate.activate_now")}
              </Button>
              <Button variant="magical" onClick={handlePurchase}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t("how_to_activate.purchase")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ActivateLicenseModal
        open={showActivateModal}
        onClose={() => setShowActivateModal(false)}
      />

      <EULAModal open={showEULA} onClose={() => setShowEULA(false)} />
    </>
  );
}
