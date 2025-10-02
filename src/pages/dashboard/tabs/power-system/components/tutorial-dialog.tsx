import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ITutorialStep {
  title: string;
  content: string;
  target: string | null;
}

interface PropsTutorialDialog {
  isOpen: boolean;
  step: number;
  steps: ITutorialStep[];
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export function TutorialDialog({
  isOpen,
  step,
  steps,
  onNext,
  onPrev,
  onClose,
}: PropsTutorialDialog) {
  if (!isOpen) return null;

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{currentStep.title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-muted-foreground mb-6">{currentStep.content}</p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {step + 1} de {steps.length}
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={onPrev}>
                Anterior
              </Button>
            )}

            {isLastStep ? (
              <Button size="sm" onClick={onClose}>
                Finalizar
              </Button>
            ) : (
              <Button size="sm" onClick={onNext}>
                Próximo
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
