import { ReactNode } from "react";

import { useTranslation } from "react-i18next";

import { useLicense } from "@/hooks/useLicense";

import { LicenseExpiredScreen } from "./LicenseExpiredScreen";
import { LoadingSpinner } from "../ui/loading-spinner";

interface LicenseGuardProps {
  children: ReactNode;
}

export function LicenseGuard({ children }: LicenseGuardProps) {
  const { status, loading } = useLicense();
  const { ready } = useTranslation();

  // Show loading state while checking license or i18n not ready
  if (loading || !status || !ready) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show expired screen if trial expired and not licensed
  if (status.trial_expired && !status.is_licensed) {
    return <LicenseExpiredScreen />;
  }

  // Show app normally
  return <>{children}</>;
}
