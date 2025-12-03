/**
 * Modal de Metas e Limites
 *
 * Permite configurar metas (objetivos a alcançar) e limites (valores máximos)
 * para o capítulo individual.
 */

import { useState } from "react";

import { Target, AlertTriangle, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Slider } from "@/components/ui/slider";
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Metas e Limites</DialogTitle>
          <DialogDescription>
            Configure metas e limites para este capítulo. Avisos serão criados
            quando os valores configurados forem atingidos.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="goals" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="goals" className="gap-2">
              <Target className="w-4 h-4" />
              Metas
            </TabsTrigger>
            <TabsTrigger value="limits" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Limites
            </TabsTrigger>
          </TabsList>

          {/* Tab de Metas */}
          <TabsContent value="goals" className="space-y-6 mt-6">
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
              warnAt={localGoals.words?.warnAt ?? DEFAULT_CHAPTER_GOALS.words!.warnAt}
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
              onWarnAtChange={(warnAt) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words!, warnAt },
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
              warnAt={
                localGoals.characters?.warnAt ??
                DEFAULT_CHAPTER_GOALS.characters!.warnAt
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
              onWarnAtChange={(warnAt) =>
                setLocalGoals({
                  ...localGoals,
                  characters: { ...localGoals.characters!, warnAt },
                })
              }
            />
          </TabsContent>

          {/* Tab de Limites */}
          <TabsContent value="limits" className="space-y-6 mt-6">
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
              warnAt={
                localLimits.words?.warnAt ??
                DEFAULT_CHAPTER_LIMITS.words!.warnAt
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
              onWarnAtChange={(warnAt) =>
                setLocalLimits({
                  ...localLimits,
                  words: { ...localLimits.words!, warnAt },
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
              warnAt={
                localLimits.characters?.warnAt ??
                DEFAULT_CHAPTER_LIMITS.characters!.warnAt
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
              onWarnAtChange={(warnAt) =>
                setLocalLimits({
                  ...localLimits,
                  characters: { ...localLimits.characters!, warnAt },
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
              warnAt={
                localLimits.session?.warnAt ??
                DEFAULT_CHAPTER_LIMITS.session!.warnAt
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
              onWarnAtChange={(warnAt) =>
                setLocalLimits({
                  ...localLimits,
                  session: { ...localLimits.session!, warnAt },
                })
              }
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface GoalConfigProps {
  enabled: boolean;
  target: number;
  warnAt: number;
  label: string;
  description: string;
  unit: string;
  onEnabledChange: (enabled: boolean) => void;
  onTargetChange: (target: number) => void;
  onWarnAtChange: (warnAt: number) => void;
}

function GoalConfig({
  enabled,
  target,
  warnAt,
  label,
  description,
  unit,
  onEnabledChange,
  onTargetChange,
  onWarnAtChange,
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
            <Input
              type="number"
              value={target}
              onChange={(e) => onTargetChange(Number(e.target.value))}
              min={1}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Avisar ao atingir: {warnAt}%</Label>
            <Slider
              value={[warnAt]}
              onValueChange={([value]) => onWarnAtChange(value)}
              min={50}
              max={100}
              step={5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>50%</span>
              <span>100%</span>
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
  warnAt: number;
  label: string;
  description: string;
  unit: string;
  onEnabledChange: (enabled: boolean) => void;
  onLimitChange: (limit: number) => void;
  onWarnAtChange: (warnAt: number) => void;
}

function LimitConfig({
  enabled,
  limit,
  warnAt,
  label,
  description,
  unit,
  onEnabledChange,
  onLimitChange,
  onWarnAtChange,
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
            <Input
              type="number"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              min={1}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Avisar ao atingir: {warnAt}%</Label>
            <Slider
              value={[warnAt]}
              onValueChange={([value]) => onWarnAtChange(value)}
              min={50}
              max={100}
              step={5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>50%</span>
              <span>100%</span>
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
  warnAt: number;
  onEnabledChange: (enabled: boolean) => void;
  onMinutesChange: (minutes: number) => void;
  onWarnAtChange: (warnAt: number) => void;
}

function SessionLimitConfig({
  enabled,
  minutes,
  warnAt,
  onEnabledChange,
  onMinutesChange,
  onWarnAtChange,
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
              <Input
                type="number"
                value={hours}
                onChange={(e) =>
                  onMinutesChange(Number(e.target.value) * 60 + mins)
                }
                min={0}
                max={23}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Minutos</Label>
              <Input
                type="number"
                value={mins}
                onChange={(e) =>
                  onMinutesChange(hours * 60 + Number(e.target.value))
                }
                min={0}
                max={59}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Avisar ao atingir: {warnAt}%</Label>
            <Slider
              value={[warnAt]}
              onValueChange={([value]) => onWarnAtChange(value)}
              min={50}
              max={100}
              step={5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
