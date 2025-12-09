/**
 * Hook para monitorar tempo de escrita e criar avisos
 */

import { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { ChapterMetrics } from "../types/metrics";

interface UseTimeWarningsMonitorProps {
  metrics: ChapterMetrics;
  enabled: boolean;
  hasSessionTimeGoal: boolean;
  chapterId: string;
  onWarning: (
    severity: "info" | "warning" | "error",
    title: string,
    message: string
  ) => void;
}

const STORAGE_KEY_PREFIX = "grimorium_time_warnings";

interface TimeWarningTracker {
  twoHours?: boolean;
  fiveHours?: boolean;
}

/**
 * Gera a chave de storage específica para o capítulo
 */
function getStorageKey(chapterId: string): string {
  return `${STORAGE_KEY_PREFIX}_${chapterId}`;
}

/**
 * Carrega o rastreador de avisos de tempo para um capítulo específico
 */
function loadTimeWarningTracker(chapterId: string): TimeWarningTracker {
  try {
    const stored = localStorage.getItem(getStorageKey(chapterId));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar rastreador de avisos de tempo:", error);
  }
  return {};
}

/**
 * Salva o rastreador de avisos de tempo para um capítulo específico
 */
function saveTimeWarningTracker(chapterId: string, tracker: TimeWarningTracker): void {
  try {
    localStorage.setItem(getStorageKey(chapterId), JSON.stringify(tracker));
  } catch (error) {
    console.error("Erro ao salvar rastreador de avisos de tempo:", error);
  }
}

/**
 * Monitora tempo de sessão e dispara avisos
 * Só funciona quando não há meta de tempo de sessão ativada
 * Cada capítulo tem seu próprio rastreamento de avisos
 */
export function useTimeWarningsMonitor({
  metrics,
  enabled,
  hasSessionTimeGoal,
  chapterId,
  onWarning,
}: UseTimeWarningsMonitorProps) {
  const { t } = useTranslation("chapter-editor");
  const currentChapterIdRef = useRef<string>(chapterId);
  const isTransitioningRef = useRef<boolean>(false);
  const warningsShownRef = useRef<TimeWarningTracker>(
    loadTimeWarningTracker(chapterId)
  );

  // Recarrega avisos quando o capítulo mudar
  useEffect(() => {
    if (currentChapterIdRef.current !== chapterId) {
      // Marca que estamos em transição
      isTransitioningRef.current = true;

      currentChapterIdRef.current = chapterId;
      warningsShownRef.current = loadTimeWarningTracker(chapterId);

      // Aguarda um pouco para as métricas serem recalculadas
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 1000);
    }
  }, [chapterId]);

  useEffect(() => {
    // Não executa durante transição de capítulo
    if (isTransitioningRef.current) {
      return;
    }

    // Não exibe avisos se:
    // 1. O sistema de avisos está desativado
    // 2. Há uma meta de tempo de sessão ativada
    if (!enabled || hasSessionTimeGoal) return;

    const shown = warningsShownRef.current;
    let needsSave = false;

    // Converte minutos para horas
    const hours = metrics.sessionDuration / 60;

    // Aviso aos 2 horas (120 minutos) - Importante
    if (hours >= 2 && !shown.twoHours) {
      shown.twoHours = true;
      needsSave = true;
      onWarning(
        "warning",
        t("warnings.messages.time.two_hours_title"),
        t("warnings.messages.time.two_hours_message")
      );
    }

    // Aviso aos 5 horas (300 minutos) - Crítico
    if (hours >= 5 && !shown.fiveHours) {
      shown.fiveHours = true;
      needsSave = true;
      onWarning(
        "error",
        t("warnings.messages.time.five_hours_title"),
        t("warnings.messages.time.five_hours_message")
      );
    }

    if (needsSave) {
      saveTimeWarningTracker(chapterId, shown);
    }
  }, [metrics.sessionDuration, enabled, hasSessionTimeGoal, chapterId, onWarning]);

  // Reseta avisos quando o capítulo ATUAL é esvaziado
  // IMPORTANTE: Só reseta se NÃO estamos em transição entre capítulos
  // Isso garante que cada capítulo mantenha seu próprio histórico de avisos isolado
  useEffect(() => {
    // Não reseta durante navegação entre capítulos
    if (isTransitioningRef.current) {
      return;
    }

    // Reseta apenas se o capítulo atual está vazio
    if (metrics.characterCount < 100) {
      warningsShownRef.current = {};
      saveTimeWarningTracker(chapterId, {});
    }
  }, [metrics.characterCount, chapterId]);
}
