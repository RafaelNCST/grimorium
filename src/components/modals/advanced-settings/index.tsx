/**
 * Advanced Settings Modal
 *
 * Modal completo de configurações com sidebar estilo Discord
 */

import { useState } from "react";

import {
  User,
  LayoutDashboard,
  Bell,
  Shield,
  Info,
  Edit2,
  Crown,
  Wheat,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUserAccountStore } from "@/stores/user-account-store";

import { AboutSection } from "./sections/AboutSection";
import { AccountSection } from "./sections/AccountSection";
import { DashboardSection } from "./sections/DashboardSection";
import { DataSection } from "./sections/DataSection";
import { NotificationsSection } from "./sections/NotificationsSection";
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
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("account");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user?.displayName || "");

  const sections: SettingsSectionConfig[] = [
    { id: "account", labelKey: "sections.account", icon: User },
    { id: "dashboard", labelKey: "sections.dashboard", icon: LayoutDashboard },
    { id: "notifications", labelKey: "sections.notifications", icon: Bell },
    { id: "data", labelKey: "sections.data_privacy", icon: Shield },
    { id: "about", labelKey: "sections.about", icon: Info },
  ];

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateDisplayName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleCancelEditName = () => {
    setTempName(user?.displayName || "");
    setIsEditingName(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return <AccountSection />;
      case "dashboard":
        return <DashboardSection />;
      case "notifications":
        return <NotificationsSection />;
      case "data":
        return <DataSection />;
      case "about":
        return <AboutSection />;
      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  const isPremium = user.subscription.tier === "realeza";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="z-[160]" />
        <DialogContent
          className="p-0 gap-0 overflow-hidden !w-[1200px] !max-w-[1200px] !min-w-[1200px] z-[170]"
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
                {/* Avatar */}
                <div className="relative">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center select-none">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  {isPremium && (
                    <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Name and Email */}
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
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
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
                  "px-4 py-3 rounded-lg text-center border transition-colors",
                  isPremium
                    ? "bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 dark:from-purple-400/20 dark:to-purple-500/20 dark:border-purple-400/30"
                    : "bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 dark:from-green-400/20 dark:to-green-500/20 dark:border-green-400/30"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  {isPremium ? (
                    <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Wheat className="w-4 h-4 text-green-600 dark:text-green-400" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-bold",
                      isPremium
                        ? "text-purple-700 dark:text-purple-300"
                        : "text-green-700 dark:text-green-300"
                    )}
                  >
                    {isPremium
                      ? t("account.subscription.tier_premium")
                      : t("account.subscription.tier_free")}
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
      </DialogPortal>
    </Dialog>
  );
}
