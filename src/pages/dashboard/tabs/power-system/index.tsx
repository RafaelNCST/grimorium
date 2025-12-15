import { useEffect, useState } from "react";

import { usePowerSystemStore } from "@/stores/power-system-store";
import { usePowerSystemUIStore } from "@/stores/power-system-ui-store";

import { executeTemplate } from "./utils/template-builder";
import { PowerSystemView } from "./view";

import type { IPowerSystem } from "./types/power-system-types";

interface PowerSystemTabProps {
  bookId: string;
}

export function PowerSystemTab({ bookId }: PowerSystemTabProps) {
  // Store
  const {
    fetchSystems,
    getSystems,
    isLoading: isStoreLoading,
  } = usePowerSystemStore();
  const systems = getSystems(bookId);
  const isLoadingSystems = isStoreLoading(bookId);

  // UI Store
  const { setCurrentPageId } = usePowerSystemUIStore();

  // UI State
  const [isEditMode, setIsEditMode] = useState(false);

  // Modal States
  const [isCreateSystemModalOpen, setIsCreateSystemModalOpen] = useState(false);
  const [isEditSystemModalOpen, setIsEditSystemModalOpen] = useState(false);
  const [isDeleteSystemModalOpen, setIsDeleteSystemModalOpen] = useState(false);

  // Modal Context
  const [systemToEdit, setSystemToEdit] = useState<IPowerSystem | null>(null);

  // Fetch systems on mount
  useEffect(() => {
    fetchSystems(bookId);
  }, [bookId, fetchSystems]);

  // ============================================================================
  // SYSTEM HANDLERS
  // ============================================================================

  const handleCreateSystem = async (
    name: string,
    iconImage?: string,
    templateId?: string,
    language?: string
  ) => {
    try {
      const systemId = await usePowerSystemStore
        .getState()
        .addSystem(bookId, name, iconImage);

      // If a template was selected, execute it
      if (templateId && language) {
        const pageId = await executeTemplate(
          systemId,
          templateId,
          language as "pt" | "en"
        );

        // Advanced templates return a pageId for navigation
        // Basic templates return null (no navigation)
        if (pageId) {
          setCurrentPageId(systemId, pageId);
        }
      }

      setIsCreateSystemModalOpen(false);
    } catch (error) {
      console.error("Error creating system:", error);
    }
  };

  const handleUpdateSystem = async (
    systemId: string,
    name: string,
    iconImage?: string
  ) => {
    try {
      await usePowerSystemStore
        .getState()
        .updateSystemInCache(systemId, name, iconImage);

      setIsEditSystemModalOpen(false);
      setSystemToEdit(null);
    } catch (error) {
      console.error("Error updating system:", error);
    }
  };

  const handleEditSystemClick = (system: IPowerSystem) => {
    setSystemToEdit(system);
    setIsEditSystemModalOpen(true);
  };

  const handleDeleteSystem = async (systemId: string) => {
    try {
      await usePowerSystemStore
        .getState()
        .deleteSystemFromCache(bookId, systemId);
    } catch (error) {
      console.error("Error deleting system:", error);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <PowerSystemView
      // Data
      systems={systems}
      systemToEdit={systemToEdit}
      // UI State
      isEditMode={isEditMode}
      // Loading States
      isLoadingSystems={isLoadingSystems}
      // Modal States
      isCreateSystemModalOpen={isCreateSystemModalOpen}
      isEditSystemModalOpen={isEditSystemModalOpen}
      isDeleteSystemModalOpen={isDeleteSystemModalOpen}
      // System Handlers
      onCreateSystem={handleCreateSystem}
      onUpdateSystem={handleUpdateSystem}
      onEditSystemClick={handleEditSystemClick}
      onDeleteSystem={handleDeleteSystem}
      // Modal Handlers
      onOpenCreateSystemModal={() => setIsCreateSystemModalOpen(true)}
      onCloseCreateSystemModal={() => setIsCreateSystemModalOpen(false)}
      onCloseEditSystemModal={() => {
        setIsEditSystemModalOpen(false);
        setSystemToEdit(null);
      }}
      onOpenDeleteSystemModal={() => setIsDeleteSystemModalOpen(true)}
      onCloseDeleteSystemModal={() => setIsDeleteSystemModalOpen(false)}
    />
  );
}
