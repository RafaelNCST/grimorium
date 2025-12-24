import { useState } from "react";

import { RouterProvider, createRouter } from "@tanstack/react-router";

import { ResetDatabaseButton } from "@/components/dev-tools/reset-database-button";
import { InboxInitializer } from "@/components/inbox-initializer";
import { DatabaseErrorModal } from "@/components/modals/database-error-modal";
import { SplashScreen } from "@/components/splash-screen";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAutomaticCleanup } from "@/hooks/useAutomaticCleanup";
import { useErrorModalStore } from "@/stores/error-modal-store";
import { ChapterArcWarningProvider } from "@/lib/helpers/chapter-arc-warning";

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
  const { isOpen, errorType, hideError } = useErrorModalStore();

  // Run automatic cleanup on app initialization
  useAutomaticCleanup();

  if (showSplash) {
    return <SplashScreen onLoadingComplete={() => setShowSplash(false)} />;
  }

  return (
    <TooltipProvider>
      <ChapterArcWarningProvider>
        <InboxInitializer />
        <RouterProvider router={router} />
        <ResetDatabaseButton />

        {errorType && (
          <DatabaseErrorModal
            isOpen={isOpen}
            errorType={errorType}
            onClose={hideError}
          />
        )}
      </ChapterArcWarningProvider>
    </TooltipProvider>
  );
};

export default App;
