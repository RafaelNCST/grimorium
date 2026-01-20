/**
 * Account Section
 *
 * Gerenciamento de perfil e licença
 */

import { useState } from "react";

import { Sword, Wheat, Calendar, Key } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLicense } from "@/hooks/useLicense";
import { ActivateLicenseModal } from "@/components/modals/activate-license-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/language-store";
import { useUserAccountStore } from "@/stores/user-account-store";

export function AccountSection() {
  const { t } = useTranslation("advanced-settings");
  const { user, updateDisplayName } = useUserAccountStore();
  const { language, setLanguage } = useLanguageStore();
  const { status, loading } = useLicense();

  const [displayName, setDisplayName] = useState(user.displayName);
  const [showActivateModal, setShowActivateModal] = useState(false);

  const hasNameChanged =
    displayName !== user.displayName && displayName.trim() !== "";

  const isLicensed = status?.is_licensed ?? false;
  const daysRemaining = status?.days_remaining ?? 0;

  const handleSaveName = () => {
    if (displayName.trim() && hasNameChanged) {
      updateDisplayName(displayName.trim());
    }
  };

  return (
    <div className="space-y-8 w-full max-w-full">
      {/* Profile Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("account.profile.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("account.profile.description")}
          </p>
        </div>

        <div className="space-y-4">
          {/* Display Name */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t("account.profile.display_name")}
            </Label>
            <div className="flex gap-2">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1"
                maxLength={50}
                placeholder={t("account.profile.display_name_placeholder")}
              />
              <Button
                variant="magical"
                size="sm"
                onClick={handleSaveName}
                disabled={!hasNameChanged}
              >
                {t("user_profile.save")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {t("account.profile.display_name_help")}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* License Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("account.license.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("account.license.description")}
          </p>
        </div>

        <div
          className={cn(
            "rounded-lg p-4 relative overflow-hidden",
            isLicensed
              ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 dark:from-yellow-900/30 dark:to-yellow-950/40"
              : "bg-gradient-to-br from-green-500/20 to-green-600/20 dark:from-green-900/30 dark:to-green-950/40"
          )}
        >
          {/* Icon Badge */}
          <div
            className={cn(
              "absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20",
              isLicensed ? "bg-yellow-500" : "bg-green-500"
            )}
          />

          <div className="flex items-start justify-between relative">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    isLicensed
                      ? "bg-yellow-500/20 dark:bg-yellow-500/30"
                      : "bg-green-500/20 dark:bg-green-500/30"
                  )}
                >
                  {isLicensed ? (
                    <Sword className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  ) : (
                    <Wheat className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">
                    {t("account.license.currently_you_are")}
                  </span>
                  <h4
                    className={cn(
                      "font-bold text-lg leading-none",
                      isLicensed
                        ? "text-yellow-700 dark:text-yellow-300"
                        : "text-green-700 dark:text-green-300"
                    )}
                  >
                    {isLicensed
                      ? t("account.license.tier_knight")
                      : t("account.license.tier_peasant")}
                  </h4>
                </div>
              </div>

              {!isLicensed && !loading && (
                <div className="flex items-center gap-2 text-sm pl-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground/80 font-medium">
                    {t("account.license.days_remaining", { days: daysRemaining })}
                  </span>
                </div>
              )}

              {isLicensed && (
                <p className="text-sm text-foreground/70 pl-1">
                  {t("account.license.licensed_description")}
                </p>
              )}
            </div>

            {!isLicensed && (
              <div className="ml-4 shrink-0 flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground italic">
                  {t("account.license.become_knight")}
                </span>
                <Button
                  variant="magical"
                  size="sm"
                  onClick={() => setShowActivateModal(true)}
                >
                  <Key className="w-4 h-4 mr-2" />
                  {t("account.license.activate_button")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Language */}
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("account.language.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("account.language.description")}
          </p>
        </div>

        <div className="max-w-xs">
          <Label className="text-sm font-medium mb-2 block">
            {t("account.language.select_label")}
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="bottom">
              <SelectItem value="pt">🇧🇷 Português</SelectItem>
              <SelectItem value="en">🇺🇸 English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activate License Modal */}
      <ActivateLicenseModal
        open={showActivateModal}
        onClose={() => setShowActivateModal(false)}
      />
    </div>
  );
}
