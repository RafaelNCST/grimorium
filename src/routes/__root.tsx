import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { ThemeInitializer } from "@/components/theme-initializer";
import { TitleBar } from "@/components/title-bar";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const RootLayout = () => (
  <TooltipProvider>
    <ThemeInitializer />
    <div className="flex h-screen flex-col overflow-hidden">
      <TitleBar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
    <Toaster />
    <Sonner />
    <TanStackRouterDevtools />
  </TooltipProvider>
);

export const Route = createRootRoute({
  component: RootLayout,
});
