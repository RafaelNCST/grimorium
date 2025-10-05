import { useState } from "react";

import { format } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInboxStore, type MessageType } from "@/stores/inbox-store";
import { useLanguageStore } from "@/stores/language-store";

export function InboxModal() {
  const { t } = useTranslation("inbox");
  const { language } = useLanguageStore();
  const {
    messages,
    deleteMessage,
    deleteMessagePermanently,
    clearAllMessages,
    clearAllDeletedMessages,
  } = useInboxStore();

  const [expandedMessages, setExpandedMessages] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"clear_all" | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "deleted">("all");

  const activeMessages = messages.filter((msg) => !msg.isDeleted);
  const deletedMessages = messages.filter((msg) => msg.isDeleted);

  const toggleMessageExpansion = (id: string) => {
    setExpandedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  const handleClearAll = () => {
    setConfirmAction("clear_all");
    setShowConfirmDialog(true);
  };

  const confirmDialogAction = () => {
    if (confirmAction === "clear_all") {
      if (activeTab === "all") {
        clearAllMessages();
      } else {
        clearAllDeletedMessages();
      }
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const getMessageTypeLabel = (type: MessageType) => {
    const typeMap: Record<MessageType, string> = {
      update: t("message_types.update"),
      team_response: t("message_types.team_response"),
      data_research: t("message_types.data_research"),
      news: t("message_types.news"),
    };
    return typeMap[type] || type;
  };

  const getMessageTypeColor = (type: MessageType) => {
    const colorMap: Record<MessageType, string> = {
      update: "bg-blue-500/10 text-blue-500",
      team_response: "bg-green-500/10 text-green-500",
      data_research: "bg-purple-500/10 text-purple-500",
      news: "bg-orange-500/10 text-orange-500",
    };
    return colorMap[type] || "bg-gray-500/10 text-gray-500";
  };

  const formatMessageDate = (date: Date) => {
    const locale = language === "pt" ? ptBR : enUS;
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale });
  };

  const renderMessage = (message: (typeof messages)[0]) => {
    const isExpanded = expandedMessages.includes(message.id);
    const shouldShowReadMore = message.content.length > 150;
    const displayContent = isExpanded
      ? message.content
      : message.content.slice(0, 150);

    return (
      <div
        key={message.id}
        className="group border-b border-border last:border-0 p-4 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="font-semibold text-sm truncate">
                {message.title}
              </h4>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getMessageTypeColor(
                  message.type
                )}`}
              >
                {getMessageTypeLabel(message.type)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {formatMessageDate(message.date)}
            </p>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">
              {displayContent}
              {shouldShowReadMore && !isExpanded && "..."}
            </p>
            {shouldShowReadMore && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleMessageExpansion(message.id)}
                className="mt-2 h-8 text-xs"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    {t("actions.read_less")}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    {t("actions.read_more")}
                  </>
                )}
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (activeTab === "all") {
                deleteMessage(message.id);
              } else {
                deleteMessagePermanently(message.id);
              }
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full flex flex-col max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "all" | "deleted")}
          className="flex flex-col min-h-0 flex-1 overflow-hidden"
        >
          <TabsList className="w-full rounded-none border-b shrink-0 grid grid-cols-2">
            <TabsTrigger value="all" className="truncate">
              {t("tabs.all")}{" "}
              {activeMessages.length > 0 && `(${activeMessages.length})`}
            </TabsTrigger>
            <TabsTrigger value="deleted" className="truncate">
              {t("tabs.deleted")}{" "}
              {deletedMessages.length > 0 && `(${deletedMessages.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="all"
            className="mt-0 data-[state=inactive]:hidden flex flex-col"
          >
            {activeMessages.length > 0 ? (
              <>
                <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-end shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-8 text-xs text-destructive hover:text-destructive"
                  >
                    {t("actions.clear_all")}
                  </Button>
                </div>
                <ScrollArea className="max-h-[calc(80vh-250px)] sm:max-h-[calc(70vh-200px)] lg:max-h-[calc(60vh-180px)] min-h-0">
                  {activeMessages.map(renderMessage)}
                </ScrollArea>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                {t("empty.all")}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="deleted"
            className="mt-0 data-[state=inactive]:hidden flex flex-col"
          >
            {deletedMessages.length > 0 ? (
              <>
                <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-end shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-8 text-xs text-destructive hover:text-destructive"
                  >
                    {t("actions.clear_all")}
                  </Button>
                </div>
                <ScrollArea className="max-h-[calc(80vh-250px)] sm:max-h-[calc(70vh-200px)] lg:max-h-[calc(60vh-180px)] min-h-0">
                  {deletedMessages.map(renderMessage)}
                </ScrollArea>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                {t("empty.deleted")}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirm.delete_all_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirm.delete_all_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("confirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDialogAction}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t("confirm.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
