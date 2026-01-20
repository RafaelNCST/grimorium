import { useState } from "react";

import { RouterProvider, createRouter } from "@tanstack/react-router";

import { DevToolsMenu } from "@/components/dev-tools/dev-tools-menu";
import { LicenseGuard } from "@/components/license";
import { ChapterOrderWarningModal } from "@/components/modals/chapter-order-warning-modal";
import { DatabaseErrorModal } from "@/components/modals/database-error-modal";
import { SplashScreen } from "@/components/splash-screen";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAutomaticCleanup } from "@/hooks/useAutomaticCleanup";
import { ChapterArcWarningProvider } from "@/lib/helpers/chapter-arc-warning";
import { useErrorModalStore } from "@/stores/error-modal-store";

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
    <LicenseGuard>
      <TooltipProvider>
        <ChapterArcWarningProvider>
          <RouterProvider router={router} />
          <DevToolsMenu />

          {errorType && (
            <DatabaseErrorModal
              isOpen={isOpen}
              errorType={errorType}
              onClose={hideError}
            />
          )}

          <ChapterOrderWarningModal />
        </ChapterArcWarningProvider>
      </TooltipProvider>
    </LicenseGuard>
  );
};

export default App;
