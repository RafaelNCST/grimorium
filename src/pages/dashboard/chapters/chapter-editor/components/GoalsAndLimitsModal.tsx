/**
 * Modal de Metas e Limites
 *
 * Permite configurar metas (objetivos a alcançar) e limites (valores máximos)
 * para o capítulo individual.
 */

import { useState } from "react";

import { Target, AlertTriangle, Clock, ChevronUp, ChevronDown } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ChapterGoals,
  ChapterLimits,
  DEFAULT_CHAPTER_GOALS,
  DEFAULT_CHAPTER_LIMITS,
} from "../types/goals-and-limits";

interface GoalsAndLimitsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goals: ChapterGoals;
  limits: ChapterLimits;
  onSave: (goals: ChapterGoals, limits: ChapterLimits) => void;
}

export function GoalsAndLimitsModal({
  open,
  onOpenChange,
  goals,
  limits,
  onSave,
}: GoalsAndLimitsModalProps) {
  const [localGoals, setLocalGoals] = useState<ChapterGoals>(goals);
  const [localLimits, setLocalLimits] = useState<ChapterLimits>(limits);

  const handleSave = () => {
    onSave(localGoals, localLimits);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[850px] min-w-[850px] max-w-[850px] h-[700px] min-h-[700px] max-h-[700px] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Metas e Limites</DialogTitle>
          <DialogDescription>
            Configure metas e limites para este capítulo. Avisos serão criados
            quando os valores configurados forem atingidos.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="goals" className="mt-4 w-full flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full h-10 flex items-center justify-start rounded-md bg-transparent p-1 text-muted-foreground">
            <TabsTrigger
              value="goals"
              className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
            >
              <Target className="w-4 h-4" />
              Metas
            </TabsTrigger>
            <TabsTrigger
              value="limits"
              className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
            >
              <AlertTriangle className="w-4 h-4" />
              Limites
            </TabsTrigger>
          </TabsList>

          {/* Tab de Metas */}
          <TabsContent value="goals" className="space-y-6 mt-6 pb-6 pr-4 w-full flex-1 overflow-y-auto">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Metas</strong> são
                objetivos que você deseja alcançar. Um aviso será criado quando
                você atingir a porcentagem configurada.
              </p>
            </div>

            {/* Meta de Palavras */}
            <GoalConfig
              enabled={localGoals.words?.enabled ?? false}
              target={localGoals.words?.target ?? DEFAULT_CHAPTER_GOALS.words!.target}
              warnAt90={localGoals.words?.warnAt90 ?? DEFAULT_CHAPTER_GOALS.words!.warnAt90}
              warnAt100={localGoals.words?.warnAt100 ?? DEFAULT_CHAPTER_GOALS.words!.warnAt100}
              label="Meta de Palavras"
              description="Defina quantas palavras deseja escrever"
              unit="palavras"
              onEnabledChange={(enabled) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words!, enabled },
                })
              }
              onTargetChange={(target) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words!, target },
                })
              }
              onWarnAt90Change={(warnAt90) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words!, warnAt90 },
                })
              }
              onWarnAt100Change={(warnAt100) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words!, warnAt100 },
                })
              }
            />

            <Separator />

            {/* Meta de Caracteres */}
            <GoalConfig
              enabled={localGoals.characters?.enabled ?? false}
              target={
                localGoals.characters?.target ??
                DEFAULT_CHAPTER_GOALS.characters!.target
              }
              warnAt90={
                localGoals.characters?.warnAt90 ??
                DEFAULT_CHAPTER_GOALS.characters!.warnAt90
              }
              warnAt100={
                localGoals.characters?.warnAt100 ??
                DEFAULT_CHAPTER_GOALS.characters!.warnAt100
              }
              label="Meta de Caracteres"
              description="Defina quantos caracteres deseja escrever"
              unit="caracteres"
              onEnabledChange={(enabled) =>
                setLocalGoals({
                  ...localGoals,
                  characters: { ...localGoals.characters!, enabled },
                })
              }
              onTargetChange={(target) =>
                setLocalGoals({
                  ...localGoals,
                  characters: { ...localGoals.characters!, target },
                })
              }
              onWarnAt90Change={(warnAt90) =>
                setLocalGoals({
                  ...localGoals,
                  characters: { ...localGoals.characters!, warnAt90 },
                })
              }
              onWarnAt100Change={(warnAt100) =>
                setLocalGoals({
                  ...localGoals,
                  characters: { ...localGoals.characters!, warnAt100 },
                })
              }
            />
          </TabsContent>

          {/* Tab de Limites */}
          <TabsContent value="limits" className="space-y-6 mt-6 pb-6 pr-4 w-full flex-1 overflow-y-auto">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Limites</strong> são
                valores máximos recomendados. Um aviso será criado quando você
                ultrapassar a porcentagem configurada.
              </p>
            </div>

            {/* Limite de Palavras */}
            <LimitConfig
              enabled={localLimits.words?.enabled ?? false}
              limit={
                localLimits.words?.limit ?? DEFAULT_CHAPTER_LIMITS.words!.limit
              }
              warnAt90={
                localLimits.words?.warnAt90 ??
                DEFAULT_CHAPTER_LIMITS.words!.warnAt90
              }
              warnAt100={
                localLimits.words?.warnAt100 ??
                DEFAULT_CHAPTER_LIMITS.words!.warnAt100
              }
              label="Limite de Palavras"
              description="Máximo de palavras recomendado para o capítulo"
              unit="palavras"
              onEnabledChange={(enabled) =>
                setLocalLimits({
                  ...localLimits,
                  words: { ...localLimits.words!, enabled },
                })
              }
              onLimitChange={(limit) =>
                setLocalLimits({
                  ...localLimits,
                  words: { ...localLimits.words!, limit },
                })
              }
              onWarnAt90Change={(warnAt90) =>
                setLocalLimits({
                  ...localLimits,
                  words: { ...localLimits.words!, warnAt90 },
                })
              }
              onWarnAt100Change={(warnAt100) =>
                setLocalLimits({
                  ...localLimits,
                  words: { ...localLimits.words!, warnAt100 },
                })
              }
            />

            <Separator />

            {/* Limite de Caracteres */}
            <LimitConfig
              enabled={localLimits.characters?.enabled ?? false}
              limit={
                localLimits.characters?.limit ??
                DEFAULT_CHAPTER_LIMITS.characters!.limit
              }
              warnAt90={
                localLimits.characters?.warnAt90 ??
                DEFAULT_CHAPTER_LIMITS.characters!.warnAt90
              }
              warnAt100={
                localLimits.characters?.warnAt100 ??
                DEFAULT_CHAPTER_LIMITS.characters!.warnAt100
              }
              label="Limite de Caracteres"
              description="Máximo de caracteres recomendado para o capítulo"
              unit="caracteres"
              onEnabledChange={(enabled) =>
                setLocalLimits({
                  ...localLimits,
                  characters: { ...localLimits.characters!, enabled },
                })
              }
              onLimitChange={(limit) =>
                setLocalLimits({
                  ...localLimits,
                  characters: { ...localLimits.characters!, limit },
                })
              }
              onWarnAt90Change={(warnAt90) =>
                setLocalLimits({
                  ...localLimits,
                  characters: { ...localLimits.characters!, warnAt90 },
                })
              }
              onWarnAt100Change={(warnAt100) =>
                setLocalLimits({
                  ...localLimits,
                  characters: { ...localLimits.characters!, warnAt100 },
                })
              }
            />

            <Separator />

            {/* Limite de Sessão */}
            <SessionLimitConfig
              enabled={localLimits.session?.enabled ?? false}
              minutes={
                localLimits.session?.minutes ??
                DEFAULT_CHAPTER_LIMITS.session!.minutes
              }
              warnAt90={
                localLimits.session?.warnAt90 ??
                DEFAULT_CHAPTER_LIMITS.session!.warnAt90
              }
              warnAt100={
                localLimits.session?.warnAt100 ??
                DEFAULT_CHAPTER_LIMITS.session!.warnAt100
              }
              onEnabledChange={(enabled) =>
                setLocalLimits({
                  ...localLimits,
                  session: { ...localLimits.session!, enabled },
                })
              }
              onMinutesChange={(minutes) =>
                setLocalLimits({
                  ...localLimits,
                  session: { ...localLimits.session!, minutes },
                })
              }
              onWarnAt90Change={(warnAt90) =>
                setLocalLimits({
                  ...localLimits,
                  session: { ...localLimits.session!, warnAt90 },
                })
              }
              onWarnAt100Change={(warnAt100) =>
                setLocalLimits({
                  ...localLimits,
                  session: { ...localLimits.session!, warnAt100 },
                })
              }
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="magical" onClick={handleSave}>
            Salvar Configurações
          </Button>
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
  label: string;
  description: string;
  unit: string;
  onEnabledChange: (enabled: boolean) => void;
  onTargetChange: (target: number) => void;
  onWarnAt90Change: (warnAt90: boolean) => void;
  onWarnAt100Change: (warnAt100: boolean) => void;
}

function GoalConfig({
  enabled,
  target,
  warnAt90,
  warnAt100,
  label,
  description,
  unit,
  onEnabledChange,
  onTargetChange,
  onWarnAt90Change,
  onWarnAt100Change,
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface LimitConfigProps {
  enabled: boolean;
  limit: number;
  warnAt90: boolean;
  warnAt100: boolean;
  label: string;
  description: string;
  unit: string;
  onEnabledChange: (enabled: boolean) => void;
  onLimitChange: (limit: number) => void;
  onWarnAt90Change: (warnAt90: boolean) => void;
  onWarnAt100Change: (warnAt100: boolean) => void;
}

function LimitConfig({
  enabled,
  limit,
  warnAt90,
  warnAt100,
  label,
  description,
  unit,
  onEnabledChange,
  onLimitChange,
  onWarnAt90Change,
  onWarnAt100Change,
}: LimitConfigProps) {
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
        <div className="space-y-4 pl-4 border-l-2 border-amber-500/20">
          <div>
            <Label>Limite máximo ({unit})</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                value={limit}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value) && value >= 1) {
                    onLimitChange(value);
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
                  onClick={() => onLimitChange(limit + 1)}
                  className="h-5 px-2"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onLimitChange(Math.max(1, limit - 1))}
                  className="h-5 px-2"
                  disabled={limit <= 1}
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
                  id={`${label}-limit-90`}
                  checked={warnAt90}
                  onCheckedChange={(checked) => onWarnAt90Change(checked === true)}
                />
                <label
                  htmlFor={`${label}-limit-90`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  90% do limite
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${label}-limit-100`}
                  checked={warnAt100}
                  onCheckedChange={(checked) => onWarnAt100Change(checked === true)}
                />
                <label
                  htmlFor={`${label}-limit-100`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  100% do limite (ultrapassado)
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SessionLimitConfigProps {
  enabled: boolean;
  minutes: number;
  warnAt90: boolean;
  warnAt100: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onMinutesChange: (minutes: number) => void;
  onWarnAt90Change: (warnAt90: boolean) => void;
  onWarnAt100Change: (warnAt100: boolean) => void;
}

function SessionLimitConfig({
  enabled,
  minutes,
  warnAt90,
  warnAt100,
  onEnabledChange,
  onMinutesChange,
  onWarnAt90Change,
  onWarnAt100Change,
}: SessionLimitConfigProps) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Limite de Sessão
          </Label>
          <p className="text-sm text-muted-foreground">
            Tempo máximo recomendado de escrita contínua
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      {enabled && (
        <div className="space-y-4 pl-4 border-l-2 border-amber-500/20">
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
                      onMinutesChange(value * 60 + mins);
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
                    onClick={() => onMinutesChange(Math.min(23, hours + 1) * 60 + mins)}
                    className="h-5 px-2"
                    disabled={hours >= 23}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onMinutesChange(Math.max(0, hours - 1) * 60 + mins)}
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
                      onMinutesChange(hours * 60 + value);
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
                    onClick={() => onMinutesChange(hours * 60 + Math.min(59, mins + 1))}
                    className="h-5 px-2"
                    disabled={mins >= 59}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onMinutesChange(hours * 60 + Math.max(0, mins - 1))}
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
                  id="session-limit-90"
                  checked={warnAt90}
                  onCheckedChange={(checked) => onWarnAt90Change(checked === true)}
                />
                <label
                  htmlFor="session-limit-90"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  90% do tempo limite
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="session-limit-100"
                  checked={warnAt100}
                  onCheckedChange={(checked) => onWarnAt100Change(checked === true)}
                />
                <label
                  htmlFor="session-limit-100"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  100% do tempo limite (ultrapassado)
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
