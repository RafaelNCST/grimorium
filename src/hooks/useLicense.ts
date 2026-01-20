import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface LicenseStatus {
  is_trial: boolean;
  is_licensed: boolean;
  days_remaining: number;
  trial_expired: boolean;
  first_run_date: string;
}

export interface ActivateLicenseParams {
  email: string;
  license_key: string;
}

export function useLicense() {
  const [status, setStatus] = useState<LicenseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<LicenseStatus>("check_license_status");
      setStatus(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to check license status";
      setError(errorMessage);
      console.error("License check error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const activateLicense = useCallback(
    async (email: string, licenseKey: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        const result = await invoke<LicenseStatus>("activate_license_key", {
          email,
          licenseKey,
        });
        setStatus(result);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to activate license";
        setError(errorMessage);
        console.error("License activation error:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Only available in development mode
  const resetLicense = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await invoke<string>("reset_license");
      await checkStatus(); // Refresh status
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to reset license (may not be available in production)";
      setError(errorMessage);
      console.error("License reset error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [checkStatus]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    status,
    loading,
    error,
    checkStatus,
    activateLicense,
    resetLicense,
    // Helper computed properties
    isTrialExpired: status?.trial_expired ?? false,
    isLicensed: status?.is_licensed ?? false,
    daysRemaining: status?.days_remaining ?? 0,
  };
}
