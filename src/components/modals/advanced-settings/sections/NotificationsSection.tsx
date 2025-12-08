/**
 * Notifications Section
 *
 * Configurações de notificações e sons
 */

import { Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppSettingsStore } from "@/stores/app-settings-store";

export function NotificationsSection() {
  const { t } = useTranslation("advanced-settings");
  const { notifications, setSoundEnabled } = useAppSettingsStore();

  return (
    <div className="space-y-6 w-full max-w-full">
      <div>
        <h3 className="text-base font-semibold mb-1">
          {t("notifications.sound.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("notifications.sound.description")}
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-start gap-3 flex-1">
          {notifications.soundEnabled ? (
            <Volume2 className="w-5 h-5 text-muted-foreground mt-0.5" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground mt-0.5" />
          )}
          <div className="space-y-0.5">
            <Label className="text-base font-semibold">
              {t("notifications.sound.label")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("notifications.sound.help")}
            </p>
          </div>
        </div>
        <Switch
          checked={notifications.soundEnabled}
          onCheckedChange={setSoundEnabled}
        />
      </div>

      <div className="rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          💡 {t("notifications.sound.note")}
        </p>
      </div>
    </div>
  );
}
