/**
 * Hook para monitorar tamanho do capítulo e criar avisos de tipografia
 */

import { useEffect, useRef } from "react";

import { ChapterMetrics } from "../types/metrics";

interface UseTypographyWarningsMonitorProps {
  metrics: ChapterMetrics;
  enabled: boolean;
  hasWordGoal: boolean;
  chapterId: string;
  onWarning: (
    severity: "info" | "warning" | "error",
    title: string,
    message: string
  ) => void;
}

const STORAGE_KEY_PREFIX = "grimorium_typography_warnings";

interface TypographyWarningTracker {
  words5k?: boolean;
  words10k?: boolean;
  words15k?: boolean;
}

/**
 * Gera a chave de storage específica para o capítulo
 */
function getStorageKey(chapterId: string): string {
  return `${STORAGE_KEY_PREFIX}_${chapterId}`;
}

/**
 * Carrega o rastreador de avisos de tipografia para um capítulo específico
 */
function loadTypographyWarningTracker(chapterId: string): TypographyWarningTracker {
  try {
    const stored = localStorage.getItem(getStorageKey(chapterId));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(
      "Erro ao carregar rastreador de avisos de tipografia:",
      error
    );
  }
  return {};
}

/**
 * Salva o rastreador de avisos de tipografia para um capítulo específico
 */
function saveTypographyWarningTracker(chapterId: string, tracker: TypographyWarningTracker): void {
  try {
    localStorage.setItem(getStorageKey(chapterId), JSON.stringify(tracker));
  } catch (error) {
    console.error("Erro ao salvar rastreador de avisos de tipografia:", error);
  }
}

/**
 * Monitora tamanho do capítulo e dispara avisos
 * Só funciona quando não há meta de palavras ativada
 * Cada capítulo tem seu próprio rastreamento de avisos
 */
export function useTypographyWarningsMonitor({
  metrics,
  enabled,
  hasWordGoal,
  chapterId,
  onWarning,
}: UseTypographyWarningsMonitorProps) {
  const warningsShownRef = useRef<TypographyWarningTracker>(
    loadTypographyWarningTracker(chapterId)
  );

  // Recarrega avisos quando o capítulo mudar
  useEffect(() => {
    warningsShownRef.current = loadTypographyWarningTracker(chapterId);
  }, [chapterId]);

  useEffect(() => {
    // Não exibe avisos se:
    // 1. O sistema de avisos está desativado
    // 2. Há uma meta de palavras ativada
    if (!enabled || hasWordGoal) return;

    const shown = warningsShownRef.current;
    let needsSave = false;

    // Aviso em 5k palavras - Informação
    if (metrics.wordCount >= 5000 && !shown.words5k) {
      shown.words5k = true;
      needsSave = true;
      onWarning(
        "info",
        "Capítulo com 5.000 palavras",
        "Seu capítulo está ficando grande. Considere revisar a estrutura."
      );
    }

    // Aviso em 10k palavras - Importante
    if (metrics.wordCount >= 10000 && !shown.words10k) {
      shown.words10k = true;
      needsSave = true;
      onWarning(
        "warning",
        "Capítulo com 10.000 palavras",
        "Seu capítulo está muito grande. Considere dividir em múltiplos capítulos."
      );
    }

    // Aviso em 15k palavras - Crítico
    if (metrics.wordCount >= 15000 && !shown.words15k) {
      shown.words15k = true;
      needsSave = true;
      onWarning(
        "error",
        "Capítulo com 15.000 palavras!",
        "Seu capítulo está extremamente grande. É recomendado dividir em múltiplos capítulos."
      );
    }

    if (needsSave) {
      saveTypographyWarningTracker(chapterId, shown);
    }
  }, [metrics.wordCount, enabled, hasWordGoal, chapterId, onWarning]);

  // Reseta avisos quando o capítulo é esvaziado ou reiniciado
  useEffect(() => {
    if (metrics.wordCount < 100) {
      warningsShownRef.current = {};
      saveTypographyWarningTracker(chapterId, {});
    }
  }, [metrics.wordCount, chapterId]);
}
