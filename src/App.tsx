import { RouterProvider, createRouter } from "@tanstack/react-router";

import { InboxInitializer } from "@/components/inbox-initializer";
import { ThemeInitializer } from "@/components/theme-initializer";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => (
  <TooltipProvider>
    <ThemeInitializer />
    <InboxInitializer />
    <Toaster />
    <Sonner />
    <RouterProvider router={router} />
  </TooltipProvider>
);

export default App;
