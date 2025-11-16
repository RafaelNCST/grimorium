import { Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface InfoAlertProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoAlert({ children, className }: InfoAlertProps) {
  return (
    <Alert className={`bg-primary/10 border-primary/30 ${className || ""}`}>
      <Info className="h-4 w-4 text-primary" />
      <AlertDescription className="text-sm">{children}</AlertDescription>
    </Alert>
  );
}
