import { useState } from "react";

import { KeyRound, Loader2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const IS_DEV = import.meta.env.DEV;

export function ResetLicenseButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    try {
      setResetting(true);
      await invoke("reset_license");
      // Recarregar a página para atualizar o estado da licença
      window.location.reload();
    } catch (error) {
      console.error("Failed to reset license:", error);
      alert("Failed to reset license. Check console for details.");
      setResetting(false);
    }
  };

  if (!IS_DEV) return null;

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-4 right-[11rem] z-50 gap-2"
      >
        <KeyRound className="h-4 w-4" />
        Reset License (DEV)
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset License</DialogTitle>
            <DialogDescription>
              This will delete your license data and return you to trial mode.
              The page will reload automatically. This action is for development
              only.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowConfirm(false)}
              disabled={resetting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleReset}
              disabled={resetting}
              className="gap-2 animate-glow-red"
            >
              {resetting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Confirm Reset
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
