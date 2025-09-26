import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { ThemeInitializer } from "@/components/theme-initializer";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const RootLayout = () => (
  <TooltipProvider>
    <ThemeInitializer />
    <Toaster />
    <Sonner />
    <Outlet />
    <TanStackRouterDevtools />
  </TooltipProvider>
);

export const Route = createRootRoute({
  component: RootLayout,
});
