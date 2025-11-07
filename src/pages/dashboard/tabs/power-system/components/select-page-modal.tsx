import { useState } from "react";

import { FileText, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { IPowerPage } from "../types/power-system-types";

interface SelectPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pageId: string) => void;
  pages: IPowerPage[];
  currentPageId?: string; // To prevent selecting the same page
}

export function SelectPageModal({
  isOpen,
  onClose,
  onSelect,
  pages,
  currentPageId,
}: SelectPageModalProps) {
  const { t } = useTranslation("power-system");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter pages by search query and exclude current page
  const filteredPages = pages
    .filter((page) => page.id !== currentPageId)
    .filter((page) =>
      page.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const handleSelect = (pageId: string) => {
    onSelect(pageId);
    setSearchQuery(""); // Reset search
  };

  const handleClose = () => {
    setSearchQuery(""); // Reset search on close
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("blocks.navigator.select_page")}</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("pages.filter_sections")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-3 pb-4">
          {filteredPages.length > 0 ? (
            filteredPages.map((page) => (
              <Card
                key={page.id}
                className="p-4 cursor-pointer transition-colors hover:bg-white/5"
                onClick={() => handleSelect(page.id)}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="space-y-1">
                    <CardTitle className="text-base">{page.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {t("pages.create")}
                    </CardDescription>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery
                  ? t("system_list.no_results")
                  : t("navigation.empty_pages")}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
