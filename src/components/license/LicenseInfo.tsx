import { useState } from "react";

import { Calendar, Check, Clock, Key, RefreshCw } from "lucide-react";

import { useLicense } from "@/hooks/useLicense";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

/**
 * Component to display license information and status.
 * Can be added to settings/about page.
 */
export function LicenseInfo() {
  const { status, loading, checkStatus, isLicensed, daysRemaining, resetLicense } =
    useLicense();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (
      !confirm(
        "Are you sure you want to reset the license? This will restart your trial period (dev only)."
      )
    ) {
      return;
    }

    setIsResetting(true);
    await resetLicense();
    setIsResetting(false);
  };

  if (loading || !status) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading license information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const firstRunDate = new Date(status.first_run_date);
  const formattedDate = firstRunDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          License Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* License Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          {isLicensed ? (
            <Badge variant="default" className="gap-1">
              <Check className="w-3 h-3" />
              Licensed
            </Badge>
          ) : status.trial_expired ? (
            <Badge variant="destructive" className="gap-1">
              <Clock className="w-3 h-3" />
              Trial Expired
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <Clock className="w-3 h-3" />
              Trial Active
            </Badge>
          )}
        </div>

        {/* Days Remaining (only show if on trial) */}
        {!isLicensed && !status.trial_expired && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Days Remaining</span>
            <span className="text-sm font-semibold text-primary">
              {daysRemaining} days
            </span>
          </div>
        )}

        {/* First Run Date */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">First Run</span>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>

          {/* Dev-only reset button */}
          {import.meta.env.DEV && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
              disabled={isResetting}
              className="w-full"
            >
              {isResetting ? "Resetting..." : "Reset License (Dev Only)"}
            </Button>
          )}
        </div>

        {!isLicensed && (
          <div className="pt-2 text-xs text-center text-muted-foreground">
            Need a license?{" "}
            <a
              href="https://yourwebsite.com/purchase"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Purchase here
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
