import { useState } from "react";

import { format } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { Trash2, ChevronDown, ChevronUp, X } from "lucide-react";
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
import { useInboxStore, type MessageType } from "@/stores/inbox-store";
import { useLanguageStore } from "@/stores/language-store";

interface InboxNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InboxNotificationModal({
  isOpen,
  onClose,
}: InboxNotificationModalProps) {
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
        className="group border-b border-border last:border-b-0 last:rounded-b-lg p-4 transition-colors hover:bg-muted/30"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h4 className="font-semibold text-sm">{message.title}</h4>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getMessageTypeColor(
                  message.type
                )}`}
              >
                {getMessageTypeLabel(message.type)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {formatMessageDate(message.date)}
            </p>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {displayContent}
              {shouldShowReadMore && !isExpanded && "..."}
            </p>
            {shouldShowReadMore && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleMessageExpansion(message.id)}
                className="mt-3 h-8 text-xs px-3"
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
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 shrink-0"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    );
  };

  const currentMessages =
    activeTab === "all" ? activeMessages : deletedMessages;
  const hasMessages = currentMessages.length > 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Transparente para não escurecer */}
      <div
        className="fixed inset-0 z-[115]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container - Posicionado no canto superior direito */}
      <div
        className="fixed z-[120] bg-background border border-border rounded-lg shadow-2xl overflow-hidden"
        style={{
          top: "3rem",
          right: "1rem",
          width: "800px",
          maxWidth: "calc(100vw - 2rem)",
          maxHeight: "calc(100vh - 4rem)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background rounded-t-lg">
          <h2 className="text-lg font-semibold text-foreground">
            {t("title")}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs de Navegação */}
        <div className="flex border-b border-border bg-background">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "all"
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {t("tabs.all")}{" "}
            {activeMessages.length > 0 && (
              <span className="ml-1">({activeMessages.length})</span>
            )}
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("deleted")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "deleted"
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {t("tabs.deleted")}{" "}
            {deletedMessages.length > 0 && (
              <span className="ml-1">({deletedMessages.length})</span>
            )}
            {activeTab === "deleted" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Conteúdo */}
        <div className="w-full bg-background rounded-b-lg">
          {hasMessages ? (
            <>
              {/* Barra de Ações */}
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  {t("actions.clear_all")}
                </Button>
              </div>

              {/* Lista de Mensagens com Scroll */}
              <div
                className="overflow-y-auto bg-background rounded-b-lg"
                style={{ maxHeight: "calc(100vh - 16rem)" }}
              >
                {currentMessages.map(renderMessage)}
              </div>
            </>
          ) : (
            <div
              className="flex items-center justify-center text-sm text-muted-foreground bg-background rounded-b-lg"
              style={{ height: "300px" }}
            >
              {activeTab === "all" ? t("empty.all") : t("empty.deleted")}
            </div>
          )}
        </div>
      </div>

      {/* Diálogo de Confirmação */}
      <AlertDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
      >
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
