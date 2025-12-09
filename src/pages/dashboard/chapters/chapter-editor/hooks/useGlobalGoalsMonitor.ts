/**
 * Hook para monitorar metas globais e criar avisos automáticos
 */

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { GlobalGoals, ChapterStatus } from "@/types/global-goals";

import { ChapterMetrics } from "../types/metrics";

interface UseGlobalGoalsMonitorProps {
  metrics: ChapterMetrics;
  globalGoals: GlobalGoals;
  chapterStatus: ChapterStatus;
  chapterId: string;
  sessionId: string; // ID único da sessão (reseta ao sair/voltar do editor)
  onWarning: (
    severity: "info" | "warning" | "error",
    title: string,
    message: string
  ) => void;
}

interface WordWarningTracker {
  wordGoal90?: boolean;
  wordGoal100?: boolean;
}

interface SessionWarningTracker {
  sessionGoal100?: boolean;
}

const WORD_WARNINGS_STORAGE_KEY_PREFIX = "grimorium_word_goals_warnings";
const SESSION_WARNINGS_STORAGE_KEY_PREFIX = "grimorium_session_goals_warnings";

/**
 * Gera a chave de storage específica para avisos de palavras (por capítulo)
 */
function getWordStorageKey(chapterId: string): string {
  return `${WORD_WARNINGS_STORAGE_KEY_PREFIX}_${chapterId}`;
}

/**
 * Gera a chave de storage específica para avisos de tempo (por sessão)
 */
function getSessionStorageKey(sessionId: string): string {
  return `${SESSION_WARNINGS_STORAGE_KEY_PREFIX}_${sessionId}`;
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
      warnAt100: goals.sessionTime.warnAt100,
      silent: goals.sessionTime.silent,
    },
    appliesTo: goals.appliesTo,
  });
}

/**
 * Carrega o rastreador de avisos de palavras do localStorage para um capítulo específico
 */
function loadWordWarningTracker(chapterId: string, configKey: string): WordWarningTracker {
  try {
    const stored = localStorage.getItem(getWordStorageKey(chapterId));
    if (stored) {
      const data = JSON.parse(stored);
      // Verifica se a chave de configuração bate
      if (data.configKey === configKey) {
        return data.tracker || {};
      }
    }
  } catch (error) {
    console.error("Erro ao carregar rastreador de avisos de palavras:", error);
  }
  return {};
}

/**
 * Salva o rastreador de avisos de palavras no localStorage para um capítulo específico
 */
function saveWordWarningTracker(chapterId: string, configKey: string, tracker: WordWarningTracker): void {
  try {
    localStorage.setItem(
      getWordStorageKey(chapterId),
      JSON.stringify({ configKey, tracker })
    );
  } catch (error) {
    console.error("Erro ao salvar rastreador de avisos de palavras:", error);
  }
}

/**
 * Carrega o rastreador de avisos de tempo do localStorage para uma sessão específica
 */
function loadSessionWarningTracker(sessionId: string): SessionWarningTracker {
  try {
    const stored = localStorage.getItem(getSessionStorageKey(sessionId));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar rastreador de avisos de tempo:", error);
  }
  return {};
}

/**
 * Salva o rastreador de avisos de tempo no localStorage para uma sessão específica
 */
function saveSessionWarningTracker(sessionId: string, tracker: SessionWarningTracker): void {
  try {
    localStorage.setItem(getSessionStorageKey(sessionId), JSON.stringify(tracker));
  } catch (error) {
    console.error("Erro ao salvar rastreador de avisos de tempo:", error);
  }
}

/**
 * Monitora métricas globais e dispara avisos quando metas são atingidas
 * Avisos de palavras são por capítulo, avisos de tempo são por sessão
 */
export function useGlobalGoalsMonitor({
  metrics,
  globalGoals,
  chapterStatus,
  chapterId,
  sessionId,
  onWarning,
}: UseGlobalGoalsMonitorProps) {
  const { t } = useTranslation("chapter-editor");

  // Estados para controlar capítulo, sessão e configuração
  const [currentChapterId, setCurrentChapterId] = useState(chapterId);
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);
  const [configKey, setConfigKey] = useState(() => generateGoalsConfigKey(globalGoals));
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Trackers separados: palavras por capítulo, tempo por sessão
  const [wordWarningsShown, setWordWarningsShown] = useState<WordWarningTracker>(() =>
    loadWordWarningTracker(chapterId, configKey)
  );
  const [sessionWarningsShown, setSessionWarningsShown] = useState<SessionWarningTracker>(() =>
    loadSessionWarningTracker(sessionId)
  );

  // Recarrega avisos de palavras quando o capítulo ou configuração mudar
  useEffect(() => {
    const newConfigKey = generateGoalsConfigKey(globalGoals);
    const chapterChanged = currentChapterId !== chapterId;
    const configChanged = configKey !== newConfigKey;

    // Atualiza o tracker de palavras apenas se o capítulo mudou OU a configuração mudou
    if (chapterChanged || configChanged) {
      // Marca que estamos em transição
      setIsTransitioning(true);

      setConfigKey(newConfigKey);
      setCurrentChapterId(chapterId);
      setWordWarningsShown(loadWordWarningTracker(chapterId, newConfigKey));

      // Aguarda um pouco para as métricas serem recalculadas
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [chapterId, globalGoals, currentChapterId, configKey]);

  // Recarrega avisos de tempo quando a sessão mudar (nova sessão = reseta avisos de tempo)
  useEffect(() => {
    if (currentSessionId !== sessionId) {
      setCurrentSessionId(sessionId);
      setSessionWarningsShown(loadSessionWarningTracker(sessionId));
    }
  }, [sessionId, currentSessionId]);

  useEffect(() => {
    // Não executa durante transição de capítulo
    if (isTransitioning) {
      return;
    }

    // Verifica se as metas se aplicam ao status atual do capítulo
    if (!globalGoals.appliesTo.includes(chapterStatus)) {
      return;
    }

    // ========== METAS DE PALAVRAS (por capítulo) ==========

    if (
      globalGoals.words.enabled &&
      globalGoals.words.target > 0 &&
      !globalGoals.words.silent
    ) {
      setWordWarningsShown((currentShown) => {
        let needsUpdate = false;
        const newShown = { ...currentShown };
        const percentage = (metrics.wordCount / globalGoals.words.target) * 100;

        // Notificação aos 90%
        if (
          globalGoals.words.warnAt90 &&
          percentage >= 90 &&
          percentage < 100 &&
          !newShown.wordGoal90
        ) {
          newShown.wordGoal90 = true;
          needsUpdate = true;
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
          !newShown.wordGoal100
        ) {
          newShown.wordGoal100 = true;
          needsUpdate = true;
          onWarning(
            "info",
            t("warnings.messages.goals.word_goal_100_title"),
            t("warnings.messages.goals.word_goal_100_message", {
              target: globalGoals.words.target
            })
          );
        }

        // Salva o rastreador atualizado no localStorage
        if (needsUpdate) {
          saveWordWarningTracker(chapterId, configKey, newShown);
          return newShown;
        }

        return currentShown;
      });
    }

    // ========== METAS DE TEMPO DE SESSÃO (por sessão) ==========

    if (
      globalGoals.sessionTime.enabled &&
      globalGoals.sessionTime.targetMinutes > 0 &&
      !globalGoals.sessionTime.silent
    ) {
      setSessionWarningsShown((currentShown) => {
        let needsUpdate = false;
        const newShown = { ...currentShown };
        const percentage =
          (metrics.sessionDuration / globalGoals.sessionTime.targetMinutes) * 100;

        // Notificação ao atingir 100%
        if (
          globalGoals.sessionTime.warnAt100 &&
          percentage >= 100 &&
          !newShown.sessionGoal100
        ) {
          newShown.sessionGoal100 = true;
          needsUpdate = true;
          onWarning(
            "info",
            t("warnings.messages.goals.session_goal_100_title"),
            t("warnings.messages.goals.session_goal_100_message", {
              duration: metrics.sessionDuration
            })
          );
        }

        // Salva o rastreador atualizado no localStorage
        if (needsUpdate) {
          saveSessionWarningTracker(sessionId, newShown);
          return newShown;
        }

        return currentShown;
      });
    }
  }, [metrics, globalGoals, chapterStatus, chapterId, sessionId, onWarning, isTransitioning, configKey, t]);

  // Reseta avisos de PALAVRAS quando o capítulo ATUAL é esvaziado
  // IMPORTANTE: Só reseta se NÃO estamos em transição entre capítulos
  // Isso garante que cada capítulo mantenha seu próprio histórico de avisos isolado
  // Avisos de tempo NÃO são resetados aqui, pois dependem apenas da sessão
  useEffect(() => {
    // Não reseta durante navegação entre capítulos
    if (isTransitioning) {
      return;
    }

    // Reseta apenas se o capítulo atual está vazio
    if (metrics.characterCount < 100) {
      setWordWarningsShown({});
      saveWordWarningTracker(chapterId, configKey, {});
    }
  }, [metrics.characterCount, chapterId, isTransitioning, configKey]);
}
