/**
 * Sistema de Avisos do Editor de Capítulos
 *
 * Este arquivo define os tipos para o sistema de avisos/notificações
 * que alerta o usuário sobre problemas de tipografia, gramática, metas e limites.
 */

/**
 * Tipos de avisos disponíveis no sistema
 */
export type WarningType = "typography" | "grammar" | "goals" | "limits";

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
  grammar: "Gramática",
  goals: "Metas",
  limits: "Limites",
};

/**
 * Cores por tipo de aviso
 */
export const WARNING_TYPE_COLORS: Record<WarningType, string> = {
  typography: "text-blue-600 dark:text-blue-400",
  grammar: "text-yellow-600 dark:text-yellow-400",
  goals: "text-purple-600 dark:text-purple-400",
  limits: "text-red-600 dark:text-red-400",
};

/**
 * Ícones por tipo de aviso (Lucide React)
 */
export const WARNING_TYPE_ICONS: Record<WarningType, string> = {
  typography: "Type",
  grammar: "FileText",
  goals: "Target",
  limits: "AlertTriangle",
};

/**
 * Cores por severidade
 */
export const WARNING_SEVERITY_COLORS: Record<WarningSeverity, string> = {
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
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
