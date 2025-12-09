import { useState } from "react";

import { RouterProvider, createRouter } from "@tanstack/react-router";

import { ResetDatabaseButton } from "@/components/dev-tools/reset-database-button";
import { InboxInitializer } from "@/components/inbox-initializer";
import { SplashScreen } from "@/components/splash-screen";
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

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onLoadingComplete={() => setShowSplash(false)} />;
  }

  return (
    <TooltipProvider>
      <InboxInitializer />
      <RouterProvider router={router} />
      <ResetDatabaseButton />
    </TooltipProvider>
  );
};

export default App;
