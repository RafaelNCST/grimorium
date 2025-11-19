import React from "react";

import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { ITEM_CATEGORIES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-categories";
import { ITEM_STATUSES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-statuses";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface IItem {
  id: string;
  name: string;
  status: string;
  category: string;
  customCategory?: string;
  basicDescription: string;
  image?: string;
  appearance?: string;
  origin?: string;
  alternativeNames?: string[];
  storyRarity?: string;
  narrativePurpose?: string;
  usageRequirements?: string;
  usageConsequences?: string;
  createdAt: string;
}

interface PropsItemCard {
  item: IItem;
  onClick?: (itemId: string) => void;
}

export function ItemCard({ item, onClick }: PropsItemCard) {
  const { t } = useTranslation(["items", "create-item"]);
  const [isHovered, setIsHovered] = React.useState(false);

  const statusData = ITEM_STATUSES_CONSTANT.find(
    (s) => s.value === item.status
  );
  const StatusIcon = statusData?.icon;

  const categoryData = ITEM_CATEGORIES_CONSTANT.find(
    (c) => c.value === item.category
  );
  const CategoryIcon = categoryData?.icon;

  const displayCategory =
    item.category === "other" && item.customCategory
      ? item.customCategory
      : t(`create-item:category.${item.category}`);

  return (
    <Card
      className="relative cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80 max-w-[470px]"
      onClick={() => onClick?.(item.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Image covering the top with full width */}
        {item.image ? (
          <div className="relative w-full h-80">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        ) : (
          <div className="relative w-full h-80 rounded-t-lg overflow-hidden">
            <FormImageDisplay
              icon={Package}
              height="h-full"
              width="w-full"
              shape="square"
              className="rounded-t-lg"
            />
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Name */}
          <h3 className="font-semibold text-lg leading-tight">
            {item.name}
          </h3>

          {/* Category and Status side by side */}
          <div className="flex items-center gap-2 flex-wrap">
            {categoryData && CategoryIcon && (
              <Badge
                className={`${categoryData.bgColorClass} ${categoryData.colorClass} border px-3 py-1 pointer-events-none select-none`}
              >
                <CategoryIcon className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs font-medium">{displayCategory}</span>
              </Badge>
            )}
            {statusData && StatusIcon && (
              <Badge
                className={`${statusData.bgColorClass} ${statusData.colorClass} border px-3 py-1 pointer-events-none select-none`}
              >
                <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs font-medium">
                  {t(`create-item:status.${item.status}`)}
                </span>
              </Badge>
            )}
          </div>

          {/* Basic description showing a maximum of 2 lines, hiding the rest */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.basicDescription}
          </p>
        </div>
      </CardContent>

      {/* Overlay cobrindo todo o card */}
      <div
        className={`absolute inset-0 z-10 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-lg ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-white text-lg font-semibold">Ver detalhes</span>
      </div>
    </Card>
  );
}
