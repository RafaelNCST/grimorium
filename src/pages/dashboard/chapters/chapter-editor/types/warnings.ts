/**
 * Sistema de Avisos do Editor de Capítulos
 *
 * Este arquivo define os tipos para o sistema de avisos/notificações
 * que alerta o usuário sobre problemas de tipografia, gramática e metas.
 */

/**
 * Tipos de avisos disponíveis no sistema
 */
export type WarningType = "typography" | "goals" | "time";

/**
 * Severidade do aviso
 */
export type WarningSeverity = "info" | "warning" | "error";

/**
 * Interface para ação executada quando o aviso é clicado
 */
export interface WarningAction {
  type: "highlight" | "navigate" | "fix" | "custom";
  data?: any;
}

/**
 * Interface principal de um aviso
 */
export interface Warning {
  id: string;
  type: WarningType;
  severity: WarningSeverity;
  title: string;
  message: string;
  createdAt: string; // ISO string
  action?: WarningAction;
  dismissed?: boolean;
}

/**
 * Mapeamento de labels para tipos de avisos
 */
export const WARNING_TYPE_LABELS: Record<WarningType, string> = {
  typography: "Tipografia",
  goals: "Metas",
  time: "Tempo",
};

/**
 * Cores por tipo de aviso
 */
export const WARNING_TYPE_COLORS: Record<WarningType, string> = {
  typography: "text-blue-600 dark:text-blue-400",
  goals: "text-purple-600 dark:text-purple-400",
  time: "text-orange-600 dark:text-orange-400",
};

/**
 * Ícones por tipo de aviso (Lucide React)
 */
export const WARNING_TYPE_ICONS: Record<WarningType, string> = {
  typography: "Type",
  goals: "Target",
  time: "Clock",
};

/**
 * Labels de severidade em português
 */
export const WARNING_SEVERITY_LABELS: Record<WarningSeverity, string> = {
  info: "Informação",
  warning: "Importante",
  error: "Crítico",
};

/**
 * Cores por severidade
 */
export const WARNING_SEVERITY_COLORS: Record<WarningSeverity, string> = {
  info: "text-blue-600 dark:text-blue-400 border-blue-500/30",
  warning: "text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  error: "text-red-600 dark:text-red-400 border-red-500/30",
};

/**
 * Interface para estatísticas de avisos
 */
export interface WarningStats {
  total: number;
  byType: Record<WarningType, number>;
  bySeverity: Record<WarningSeverity, number>;
  unread: number;
}
