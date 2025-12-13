import { useEffect, useState } from "react";

import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { ITEM_CATEGORIES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-categories";
import { ITEM_STATUSES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-statuses";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getItemById, type IItem } from "@/lib/db/items.service";

interface ItemHoverCardProps {
  itemId: string;
  children: React.ReactNode;
}

export function ItemHoverCard({ itemId, children }: ItemHoverCardProps) {
  const { t } = useTranslation(["power-system", "create-item"]);
  const [item, setItem] = useState<IItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadItem() {
      try {
        setIsLoading(true);
        setError(false);
        const data = await getItemById(itemId);
        if (mounted) {
          setItem(data);
          if (!data) {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Error loading item:", err);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadItem();

    return () => {
      mounted = false;
    };
  }, [itemId]);

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-[400px]" align="start">
        {isLoading ? (
          <div className="p-1 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error || !item ? (
          <div className="text-sm text-muted-foreground">
            {t("power-system:hover_card.item_not_found")}
          </div>
        ) : (
          <div className="p-1 space-y-4">
            {/* Top Section: Image + Name/Category/Status */}
            <div className="flex gap-4">
              {/* Item Image - Square */}
              {item.image ? (
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ) : (
                <FormImageDisplay
                  icon={Package}
                  height="h-20"
                  width="w-20"
                  shape="square"
                  className="rounded-lg"
                />
              )}

              {/* Name, Category, and Status */}
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="font-semibold text-lg leading-tight">
                  {item.name}
                </h3>

                {/* Category and Status badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {item.category &&
                    (() => {
                      const categoryData = ITEM_CATEGORIES_CONSTANT.find(
                        (c) => c.value === item.category
                      );
                      const CategoryIcon = categoryData?.icon;
                      const displayCategory =
                        item.category === "other" && item.customCategory
                          ? item.customCategory
                          : t(`create-item:category.${item.category}`);
                      return categoryData && CategoryIcon ? (
                        <Badge
                          className={`${categoryData.bgColorClass} ${categoryData.colorClass} border px-3 py-1 pointer-events-none select-none`}
                        >
                          <CategoryIcon className="w-3.5 h-3.5 mr-1.5" />
                          <span className="text-xs font-medium">
                            {displayCategory}
                          </span>
                        </Badge>
                      ) : null;
                    })()}
                  {item.status &&
                    (() => {
                      const statusData = ITEM_STATUSES_CONSTANT.find(
                        (s) => s.value === item.status
                      );
                      const StatusIcon = statusData?.icon;
                      return statusData && StatusIcon ? (
                        <Badge
                          className={`${statusData.bgColorClass} ${statusData.colorClass} border px-3 py-1 pointer-events-none select-none`}
                        >
                          <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                          <span className="text-xs font-medium">
                            {t(`create-item:status.${item.status}`)}
                          </span>
                        </Badge>
                      ) : null;
                    })()}
                </div>
              </div>
            </div>

            {/* Basic description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {item.basicDescription}
            </p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
