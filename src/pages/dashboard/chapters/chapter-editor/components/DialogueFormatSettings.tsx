import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import type { DialogueFormats } from '../types/search-types';

interface DialogueFormatSettingsProps {
  open: boolean;
  formats: DialogueFormats;
  onOpenChange: (open: boolean) => void;
  onApply: (formats: DialogueFormats) => void;
}

interface FormatOption {
  id: keyof DialogueFormats;
  label: string;
  symbol: string;
  example: string;
}

const formatOptions: FormatOption[] = [
  {
    id: 'doubleQuotes',
    label: 'Aspas duplas',
    symbol: '" "',
    example: '"Olá," disse João.',
  },
  {
    id: 'singleQuotes',
    label: 'Aspas simples',
    symbol: "' '",
    example: "'Espere,' ele respondeu.",
  },
  {
    id: 'emDash',
    label: 'Travessão',
    symbol: '—',
    example: '— Olá — disse João.',
  },
];

export function DialogueFormatSettings({
  open,
  formats,
  onOpenChange,
  onApply,
}: DialogueFormatSettingsProps) {
  const [localFormats, setLocalFormats] = useState<DialogueFormats>(formats);

  // Update local state when formats prop changes
  useEffect(() => {
    setLocalFormats(formats);
  }, [formats]);

  const handleToggle = (formatId: keyof DialogueFormats) => {
    setLocalFormats((prev) => {
      const newFormats = { ...prev, [formatId]: !prev[formatId] };

      // Ensure at least one format is selected
      const hasAtLeastOne = Object.values(newFormats).some((value) => value);
      if (!hasAtLeastOne) {
        return prev; // Don't allow deselecting the last one
      }

      return newFormats;
    });
  };

  const handleSelectAll = () => {
    setLocalFormats({
      doubleQuotes: true,
      singleQuotes: true,
      emDash: true,
    });
  };

  const handleApply = () => {
    onApply(localFormats);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalFormats(formats); // Reset to original
    onOpenChange(false);
  };

  const selectedCount = Object.values(localFormats).filter(Boolean).length;
  const isOnlyOneSelected = selectedCount === 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Formatos de Diálogo</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Selecione os formatos usados no seu texto (mínimo 1 obrigatório):
          </p>

          <div className="space-y-3">
            {formatOptions.map((option) => {
              const isChecked = localFormats[option.id];
              const isDisabled = isOnlyOneSelected && isChecked;

              return (
                <div
                  key={option.id}
                  className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    id={option.id}
                    checked={isChecked}
                    onCheckedChange={() => handleToggle(option.id)}
                    disabled={isDisabled}
                  />
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor={option.id}
                      className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer"
                    >
                      <span className="font-mono text-primary">
                        {option.symbol}
                      </span>
                      <span>{option.label}</span>
                    </label>
                    <p className="text-xs text-muted-foreground font-mono">
                      Ex: {option.example}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer" onClick={handleSelectAll}>
            <Checkbox
              id="select-all"
              checked={selectedCount === formatOptions.length}
              onCheckedChange={handleSelectAll}
            />
            <div className="flex-1 space-y-1">
              <label
                htmlFor="select-all"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Selecionar todos
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleApply}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
