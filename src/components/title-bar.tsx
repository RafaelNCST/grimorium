import { useEffect, useState, useMemo } from "react";

import { useRouterState } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { BookOpen, Inbox, Minus, Settings, Square, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { AdvancedSettingsModal } from "@/components/modals/advanced-settings";
import { GuideContentModal } from "@/components/modals/guide-content-modal";
import { GuideModal } from "@/components/modals/guide-modal";
import { InboxNotificationModal } from "@/components/modals/inbox-notification-modal";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useBookStore } from "@/stores/book-store";
import { useInboxStore } from "@/stores/inbox-store";

type TitleKey =
  | "home"
  | "dashboard"
  | "chapters"
  | "notes"
  | "character_detail"
  | "character_power"
  | "item_detail"
  | "item_timeline"
  | "race_detail"
  | "faction_detail"
  | "organization_detail"
  | "plot_detail"
  | "plot_timeline"
  | "region_detail"
  | "region_map"
  | "power_system_detail"
  | "note_detail"
  | "fallback";

const getPageTitleKey = (pathname: string): TitleKey => {
  if (pathname === "/") return "home";

  // Notes standalone pages
  if (pathname.startsWith("/notes/")) return "note_detail";
  if (pathname === "/notes") return "notes";

  if (pathname.includes("/dashboard/")) {
    // Chapters
    if (pathname.includes("/chapters")) return "chapters";

    // Notes within dashboard
    if (pathname.includes("/notes")) return "notes";

    // Character pages
    if (pathname.includes("/character/")) {
      if (pathname.includes("/power.")) return "character_power";
      return "character_detail";
    }

    // Item pages
    if (pathname.includes("/item/")) {
      if (pathname.endsWith("/timeline")) return "item_timeline";
      return "item_detail";
    }

    // Race pages
    if (pathname.includes("/race/")) return "race_detail";

    // Faction pages
    if (pathname.includes("/faction/")) return "faction_detail";

    // Organization pages
    if (pathname.includes("/organization/")) return "organization_detail";

    // Plot pages
    if (pathname.includes("/plot/")) {
      if (pathname.includes("/plot-timeline")) return "plot_timeline";
      return "plot_detail";
    }

    // World/Region pages
    if (pathname.includes("/world/")) {
      if (pathname.endsWith("/map")) return "region_map";
      return "region_detail";
    }

    // Power System pages
    if (pathname.includes("/power-system/")) return "power_system_detail";

    return "dashboard";
  }

  return "fallback";
};

export const TitleBar = () => {
  const routerState = useRouterState();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [controlsPosition, setControlsPosition] = useState({
    top: 0,
    right: 0,
  });
  const { t: tInbox } = useTranslation("inbox");
  const { t: tCommon } = useTranslation("common");
  const { t: tSettings } = useTranslation("settings");
  const messages = useInboxStore((state) => state.messages);
  const markAllAsRead = useInboxStore((state) => state.markAllAsRead);
  const { books } = useBookStore();

  const { pathname } = routerState.location;
  const pageTitleKey = getPageTitleKey(pathname);
  const pageTitle = tCommon(`title_bar.${pageTitleKey}`);
  const unreadCount = messages.filter(
    (msg) => !msg.isDeleted && !msg.isRead
  ).length;

  // Extract book ID from pathname and get book name
  const bookInfo = useMemo(() => {
    const dashboardMatch = pathname.match(/\/dashboard\/([^/]+)/);
    if (dashboardMatch && dashboardMatch[1]) {
      const bookId = dashboardMatch[1];
      const book = books.find((b) => b.id === bookId);
      return book ? { id: bookId, name: book.title } : null;
    }
    return null;
  }, [pathname, books]);

  // Construct final title with book name if available
  const finalTitle = useMemo(() => {
    if (bookInfo) {
      return `${bookInfo.name}: ${pageTitle}`;
    }
    return pageTitle;
  }, [bookInfo, pageTitle]);

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

  // Listen for custom event to open guides modal
  useEffect(() => {
    const handleOpenGuides = () => {
      setIsGuidesOpen(true);
    };

    window.addEventListener("open-guides-modal", handleOpenGuides);
    return () => window.removeEventListener("open-guides-modal", handleOpenGuides);
  }, []);

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
        <div data-tauri-drag-region className="flex items-center gap-2 px-4">
          <img
            src="/assets/logos/logo.png"
            alt="Grimorium"
            className="h-4 w-4 pointer-events-none"
          />
          <span className="text-sm font-semibold text-foreground/80 pointer-events-none">
            Grimorium
          </span>
        </div>

        {/* Center section - Page title */}
        <div
          data-tauri-drag-region
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <span className="text-sm font-medium text-foreground pointer-events-none">
            {finalTitle}
          </span>
        </div>

        {/* Right section - Guides, Settings, Inbox and placeholder for window controls */}
        <div data-tauri-drag-region className="flex items-center">
          <TooltipProvider>
            <Tooltip open={isGuidesOpen ? false : undefined}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isModalOpen}
                  onClick={() => setIsGuidesOpen(!isGuidesOpen)}
                  className={cn(
                    "h-8 w-12 rounded-none hover:bg-gray-50 hover:text-secondary",
                    "transition-colors duration-200",
                    isGuidesOpen && "bg-gray-50 text-secondary",
                    isModalOpen && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label="Guides"
                >
                  <BookOpen
                    className={cn("h-4 w-4 transition-colors duration-200")}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{tCommon("guides.tooltip")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip open={isSettingsOpen ? false : undefined}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isModalOpen}
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={cn(
                    "h-8 w-12 rounded-none hover:bg-gray-50 hover:text-secondary",
                    "transition-colors duration-200",
                    isSettingsOpen && "bg-gray-50 text-secondary",
                    isModalOpen && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label="Settings"
                >
                  <Settings
                    className={cn("h-4 w-4 transition-colors duration-200")}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{tSettings("title")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip open={isInboxOpen ? false : undefined}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isModalOpen}
                  onClick={() => setIsInboxOpen(!isInboxOpen)}
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
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{tInbox("tooltip")}</p>
              </TooltipContent>
            </Tooltip>
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

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuidesOpen}
        onClose={() => setIsGuidesOpen(false)}
        onGuideSelect={(guideId) => setSelectedGuideId(guideId)}
      />

      {/* Guide Content Modal - Fullscreen */}
      {selectedGuideId && (
        <GuideContentModal
          isOpen={!!selectedGuideId}
          onClose={() => setSelectedGuideId(null)}
          guideId={selectedGuideId}
        />
      )}

      {/* Inbox Notification Modal - Custom modal, não usa Popover */}
      <InboxNotificationModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />

      {/* Advanced Settings Modal */}
      <AdvancedSettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
