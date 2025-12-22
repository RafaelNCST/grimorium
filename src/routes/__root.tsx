import { useState, useEffect } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { TitleBar } from "@/components/title-bar";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WelcomeModal } from "@/components/modals/welcome-modal";

const WELCOME_MODAL_KEY = "grimorium-welcome-shown";

const RootLayout = () => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(WELCOME_MODAL_KEY);
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem(WELCOME_MODAL_KEY, "true");
    setShowWelcome(false);
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden">
        <TitleBar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      <Sonner />
      <TanStackRouterDevtools />
      <WelcomeModal open={showWelcome} onClose={handleCloseWelcome} />
    </TooltipProvider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
