/**
 * Context de Metas Globais
 *
 * Gerencia as metas globais que se aplicam a todos os capítulos,
 * com persistência em localStorage.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

import {
  GlobalGoals,
  DEFAULT_GLOBAL_GOALS,
  ChapterStatus,
} from "@/types/global-goals";

interface GlobalGoalsContextValue {
  goals: GlobalGoals;
  updateGoals: (goals: GlobalGoals) => void;
  resetGoals: () => void;
  isGoalApplicableToStatus: (status: ChapterStatus) => boolean;
}

const GlobalGoalsContext = createContext<GlobalGoalsContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "grimorium:global-goals";

interface GlobalGoalsProviderProps {
  children: ReactNode;
}

export function GlobalGoalsProvider({ children }: GlobalGoalsProviderProps) {
  const [goals, setGoals] = useState<GlobalGoals>(() => {
    // Carregar do localStorage na inicialização
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_GLOBAL_GOALS,
          ...parsed,
          // Garantir que todos os campos necessários existem
          words: { ...DEFAULT_GLOBAL_GOALS.words, ...parsed.words },
          characters: {
            ...DEFAULT_GLOBAL_GOALS.characters,
            ...parsed.characters,
          },
          sessionTime: {
            ...DEFAULT_GLOBAL_GOALS.sessionTime,
            ...parsed.sessionTime,
          },
        };
      }
    } catch (error) {
      console.error("Erro ao carregar metas globais do localStorage:", error);
    }
    return DEFAULT_GLOBAL_GOALS;
  });

  // Salvar no localStorage sempre que as metas mudarem
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error("Erro ao salvar metas globais no localStorage:", error);
    }
  }, [goals]);

  const updateGoals = useCallback((newGoals: GlobalGoals) => {
    setGoals(newGoals);
  }, []);

  const resetGoals = useCallback(() => {
    setGoals(DEFAULT_GLOBAL_GOALS);
  }, []);

  const isGoalApplicableToStatus = useCallback(
    (status: ChapterStatus): boolean => goals.appliesTo.includes(status),
    [goals.appliesTo]
  );

  const value = useMemo<GlobalGoalsContextValue>(
    () => ({
      goals,
      updateGoals,
      resetGoals,
      isGoalApplicableToStatus,
    }),
    [goals, updateGoals, resetGoals, isGoalApplicableToStatus]
  );

  return (
    <GlobalGoalsContext.Provider value={value}>
      {children}
    </GlobalGoalsContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de metas globais
 */
export function useGlobalGoals() {
  const context = useContext(GlobalGoalsContext);

  if (!context) {
    throw new Error("useGlobalGoals must be used within a GlobalGoalsProvider");
  }

  return context;
}
