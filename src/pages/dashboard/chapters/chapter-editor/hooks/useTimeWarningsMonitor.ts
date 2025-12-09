/**
 * Hook para monitorar tempo de escrita e criar avisos
 * Avisos de tempo são GLOBAIS para toda a sessão (não por capítulo)
 */

import { useEffect, useState } from "react";

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

  // Estados para controlar a sessão
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);
  const [warningsShown, setWarningsShown] = useState<TimeWarningTracker>(() =>
    loadTimeWarningTracker(sessionId)
  );

  // Recarrega avisos quando a sessão mudar (nova sessão = novo ID)
  useEffect(() => {
    if (currentSessionId !== sessionId) {
      setCurrentSessionId(sessionId);
      setWarningsShown(loadTimeWarningTracker(sessionId));
    }
  }, [sessionId, currentSessionId]);

  useEffect(() => {
    // Não exibe avisos se:
    // 1. O sistema de avisos está desativado
    // 2. Há uma meta de tempo de sessão ativada
    if (!enabled || hasSessionTimeGoal) return;

    // Converte minutos para horas
    const hours = metrics.sessionDuration / 60;

    // Usa a versão funcional do setState para sempre ter o estado mais recente
    setWarningsShown((currentShown) => {
      let needsUpdate = false;
      const newShown = { ...currentShown };

      // Aviso aos 2 horas (120 minutos) - Importante
      if (hours >= 2 && !newShown.twoHours) {
        newShown.twoHours = true;
        needsUpdate = true;
        onWarning(
          "warning",
          t("warnings.messages.time.two_hours_title"),
          t("warnings.messages.time.two_hours_message")
        );
      }

      // Aviso aos 5 horas (300 minutos) - Crítico
      if (hours >= 5 && !newShown.fiveHours) {
        newShown.fiveHours = true;
        needsUpdate = true;
        onWarning(
          "error",
          t("warnings.messages.time.five_hours_title"),
          t("warnings.messages.time.five_hours_message")
        );
      }

      if (needsUpdate) {
        saveTimeWarningTracker(sessionId, newShown);
        return newShown;
      }

      // Retorna o estado atual sem mudanças
      return currentShown;
    });
  }, [metrics.sessionDuration, enabled, hasSessionTimeGoal, sessionId, onWarning, t]);
}
