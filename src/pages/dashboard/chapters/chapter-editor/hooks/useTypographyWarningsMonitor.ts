/**
 * Hook para monitorar tamanho do capítulo e criar avisos de tipografia
 */

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("chapter-editor");

  // Estado para controlar transição entre capítulos
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(chapterId);

  // Estado do tracker (carrega do localStorage na inicialização)
  const [warningsShown, setWarningsShown] = useState<TypographyWarningTracker>(() =>
    loadTypographyWarningTracker(chapterId)
  );

  // Detecta mudança de capítulo e recarrega avisos
  useEffect(() => {
    if (currentChapterId !== chapterId) {
      // Marca transição
      setIsTransitioning(true);
      setCurrentChapterId(chapterId);

      // Carrega avisos do novo capítulo
      setWarningsShown(loadTypographyWarningTracker(chapterId));

      // Aguarda métricas serem recalculadas
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [chapterId, currentChapterId]);

  useEffect(() => {
    // Não executa durante transição de capítulo
    if (isTransitioning) {
      return;
    }

    // Não exibe avisos se:
    // 1. O sistema de avisos está desativado
    // 2. Há uma meta de palavras ativada
    if (!enabled || hasWordGoal) return;

    // Usa a versão funcional do setState para sempre ter o estado mais recente
    setWarningsShown((currentShown) => {
      let needsUpdate = false;
      const newShown = { ...currentShown };

      // Aviso em 5k palavras - Informação
      if (metrics.wordCount >= 5000 && !newShown.words5k) {
        newShown.words5k = true;
        needsUpdate = true;
        onWarning(
          "info",
          t("warnings.messages.typography.words_5k_title"),
          t("warnings.messages.typography.words_5k_message")
        );
      }

      // Aviso em 10k palavras - Importante
      if (metrics.wordCount >= 10000 && !newShown.words10k) {
        newShown.words10k = true;
        needsUpdate = true;
        onWarning(
          "warning",
          t("warnings.messages.typography.words_10k_title"),
          t("warnings.messages.typography.words_10k_message")
        );
      }

      // Aviso em 15k palavras - Crítico
      if (metrics.wordCount >= 15000 && !newShown.words15k) {
        newShown.words15k = true;
        needsUpdate = true;
        onWarning(
          "error",
          t("warnings.messages.typography.words_15k_title"),
          t("warnings.messages.typography.words_15k_message")
        );
      }

      if (needsUpdate) {
        saveTypographyWarningTracker(chapterId, newShown);
        return newShown;
      }

      // Retorna o estado atual sem mudanças
      return currentShown;
    });
  }, [metrics.wordCount, enabled, hasWordGoal, chapterId, onWarning, isTransitioning, t]);

  // Reseta avisos quando o capítulo ATUAL é esvaziado
  // IMPORTANTE: Só reseta se NÃO estamos em transição entre capítulos
  // Isso garante que cada capítulo mantenha seu próprio histórico de avisos isolado
  useEffect(() => {
    // Não reseta durante navegação entre capítulos
    if (isTransitioning) {
      return;
    }

    // Reseta apenas se o capítulo atual está vazio
    if (metrics.characterCount < 100) {
      setWarningsShown({});
      saveTypographyWarningTracker(chapterId, {});
    }
  }, [metrics.characterCount, chapterId, isTransitioning]);
}
