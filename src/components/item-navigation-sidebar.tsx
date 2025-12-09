import { useState } from "react";

import { X, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntitySearchBar } from "@/components/entity-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IItem {
  id: string;
  name: string;
  image?: string;
}

interface PropsItemNavigationSidebar {
  isOpen: boolean;
  onClose: () => void;
  items: IItem[];
  currentItemId?: string;
  onItemSelect: (itemId: string) => void;
}

export function ItemNavigationSidebar({
  isOpen,
  onClose,
  items,
  currentItemId,
  onItemSelect,
}: PropsItemNavigationSidebar) {
  const { t } = useTranslation(["empty-states", "items", "common"]);
  const [searchTerm, setSearchTerm] = useState("");

  const currentItem = items.find((item) => item.id === currentItemId);
  const otherItems = items.filter((item) => item.id !== currentItemId);

  const filteredOtherItems = otherItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed left-0 top-[104px] bottom-0 w-80 bg-background border-r border-border shadow-lg transition-all duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Itens</h2>
          <span className="text-xs text-muted-foreground">
            ({items.length})
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 border-b border-border bg-card">
        <EntitySearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t("items:page.search_placeholder")}
          maxWidth="w-full"
        />
      </div>

      {currentItem && (
        <div className="p-2 border-b border-border bg-card">
          <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30 cursor-default">
            <Avatar className="w-10 h-10 flex-shrink-0 rounded-md">
              <AvatarImage src={currentItem.image} className="object-cover" />
              <AvatarFallback className="text-sm rounded-md">
                {currentItem.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{currentItem.name}</p>
              <p className="text-xs text-primary font-medium">
                {t("common:sidebar.viewing_currently")}
              </p>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 h-[calc(100vh-104px-220px)]">
        <div className="p-2">
          {filteredOtherItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{t("empty-states:entity_search.no_item")}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredOtherItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onItemSelect(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50"
                >
                  <Avatar className="w-10 h-10 flex-shrink-0 rounded-md">
                    <AvatarImage src={item.image} className="object-cover" />
                    <AvatarFallback className="text-sm rounded-md">
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
