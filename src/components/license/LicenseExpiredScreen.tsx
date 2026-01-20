import { useState } from "react";

import { KeyRound, ShoppingCart, HelpCircle, Code } from "lucide-react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { open as openUrl } from "@tauri-apps/plugin-shell";

import { ActivateLicenseModal } from "@/components/modals/activate-license-modal";
import { CongratulationsKnightModal } from "@/components/modals/congratulations-knight-modal";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EXTERNAL_URLS } from "@/config/external-urls";

const IS_DEV = import.meta.env.DEV;

export function LicenseExpiredScreen() {
  const { t } = useTranslation("license");
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activatingDev, setActivatingDev] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const handlePurchase = async () => {
    await openUrl(EXTERNAL_URLS.purchase);
  };

  const handleSupport = async () => {
    await openUrl(EXTERNAL_URLS.support);
  };

  const handleDevLicense = async () => {
    try {
      setActivatingDev(true);
      await invoke("activate_dev_license");
      // Mostrar modal de congratulações
      setShowCongratulations(true);
    } catch (error) {
      console.error("Failed to activate dev license:", error);
      setActivatingDev(false);
    }
  };

  const handleCongratulationsClose = () => {
    setShowCongratulations(false);
    // Recarregar para atualizar o status
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("expired_title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("expired_description")}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={() => setShowActivateModal(true)}
            className="w-full"
            size="lg"
            variant="magical"
          >
            <KeyRound className="w-4 h-4 mr-2" />
            {t("activate_license_button")}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("or")}
              </span>
            </div>
          </div>

          <Button
            onClick={handlePurchase}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t("purchase_license_button")}
          </Button>

          <div className="pt-4 border-t border-border space-y-2">
            <Button
              variant="secondary"
              className="w-full"
              size="sm"
              onClick={handleSupport}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              {t("contact_support_button")}
            </Button>

            {IS_DEV && (
              <Button
                variant="destructive"
                className="w-full"
                size="sm"
                onClick={handleDevLicense}
                disabled={activatingDev}
              >
                <Code className="w-4 h-4 mr-2" />
                {activatingDev ? "Ativando..." : "DEV: Ativar Licença"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ActivateLicenseModal
        open={showActivateModal}
        onClose={() => setShowActivateModal(false)}
      />

      <CongratulationsKnightModal
        open={showCongratulations}
        onClose={handleCongratulationsClose}
      />
    </div>
  );
}
