/**
 * Hook para calcular métricas do capítulo em tempo real
 */

import { useMemo } from "react";

import {
  ChapterMetrics,
  EMPTY_METRICS,
  METRICS_CONFIG,
} from "../types/metrics";

interface UseChapterMetricsProps {
  content: string;
  sessionDuration: number; // Em minutos
}

/**
 * Calcula todas as métricas do capítulo baseado no conteúdo
 */
export function useChapterMetrics({
  content,
  sessionDuration,
}: UseChapterMetricsProps): ChapterMetrics {
  return useMemo(() => {
    if (!content || content.trim().length === 0) {
      return { ...EMPTY_METRICS, sessionDuration };
    }

    const text = content.trim();

    // Palavras
    const words = text
      .split(/\s+/)
      .filter((word) => word.length > 0 && /\S/.test(word));
    const wordCount = words.length;

    // Caracteres
    const characterCount = text.replace(/\s/g, "").length;
    const characterCountWithSpaces = text.length;

    // Parágrafos (linhas separadas por quebras duplas ou tags <p>)
    const paragraphs = text
      .split(/\n\n+|<\/p>|<br\s*\/?>/)
      .filter((p) => p.trim().length > 0);
    const paragraphCount = paragraphs.length;

    // Sentenças (terminadas em . ! ?)
    // Conta apenas sentenças completas com pontuação no final
    const sentenceMatches = text.match(/[^.!?]+[.!?]+/g);
    const sentenceCount = sentenceMatches ? sentenceMatches.length : 0;

    // Diálogos/Falas
    // Conta: "texto", 'texto', ou linha começando com — (travessão)
    const dialogueCount = countDialogues(text);

    // Tempo de leitura estimado (em minutos)
    const estimatedReadingTime = Math.ceil(
      wordCount / METRICS_CONFIG.wordsPerMinuteReading
    );

    // Média de palavras por sentença
    const averageWordsPerSentence =
      sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

    // Páginas estimadas
    const estimatedPages = parseFloat(
      (wordCount / METRICS_CONFIG.wordsPerPage).toFixed(1)
    );

    return {
      wordCount,
      characterCount,
      characterCountWithSpaces,
      paragraphCount,
      sentenceCount,
      dialogueCount,
      sessionDuration,
      totalDuration: 0,
      estimatedReadingTime,
      averageWordsPerSentence,
      estimatedPages,
    };
  }, [content, sessionDuration]);
}

/**
 * Conta diálogos/falas no texto
 * - Aspas duplas: "texto"
 * - Aspas simples: 'texto'
 * - Travessões no início de linha: — texto
 */
function countDialogues(text: string): number {
  let count = 0;

  // Aspas duplas: "texto"
  const doubleQuotes = text.match(/"[^"]+"/g);
  if (doubleQuotes) count += doubleQuotes.length;

  // Aspas simples: 'texto'
  const singleQuotes = text.match(/'[^']+'/g);
  if (singleQuotes) count += singleQuotes.length;

  // Travessões no início de linha: — ou – ou -
  // Usando regex para pegar linhas que começam com travessão
  const lines = text.split("\n");
  const dashDialogues = lines.filter((line) => {
    const trimmed = line.trim();
    // Travessão longo (—), médio (–), ou hífen seguido de espaço no início
    return /^[—–]\s/.test(trimmed);
  });
  count += dashDialogues.length;

  return count;
}
