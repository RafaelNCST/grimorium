/**
 * User Account Types
 *
 * Tipos relacionados ao perfil offline do usuário
 */

export interface UserAccount {
  displayName: string;
}

// User padrão
export const DEFAULT_USER: UserAccount = {
  displayName: "Escritor",
};
