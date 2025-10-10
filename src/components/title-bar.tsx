import { useEffect, useState } from "react";

import { useRouterState } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Inbox, Minus, Square, X } from "lucide-react";
import { createPortal } from "react-dom";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [controlsPosition, setControlsPosition] = useState({
    top: 0,
    right: 0,
  });
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

  // Detect if a Dialog modal is open
  useEffect(() => {
    const checkModalState = () => {
      // Check if there's a Dialog overlay in the DOM with data-state="open"
      const overlay = document.querySelector(
        '[data-modal-overlay="true"][data-state="open"]'
      );
      setIsModalOpen(!!overlay);
    };

    // Create a MutationObserver to watch for modal changes
    const observer = new MutationObserver(checkModalState);

    // Observe changes to the body and its children
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
    });

    // Initial check
    checkModalState();

    return () => {
      observer.disconnect();
    };
  }, []);

  // Update window controls position when component mounts or window resizes
  useEffect(() => {
    const updateControlsPosition = () => {
      const titleBar = document.querySelector("[data-title-bar]");
      if (titleBar) {
        const rect = titleBar.getBoundingClientRect();
        setControlsPosition({ top: rect.top, right: 0 });
      }
    };

    updateControlsPosition();
    window.addEventListener("resize", updateControlsPosition);

    return () => {
      window.removeEventListener("resize", updateControlsPosition);
    };
  }, []);

  const handleMinimize = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    getCurrentWindow().minimize();
  };

  const handleMaximize = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    getCurrentWindow().toggleMaximize();
  };

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    getCurrentWindow().close();
  };

  // Window control buttons component
  const WindowControls = () => (
    <div className="flex items-center">
      <div className="h-6 w-px bg-border" />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMinimize}
        className={cn(
          "h-8 w-12 rounded-none hover:bg-gray-50",
          "transition-colors duration-200 pointer-events-auto"
        )}
        aria-label="Minimize window control"
      >
        <Minus className="h-2 w-2" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMaximize}
        className={cn(
          "h-8 w-12 rounded-none hover:bg-gray-50",
          "transition-colors duration-200 pointer-events-auto"
        )}
        aria-label={
          isMaximized ? "Restore window control" : "Maximize window control"
        }
      >
        <Square className="h-2 w-2" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className={cn(
          "h-8 w-12 rounded-none hover:bg-destructive hover:text-destructive-foreground",
          "transition-colors duration-200 pointer-events-auto"
        )}
        aria-label="Close window control"
      >
        <X className="h-2 w-2" />
      </Button>
    </div>
  );

  return (
    <>
      <div
        data-tauri-drag-region
        data-title-bar
        className={cn(
          "flex h-8 w-full items-center justify-between",
          "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "select-none z-[60] relative pointer-events-auto"
        )}
        style={{ pointerEvents: "auto" }}
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
          <span className="text-sm font-medium text-foreground">
            {pageTitle}
          </span>
        </div>

        {/* Right section - Inbox and placeholder for window controls */}
        <div data-tauri-drag-region className="flex items-center">
          <TooltipProvider>
            <Popover open={isInboxOpen} onOpenChange={setIsInboxOpen}>
              <Tooltip open={isInboxOpen ? false : undefined}>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isModalOpen}
                      className={cn(
                        "h-8 w-12 rounded-none hover:bg-gray-50 hover:text-secondary relative",
                        "transition-colors duration-200",
                        isInboxOpen && "bg-gray-50 text-secondary",
                        isModalOpen && "opacity-50 cursor-not-allowed"
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
                onInteractOutside={(e) => {
                  // Prevent closing when clicking on title bar
                  const target = e.target as HTMLElement;
                  if (target.closest("[data-title-bar]")) {
                    e.preventDefault();
                  }
                }}
              >
                <InboxModal />
              </PopoverContent>
            </Popover>
          </TooltipProvider>
          {/* Placeholder to maintain spacing - invisible but takes up space */}
          <div
            className="h-10 w-[145px] opacity-0 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Window controls rendered in a portal with highest z-index */}
      {createPortal(
        <div
          className="fixed z-[100] flex items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border pointer-events-none"
          style={{
            top: `${controlsPosition.top}px`,
            right: `${controlsPosition.right}px`,
            height: "2rem",
          }}
        >
          <WindowControls />
        </div>,
        document.body
      )}
    </>
  );
};
