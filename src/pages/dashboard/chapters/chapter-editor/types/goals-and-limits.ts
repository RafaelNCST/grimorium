/**
 * Sistema de Metas e Limites do Editor de Capítulos
 *
 * Define os tipos para metas (objetivos a alcançar) e limites (valores máximos)
 * que criam avisos no sistema de warnings quando atingidos.
 */

/**
 * Configuração de meta de palavras para o capítulo
 */
export interface WordGoal {
  enabled: boolean;
  target: number;
  warnAt90: boolean; // Avisar em 90%
  warnAt100: boolean; // Avisar em 100%
}

/**
 * Configuração de meta de caracteres para o capítulo
 */
export interface CharacterGoal {
  enabled: boolean;
  target: number;
  warnAt90: boolean; // Avisar em 90%
  warnAt100: boolean; // Avisar em 100%
}

/**
 * Configuração de limite de palavras para o capítulo
 */
export interface WordLimit {
  enabled: boolean;
  limit: number;
  warnAt90: boolean; // Avisar em 90%
  warnAt100: boolean; // Avisar em 100%
}

/**
 * Configuração de limite de caracteres para o capítulo
 */
export interface CharacterLimit {
  enabled: boolean;
  limit: number;
  warnAt90: boolean; // Avisar em 90%
  warnAt100: boolean; // Avisar em 100%
}

/**
 * Configuração de limite de sessão (tempo máximo de escrita contínua)
 */
export interface SessionLimit {
  enabled: boolean;
  minutes: number; // Tempo em minutos
  warnAt90: boolean; // Avisar em 90%
  warnAt100: boolean; // Avisar em 100%
}

/**
 * Todas as metas do capítulo (sempre por capítulo individual)
 */
export interface ChapterGoals {
  words?: WordGoal;
  characters?: CharacterGoal;
}

/**
 * Todos os limites do capítulo (sempre por capítulo individual)
 */
export interface ChapterLimits {
  words?: WordLimit;
  characters?: CharacterLimit;
  session?: SessionLimit;
}

/**
 * Valores padrão para uma meta de palavras
 */
export const DEFAULT_WORD_GOAL: WordGoal = {
  enabled: false,
  target: 2000,
  warnAt90: true,
  warnAt100: true,
};

/**
 * Valores padrão para uma meta de caracteres
 */
export const DEFAULT_CHARACTER_GOAL: CharacterGoal = {
  enabled: false,
  target: 10000,
  warnAt90: true,
  warnAt100: true,
};

/**
 * Valores padrão para um limite de palavras
 */
export const DEFAULT_WORD_LIMIT: WordLimit = {
  enabled: false,
  limit: 5000,
  warnAt90: true,
  warnAt100: false,
};

/**
 * Valores padrão para um limite de caracteres
 */
export const DEFAULT_CHARACTER_LIMIT: CharacterLimit = {
  enabled: false,
  limit: 25000,
  warnAt90: true,
  warnAt100: false,
};

/**
 * Valores padrão para um limite de sessão
 */
export const DEFAULT_SESSION_LIMIT: SessionLimit = {
  enabled: false,
  minutes: 120, // 2 horas
  warnAt90: true,
  warnAt100: false,
};

/**
 * Metas padrão para um capítulo
 */
export const DEFAULT_CHAPTER_GOALS: ChapterGoals = {
  words: DEFAULT_WORD_GOAL,
  characters: DEFAULT_CHARACTER_GOAL,
};

/**
 * Limites padrão para um capítulo
 */
export const DEFAULT_CHAPTER_LIMITS: ChapterLimits = {
  words: DEFAULT_WORD_LIMIT,
  characters: DEFAULT_CHARACTER_LIMIT,
  session: DEFAULT_SESSION_LIMIT,
};
