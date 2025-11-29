import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import { getColorClass } from "../utils/get-color-class";

interface HeaderProps {
  daysSinceLastChapter: number;
  lastEditedBook: string;
  lastEditedDate?: Date;
  lastChapter?: {
    title: string;
    bookTitle: string;
    date?: Date;
  };
  onOpenCreateModal: () => void;
}

function formatDate(date: Date | undefined, locale: string): string {
  if (!date) return "";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  // Format based on locale
  if (locale === "pt" || locale === "pt-BR") {
    return date.toLocaleDateString("pt-BR", options);
  }

  return date.toLocaleDateString("en-US", options);
}

export function Header({
  daysSinceLastChapter,
  lastEditedBook,
  lastEditedDate,
  lastChapter,
  onOpenCreateModal,
}: HeaderProps) {
  const { t, i18n } = useTranslation("home");

  const formattedLastEditedDate = formatDate(lastEditedDate, i18n.language);
  const formattedLastChapterDate = formatDate(lastChapter?.date, i18n.language);

  return (
    <div className="relative h-80 overflow-hidden rounded-xl mx-6 my-6">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/assets/hero-workspace.jpg)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

      <div className="relative h-full flex items-center justify-between px-8">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">
            {t("header.title_first_part")}
            <br />
            <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
              {t("header.title_second_part")}
            </span>
          </h1>
          <div className="animate-fade-in-up space-y-1">
            <p className="text-lg">
              <span
                className={`font-bold ${getColorClass(daysSinceLastChapter)}`}
              >
                {daysSinceLastChapter}
              </span>
              <span className="text-gray-200"> {t("header.subtext")}</span>
            </p>
            <div className="flex gap-6 text-sm text-gray-300">
              <div>
                <span className="text-gray-400">
                  {t("header.last_edited")}:{" "}
                </span>
                <span className="font-medium">
                  {lastEditedBook || t("header.no_book")}
                  {formattedLastEditedDate && ` - ${formattedLastEditedDate}`}
                </span>
              </div>
              <div>
                <span className="text-gray-400">
                  {t("header.last_chapter")}:{" "}
                </span>
                <span className="font-medium">
                  {lastChapter?.title || t("header.no_chapter")}
                  {formattedLastChapterDate && ` - ${formattedLastChapterDate}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="magical"
            size="lg"
            onClick={onOpenCreateModal}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t("header.button_create_book")}
          </Button>
        </div>
      </div>
    </div>
  );
}
