import { Download, Upload, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ITemplate } from "../types/power-system-types";

interface PropsTemplateDialog {
  isOpen: boolean;
  templates: ITemplate[];
  onOpenChange: (open: boolean) => void;
}

export function TemplateDialog({
  isOpen,
  templates,
  onOpenChange,
}: PropsTemplateDialog) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Templates</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Salvar como Template
            </Button>
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Carregar Template
            </Button>
          </div>

          {templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum template salvo ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="text-sm">{template.name}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      Usar
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
