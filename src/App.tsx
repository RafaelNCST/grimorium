import { useState } from "react";

import { RouterProvider, createRouter } from "@tanstack/react-router";

import { ResetDatabaseButton } from "@/components/dev-tools/reset-database-button";
import { InboxInitializer } from "@/components/inbox-initializer";
import { SplashScreen } from "@/components/splash-screen";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalGoalsProvider } from "@/contexts/GlobalGoalsContext";
import { WarningsSettingsProvider } from "@/contexts/WarningsSettingsContext";

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

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onLoadingComplete={() => setShowSplash(false)} />;
  }

  return (
    <WarningsSettingsProvider>
      <GlobalGoalsProvider>
        <TooltipProvider>
          <InboxInitializer />
          <RouterProvider router={router} />
          <ResetDatabaseButton />
        </TooltipProvider>
      </GlobalGoalsProvider>
    </WarningsSettingsProvider>
  );
};

export default App;
