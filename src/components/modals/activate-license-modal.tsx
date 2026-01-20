/**
 * Activate License Modal
 *
 * Modal para ativação de licença do Grimorium
 */

import { useState } from "react";

import { Key, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLicense } from "@/hooks/useLicense";
import { CongratulationsKnightModal } from "@/components/modals/congratulations-knight-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ActivateLicenseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ActivateLicenseModal({
  open,
  onClose,
  onSuccess,
}: ActivateLicenseModalProps) {
  const { t } = useTranslation("license");
  const { activateLicense } = useLicense();

  const [email, setEmail] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const handleActivate = async () => {
    if (!email.trim() || !licenseKey.trim()) {
      setError(t("error_empty_fields"));
      return;
    }

    setActivating(true);
    setError(null);

    const success = await activateLicense(email.trim(), licenseKey.trim());

    setActivating(false);

    if (success) {
      // Limpar campos
      setEmail("");
      setLicenseKey("");
      setError(null);

      // Chamar callback de sucesso se fornecido
      onSuccess?.();

      // Fechar modal de ativação
      onClose();

      // Mostrar modal de congratulações
      setShowCongratulations(true);
    } else {
      setError(t("error_invalid_key"));
    }
  };

  const handleClose = () => {
    if (!activating) {
      setEmail("");
      setLicenseKey("");
      setError(null);
      onClose();
    }
  };

  const handleCongratulationsClose = () => {
    setShowCongratulations(false);
    // Recarregar para atualizar o status
    window.location.reload();
  };

  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md z-[200]" overlayClassName="z-[195]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            {t("activate_title")}
          </DialogTitle>
          <DialogDescription>{t("activate_description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email_label")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={activating}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleActivate();
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="license-key">{t("key_label")}</Label>
            <Input
              id="license-key"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              disabled={activating}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleActivate();
              }}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={activating}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="magical"
            onClick={handleActivate}
            disabled={activating || !email.trim() || !licenseKey.trim()}
          >
            {activating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {activating ? t("activating") : t("activate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <CongratulationsKnightModal
      open={showCongratulations}
      onClose={handleCongratulationsClose}
    />
  </>
  );
}
