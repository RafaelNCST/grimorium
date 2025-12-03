import { RouterProvider, createRouter } from "@tanstack/react-router";

import { ResetDatabaseButton } from "@/components/dev-tools/reset-database-button";
import { InboxInitializer } from "@/components/inbox-initializer";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalGoalsProvider } from "@/contexts/GlobalGoalsContext";

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
  <GlobalGoalsProvider>
    <TooltipProvider>
      <InboxInitializer />
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
      <ResetDatabaseButton />
    </TooltipProvider>
  </GlobalGoalsProvider>
);

export default App;
