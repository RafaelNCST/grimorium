/**
 * User Account Store
 *
 * Gerencia os dados da conta do usuário incluindo perfil, assinatura e pagamento
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { UserAccount, MOCK_USER } from "@/types/user-account";

interface UserAccountState {
  user: UserAccount | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: UserAccount) => void;
  updateDisplayName: (name: string) => void;
  updateAvatar: (url: string) => void;
  logout: () => void;
}

export const useUserAccountStore = create<UserAccountState>()(
  persist(
    (set) => ({
      // Estado inicial com mock user para desenvolvimento
      user: MOCK_USER,
      isAuthenticated: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      updateDisplayName: (name) =>
        set((state) => ({
          user: state.user ? { ...state.user, displayName: name } : null,
        })),

      updateAvatar: (url) =>
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl: url } : null,
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "user-account-storage",
    }
  )
);
