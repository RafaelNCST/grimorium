/**
 * Dashboard Section
 *
 * Configurações de tabs visíveis por padrão em novos livros
 */

import {
  BookOpen,
  Users,
  MapPin,
  Building,
  Target,
  Zap,
  Dna,
  Package,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { DashboardTabId } from "@/types/app-settings";

const TAB_ICONS: Record<DashboardTabId, React.ComponentType<{ className?: string }>> = {
  overview: BookOpen,
  characters: Users,
  world: MapPin,
  factions: Building,
  plot: Target,
  magic: Zap,
  species: Dna,
  items: Package,
};

export function DashboardSection() {
  const { t } = useTranslation("advanced-settings");
  const { dashboard, toggleDefaultTab } = useAppSettingsStore();

  const tabs: DashboardTabId[] = [
    "overview",
    "characters",
    "world",
    "factions",
    "plot",
    "magic",
    "species",
    "items",
  ];

  return (
    <div className="space-y-6 w-full max-w-full">
      <div>
        <h3 className="text-base font-semibold mb-1">
          {t("dashboard.default_tabs.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.default_tabs.description")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tabs.map((tabId) => {
          const Icon = TAB_ICONS[tabId];
          const isChecked = dashboard.defaultVisibleTabs.includes(tabId);
          const isOverview = tabId === "overview";

          return (
            <div
              key={tabId}
              className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200"
            >
              <Checkbox
                id={`tab-${tabId}`}
                checked={isChecked}
                onCheckedChange={() => toggleDefaultTab(tabId)}
                disabled={isOverview}
              />
              <label
                htmlFor={`tab-${tabId}`}
                className="flex items-center gap-2 flex-1 cursor-pointer"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {t(`dashboard.tabs.${tabId}`)}
                </span>
              </label>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          💡 {t("dashboard.default_tabs.note")}
        </p>
      </div>
    </div>
  );
}
