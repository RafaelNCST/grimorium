import { useState, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { getItemById, type IItem } from "@/lib/db/items.service";
import { Route } from "@/routes/dashboard/$dashboardId/super-views/item/$itemId";

import { ItemSuperView } from "./view";

export function ItemSuperViewPage() {
  const params = useParams({
    from: "/dashboard/$dashboardId/super-views/item/$itemId",
  });
  const navigate = useNavigate();
  const { t } = useTranslation(["errors"]);
  const search = Route.useSearch();
  const { dashboardId, itemId } = params;
  const fromChapterId = search.from;

  const [item, setItem] = useState<IItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load item data
  useEffect(() => {
    const loadItem = async () => {
      setIsLoading(true);
      try {
        const data = await getItemById(itemId);
        if (data) {
          setItem(data);
        }
      } catch (error) {
        console.error("Error loading item:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [dashboardId, itemId]);

  const handleBack = () => {
    // Navigate back to specific chapter
    if (fromChapterId) {
      navigate({
        to: "/dashboard/$dashboardId/chapters/$editor-chapters-id",
        params: { dashboardId, "editor-chapters-id": fromChapterId },
      });
    } else {
      navigate({
        to: "/dashboard/$dashboardId/chapters",
        params: { dashboardId },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">{t("errors:not_found.item")}</p>
      </div>
    );
  }

  return (
    <ItemSuperView
      item={item}
      displayData={item}
      bookId={dashboardId}
      onBack={handleBack}
    />
  );
}
