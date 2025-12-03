/**
 * Modal de Metas Globais
 *
 * Permite configurar metas globais que se aplicam a todos os capítulos,
 * com opções de filtro por status do capítulo.
 */

import { useState, useEffect } from "react";

import { Target, Clock, ChevronUp, ChevronDown, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  GlobalGoals,
  DEFAULT_GLOBAL_GOALS,
  CHAPTER_STATUS_LABELS,
  ChapterStatus,
} from "@/types/global-goals";

interface GlobalGoalsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goals: GlobalGoals;
  onSave: (goals: GlobalGoals) => void;
}

export function GlobalGoalsModal({
  open,
  onOpenChange,
  goals,
  onSave,
}: GlobalGoalsModalProps) {
  const [localGoals, setLocalGoals] = useState<GlobalGoals>(goals);

  // Reseta o estado local sempre que o modal abrir ou as goals mudarem
  useEffect(() => {
    if (open) {
      setLocalGoals(goals);
    }
  }, [open, goals]);

  const handleSave = () => {
    onSave(localGoals);
    onOpenChange(false);
  };

  const toggleStatus = (status: ChapterStatus) => {
    setLocalGoals((prev) => {
      const newAppliesTo = prev.appliesTo.includes(status)
        ? prev.appliesTo.filter((s) => s !== status)
        : [...prev.appliesTo, status];
      return { ...prev, appliesTo: newAppliesTo };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[850px] min-w-[850px] max-w-[850px] h-[700px] min-h-[700px] max-h-[700px] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Target className="w-6 h-6" />
            Metas Globais
          </DialogTitle>
          <DialogDescription>
            Configure metas que se aplicam a todos os capítulos do livro.
            Escolha os tipos de status onde as metas serão aplicadas.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 w-full flex-1 flex flex-col overflow-hidden">
          <div className="space-y-6 pb-6 pr-4 w-full flex-1 overflow-y-auto">
            {/* Info sobre metas globais */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">
                      Estas metas se aplicam a todos os capítulos
                    </strong>{" "}
                    que possuem os status selecionados abaixo. Os números da
                    barra de estatísticas mudarão de cor gradualmente conforme
                    você se aproxima da meta.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      <strong>Cor normal:</strong> Abaixo de 90% da meta
                    </li>
                    <li>
                      <strong>Amarelo:</strong> Entre 90% e 100% da meta
                    </li>
                    <li>
                      <strong>Vermelho:</strong> Meta atingida ou ultrapassada
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Aplicar a quais status */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Aplicar metas aos capítulos com status:
              </Label>
              <div className="grid grid-cols-2 gap-3 pl-4">
                {(
                  [
                    "draft",
                    "in-progress",
                    "review",
                    "finished",
                    "published",
                  ] as ChapterStatus[]
                ).map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={localGoals.appliesTo.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    />
                    <label
                      htmlFor={`status-${status}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {CHAPTER_STATUS_LABELS[status]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Meta de Palavras */}
            <GoalConfig
              enabled={localGoals.words.enabled}
              target={localGoals.words.target}
              warnAt90={localGoals.words.warnAt90}
              warnAt100={localGoals.words.warnAt100}
              silent={localGoals.words.silent}
              label="Meta de Palavras"
              description="Quantas palavras deseja escrever por capítulo"
              unit="palavras"
              onEnabledChange={(enabled) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words, enabled },
                })
              }
              onTargetChange={(target) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words, target },
                })
              }
              onWarnAt90Change={(warnAt90) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words, warnAt90, silent: warnAt90 ? false : localGoals.words.silent },
                })
              }
              onWarnAt100Change={(warnAt100) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words, warnAt100, silent: warnAt100 ? false : localGoals.words.silent },
                })
              }
              onSilentChange={(silent) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words, silent, warnAt90: silent ? false : localGoals.words.warnAt90, warnAt100: silent ? false : localGoals.words.warnAt100 },
                })
              }
            />

            <Separator />

            {/* Meta de Caracteres */}
            <GoalConfig
              enabled={localGoals.characters.enabled}
              target={localGoals.characters.target}
              warnAt90={localGoals.characters.warnAt90}
              warnAt100={localGoals.characters.warnAt100}
              silent={localGoals.characters.silent}
              label="Meta de Caracteres"
              description="Quantos caracteres deseja escrever por capítulo"
              unit="caracteres"
              onEnabledChange={(enabled) =>
                setLocalGoals({
                  ...localGoals,
                  characters: { ...localGoals.characters, enabled },
                })
              }
              onTargetChange={(target) =>
                setLocalGoals({
                  ...localGoals,
                  characters: { ...localGoals.characters, target },
                })
              }
              onWarnAt90Change={(warnAt90) =>
                setLocalGoals({
                  ...localGoals,
                  characters: { ...localGoals.characters, warnAt90, silent: warnAt90 ? false : localGoals.characters.silent },
                })
              }
              onWarnAt100Change={(warnAt100) =>
                setLocalGoals({
                  ...localGoals,
                  characters: { ...localGoals.characters, warnAt100, silent: warnAt100 ? false : localGoals.characters.silent },
                })
              }
              onSilentChange={(silent) =>
                setLocalGoals({
                  ...localGoals,
                  characters: { ...localGoals.characters, silent, warnAt90: silent ? false : localGoals.characters.warnAt90, warnAt100: silent ? false : localGoals.characters.warnAt100 },
                })
              }
            />

            <Separator />

            {/* Meta de Tempo de Sessão */}
            <SessionTimeGoalConfig
              enabled={localGoals.sessionTime.enabled}
              targetMinutes={localGoals.sessionTime.targetMinutes}
              warnAt90={localGoals.sessionTime.warnAt90}
              warnAt100={localGoals.sessionTime.warnAt100}
              silent={localGoals.sessionTime.silent}
              onEnabledChange={(enabled) =>
                setLocalGoals({
                  ...localGoals,
                  sessionTime: { ...localGoals.sessionTime, enabled },
                })
              }
              onTargetMinutesChange={(targetMinutes) =>
                setLocalGoals({
                  ...localGoals,
                  sessionTime: { ...localGoals.sessionTime, targetMinutes },
                })
              }
              onWarnAt90Change={(warnAt90) =>
                setLocalGoals({
                  ...localGoals,
                  sessionTime: { ...localGoals.sessionTime, warnAt90, silent: warnAt90 ? false : localGoals.sessionTime.silent },
                })
              }
              onWarnAt100Change={(warnAt100) =>
                setLocalGoals({
                  ...localGoals,
                  sessionTime: { ...localGoals.sessionTime, warnAt100, silent: warnAt100 ? false : localGoals.sessionTime.silent },
                })
              }
              onSilentChange={(silent) =>
                setLocalGoals({
                  ...localGoals,
                  sessionTime: { ...localGoals.sessionTime, silent, warnAt90: silent ? false : localGoals.sessionTime.warnAt90, warnAt100: silent ? false : localGoals.sessionTime.warnAt100 },
                })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="magical" onClick={handleSave}>
              Salvar Metas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface GoalConfigProps {
  enabled: boolean;
  target: number;
  warnAt90: boolean;
  warnAt100: boolean;
  silent: boolean;
  label: string;
  description: string;
  unit: string;
  onEnabledChange: (enabled: boolean) => void;
  onTargetChange: (target: number) => void;
  onWarnAt90Change: (warnAt90: boolean) => void;
  onWarnAt100Change: (warnAt100: boolean) => void;
  onSilentChange: (silent: boolean) => void;
}

function GoalConfig({
  enabled,
  target,
  warnAt90,
  warnAt100,
  silent,
  label,
  description,
  unit,
  onEnabledChange,
  onTargetChange,
  onWarnAt90Change,
  onWarnAt100Change,
  onSilentChange,
}: GoalConfigProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold">{label}</Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      {enabled && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <div>
            <Label>Meta ({unit})</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                value={target}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value) && value >= 1) {
                    onTargetChange(value);
                  }
                }}
                min={1}
                className="flex-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <div className="flex flex-col gap-0.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onTargetChange(target + 1)}
                  className="h-5 px-2"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onTargetChange(Math.max(1, target - 1))}
                  className="h-5 px-2"
                  disabled={target <= 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Avisar quando atingir:</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${label}-90`}
                  checked={warnAt90}
                  onCheckedChange={(checked) => onWarnAt90Change(checked === true)}
                />
                <label
                  htmlFor={`${label}-90`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  90% da meta
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${label}-100`}
                  checked={warnAt100}
                  onCheckedChange={(checked) => onWarnAt100Change(checked === true)}
                />
                <label
                  htmlFor={`${label}-100`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  100% da meta (atingida)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${label}-silent`}
                  checked={silent}
                  onCheckedChange={(checked) => onSilentChange(checked === true)}
                />
                <label
                  htmlFor={`${label}-silent`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Silencioso (apenas visual)
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SessionTimeGoalConfigProps {
  enabled: boolean;
  targetMinutes: number;
  warnAt90: boolean;
  warnAt100: boolean;
  silent: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onTargetMinutesChange: (minutes: number) => void;
  onWarnAt90Change: (warnAt90: boolean) => void;
  onWarnAt100Change: (warnAt100: boolean) => void;
  onSilentChange: (silent: boolean) => void;
}

function SessionTimeGoalConfig({
  enabled,
  targetMinutes,
  warnAt90,
  warnAt100,
  silent,
  onEnabledChange,
  onTargetMinutesChange,
  onWarnAt90Change,
  onWarnAt100Change,
  onSilentChange,
}: SessionTimeGoalConfigProps) {
  const hours = Math.floor(targetMinutes / 60);
  const mins = targetMinutes % 60;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Meta de Tempo de Sessão
          </Label>
          <p className="text-sm text-muted-foreground">
            Tempo meta para cada sessão de escrita
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      {enabled && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Horas</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={hours}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) && value >= 0 && value <= 23) {
                      onTargetMinutesChange(value * 60 + mins);
                    }
                  }}
                  min={0}
                  max={23}
                  className="flex-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <div className="flex flex-col gap-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onTargetMinutesChange(Math.min(23, hours + 1) * 60 + mins)
                    }
                    className="h-5 px-2"
                    disabled={hours >= 23}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onTargetMinutesChange(Math.max(0, hours - 1) * 60 + mins)
                    }
                    className="h-5 px-2"
                    disabled={hours <= 0}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Label>Minutos</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={mins}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) && value >= 0 && value <= 59) {
                      onTargetMinutesChange(hours * 60 + value);
                    }
                  }}
                  min={0}
                  max={59}
                  className="flex-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <div className="flex flex-col gap-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onTargetMinutesChange(hours * 60 + Math.min(59, mins + 1))
                    }
                    className="h-5 px-2"
                    disabled={mins >= 59}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onTargetMinutesChange(hours * 60 + Math.max(0, mins - 1))
                    }
                    className="h-5 px-2"
                    disabled={mins <= 0}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Avisar quando atingir:</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="session-time-90"
                  checked={warnAt90}
                  onCheckedChange={(checked) => onWarnAt90Change(checked === true)}
                />
                <label
                  htmlFor="session-time-90"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  90% do tempo meta
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="session-time-100"
                  checked={warnAt100}
                  onCheckedChange={(checked) => onWarnAt100Change(checked === true)}
                />
                <label
                  htmlFor="session-time-100"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  100% do tempo meta (atingido)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="session-time-silent"
                  checked={silent}
                  onCheckedChange={(checked) => onSilentChange(checked === true)}
                />
                <label
                  htmlFor="session-time-silent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Silencioso (apenas visual)
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
