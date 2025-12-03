/**
 * Hook para monitorar metas e limites e criar avisos automáticos
 */

import { useEffect, useRef } from "react";

import { ChapterGoals, ChapterLimits } from "../types/goals-and-limits";
import { ChapterMetrics } from "../types/metrics";

interface UseGoalsAndLimitsMonitorProps {
  metrics: ChapterMetrics;
  goals: ChapterGoals;
  limits: ChapterLimits;
  onWarning: (
    type: "goals" | "limits",
    severity: "info" | "warning" | "error",
    title: string,
    message: string
  ) => void;
}

interface WarningTracker {
  wordGoal90?: boolean;
  wordGoal100?: boolean;
  characterGoal90?: boolean;
  characterGoal100?: boolean;
  wordLimit90?: boolean;
  wordLimit100?: boolean;
  characterLimit90?: boolean;
  characterLimit100?: boolean;
  sessionLimit90?: boolean;
  sessionLimit100?: boolean;
}

/**
 * Monitora métricas e dispara avisos quando metas/limites são atingidos
 */
export function useGoalsAndLimitsMonitor({
  metrics,
  goals,
  limits,
  onWarning,
}: UseGoalsAndLimitsMonitorProps) {
  const warningsShownRef = useRef<WarningTracker>({});

  useEffect(() => {
    // Reset warnings when goals/limits change
    warningsShownRef.current = {};
  }, [goals, limits]);

  useEffect(() => {
    const shown = warningsShownRef.current;

    // ========== METAS ==========

    // Meta de Palavras
    if (goals.words?.enabled && goals.words.target > 0) {
      const percentage = (metrics.wordCount / goals.words.target) * 100;

      // Aviso em 90%
      if (
        goals.words.warnAt90 &&
        percentage >= 90 &&
        percentage < 100 &&
        !shown.wordGoal90
      ) {
        shown.wordGoal90 = true;
        onWarning(
          "goals",
          "info",
          `Quase lá! ${Math.floor(percentage)}% da meta de palavras`,
          `Você já escreveu ${metrics.wordCount} de ${goals.words.target} palavras. Continue assim!`
        );
      }

      // Aviso ao atingir 100%
      if (goals.words.warnAt100 && percentage >= 100 && !shown.wordGoal100) {
        shown.wordGoal100 = true;
        onWarning(
          "goals",
          "info",
          "🎉 Meta de palavras atingida!",
          `Parabéns! Você atingiu sua meta de ${goals.words.target} palavras!`
        );
      }
    }

    // Meta de Caracteres
    if (goals.characters?.enabled && goals.characters.target > 0) {
      const percentage =
        (metrics.characterCount / goals.characters.target) * 100;

      // Aviso em 90%
      if (
        goals.characters.warnAt90 &&
        percentage >= 90 &&
        percentage < 100 &&
        !shown.characterGoal90
      ) {
        shown.characterGoal90 = true;
        onWarning(
          "goals",
          "info",
          `Quase lá! ${Math.floor(percentage)}% da meta de caracteres`,
          `Você já escreveu ${metrics.characterCount} de ${goals.characters.target} caracteres.`
        );
      }

      // Aviso ao atingir 100%
      if (
        goals.characters.warnAt100 &&
        percentage >= 100 &&
        !shown.characterGoal100
      ) {
        shown.characterGoal100 = true;
        onWarning(
          "goals",
          "info",
          "🎉 Meta de caracteres atingida!",
          `Parabéns! Você atingiu sua meta de ${goals.characters.target} caracteres!`
        );
      }
    }

    // ========== LIMITES ==========

    // Limite de Palavras
    if (limits.words?.enabled && limits.words.limit > 0) {
      const percentage = (metrics.wordCount / limits.words.limit) * 100;

      // Aviso em 90%
      if (
        limits.words.warnAt90 &&
        percentage >= 90 &&
        percentage < 100 &&
        !shown.wordLimit90
      ) {
        shown.wordLimit90 = true;
        onWarning(
          "limits",
          "warning",
          `Atenção: ${Math.floor(percentage)}% do limite de palavras`,
          `Você está se aproximando do limite de ${limits.words.limit} palavras (${metrics.wordCount} atuais).`
        );
      }

      // Aviso ao ultrapassar 100%
      if (limits.words.warnAt100 && percentage >= 100 && !shown.wordLimit100) {
        shown.wordLimit100 = true;
        onWarning(
          "limits",
          "error",
          "Limite de palavras ultrapassado!",
          `O capítulo ultrapassou o limite recomendado de ${limits.words.limit} palavras (${metrics.wordCount} atuais).`
        );
      }
    }

    // Limite de Caracteres
    if (limits.characters?.enabled && limits.characters.limit > 0) {
      const percentage =
        (metrics.characterCount / limits.characters.limit) * 100;

      // Aviso em 90%
      if (
        limits.characters.warnAt90 &&
        percentage >= 90 &&
        percentage < 100 &&
        !shown.characterLimit90
      ) {
        shown.characterLimit90 = true;
        onWarning(
          "limits",
          "warning",
          `Atenção: ${Math.floor(percentage)}% do limite de caracteres`,
          `Você está se aproximando do limite de ${limits.characters.limit} caracteres (${metrics.characterCount} atuais).`
        );
      }

      // Aviso ao ultrapassar 100%
      if (
        limits.characters.warnAt100 &&
        percentage >= 100 &&
        !shown.characterLimit100
      ) {
        shown.characterLimit100 = true;
        onWarning(
          "limits",
          "error",
          "Limite de caracteres ultrapassado!",
          `O capítulo ultrapassou o limite recomendado de ${limits.characters.limit} caracteres (${metrics.characterCount} atuais).`
        );
      }
    }

    // Limite de Sessão
    if (limits.session?.enabled && limits.session.minutes > 0) {
      const percentage =
        (metrics.sessionDuration / limits.session.minutes) * 100;

      // Aviso em 90%
      if (
        limits.session.warnAt90 &&
        percentage >= 90 &&
        percentage < 100 &&
        !shown.sessionLimit90
      ) {
        shown.sessionLimit90 = true;
        const remainingMinutes = Math.ceil(
          limits.session.minutes - metrics.sessionDuration
        );
        onWarning(
          "limits",
          "warning",
          `${Math.floor(percentage)}% do tempo de sessão`,
          `Você está escrevendo há ${metrics.sessionDuration} minutos. Restam ~${remainingMinutes} minutos antes de uma pausa recomendada.`
        );
      }

      // Aviso ao ultrapassar 100%
      if (
        limits.session.warnAt100 &&
        percentage >= 100 &&
        !shown.sessionLimit100
      ) {
        shown.sessionLimit100 = true;
        onWarning(
          "limits",
          "error",
          "⏰ Hora de fazer uma pausa!",
          `Você está escrevendo há ${metrics.sessionDuration} minutos. Uma pausa pode melhorar sua criatividade e prevenir fadiga.`
        );
      }
    }
  }, [metrics, goals, limits, onWarning]);
}
