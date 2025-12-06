/**
 * Sistema de Metas Globais
 *
 * Metas que se aplicam a todos os capítulos de um livro,
 * com opções de filtro por status do capítulo.
 */

/**
 * Status possíveis de um capítulo
 */
export type ChapterStatus =
  | "draft"
  | "in-progress"
  | "review"
  | "finished"
  | "published";

/**
 * Meta de palavras global (mínimo: 1000 palavras)
 */
export interface WordGoal {
  enabled: boolean;
  target: number; // Mínimo: 1000
  warnAt90: boolean;
  warnAt100: boolean;
  silent: boolean; // Se true, não notifica (apenas visual)
}

/**
 * Meta de tempo de sessão global (em minutos)
 */
export interface SessionTimeGoal {
  enabled: boolean;
  targetMinutes: number;
  warnAt90: boolean;
  warnAt100: boolean;
  silent: boolean;
}

/**
 * Configuração completa das metas globais
 */
export interface GlobalGoals {
  words: WordGoal;
  sessionTime: SessionTimeGoal;
  // Status de capítulos onde as metas se aplicam
  appliesTo: ChapterStatus[];
}

/**
 * Valores padrão para meta de palavras (mínimo: 1000)
 */
export const DEFAULT_WORD_GOAL: WordGoal = {
  enabled: false,
  target: 2000,
  warnAt90: true,
  warnAt100: true,
  silent: false,
};

/**
 * Valores padrão para meta de tempo de sessão
 */
export const DEFAULT_SESSION_TIME_GOAL: SessionTimeGoal = {
  enabled: false,
  targetMinutes: 60, // 1 hora
  warnAt90: true,
  warnAt100: true,
  silent: false,
};

/**
 * Valores padrão completos das metas globais
 * Por padrão, aplica-se a todos os status exceto "published"
 */
export const DEFAULT_GLOBAL_GOALS: GlobalGoals = {
  words: DEFAULT_WORD_GOAL,
  sessionTime: DEFAULT_SESSION_TIME_GOAL,
  appliesTo: ["draft", "in-progress", "review", "finished"],
};

/**
 * Constantes de validação
 */
export const MIN_WORD_GOAL = 1000;

/**
 * Labels dos status de capítulos
 */
export const CHAPTER_STATUS_LABELS: Record<ChapterStatus, string> = {
  draft: "Rascunho",
  "in-progress": "Em andamento",
  review: "Em revisão",
  finished: "Finalizado",
  published: "Lançado",
};
