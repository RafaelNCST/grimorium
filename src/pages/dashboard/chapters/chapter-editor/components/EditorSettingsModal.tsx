import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import type {
  EditorSettings,
  AutoScrollMode,
  CursorColor,
} from "../types/editor-settings";
import { CURSOR_COLORS } from "../types/editor-settings";

interface EditorSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
}

export function EditorSettingsModal({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: EditorSettingsModalProps) {
  const updateSetting = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[75vw] max-h-[85vh] flex flex-col p-0 gap-0">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <DialogTitle>Configurações do Editor</DialogTitle>
            </div>
            <DialogDescription>
              Personalize sua experiência de escrita para maior conforto em longas sessões
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6 [&>*:not(:last-child)]:mb-6">
          {/* First Row: Auto Scroll + Typography */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Auto Scroll */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">Auto Scroll</Label>
                <p className="text-sm text-muted-foreground">
                  Controla onde o cursor fica posicionado durante a escrita
                </p>
              </div>
              <Select
                value={settings.autoScrollMode}
                onValueChange={(value: AutoScrollMode) =>
                  updateSetting('autoScrollMode', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Nenhum</SelectItem>
                  <SelectItem value="near-end">Perto do fim</SelectItem>
                  <SelectItem value="center">Sempre no meio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Visual Toggles */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Elementos Visuais</Label>
                <p className="text-sm text-muted-foreground">
                  Desative elementos que possam distrair durante a escrita
                </p>
              </div>

              {/* Annotation Highlights */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Destaque de Anotações</Label>
                  <p className="text-xs text-muted-foreground">
                    Mostra fundo colorido nas anotações
                  </p>
                </div>
                <Switch
                  checked={settings.showAnnotationHighlights}
                  onCheckedChange={(checked) =>
                    updateSetting('showAnnotationHighlights', checked)
                  }
                />
              </div>

              {/* Spell Check */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Corretor Ortográfico</Label>
                  <p className="text-xs text-muted-foreground">
                    Mostra sublinhados de erros gramaticais
                  </p>
                </div>
                <Switch
                  checked={settings.enableSpellCheck}
                  onCheckedChange={(checked) => updateSetting('enableSpellCheck', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Typography Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Tipografia</Label>
              <p className="text-sm text-muted-foreground">
                Ajuste espaçamento para melhor legibilidade
              </p>
            </div>

            {/* Line Height */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Altura da Linha</Label>
                <span className="text-sm text-muted-foreground">{settings.lineHeight}</span>
              </div>
              <Slider
                value={[settings.lineHeight]}
                onValueChange={([value]) => updateSetting('lineHeight', value)}
                min={1.0}
                max={2.5}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Menor: 1.0 (compacto) - Padrão: 1.6 - Maior: 2.5 (espaçoso)
              </p>
            </div>
          </div>

          <Separator />

          {/* Third Row: Theme + Cursor Color */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Theme */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">Tema Visual</Label>
                <p className="text-sm text-muted-foreground">
                  Ajuste as cores do editor para maior conforto
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Diminuir cansaço visual</Label>
                  <p className="text-xs text-muted-foreground">
                    Tom amarelado suave para reduzir fadiga visual
                  </p>
                </div>
                <Switch
                  checked={settings.sepiaMode}
                  onCheckedChange={(checked) => updateSetting('sepiaMode', checked)}
                />
              </div>
            </div>

            {/* Cursor Color */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">Cor do Cursor</Label>
                <p className="text-sm text-muted-foreground">
                  Escolha uma cor que seja confortável para seus olhos
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CURSOR_COLORS).map(([key, color]) => {
                  const colorKey = key as CursorColor;
                  const isSelected = settings.cursorColor === colorKey;

                  // Labels amigáveis
                  const labels: Record<CursorColor, string> = {
                    default: 'Padrão',
                    primary: 'Primária',
                    blue: 'Azul',
                    green: 'Verde',
                    purple: 'Roxo',
                    orange: 'Laranja',
                  };

                  return (
                    <button
                      key={key}
                      onClick={() => updateSetting('cursorColor', colorKey)}
                      className={`
                        flex items-center gap-2 p-2.5 rounded-lg border-2 transition-all
                        ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }
                      `}
                    >
                      <div
                        className="w-5 h-5 rounded border border-border flex-shrink-0"
                        style={{
                          background: color.startsWith('hsl')
                            ? color
                            : color,
                        }}
                      />
                      <span className="text-sm font-medium">{labels[colorKey]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-background rounded-b-lg">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
