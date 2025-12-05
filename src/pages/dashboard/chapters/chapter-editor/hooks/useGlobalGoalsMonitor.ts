/**
 * Hook para monitorar metas globais e criar avisos automáticos
 */

import { useEffect, useRef } from "react";

import { GlobalGoals, ChapterStatus } from "@/types/global-goals";

import { ChapterMetrics } from "../types/metrics";

interface UseGlobalGoalsMonitorProps {
  metrics: ChapterMetrics;
  globalGoals: GlobalGoals;
  chapterStatus: ChapterStatus;
  onWarning: (
    severity: "info" | "warning" | "error",
    title: string,
    message: string
  ) => void;
}

interface WarningTracker {
  wordGoal90?: boolean;
  wordGoal100?: boolean;
  characterGoal90?: boolean;
  characterGoal100?: boolean;
  sessionGoal90?: boolean;
  sessionGoal100?: boolean;
}

const WARNINGS_STORAGE_KEY = "grimorium_global_goals_warnings";

/**
 * Gera uma chave única baseada na configuração atual das metas
 * Mudanças nesta chave indicam que os avisos devem ser resetados
 */
function generateGoalsConfigKey(goals: GlobalGoals): string {
  return JSON.stringify({
    words: {
      enabled: goals.words.enabled,
      target: goals.words.target,
      warnAt90: goals.words.warnAt90,
      warnAt100: goals.words.warnAt100,
      silent: goals.words.silent,
    },
    characters: {
      enabled: goals.characters.enabled,
      target: goals.characters.target,
      warnAt90: goals.characters.warnAt90,
      warnAt100: goals.characters.warnAt100,
      silent: goals.characters.silent,
    },
    sessionTime: {
      enabled: goals.sessionTime.enabled,
      targetMinutes: goals.sessionTime.targetMinutes,
      warnAt90: goals.sessionTime.warnAt90,
      warnAt100: goals.sessionTime.warnAt100,
      silent: goals.sessionTime.silent,
    },
    appliesTo: goals.appliesTo,
  });
}

/**
 * Carrega o rastreador de avisos do localStorage
 */
function loadWarningTracker(configKey: string): WarningTracker {
  try {
    const stored = localStorage.getItem(WARNINGS_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Verifica se a chave de configuração bate
      if (data.configKey === configKey) {
        return data.tracker || {};
      }
    }
  } catch (error) {
    console.error("Erro ao carregar rastreador de avisos:", error);
  }
  return {};
}

/**
 * Salva o rastreador de avisos no localStorage
 */
function saveWarningTracker(configKey: string, tracker: WarningTracker): void {
  try {
    localStorage.setItem(
      WARNINGS_STORAGE_KEY,
      JSON.stringify({ configKey, tracker })
    );
  } catch (error) {
    console.error("Erro ao salvar rastreador de avisos:", error);
  }
}

/**
 * Monitora métricas globais e dispara avisos quando metas são atingidas
 */
export function useGlobalGoalsMonitor({
  metrics,
  globalGoals,
  chapterStatus,
  onWarning,
}: UseGlobalGoalsMonitorProps) {
  const configKeyRef = useRef<string>("");
  const warningsShownRef = useRef<WarningTracker>({});

  // Inicializa ou reseta o rastreador quando a configuração muda
  useEffect(() => {
    const newConfigKey = generateGoalsConfigKey(globalGoals);

    // Se a configuração mudou, reseta os avisos
    if (configKeyRef.current !== newConfigKey) {
      configKeyRef.current = newConfigKey;
      warningsShownRef.current = loadWarningTracker(newConfigKey);
    }
  }, [globalGoals]);

  useEffect(() => {
    // Verifica se as metas se aplicam ao status atual do capítulo
    if (!globalGoals.appliesTo.includes(chapterStatus)) {
      return;
    }

    const shown = warningsShownRef.current;
    let needsSave = false;

    // ========== METAS DE PALAVRAS ==========

    if (
      globalGoals.words.enabled &&
      globalGoals.words.target > 0 &&
      !globalGoals.words.silent
    ) {
      const percentage = (metrics.wordCount / globalGoals.words.target) * 100;

      // Notificação aos 90%
      if (
        globalGoals.words.warnAt90 &&
        percentage >= 90 &&
        percentage < 100 &&
        !shown.wordGoal90
      ) {
        shown.wordGoal90 = true;
        needsSave = true;
        onWarning(
          "info",
          `Quase lá! 90% da meta de palavras`,
          `Você já escreveu ${metrics.wordCount} de ${globalGoals.words.target} palavras. Continue assim!`
        );
      }

      // Notificação ao atingir 100%
      if (
        globalGoals.words.warnAt100 &&
        percentage >= 100 &&
        !shown.wordGoal100
      ) {
        shown.wordGoal100 = true;
        needsSave = true;
        onWarning(
          "info",
          "🎉 Meta de palavras atingida!",
          `Parabéns! Você atingiu sua meta de ${globalGoals.words.target} palavras!`
        );
      }
    }

    // ========== METAS DE CARACTERES ==========

    if (
      globalGoals.characters.enabled &&
      globalGoals.characters.target > 0 &&
      !globalGoals.characters.silent
    ) {
      const percentage =
        (metrics.characterCount / globalGoals.characters.target) * 100;

      // Notificação aos 90%
      if (
        globalGoals.characters.warnAt90 &&
        percentage >= 90 &&
        percentage < 100 &&
        !shown.characterGoal90
      ) {
        shown.characterGoal90 = true;
        needsSave = true;
        onWarning(
          "info",
          `Quase lá! 90% da meta de caracteres`,
          `Você já escreveu ${metrics.characterCount} de ${globalGoals.characters.target} caracteres.`
        );
      }

      // Notificação ao atingir 100%
      if (
        globalGoals.characters.warnAt100 &&
        percentage >= 100 &&
        !shown.characterGoal100
      ) {
        shown.characterGoal100 = true;
        needsSave = true;
        onWarning(
          "info",
          "🎉 Meta de caracteres atingida!",
          `Parabéns! Você atingiu sua meta de ${globalGoals.characters.target} caracteres!`
        );
      }
    }

    // ========== METAS DE TEMPO DE SESSÃO ==========

    if (
      globalGoals.sessionTime.enabled &&
      globalGoals.sessionTime.targetMinutes > 0 &&
      !globalGoals.sessionTime.silent
    ) {
      const percentage =
        (metrics.sessionDuration / globalGoals.sessionTime.targetMinutes) * 100;

      // Notificação aos 90%
      if (
        globalGoals.sessionTime.warnAt90 &&
        percentage >= 90 &&
        percentage < 100 &&
        !shown.sessionGoal90
      ) {
        shown.sessionGoal90 = true;
        needsSave = true;
        const remainingMinutes = Math.ceil(
          globalGoals.sessionTime.targetMinutes - metrics.sessionDuration
        );
        onWarning(
          "info",
          `90% do tempo meta de sessão`,
          `Você está escrevendo há ${metrics.sessionDuration} minutos. Restam ~${remainingMinutes} minutos para a meta.`
        );
      }

      // Notificação ao atingir 100%
      if (
        globalGoals.sessionTime.warnAt100 &&
        percentage >= 100 &&
        !shown.sessionGoal100
      ) {
        shown.sessionGoal100 = true;
        needsSave = true;
        onWarning(
          "info",
          "⏰ Meta de tempo atingida!",
          `Parabéns! Você está escrevendo há ${metrics.sessionDuration} minutos e atingiu sua meta!`
        );
      }
    }

    // Salva o rastreador atualizado no localStorage
    if (needsSave) {
      saveWarningTracker(configKeyRef.current, shown);
    }
  }, [metrics, globalGoals, chapterStatus, onWarning]);
}
