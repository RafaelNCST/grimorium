import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TabsTrigger } from "@/components/ui/tabs";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  isDefault?: boolean;
}

interface PropsSortableTab {
  tab: TabConfig;
  isCustomizing: boolean;
  onToggleVisibility: (tabId: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function SortableTab({
  tab,
  isCustomizing,
  onToggleVisibility,
  isFirst = false,
  isLast = false,
}: PropsSortableTab) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id, disabled: !isCustomizing || tab.isDefault });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (isCustomizing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`relative flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-md flex-1 min-w-0 ${
          tab.isDefault ? "opacity-75" : ""
        } ${!tab.visible ? "opacity-50" : ""}`}
      >
        {!tab.isDefault && (
          <div
            {...attributes}
            {...listeners}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          />
        )}
        <tab.icon className="w-4 h-4" />
        <span className="flex-1 text-sm">{tab.label}</span>
        {!tab.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleVisibility(tab.id)}
            className="h-6 w-6 p-0 relative z-10"
          >
            {tab.visible ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
          </Button>
        )}
      </div>
    );
  }

  if (!tab.visible) return null;

  return (
    <TabsTrigger
      value={tab.id}
      className="flex pointer-events-auto items-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
    >
      <tab.icon className="w-4 h-4" />
      <span className="hidden sm:inline">{tab.label}</span>
    </TabsTrigger>
  );
}
