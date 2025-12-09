/**
 * Hook para monitorar metas globais e criar avisos automáticos
 */

import { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { GlobalGoals, ChapterStatus } from "@/types/global-goals";

import { ChapterMetrics } from "../types/metrics";

interface UseGlobalGoalsMonitorProps {
  metrics: ChapterMetrics;
  globalGoals: GlobalGoals;
  chapterStatus: ChapterStatus;
  chapterId: string;
  onWarning: (
    severity: "info" | "warning" | "error",
    title: string,
    message: string
  ) => void;
}

interface WarningTracker {
  wordGoal90?: boolean;
  wordGoal100?: boolean;
  sessionGoal90?: boolean;
  sessionGoal100?: boolean;
}

const WARNINGS_STORAGE_KEY_PREFIX = "grimorium_global_goals_warnings";

/**
 * Gera a chave de storage específica para o capítulo
 */
function getStorageKey(chapterId: string): string {
  return `${WARNINGS_STORAGE_KEY_PREFIX}_${chapterId}`;
}

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
 * Carrega o rastreador de avisos do localStorage para um capítulo específico
 */
function loadWarningTracker(chapterId: string, configKey: string): WarningTracker {
  try {
    const stored = localStorage.getItem(getStorageKey(chapterId));
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
 * Salva o rastreador de avisos no localStorage para um capítulo específico
 */
function saveWarningTracker(chapterId: string, configKey: string, tracker: WarningTracker): void {
  try {
    localStorage.setItem(
      getStorageKey(chapterId),
      JSON.stringify({ configKey, tracker })
    );
  } catch (error) {
    console.error("Erro ao salvar rastreador de avisos:", error);
  }
}

/**
 * Monitora métricas globais e dispara avisos quando metas são atingidas
 * Cada capítulo tem seu próprio rastreamento de avisos
 */
export function useGlobalGoalsMonitor({
  metrics,
  globalGoals,
  chapterStatus,
  chapterId,
  onWarning,
}: UseGlobalGoalsMonitorProps) {
  const { t } = useTranslation("chapter-editor");
  const configKeyRef = useRef<string>("");
  const warningsShownRef = useRef<WarningTracker>({});

  // Inicializa ou reseta o rastreador quando a configuração ou capítulo muda
  useEffect(() => {
    const newConfigKey = generateGoalsConfigKey(globalGoals);

    // Se a configuração mudou, reseta os avisos
    if (configKeyRef.current !== newConfigKey) {
      configKeyRef.current = newConfigKey;
      warningsShownRef.current = loadWarningTracker(chapterId, newConfigKey);
    }
  }, [globalGoals, chapterId]);

  // Recarrega avisos quando o capítulo mudar
  useEffect(() => {
    const configKey = generateGoalsConfigKey(globalGoals);
    configKeyRef.current = configKey;
    warningsShownRef.current = loadWarningTracker(chapterId, configKey);
  }, [chapterId, globalGoals]);

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
          t("warnings.messages.goals.word_goal_90_title"),
          t("warnings.messages.goals.word_goal_90_message", {
            current: metrics.wordCount,
            target: globalGoals.words.target
          })
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
          t("warnings.messages.goals.word_goal_100_title"),
          t("warnings.messages.goals.word_goal_100_message", {
            target: globalGoals.words.target
          })
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
          t("warnings.messages.goals.session_goal_90_title"),
          t("warnings.messages.goals.session_goal_90_message", {
            current: metrics.sessionDuration,
            remaining: remainingMinutes
          })
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
          t("warnings.messages.goals.session_goal_100_title"),
          t("warnings.messages.goals.session_goal_100_message", {
            duration: metrics.sessionDuration
          })
        );
      }
    }

    // Salva o rastreador atualizado no localStorage
    if (needsSave) {
      saveWarningTracker(chapterId, configKeyRef.current, shown);
    }
  }, [metrics, globalGoals, chapterStatus, chapterId, onWarning]);

  // Reseta avisos quando o capítulo é esvaziado ou reiniciado
  useEffect(() => {
    if (metrics.wordCount < 100) {
      warningsShownRef.current = {};
      saveWarningTracker(chapterId, configKeyRef.current, {});
    }
  }, [metrics.wordCount, chapterId]);
}
