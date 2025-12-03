/**
 * Sistema de Métricas do Editor de Capítulos
 *
 * Define os tipos para todas as métricas calculadas durante a escrita.
 */

/**
 * Métricas principais do capítulo
 */
export interface ChapterMetrics {
  // Básicas
  wordCount: number;
  characterCount: number; // Sem espaços
  characterCountWithSpaces: number; // Com espaços

  // Estruturais
  paragraphCount: number;
  sentenceCount: number;
  dialogueCount: number; // Falas estimadas

  // Tempo
  sessionDuration: number; // Em minutos (sessão atual)
  totalDuration?: number; // Total acumulado (futuro)

  // Qualidade/Leitura (para o modal de detalhes)
  estimatedReadingTime: number; // Em minutos
  averageWordsPerSentence: number;
  estimatedPages: number; // Baseado em 250 palavras/página
}

/**
 * Métricas vazias/iniciais
 */
export const EMPTY_METRICS: ChapterMetrics = {
  wordCount: 0,
  characterCount: 0,
  characterCountWithSpaces: 0,
  paragraphCount: 0,
  sentenceCount: 0,
  dialogueCount: 0,
  sessionDuration: 0,
  totalDuration: 0,
  estimatedReadingTime: 0,
  averageWordsPerSentence: 0,
  estimatedPages: 0,
};

/**
 * Configurações para cálculo de métricas
 */
export const METRICS_CONFIG = {
  wordsPerPage: 250,
  wordsPerMinuteReading: 225,
} as const;
