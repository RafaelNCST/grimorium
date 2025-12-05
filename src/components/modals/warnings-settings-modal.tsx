/**
 * Modal de Gerenciamento de Avisos
 *
 * Permite configurar quais tipos de avisos são exibidos
 */

import { useState, useEffect } from "react";

import { Bell, BellOff, Clock, Type, AlertCircle } from "lucide-react";

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
            Gerenciar Avisos
          </DialogTitle>
          <DialogDescription>
            Configure quais tipos de avisos você deseja receber durante a
            escrita.
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
                Sistema de Avisos
              </Label>
              <p className="text-sm text-muted-foreground">
                Desabilita completamente o sistema de avisos (menu lateral e
                toasts)
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
                    Notificações (Toasts)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Exibe notificações popup. Avisos ainda aparecem no menu
                    lateral
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
                  Tipos de Avisos
                </Label>

                {/* Avisos de Tempo */}
                <div className="flex items-center justify-between pl-4">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Avisos de Tempo
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Lembretes para fazer pausas durante a escrita
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
                      Avisos de Tipografia
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas sobre o tamanho do capítulo
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
            Cancelar
          </Button>
          <Button variant="magical" onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
