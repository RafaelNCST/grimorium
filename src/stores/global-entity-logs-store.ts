/**
 * Global Entity Logs Store
 *
 * Zustand store para gerenciar logs globais com cache por bookId.
 * Segue o padrão do gallery-store.ts para consistência.
 */

import { create } from "zustand";

import {
  getAllGlobalEntityLogs,
  getGlobalEntityLogById,
  getGlobalEntityLogsByEntityId,
  createGlobalEntityLog,
  updateGlobalEntityLog,
  deleteGlobalEntityLog,
  reorderGlobalEntityLogs,
} from "@/lib/db/global-entity-logs.service";
import {
  addEntityLogLink,
  removeEntityLogLink,
  updateEntityLogLinks,
  countLinksForLog,
  reorderEntityLogLinks,
} from "@/lib/db/entity-log-links.service";
import {
  IGlobalEntityLog,
  IEntityLogLink,
  EntityType,
} from "@/types/global-entity-log-types";

interface GlobalEntityLogsState {
  logs: IGlobalEntityLog[];
  isLoading: boolean;
  lastFetched: number;
  currentBookId: string | null;

  // Fetch
  fetchGlobalEntityLogs: (
    forceRefresh?: boolean,
    bookId?: string
  ) => Promise<void>;
  getGlobalEntityLogById: (logId: string) => Promise<IGlobalEntityLog | null>;
  getLogsByEntityId: (
    entityId: string,
    entityType: EntityType
  ) => Promise<IGlobalEntityLog[]>;

  // CRUD
  addGlobalEntityLog: (log: IGlobalEntityLog) => Promise<void>;
  updateGlobalEntityLogInCache: (
    logId: string,
    updates: Partial<Omit<IGlobalEntityLog, "id" | "createdAt" | "links">>
  ) => Promise<void>;
  deleteGlobalEntityLogFromCache: (logId: string) => Promise<void>;

  // Links
  addEntityLogLinkInCache: (logId: string, link: IEntityLogLink) => Promise<void>;
  removeEntityLogLinkFromCache: (
    logId: string,
    linkId: string
  ) => Promise<void>;
  updateEntityLogLinksInCache: (
    logId: string,
    links: IEntityLogLink[]
  ) => Promise<void>;

  // Reorder
  reorderGlobalEntityLogsInCache: (
    reorderedLogs: IGlobalEntityLog[]
  ) => Promise<void>;
  reorderEntityLogLinksInCache: (
    entityId: string,
    entityType: EntityType,
    logIds: string[]
  ) => Promise<void>;

  // Utils
  invalidateCache: () => void;
  countLinksForLog: (logId: string) => Promise<number>;
}

// Promise para rastrear fetch em andamento
let fetchingPromise: Promise<void> | null = null;

export const useGlobalEntityLogsStore = create<GlobalEntityLogsState>(
  (set, get) => ({
    logs: [],
    isLoading: false,
    lastFetched: 0,
    currentBookId: null,

    fetchGlobalEntityLogs: async (forceRefresh = false, bookId?: string) => {
      // Se já está fetchando e não é force refresh, retornar a promise existente
      if (fetchingPromise && !forceRefresh) {
        return fetchingPromise;
      }

      const promise = (async () => {
        const state = get();

        // Se o bookId mudou, forçar refresh
        const bookIdChanged = bookId !== state.currentBookId;
        const shouldRefresh = forceRefresh || bookIdChanged;

        // Verificar cache se não for shouldRefresh
        if (!shouldRefresh && state.logs.length > 0) {
          return;
        }

        // Marcar como loading
        set({
          isLoading: true,
          currentBookId: bookId ?? null,
          logs: [], // Limpar logs ao trocar de book ou refresh
        });

        try {
          const targetBookId = bookId ?? null;

          if (!targetBookId) {
            console.warn(
              "[GlobalEntityLogsStore] No bookId provided. Cannot fetch logs."
            );
            set({ isLoading: false, logs: [] });
            return;
          }

          // Fetch logs do banco
          const fetchedLogs = await getAllGlobalEntityLogs(targetBookId);

          set({
            logs: fetchedLogs,
            isLoading: false,
            lastFetched: Date.now(),
          });
        } catch (error) {
          console.error("[GlobalEntityLogsStore] Error fetching logs:", error);
          set({ isLoading: false });
        }
      })();

      fetchingPromise = promise;
      await promise;
      fetchingPromise = null;
    },

    getGlobalEntityLogById: async (logId: string) => {
      const state = get();

      // Tentar buscar do cache primeiro
      const cachedLog = state.logs.find((log) => log.id === logId);
      if (cachedLog) {
        return cachedLog;
      }

      // Se não estiver no cache, buscar do banco
      try {
        const log = await getGlobalEntityLogById(logId);
        return log;
      } catch (error) {
        console.error(
          `[GlobalEntityLogsStore] Error fetching log ${logId}:`,
          error
        );
        return null;
      }
    },

    getLogsByEntityId: async (entityId: string, entityType: EntityType) => {
      try {
        const logs = await getGlobalEntityLogsByEntityId(entityId, entityType);
        return logs;
      } catch (error) {
        console.error(
          `[GlobalEntityLogsStore] Error fetching logs for entity ${entityId}:`,
          error
        );
        return [];
      }
    },

    addGlobalEntityLog: async (log: IGlobalEntityLog) => {
      try {
        await createGlobalEntityLog(log);

        // Save links to database
        for (const link of log.links) {
          await addEntityLogLink(link);
        }

        // Adicionar ao cache
        set((state) => ({
          logs: [...state.logs, log],
        }));
      } catch (error) {
        console.error("[GlobalEntityLogsStore] Error adding log:", error);
        throw error;
      }
    },

    updateGlobalEntityLogInCache: async (logId, updates) => {
      try {
        await updateGlobalEntityLog(logId, updates);

        // Atualizar no cache
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === logId
              ? { ...log, ...updates, updatedAt: new Date().toISOString() }
              : log
          ),
        }));
      } catch (error) {
        console.error(
          `[GlobalEntityLogsStore] Error updating log ${logId}:`,
          error
        );
        throw error;
      }
    },

    deleteGlobalEntityLogFromCache: async (logId) => {
      try {
        await deleteGlobalEntityLog(logId);

        // Remover do cache
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== logId),
        }));
      } catch (error) {
        console.error(
          `[GlobalEntityLogsStore] Error deleting log ${logId}:`,
          error
        );
        throw error;
      }
    },

    addEntityLogLinkInCache: async (logId, link) => {
      try {
        await addEntityLogLink(link);

        // Atualizar no cache
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === logId
              ? { ...log, links: [...log.links, link] }
              : log
          ),
        }));
      } catch (error) {
        console.error(
          `[GlobalEntityLogsStore] Error adding link to log ${logId}:`,
          error
        );
        throw error;
      }
    },

    removeEntityLogLinkFromCache: async (logId, linkId) => {
      try {
        await removeEntityLogLink(linkId);

        // Atualizar no cache
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === logId
              ? {
                  ...log,
                  links: log.links.filter((link) => link.id !== linkId),
                }
              : log
          ),
        }));
      } catch (error) {
        console.error(
          `[GlobalEntityLogsStore] Error removing link ${linkId}:`,
          error
        );
        throw error;
      }
    },

    updateEntityLogLinksInCache: async (logId, links) => {
      try {
        await updateEntityLogLinks(logId, links);

        // Atualizar no cache
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === logId ? { ...log, links } : log
          ),
        }));
      } catch (error) {
        console.error(
          `[GlobalEntityLogsStore] Error updating links for log ${logId}:`,
          error
        );
        throw error;
      }
    },

    reorderGlobalEntityLogsInCache: async (reorderedLogs) => {
      try {
        const state = get();
        const bookId = state.currentBookId;

        if (!bookId) {
          throw new Error("No bookId set in store");
        }

        // Update order indices
        const logsWithNewOrder = reorderedLogs.map((log, index) => ({
          ...log,
          orderIndex: index,
        }));

        // Update cache immediately for smooth UX
        set({ logs: logsWithNewOrder });

        // Update in database in background (don't await)
        reorderGlobalEntityLogs(
          bookId,
          logsWithNewOrder.map((log) => log.id)
        ).catch((error) => {
          console.error(
            "[GlobalEntityLogsStore] Error persisting reorder:",
            error
          );
        });
      } catch (error) {
        console.error(
          "[GlobalEntityLogsStore] Error reordering logs:",
          error
        );
        throw error;
      }
    },

    reorderEntityLogLinksInCache: async (entityId, entityType, logIds) => {
      try {
        // Persist entity-specific reordering in background (don't await)
        reorderEntityLogLinks(entityId, entityType, logIds).catch((error) => {
          console.error(
            "[GlobalEntityLogsStore] Error persisting entity log links reorder:",
            error
          );
        });
      } catch (error) {
        console.error(
          "[GlobalEntityLogsStore] Error reordering entity log links:",
          error
        );
        throw error;
      }
    },

    invalidateCache: () => {
      set({
        logs: [],
        lastFetched: 0,
        currentBookId: null,
      });
    },

    countLinksForLog: async (logId: string) => {
      try {
        const count = await countLinksForLog(logId);
        return count;
      } catch (error) {
        console.error(
          `[GlobalEntityLogsStore] Error counting links for log ${logId}:`,
          error
        );
        return 0;
      }
    },
  })
);
