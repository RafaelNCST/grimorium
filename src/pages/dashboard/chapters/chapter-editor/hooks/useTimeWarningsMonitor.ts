/**
 * Hook para monitorar tempo de escrita e criar avisos
 */

import { useEffect, useRef } from "react";

import { ChapterMetrics } from "../types/metrics";

interface UseTimeWarningsMonitorProps {
  metrics: ChapterMetrics;
  enabled: boolean;
  onWarning: (
    severity: "info" | "warning" | "error",
    title: string,
    message: string
  ) => void;
}

const STORAGE_KEY = "grimorium_time_warnings";

interface TimeWarningTracker {
  twoHours?: boolean;
  fiveHours?: boolean;
}

/**
 * Gera chave única para sessão atual
 */
function generateSessionKey(): string {
  return `session_${Date.now()}`;
}

/**
 * Carrega o rastreador de avisos de tempo
 */
function loadTimeWarningTracker(): TimeWarningTracker {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar rastreador de avisos de tempo:", error);
  }
  return {};
}

/**
 * Salva o rastreador de avisos de tempo
 */
function saveTimeWarningTracker(tracker: TimeWarningTracker): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracker));
  } catch (error) {
    console.error("Erro ao salvar rastreador de avisos de tempo:", error);
  }
}

/**
 * Monitora tempo de sessão e dispara avisos
 */
export function useTimeWarningsMonitor({
  metrics,
  enabled,
  onWarning,
}: UseTimeWarningsMonitorProps) {
  const warningsShownRef = useRef<TimeWarningTracker>(loadTimeWarningTracker());

  useEffect(() => {
    if (!enabled) return;

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
        "Você está escrevendo há 2 horas",
        "Que tal fazer uma pausa? Beba água e descanse os olhos!"
      );
    }

    // Aviso aos 5 horas (300 minutos) - Crítico
    if (hours >= 5 && !shown.fiveHours) {
      shown.fiveHours = true;
      needsSave = true;
      onWarning(
        "error",
        "Você está escrevendo há 5 horas!",
        "Pare e descanse! É importante cuidar da sua saúde e bem-estar."
      );
    }

    if (needsSave) {
      saveTimeWarningTracker(shown);
    }
  }, [metrics.sessionDuration, enabled, onWarning]);

  // Reseta avisos quando uma nova sessão começa (quando sessionDuration volta para valores baixos)
  useEffect(() => {
    if (metrics.sessionDuration < 1) {
      warningsShownRef.current = {};
      saveTimeWarningTracker({});
    }
  }, [metrics.sessionDuration]);
}
