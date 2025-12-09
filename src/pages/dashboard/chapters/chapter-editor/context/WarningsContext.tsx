/**
 * Contexto de Gerenciamento de Avisos
 *
 * Gerencia todos os avisos do editor de capítulos, incluindo:
 * - Adição, remoção e dismissal de avisos
 * - Notificações via toast
 * - Estatísticas de avisos
 * - Persistência em localStorage
 * - Respeita configurações globais de avisos
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
  useRef,
} from "react";

import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useWarningsSettings } from "@/contexts/WarningsSettingsContext";

import {
  Warning,
  WarningType,
  WarningSeverity,
  WarningStats,
  WarningAction,
} from "../types/warnings";

/**
 * Gera uma chave de armazenamento única para cada capítulo
 */
const getStorageKey = (chapterId: string) =>
  `grimorium_chapter_warnings_${chapterId}`;

interface WarningsContextValue {
  warnings: Warning[];
  stats: WarningStats;
  addWarning: (
    type: WarningType,
    severity: WarningSeverity,
    title: string,
    message: string,
    action?: WarningAction
  ) => string;
  removeWarning: (id: string) => void;
  dismissWarning: (id: string) => void;
  clearAllWarnings: () => void;
  clearWarningsByType: (type: WarningType) => void;
  getWarningsByType: (type: WarningType) => Warning[];
  handleWarningAction: (warning: Warning) => void;
  showWarningToasts: boolean;
  setShowWarningToasts: (show: boolean) => void;
}

const WarningsContext = createContext<WarningsContextValue | undefined>(
  undefined
);

interface WarningsProviderProps {
  children: ReactNode;
  chapterId: string;
  showWarningToasts?: boolean;
}

export function WarningsProvider({
  children,
  chapterId,
  showWarningToasts: initialShowToasts = true,
}: WarningsProviderProps) {
  const { t } = useTranslation("chapter-editor");
  const { settings } = useWarningsSettings();

  // Ref para rastrear o capítulo atual e evitar avisos durante transição
  const currentChapterIdRef = useRef<string>(chapterId);
  const isLoadingChapterRef = useRef<boolean>(false);
  const recentWarningsRef = useRef<Map<string, number>>(new Map());

  // Carrega avisos do localStorage na inicialização e quando o capítulo mudar
  const [warnings, setWarnings] = useState<Warning[]>(() => {
    try {
      const storageKey = getStorageKey(chapterId);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Erro ao carregar avisos do localStorage:", error);
    }
    return [];
  });
  const [showWarningToasts, setShowWarningToasts] = useState(initialShowToasts);

  // Recarrega avisos quando o capítulo mudar
  useEffect(() => {
    // Se o capítulo não mudou, não faz nada
    if (currentChapterIdRef.current === chapterId) {
      return;
    }

    // Marca que estamos carregando um novo capítulo
    isLoadingChapterRef.current = true;
    currentChapterIdRef.current = chapterId;

    // Limpa o mapa de avisos recentes ao trocar de capítulo
    recentWarningsRef.current.clear();

    try {
      const storageKey = getStorageKey(chapterId);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setWarnings(JSON.parse(stored));
      } else {
        setWarnings([]);
      }
    } catch (error) {
      console.error("Erro ao carregar avisos do localStorage:", error);
      setWarnings([]);
    }

    // Delay maior para garantir que todos os hooks carregaram seus trackers
    // e processaram as métricas iniciais do novo capítulo
    setTimeout(() => {
      isLoadingChapterRef.current = false;
    }, 500);
  }, [chapterId]);

  // Salva avisos no localStorage sempre que mudarem
  useEffect(() => {
    try {
      const storageKey = getStorageKey(chapterId);
      localStorage.setItem(storageKey, JSON.stringify(warnings));
    } catch (error) {
      console.error("Erro ao salvar avisos no localStorage:", error);
    }
  }, [warnings, chapterId]);

  /**
   * Calcula estatísticas dos avisos
   */
  const stats = useMemo<WarningStats>(() => {
    const activeWarnings = warnings.filter((w) => !w.dismissed);

    const byType: Record<WarningType, number> = {
      typography: 0,
      goals: 0,
      time: 0,
    };

    const bySeverity: Record<WarningSeverity, number> = {
      info: 0,
      warning: 0,
      error: 0,
    };

    activeWarnings.forEach((warning) => {
      byType[warning.type]++;
      bySeverity[warning.severity]++;
    });

    return {
      total: activeWarnings.length,
      byType,
      bySeverity,
      unread: activeWarnings.length,
    };
  }, [warnings]);

  /**
   * Adiciona um novo aviso
   */
  const addWarning = useCallback(
    (
      type: WarningType,
      severity: WarningSeverity,
      title: string,
      message: string,
      action?: WarningAction
    ): string => {
      // Se avisos estão desligados completamente, não faz nada
      if (!settings.enabled) {
        return "";
      }

      // Se estamos em transição de capítulo, não adiciona avisos
      if (isLoadingChapterRef.current) {
        return "";
      }

      // Verifica se um aviso idêntico foi criado recentemente (últimos 2 segundos)
      // Isso previne loops infinitos de avisos
      const warningKey = `${type}-${title}-${message}`;
      const now = Date.now();
      const lastWarningTime = recentWarningsRef.current.get(warningKey);

      if (lastWarningTime && now - lastWarningTime < 2000) {
        // Aviso duplicado muito recente, ignora
        return "";
      }

      // Registra este aviso
      recentWarningsRef.current.set(warningKey, now);

      // Limpa avisos antigos do mapa (mais de 5 segundos)
      recentWarningsRef.current.forEach((time, key) => {
        if (now - time > 5000) {
          recentWarningsRef.current.delete(key);
        }
      });

      const newWarning: Warning = {
        id: `warning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        severity,
        title,
        message,
        createdAt: new Date().toISOString(),
        action,
        dismissed: false,
      };

      setWarnings((prev) => [newWarning, ...prev]);

      // Mostra toast apenas se notificações estiverem habilitadas
      if (showWarningToasts && settings.notificationsEnabled) {
        const typeLabel = t(`warnings.types.${type}`);
        const toastMessage = `${typeLabel}: ${title}`;

        switch (severity) {
          case "error":
            toast.error(toastMessage, {
              description: message,
              duration: 5000,
            });
            break;
          case "warning":
            toast.warning(toastMessage, {
              description: message,
              duration: 5000,
            });
            break;
          case "info":
            toast.info(toastMessage, {
              description: message,
              duration: 5000,
            });
            break;
        }
      }

      return newWarning.id;
    },
    [showWarningToasts, settings.enabled, settings.notificationsEnabled, t]
  );

  /**
   * Remove um aviso completamente
   */
  const removeWarning = useCallback((id: string) => {
    setWarnings((prev) => prev.filter((w) => w.id !== id));
  }, []);

  /**
   * Marca um aviso como dismissado (não remove, apenas esconde)
   */
  const dismissWarning = useCallback((id: string) => {
    setWarnings((prev) =>
      prev.map((w) => (w.id === id ? { ...w, dismissed: true } : w))
    );
  }, []);

  /**
   * Remove todos os avisos
   */
  const clearAllWarnings = useCallback(() => {
    setWarnings([]);
  }, []);

  /**
   * Remove todos os avisos de um tipo específico
   */
  const clearWarningsByType = useCallback((type: WarningType) => {
    setWarnings((prev) => prev.filter((w) => w.type !== type));
  }, []);

  /**
   * Obtém avisos por tipo
   */
  const getWarningsByType = useCallback(
    (type: WarningType): Warning[] =>
      warnings.filter((w) => w.type === type && !w.dismissed),
    [warnings]
  );

  /**
   * Executa a ação associada a um aviso
   */
  const handleWarningAction = useCallback((warning: Warning) => {
    if (!warning.action) return;

    switch (warning.action.type) {
      case "highlight":
        // Implementar highlight de texto
        console.log("Highlight action:", warning.action.data);
        break;

      case "navigate":
        // Implementar navegação
        console.log("Navigate action:", warning.action.data);
        break;

      case "fix":
        // Implementar correção automática
        console.log("Fix action:", warning.action.data);
        break;

      case "custom":
        // Ação customizada
        console.log("Custom action:", warning.action.data);
        break;
    }
  }, []);

  const value: WarningsContextValue = {
    warnings: warnings.filter((w) => !w.dismissed),
    stats,
    addWarning,
    removeWarning,
    dismissWarning,
    clearAllWarnings,
    clearWarningsByType,
    getWarningsByType,
    handleWarningAction,
    showWarningToasts,
    setShowWarningToasts,
  };

  return (
    <WarningsContext.Provider value={value}>
      {children}
    </WarningsContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de avisos
 */
export function useWarnings() {
  const context = useContext(WarningsContext);

  if (!context) {
    throw new Error("useWarnings must be used within a WarningsProvider");
  }

  return context;
}
