import { Book, HardDrive } from "lucide-react";
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
          title={t("total_books")}
          value={totalBooks}
          description={t("active_projects")}
          icon={Book}
        />
        <StatsCard
          title={t("storage_used")}
          value="2.1 GB"
          description={t("storage_available")}
          icon={HardDrive}
        />
        <StatsCard
          title={t("last_edition")}
          value={lastEditedBook}
          description={t("this_month")}
          icon={Book}
        />
      </div>
    </div>
  );
}
