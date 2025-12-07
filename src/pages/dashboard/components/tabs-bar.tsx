import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import { Palette } from "lucide-react";
import { useTranslation } from "react-i18next";

import { TabsList } from "@/components/ui/tabs";

import { SortableTab } from "./sortable-tab";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  isDefault?: boolean;
}

interface PropsTabsBar {
  isCustomizing: boolean;
  isHeaderHidden: boolean;
  tabs: TabConfig[];
  visibleTabs: TabConfig[];
  sensors: SensorDescriptor<SensorOptions>[];
  activeTab: string;
  previewTabs?: TabConfig[];
  draggedTabId?: string | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragMove: (event: DragMoveEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onToggleVisibility: (tabId: string) => void;
  onActiveTabChange: (tab: string) => void;
}

export function TabsBar({
  isCustomizing,
  isHeaderHidden,
  tabs,
  visibleTabs,
  sensors,
  previewTabs,
  draggedTabId,
  onDragStart,
  onDragMove,
  onDragEnd,
  onToggleVisibility,
}: PropsTabsBar) {
  const { t } = useTranslation("tooltips");
  const displayTabs =
    previewTabs && previewTabs.length > 0 ? previewTabs : tabs;
  if (isCustomizing) {
    return (
      <>
        <div className={`px-6 mb-4 ${isHeaderHidden ? "pt-2" : "pt-10"}`}>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {t("customize.customize_tabs")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("instructions.drag_to_reorder")}
            &quot;{t("tabs.overview")}&quot; {t("customize.overview_note")}
          </p>
        </div>
        <div className="pb-3 px-6">
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
          >
            <div
              id="tabs-container"
              className="flex gap-2 p-1 bg-muted/50 rounded-md border overflow-x-auto"
            >
              {displayTabs.map((tab) => (
                <SortableTab
                  key={tab.id}
                  tab={tab}
                  isCustomizing={isCustomizing}
                  onToggleVisibility={onToggleVisibility}
                  isDragging={draggedTabId === tab.id}
                />
              ))}
            </div>
          </DndContext>
        </div>
      </>
    );
  }

  return (
    <div
      className={`pointer-events-none pb-3 px-6 @container ${isHeaderHidden ? "pt-2" : "pt-6"}`}
    >
      <TabsList className="w-full h-10 flex items-center justify-start rounded-md bg-transparent p-1 text-muted-foreground">
        {visibleTabs.map((tab, index) => (
          <SortableTab
            key={tab.id}
            tab={tab}
            isCustomizing={isCustomizing}
            onToggleVisibility={onToggleVisibility}
            isFirst={index === 0}
            isLast={index === visibleTabs.length - 1}
          />
        ))}
      </TabsList>
    </div>
  );
}
