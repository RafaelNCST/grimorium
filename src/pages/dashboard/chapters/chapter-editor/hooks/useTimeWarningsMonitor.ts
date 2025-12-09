/**
 * Hook para monitorar tempo de escrita e criar avisos
 * Avisos de tempo são GLOBAIS para toda a sessão (não por capítulo)
 */

import { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { ChapterMetrics } from "../types/metrics";

interface UseTimeWarningsMonitorProps {
  metrics: ChapterMetrics;
  enabled: boolean;
  hasSessionTimeGoal: boolean;
  sessionId: string; // ID único da sessão (não muda ao trocar de capítulo)
  onWarning: (
    severity: "info" | "warning" | "error",
    title: string,
    message: string
  ) => void;
}

const STORAGE_KEY_PREFIX = "grimorium_time_warnings_session";

interface TimeWarningTracker {
  twoHours?: boolean;
  fiveHours?: boolean;
}

/**
 * Gera a chave de storage específica para a sessão
 */
function getStorageKey(sessionId: string): string {
  return `${STORAGE_KEY_PREFIX}_${sessionId}`;
}

/**
 * Carrega o rastreador de avisos de tempo para a sessão atual
 */
function loadTimeWarningTracker(sessionId: string): TimeWarningTracker {
  try {
    const stored = localStorage.getItem(getStorageKey(sessionId));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar rastreador de avisos de tempo:", error);
  }
  return {};
}

/**
 * Salva o rastreador de avisos de tempo para a sessão atual
 */
function saveTimeWarningTracker(sessionId: string, tracker: TimeWarningTracker): void {
  try {
    localStorage.setItem(getStorageKey(sessionId), JSON.stringify(tracker));
  } catch (error) {
    console.error("Erro ao salvar rastreador de avisos de tempo:", error);
  }
}

/**
 * Monitora tempo de sessão e dispara avisos GLOBAIS
 * Só funciona quando não há meta de tempo de sessão ativada
 * Avisos são para toda a sessão de escrita (não por capítulo)
 */
export function useTimeWarningsMonitor({
  metrics,
  enabled,
  hasSessionTimeGoal,
  sessionId,
  onWarning,
}: UseTimeWarningsMonitorProps) {
  const { t } = useTranslation("chapter-editor");

  // Carrega avisos apenas uma vez para a sessão (não muda entre capítulos)
  const warningsShownRef = useRef<TimeWarningTracker>(
    loadTimeWarningTracker(sessionId)
  );

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
      saveTimeWarningTracker(sessionId, shown);
    }
  }, [metrics.sessionDuration, enabled, hasSessionTimeGoal, sessionId, onWarning, t]);
}
