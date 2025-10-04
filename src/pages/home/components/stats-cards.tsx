import { Book, Edit, Paperclip } from "lucide-react";
import { useTranslation } from "react-i18next";

import { StatsCard } from "@/components/common/stats-card";

interface StatsCardsProps {
  totalBooks: number;
  lastEditedBook: string;
}

export function StatsCards({ totalBooks, lastEditedBook }: StatsCardsProps) {
  const { t } = useTranslation("home");

  return (
    <div className="px-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title={t("cards.metrics.total_books_title")}
          value={totalBooks}
          icon={Book}
          subMetrics={[
            { label: "Caracteres", value: "150.000" },
            { label: "Palavras", value: "25.000" },
          ]}
        />
        <StatsCard
          title={t("cards.chapter.title")}
          value="Capítulo 1: O templo de dandara"
          icon={Paperclip}
        />
        <StatsCard
          title={t("cards.edit.title")}
          value={lastEditedBook}
          icon={Edit}
        />
      </div>
    </div>
  );
}
