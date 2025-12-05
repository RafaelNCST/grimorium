/**
 * Hook para monitorar tamanho do capítulo e criar avisos de tipografia
 */

import { useEffect, useRef } from "react";

import { ChapterMetrics } from "../types/metrics";

interface UseTypographyWarningsMonitorProps {
  metrics: ChapterMetrics;
  enabled: boolean;
  onWarning: (
    severity: "info" | "warning" | "error",
    title: string,
    message: string
  ) => void;
}

const STORAGE_KEY = "grimorium_typography_warnings";

interface TypographyWarningTracker {
  words1k?: boolean;
  words10k?: boolean;
  chars10k?: boolean;
  chars20k?: boolean;
}

/**
 * Carrega o rastreador de avisos de tipografia
 */
function loadTypographyWarningTracker(): TypographyWarningTracker {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
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
 * Salva o rastreador de avisos de tipografia
 */
function saveTypographyWarningTracker(tracker: TypographyWarningTracker): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracker));
  } catch (error) {
    console.error("Erro ao salvar rastreador de avisos de tipografia:", error);
  }
}

/**
 * Monitora tamanho do capítulo e dispara avisos
 */
export function useTypographyWarningsMonitor({
  metrics,
  enabled,
  onWarning,
}: UseTypographyWarningsMonitorProps) {
  const warningsShownRef = useRef<TypographyWarningTracker>(
    loadTypographyWarningTracker()
  );

  useEffect(() => {
    if (!enabled) return;

    const shown = warningsShownRef.current;
    let needsSave = false;

    // Aviso em 1k palavras - Importante
    if (metrics.wordCount >= 1000 && !shown.words1k) {
      shown.words1k = true;
      needsSave = true;
      onWarning(
        "warning",
        "Capítulo com 1.000 palavras",
        "Seu capítulo está ficando grande. Considere revisar a estrutura."
      );
    }

    // Aviso em 10k palavras - Crítico
    if (metrics.wordCount >= 10000 && !shown.words10k) {
      shown.words10k = true;
      needsSave = true;
      onWarning(
        "error",
        "Capítulo com 10.000 palavras!",
        "Seu capítulo está muito grande. Considere dividir em múltiplos capítulos."
      );
    }

    // Aviso em 10k caracteres - Importante
    if (metrics.characterCount >= 10000 && !shown.chars10k) {
      shown.chars10k = true;
      needsSave = true;
      onWarning(
        "warning",
        "Capítulo com 10.000 caracteres",
        "Seu capítulo está ficando grande. Considere revisar a estrutura."
      );
    }

    // Aviso em 20k caracteres - Crítico
    if (metrics.characterCount >= 20000 && !shown.chars20k) {
      shown.chars20k = true;
      needsSave = true;
      onWarning(
        "error",
        "Capítulo com 20.000 caracteres!",
        "Seu capítulo está muito grande. Considere dividir em múltiplos capítulos."
      );
    }

    if (needsSave) {
      saveTypographyWarningTracker(shown);
    }
  }, [metrics.wordCount, metrics.characterCount, enabled, onWarning]);

  // Reseta avisos quando o capítulo é esvaziado ou reiniciado
  useEffect(() => {
    if (metrics.wordCount < 100 && metrics.characterCount < 500) {
      warningsShownRef.current = {};
      saveTypographyWarningTracker({});
    }
  }, [metrics.wordCount, metrics.characterCount]);
}
