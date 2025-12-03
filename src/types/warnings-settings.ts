/**
 * Configurações Globais de Avisos
 *
 * Controla quais avisos são exibidos e como são exibidos
 */

export interface WarningsSettings {
  // Se false, desliga TUDO relacionado a avisos
  enabled: boolean;

  // Se false, apenas esconde toasts mas mantém menu lateral
  notificationsEnabled: boolean;

  // Controles por tipo de aviso
  timeWarningsEnabled: boolean;
  typographyWarningsEnabled: boolean;
}

export const DEFAULT_WARNINGS_SETTINGS: WarningsSettings = {
  enabled: true,
  notificationsEnabled: true,
  timeWarningsEnabled: true,
  typographyWarningsEnabled: true,
};
