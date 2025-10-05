import { useEffect, useState } from "react";

import { useRouterState } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Inbox, Minus, Square, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { InboxModal } from "@/components/modals/inbox-modal";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useInboxStore } from "@/stores/inbox-store";

const getPageTitle = (pathname: string): string => {
  if (pathname === "/") return "Home";

  if (pathname.includes("/dashboard/")) {
    if (pathname.includes("/chapters")) return "Chapters";
    if (pathname.includes("/notes")) return "Notes";
    if (pathname.includes("/character/")) return "Character";
    if (pathname.includes("/beast/")) return "Beast";
    if (pathname.includes("/item/")) return "Item";
    if (pathname.includes("/organization/")) return "Organization";
    if (pathname.includes("/plot/")) return "Plot";
    if (pathname.includes("/race/")) return "Race";
    if (pathname.includes("/world/")) return "World";
    return "Dashboard";
  }

  return "Grimorium";
};

export const TitleBar = () => {
  const routerState = useRouterState();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const { t } = useTranslation("inbox");
  const messages = useInboxStore((state) => state.messages);
  const markAllAsRead = useInboxStore((state) => state.markAllAsRead);

  const { pathname } = routerState.location;
  const pageTitle = getPageTitle(pathname);
  const unreadCount = messages.filter(
    (msg) => !msg.isDeleted && !msg.isRead
  ).length;

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const initWindow = async () => {
      const appWindow = getCurrentWindow();

      // Check if window is maximized
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);

      // Listen for window resize events
      unlisten = await appWindow.onResized(async () => {
        const isMax = await appWindow.isMaximized();
        setIsMaximized(isMax);
      });
    };

    initWindow();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  useEffect(() => {
    if (isInboxOpen) {
      markAllAsRead();
    }
  }, [isInboxOpen, markAllAsRead]);

  const handleMinimize = () => {
    getCurrentWindow().minimize();
  };

  const handleMaximize = () => {
    getCurrentWindow().toggleMaximize();
  };

  const handleClose = () => {
    getCurrentWindow().close();
  };

  return (
    <div
      data-tauri-drag-region
      className={cn(
        "flex h-10 w-full items-center justify-between",
        "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "select-none"
      )}
    >
      {/* Left section - App logo/name */}
      <div data-tauri-drag-region className="flex items-center px-4">
        <span className="text-sm font-semibold text-foreground/80">
          Grimorium
        </span>
      </div>

      {/* Center section - Page title */}
      <div
        data-tauri-drag-region
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <span className="text-sm font-medium text-foreground">{pageTitle}</span>
      </div>

      {/* Right section - Window controls */}
      <div className="flex items-center">
        <TooltipProvider>
          <Popover open={isInboxOpen} onOpenChange={setIsInboxOpen}>
            <Tooltip open={isInboxOpen ? false : undefined}>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-12 rounded-none hover:bg-gray-50 hover:text-primary relative",
                      "transition-colors duration-200",
                      isInboxOpen && "bg-gray-50 text-primary"
                    )}
                    aria-label="Inbox"
                  >
                    <Inbox
                      className={cn("h-4 w-4 transition-colors duration-200")}
                    />
                    {unreadCount > 0 && !isInboxOpen && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{t("tooltip")}</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent
              className="p-0 border shadow-lg w-[560px] max-w-[90vw]"
              align="end"
              side="bottom"
              sideOffset={4}
              alignOffset={0}
            >
              <InboxModal />
            </PopoverContent>
          </Popover>
        </TooltipProvider>
        <div className="h-6 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMinimize}
          className={cn(
            "h-10 w-12 rounded-none hover:bg-gray-50",
            "transition-colors duration-200"
          )}
          aria-label="Minimize window"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMaximize}
          className={cn(
            "h-10 w-12 rounded-none hover:bg-gray-50",
            "transition-colors duration-200"
          )}
          aria-label={isMaximized ? "Restore window" : "Maximize window"}
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className={cn(
            "h-10 w-12 rounded-none hover:bg-destructive hover:text-destructive-foreground",
            "transition-colors duration-200"
          )}
          aria-label="Close window"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
