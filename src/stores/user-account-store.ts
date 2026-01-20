/**
 * User Account Store
 *
 * Gerencia o perfil offline do usuário (apenas nome de exibição)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { UserAccount, DEFAULT_USER } from "@/types/user-account";

interface UserAccountState {
  user: UserAccount;

  // Actions
  updateDisplayName: (name: string) => void;
}

export const useUserAccountStore = create<UserAccountState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: DEFAULT_USER,

      updateDisplayName: (name) =>
        set((state) => ({
          user: { ...state.user, displayName: name },
        })),
    }),
    {
      name: "user-account-storage",
    }
  )
);
