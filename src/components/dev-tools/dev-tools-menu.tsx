import { useState } from "react";

import { Wrench, Database, KeyRound, Calendar, Loader2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resetDatabase, getDatabasePath } from "@/lib/db/reset";

const IS_DEV = import.meta.env.DEV;

type ActionType = "reset-db" | "reset-license" | "reset-trial" | null;

export function DevToolsMenu() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [dbPath, setDbPath] = useState<string>("");

  const handleOpenConfirm = async (action: ActionType) => {
    setActionType(action);

    // Se for reset DB, buscar o path primeiro
    if (action === "reset-db") {
      try {
        const path = await getDatabasePath();
        setDbPath(path);
      } catch (error) {
        console.error(error);
      }
    }

    setShowConfirm(true);
  };

  const handleExecuteAction = async () => {
    if (!actionType) return;

    setIsExecuting(true);

    try {
      switch (actionType) {
        case "reset-db":
          await resetDatabase();
          // Reload page after 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          break;

        case "reset-license":
          await invoke("reset_license");
          window.location.reload();
          break;

        case "reset-trial":
          await invoke("reset_trial");
          window.location.reload();
          break;
      }
    } catch (error) {
      console.error(`Failed to execute ${actionType}:`, error);
      alert(`Failed to execute action. Check console for details.`);
      setIsExecuting(false);
      setShowConfirm(false);
    }
  };

  const getDialogContent = () => {
    switch (actionType) {
      case "reset-db":
        return {
          title: "Reset Database",
          description: (
            <>
              <p className="font-semibold text-foreground">
                ATTENTION: This action is irreversible!
              </p>
              <p className="mt-2">
                All database data will be permanently deleted:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                <li>All created books</li>
                <li>All characters</li>
                <li>Relationships and families</li>
                <li>Character versions</li>
                <li>All saved settings</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4 font-mono break-all">
                File: {dbPath}
              </p>
            </>
          ),
          buttonText: "Confirm Reset",
          icon: <Database className="h-4 w-4" />,
        };

      case "reset-license":
        return {
          title: "Reset License",
          description:
            "This will delete your license data and set trial as expired. You'll be returned to the expired trial screen. The page will reload automatically.",
          buttonText: "Reset License",
          icon: <KeyRound className="h-4 w-4" />,
        };

      case "reset-trial":
        return {
          title: "Reset Trial",
          description:
            "This will remove your license and create a fresh 30-day trial period. You'll become a Peasant again with full trial time. The page will reload automatically.",
          buttonText: "Reset Trial",
          icon: <Calendar className="h-4 w-4" />,
        };

      default:
        return {
          title: "",
          description: "",
          buttonText: "",
          icon: null,
        };
    }
  };

  const content = getDialogContent();

  if (!IS_DEV) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="fixed bottom-4 right-4 z-50 gap-2"
          >
            <Wrench className="h-4 w-4" />
            Dev Tools
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Development Tools</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleOpenConfirm("reset-db")}>
            <Database className="mr-2 h-4 w-4" />
            <span>Reset Database</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenConfirm("reset-license")}>
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Reset License</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenConfirm("reset-trial")}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Reset Trial</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              {content.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowConfirm(false)}
              disabled={isExecuting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleExecuteAction}
              disabled={isExecuting}
              className="gap-2 animate-glow-red"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  {content.icon}
                  {content.buttonText}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
