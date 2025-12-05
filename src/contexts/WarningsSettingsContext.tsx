/**
 * Contexto de Configurações de Avisos
 *
 * Gerencia configurações globais de avisos com persistência em localStorage
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  WarningsSettings,
  DEFAULT_WARNINGS_SETTINGS,
} from "@/types/warnings-settings";

const STORAGE_KEY = "grimorium_warnings_settings";

interface WarningsSettingsContextValue {
  settings: WarningsSettings;
  updateSettings: (settings: WarningsSettings) => void;
}

const WarningsSettingsContext = createContext<
  WarningsSettingsContextValue | undefined
>(undefined);

interface WarningsSettingsProviderProps {
  children: ReactNode;
}

export function WarningsSettingsProvider({
  children,
}: WarningsSettingsProviderProps) {
  const [settings, setSettings] = useState<WarningsSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_WARNINGS_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.error(
        "Erro ao carregar configurações de avisos do localStorage:",
        error
      );
    }
    return DEFAULT_WARNINGS_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error(
        "Erro ao salvar configurações de avisos no localStorage:",
        error
      );
    }
  }, [settings]);

  const updateSettings = (newSettings: WarningsSettings) => {
    setSettings(newSettings);
  };

  return (
    <WarningsSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </WarningsSettingsContext.Provider>
  );
}

export function useWarningsSettings() {
  const context = useContext(WarningsSettingsContext);

  if (!context) {
    throw new Error(
      "useWarningsSettings must be used within a WarningsSettingsProvider"
    );
  }

  return context;
}
