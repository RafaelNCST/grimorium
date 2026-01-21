/**
 * Advanced Settings Modal
 *
 * Modal completo de configurações com sidebar estilo Discord
 */

import { useState } from "react";

import {
  User,
  LayoutDashboard,
  Shield,
  Info,
  Edit2,
  Sword,
  Wheat,
  Download,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUserAccountStore } from "@/stores/user-account-store";
import { useLicense } from "@/hooks/useLicense";

import { AboutSection } from "./sections/AboutSection";
import { AccountSection } from "./sections/AccountSection";
import { DashboardSection } from "./sections/DashboardSection";
import { DataSection } from "./sections/DataSection";
import { UpdatesSection } from "./sections/UpdatesSection";
import { SettingsSection, SettingsSectionConfig } from "./types";

interface AdvancedSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdvancedSettingsModal({
  open,
  onClose,
}: AdvancedSettingsModalProps) {
  const { t } = useTranslation("advanced-settings");
  const { user, updateDisplayName } = useUserAccountStore();
  const { status } = useLicense();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("account");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.displayName);

  const sections: SettingsSectionConfig[] = [
    { id: "account", labelKey: "sections.account", icon: User },
    { id: "dashboard", labelKey: "sections.dashboard", icon: LayoutDashboard },
    { id: "data", labelKey: "sections.data_privacy", icon: Shield },
    { id: "updates", labelKey: "sections.updates", icon: Download },
    { id: "about", labelKey: "sections.about", icon: Info },
  ];

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateDisplayName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleCancelEditName = () => {
    setTempName(user.displayName);
    setIsEditingName(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return <AccountSection />;
      case "dashboard":
        return <DashboardSection />;
      case "data":
        return <DataSection />;
      case "updates":
        return <UpdatesSection />;
      case "about":
        return <AboutSection />;
      default:
        return null;
    }
  };

  const isLicensed = status?.is_licensed ?? false;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden !w-[1200px] !max-w-[1200px] !min-w-[1200px] z-[175]"
        overlayClassName="z-[170]"
        showCloseButton={false}
        style={{
          width: "1200px",
          maxWidth: "1200px",
          minWidth: "1200px",
          height: "800px",
          maxHeight: "800px",
          minHeight: "800px",
        }}
      >
        <div className="flex h-full w-full overflow-hidden">
          {/* Sidebar */}
          <div className="w-[280px] flex-shrink-0 bg-muted/30 border-r flex flex-col overflow-hidden">
            {/* User Profile Header */}
            <div className="p-4 border-b bg-background/50 flex-shrink-0">
              <div className="flex items-start gap-3">
                {/* Tier Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center select-none",
                    isLicensed
                      ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 dark:from-yellow-900/30 dark:to-yellow-950/40"
                      : "bg-gradient-to-br from-green-500/20 to-green-600/20 dark:from-green-900/30 dark:to-green-950/40"
                  )}
                >
                  {isLicensed ? (
                    <Sword className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  ) : (
                    <Wheat className="w-6 h-6 text-green-600 dark:text-green-400" />
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  {isEditingName ? (
                    <div className="space-y-2">
                      <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="h-7 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveName();
                          if (e.key === "Escape") handleCancelEditName();
                        }}
                      />
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={handleCancelEditName}
                        >
                          {t("user_profile.cancel")}
                        </Button>
                        <Button
                          size="sm"
                          variant="magical"
                          className="h-6 px-2 text-xs"
                          onClick={handleSaveName}
                        >
                          {t("user_profile.save")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1 group">
                        <h3 className="font-semibold text-sm truncate">
                          {user.displayName}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setTempName(user.displayName);
                            setIsEditingName(true);
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isLicensed
                          ? t("account.license.tier_knight")
                          : t("account.license.tier_peasant")}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{t(section.labelKey)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer with Tier Badge */}
            <div className="p-3 border-t bg-background/50 flex-shrink-0">
              <div
                className={cn(
                  "px-4 py-3 rounded-lg text-center relative overflow-hidden transition-colors",
                  isLicensed
                    ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 dark:from-yellow-900/30 dark:to-yellow-950/40"
                    : "bg-gradient-to-br from-green-500/20 to-green-600/20 dark:from-green-900/30 dark:to-green-950/40"
                )}
              >
                {/* Small decorative circle */}
                <div
                  className={cn(
                    "absolute -right-3 -bottom-3 w-12 h-12 rounded-full opacity-20",
                    isLicensed ? "bg-yellow-500" : "bg-green-500"
                  )}
                />
                <div className="flex items-center justify-center gap-2 relative">
                  {isLicensed ? (
                    <Sword className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  ) : (
                    <Wheat className="w-4 h-4 text-green-600 dark:text-green-400" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-bold",
                      isLicensed
                        ? "text-yellow-700 dark:text-yellow-300"
                        : "text-green-700 dark:text-green-300"
                    )}
                  >
                    {isLicensed
                      ? t("account.license.tier_knight")
                      : t("account.license.tier_peasant")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {/* Header */}
            <div className="h-14 border-b px-6 flex items-center flex-shrink-0">
              <h2 className="text-lg font-semibold">
                {t(
                  sections.find((s) => s.id === activeSection)?.labelKey ||
                    `sections.${activeSection}`
                )}
              </h2>
            </div>

            {/* Section Content - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-6">{renderSection()}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
