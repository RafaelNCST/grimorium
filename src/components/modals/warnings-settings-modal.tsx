/**
 * Modal de Gerenciamento de Avisos
 *
 * Permite configurar quais tipos de avisos são exibidos
 */

import { useState, useEffect } from "react";

import { Bell, BellOff, Clock, Type, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { WarningsSettings } from "@/types/warnings-settings";

interface WarningsSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: WarningsSettings;
  onSave: (settings: WarningsSettings) => void;
}

export function WarningsSettingsModal({
  open,
  onOpenChange,
  settings,
  onSave,
}: WarningsSettingsModalProps) {
  const { t } = useTranslation("warnings-settings");
  const [localSettings, setLocalSettings] =
    useState<WarningsSettings>(settings);

  // Reseta o estado local sempre que o modal abrir
  useEffect(() => {
    if (open) {
      setLocalSettings(settings);
    }
  }, [open, settings]);

  const handleSave = () => {
    onSave(localSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[600px] min-w-[600px] max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            {t("modal.title")}
          </DialogTitle>
          <DialogDescription>
            {t("modal.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Desligar tudo */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold flex items-center gap-2">
                {localSettings.enabled ? (
                  <Bell className="w-4 h-4" />
                ) : (
                  <BellOff className="w-4 h-4" />
                )}
                {t("warnings_system.label")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("warnings_system.description")}
              </p>
            </div>
            <Switch
              checked={localSettings.enabled}
              onCheckedChange={(enabled) =>
                setLocalSettings({ ...localSettings, enabled })
              }
            />
          </div>

          <Separator />

          {/* Configurações individuais - apenas se avisos estiverem ligados */}
          {localSettings.enabled && (
            <>
              {/* Notificações (toasts) */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">
                    {t("notifications.label")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("notifications.description")}
                  </p>
                </div>
                <Switch
                  checked={localSettings.notificationsEnabled}
                  onCheckedChange={(notificationsEnabled) =>
                    setLocalSettings({ ...localSettings, notificationsEnabled })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  {t("types.label")}
                </Label>

                {/* Avisos de Tempo */}
                <div className="flex items-center justify-between pl-4">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t("time_warnings.label")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("time_warnings.description")}
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.timeWarningsEnabled}
                    onCheckedChange={(timeWarningsEnabled) =>
                      setLocalSettings({
                        ...localSettings,
                        timeWarningsEnabled,
                      })
                    }
                  />
                </div>

                {/* Avisos de Tipografia */}
                <div className="flex items-center justify-between pl-4">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      {t("typography_warnings.label")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("typography_warnings.description")}
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.typographyWarningsEnabled}
                    onCheckedChange={(typographyWarningsEnabled) =>
                      setLocalSettings({
                        ...localSettings,
                        typographyWarningsEnabled,
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t("actions.cancel")}
          </Button>
          <Button variant="magical" onClick={handleSave}>
            {t("actions.save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
