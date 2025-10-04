import { useEffect, useState } from "react";

import { useRouterState } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Inbox, Minus, Square, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  const { pathname } = routerState.location;
  const pageTitle = getPageTitle(pathname);

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
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-12 rounded-none hover:bg-gray-50",
            "transition-colors duration-200"
          )}
          aria-label="Inbox"
        >
          <Inbox className="h-4 w-4" />
        </Button>
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
