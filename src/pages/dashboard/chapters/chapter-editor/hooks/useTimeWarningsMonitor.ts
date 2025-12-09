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
 * Só funciona quando não há meta de tempo de sessão ativada
 */
export function useTimeWarningsMonitor({
  metrics,
  enabled,
  hasSessionTimeGoal,
  onWarning,
}: UseTimeWarningsMonitorProps) {
  const { t } = useTranslation("chapter-editor");
  const warningsShownRef = useRef<TimeWarningTracker>(loadTimeWarningTracker());

  useEffect(() => {
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
      saveTimeWarningTracker(shown);
    }
  }, [metrics.sessionDuration, enabled, hasSessionTimeGoal, onWarning]);

  // Reseta avisos quando uma nova sessão começa (quando sessionDuration volta para valores baixos)
  useEffect(() => {
    if (metrics.sessionDuration < 1) {
      warningsShownRef.current = {};
      saveTimeWarningTracker({});
    }
  }, [metrics.sessionDuration]);
}
