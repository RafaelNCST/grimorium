import { useTranslation } from "react-i18next";

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
      className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-[0_8px_32px_hsl(240_10%_3.9%_/_0.3),0_0_20px_hsl(263_70%_50%_/_0.3)] hover:bg-card/80"
      onClick={() => onClick?.(item.id)}
    >
      <CardContent className="p-0">
        {/* Image covering the top with full width */}
        {item.image ? (
          <div className="relative w-full h-48">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        ) : (
          <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-primary/10 rounded-t-lg flex items-center justify-center">
            <span className="text-4xl text-muted-foreground">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Name on one side and status with icon and color on the same line at the end */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight flex-1">
              {item.name}
            </h3>
            {statusData && StatusIcon && (
              <Badge
                className={`flex items-center gap-1.5 ${statusData.activeColor} bg-transparent border-none px-2 py-1 pointer-events-none`}
              >
                <StatusIcon className="w-4 h-4" />
                <span className="text-xs">
                  {t(`create-item:status.${item.status}`)}
                </span>
              </Badge>
            )}
          </div>

          {/* Below: category with icon and name */}
          <div className="flex items-center gap-1.5">
            {CategoryIcon && (
              <CategoryIcon className="w-4 h-4 text-primary flex-shrink-0" />
            )}
            <span className="text-sm font-medium text-muted-foreground">
              {displayCategory}
            </span>
          </div>

          {/* At the end: basic description showing a maximum of 2 lines, hiding the rest */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.basicDescription}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
