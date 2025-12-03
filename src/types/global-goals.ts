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
 * Meta de palavras global
 */
export interface WordGoal {
  enabled: boolean;
  target: number;
  warnAt90: boolean;
  warnAt100: boolean;
  silent: boolean; // Se true, não notifica (apenas visual)
}

/**
 * Meta de caracteres global
 */
export interface CharacterGoal {
  enabled: boolean;
  target: number;
  warnAt90: boolean;
  warnAt100: boolean;
  silent: boolean;
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
  characters: CharacterGoal;
  sessionTime: SessionTimeGoal;
  // Status de capítulos onde as metas se aplicam
  appliesTo: ChapterStatus[];
}

/**
 * Valores padrão para meta de palavras
 */
export const DEFAULT_WORD_GOAL: WordGoal = {
  enabled: false,
  target: 2000,
  warnAt90: true,
  warnAt100: true,
  silent: false,
};

/**
 * Valores padrão para meta de caracteres
 */
export const DEFAULT_CHARACTER_GOAL: CharacterGoal = {
  enabled: false,
  target: 10000,
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
  characters: DEFAULT_CHARACTER_GOAL,
  sessionTime: DEFAULT_SESSION_TIME_GOAL,
  appliesTo: ["draft", "in-progress", "review", "finished"],
};

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
