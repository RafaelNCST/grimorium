import { create } from "zustand";

import { SQLiteErrorType } from "@/lib/db/error-handler";

interface ErrorModalStore {
  isOpen: boolean;
  errorType: SQLiteErrorType | null;
  showError: (errorType: SQLiteErrorType) => void;
  hideError: () => void;
}

/**
 * Store global para controle do modal de erros do banco de dados
 *
 * Este store gerencia o estado do modal de erro que é renderizado
 * globalmente no App.tsx. Services podem chamar `showError()` para
 * exibir o modal quando detectarem erros críticos.
 */
export const useErrorModalStore = create<ErrorModalStore>((set) => ({
  isOpen: false,
  errorType: null,

  showError: (errorType: SQLiteErrorType) => {
    set({ isOpen: true, errorType });
  },

  hideError: () => {
    set({ isOpen: false, errorType: null });
  },
}));
