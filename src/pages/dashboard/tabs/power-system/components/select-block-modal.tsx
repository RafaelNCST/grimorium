import {
  Heading,
  AlignLeft,
  AlertTriangle,
  List,
  ListOrdered,
  Tag,
  ChevronDown,
  Image,
  Circle,
  Grid3x3,
  Info,
  Minus,
  Star,
  BarChart3,
  Navigation2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { BlockType } from "../types/power-system-types";

interface SelectBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
}

interface BlockTypeOption {
  type: BlockType;
  icon: React.ElementType;
}

const blockTypes: BlockTypeOption[] = [
  { type: "heading", icon: Heading },
  { type: "paragraph", icon: AlignLeft },
  { type: "unordered-list", icon: List },
  { type: "numbered-list", icon: ListOrdered },
  { type: "tag-list", icon: Tag },
  { type: "dropdown", icon: ChevronDown },
  { type: "multi-dropdown", icon: ChevronDown },
  { type: "image", icon: Image },
  { type: "icon", icon: Circle },
  { type: "icon-group", icon: Grid3x3 },
  { type: "informative", icon: Info },
  { type: "divider", icon: Minus },
  { type: "stars", icon: Star },
  { type: "attributes", icon: BarChart3 },
  { type: "navigator", icon: Navigation2 },
];

export function SelectBlockModal({
  isOpen,
  onClose,
  onSelect,
}: SelectBlockModalProps) {
  const { t } = useTranslation("power-system");

  const handleSelect = (type: BlockType) => {
    onSelect(type);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("blocks.select_type")}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-3 pb-4">
          {blockTypes.map(({ type, icon: Icon }) => (
            <Card
              key={type}
              className="p-4 cursor-pointer transition-colors hover:bg-white/5"
              onClick={() => handleSelect(type)}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <Icon className="h-8 w-8 text-primary" />
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    {t(`blocks.${type.replace(/-/g, "_")}.name`)}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t(`blocks.${type.replace(/-/g, "_")}.description`)}
                  </CardDescription>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
