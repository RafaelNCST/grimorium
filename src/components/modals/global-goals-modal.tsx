/**
 * Modal de Metas Globais
 *
 * Permite configurar metas globais que se aplicam a todos os capítulos,
 * com opções de filtro por status do capítulo.
 */

import { useState, useEffect } from "react";

import { Target, Clock, ChevronUp, ChevronDown, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  CHAPTER_STATUS_TRANSLATION_KEYS,
  ChapterStatus,
  MIN_WORD_GOAL,
  MIN_SESSION_TIME_GOAL,
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
  const { t } = useTranslation(["global-goals", "chapters"]);
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
            {t("modal.title")}
          </DialogTitle>
          <DialogDescription>
            {t("modal.description")}
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
                      {t("info.applies_to_all")}
                    </strong>{" "}
                    {t("info.description")}
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      <strong>{t("info.color_normal")}</strong> {t("info.color_normal_desc")}
                    </li>
                    <li>
                      <strong>{t("info.color_yellow")}</strong> {t("info.color_yellow_desc")}
                    </li>
                    <li>
                      <strong>{t("info.color_red")}</strong> {t("info.color_red_desc")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Aplicar a quais status */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                {t("applies_to.label")}
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
                      {t(CHAPTER_STATUS_TRANSLATION_KEYS[status])}
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
              label={t("words.label")}
              description={t("words.description")}
              unit={t("words.unit")}
              minValue={MIN_WORD_GOAL}
              t={t}
              onEnabledChange={(enabled) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words, enabled },
                })
              }
              onTargetChange={(target) =>
                setLocalGoals({
                  ...localGoals,
                  words: { ...localGoals.words, target: Math.max(MIN_WORD_GOAL, target) },
                })
              }
              onWarnAt90Change={(warnAt90) =>
                setLocalGoals({
                  ...localGoals,
                  words: {
                    ...localGoals.words,
                    warnAt90,
                    silent: warnAt90 ? false : localGoals.words.silent,
                  },
                })
              }
              onWarnAt100Change={(warnAt100) =>
                setLocalGoals({
                  ...localGoals,
                  words: {
                    ...localGoals.words,
                    warnAt100,
                    silent: warnAt100 ? false : localGoals.words.silent,
                  },
                })
              }
              onSilentChange={(silent) =>
                setLocalGoals({
                  ...localGoals,
                  words: {
                    ...localGoals.words,
                    silent,
                    warnAt90: silent ? false : localGoals.words.warnAt90,
                    warnAt100: silent ? false : localGoals.words.warnAt100,
                  },
                })
              }
            />

            <Separator />

            {/* Meta de Tempo de Sessão */}
            <SessionTimeGoalConfig
              enabled={localGoals.sessionTime.enabled}
              targetMinutes={localGoals.sessionTime.targetMinutes}
              warnAt100={localGoals.sessionTime.warnAt100}
              silent={localGoals.sessionTime.silent}
              t={t}
              onEnabledChange={(enabled) =>
                setLocalGoals({
                  ...localGoals,
                  sessionTime: { ...localGoals.sessionTime, enabled },
                })
              }
              onTargetMinutesChange={(targetMinutes) =>
                setLocalGoals({
                  ...localGoals,
                  sessionTime: {
                    ...localGoals.sessionTime,
                    targetMinutes: Math.max(MIN_SESSION_TIME_GOAL, targetMinutes)
                  },
                })
              }
              onWarnAt100Change={(warnAt100) =>
                setLocalGoals({
                  ...localGoals,
                  sessionTime: {
                    ...localGoals.sessionTime,
                    warnAt100,
                    silent: warnAt100 ? false : localGoals.sessionTime.silent,
                  },
                })
              }
              onSilentChange={(silent) =>
                setLocalGoals({
                  ...localGoals,
                  sessionTime: {
                    ...localGoals.sessionTime,
                    silent,
                    warnAt100: silent
                      ? false
                      : localGoals.sessionTime.warnAt100,
                  },
                })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {t("actions.cancel")}
            </Button>
            <Button variant="magical" onClick={handleSave}>
              {t("actions.save")}
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
  minValue?: number;
  t: (key: string, options?: any) => string;
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
  minValue = 1,
  t,
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
            <Label>{t("goal_config.target_label", { unit })}</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                value={target}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value) && value >= minValue) {
                    onTargetChange(value);
                  }
                }}
                min={minValue}
                className="flex-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <div className="flex flex-col gap-0.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onTargetChange(target + 100)}
                  className="h-5 px-2"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onTargetChange(Math.max(minValue, target - 100))}
                  className="h-5 px-2"
                  disabled={target <= minValue}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-3 block">{t("goal_config.warn_label")}</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${label}-90`}
                  checked={warnAt90}
                  onCheckedChange={(checked) =>
                    onWarnAt90Change(checked === true)
                  }
                />
                <label
                  htmlFor={`${label}-90`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t("goal_config.warn_90")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${label}-100`}
                  checked={warnAt100}
                  onCheckedChange={(checked) =>
                    onWarnAt100Change(checked === true)
                  }
                />
                <label
                  htmlFor={`${label}-100`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t("goal_config.warn_100")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${label}-silent`}
                  checked={silent}
                  onCheckedChange={(checked) =>
                    onSilentChange(checked === true)
                  }
                />
                <label
                  htmlFor={`${label}-silent`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t("goal_config.silent")}
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
  warnAt100: boolean;
  silent: boolean;
  t: (key: string, options?: any) => string;
  onEnabledChange: (enabled: boolean) => void;
  onTargetMinutesChange: (minutes: number) => void;
  onWarnAt100Change: (warnAt100: boolean) => void;
  onSilentChange: (silent: boolean) => void;
}

function SessionTimeGoalConfig({
  enabled,
  targetMinutes,
  warnAt100,
  silent,
  t,
  onEnabledChange,
  onTargetMinutesChange,
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
            {t("session_time.label")}
          </Label>
          <p className="text-sm text-muted-foreground">
            {t("session_time.description")}
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      {enabled && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("session_time.hours")}</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={hours}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) && value >= 0 && value <= 23) {
                      const newTotal = value * 60 + mins;
                      onTargetMinutesChange(newTotal);
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
                    disabled={targetMinutes <= MIN_SESSION_TIME_GOAL}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Label>{t("session_time.minutes")}</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={mins}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) && value >= 0 && value <= 59) {
                      const newTotal = hours * 60 + value;
                      onTargetMinutesChange(newTotal);
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
                    disabled={targetMinutes <= MIN_SESSION_TIME_GOAL}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-3 block">{t("goal_config.warn_label")}</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="session-time-100"
                  checked={warnAt100}
                  onCheckedChange={(checked) =>
                    onWarnAt100Change(checked === true)
                  }
                />
                <label
                  htmlFor="session-time-100"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t("session_time_config.warn_100")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="session-time-silent"
                  checked={silent}
                  onCheckedChange={(checked) =>
                    onSilentChange(checked === true)
                  }
                />
                <label
                  htmlFor="session-time-silent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t("goal_config.silent")}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
