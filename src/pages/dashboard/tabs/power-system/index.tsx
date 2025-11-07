import { useEffect, useState } from "react";

import { usePowerSystemStore } from "@/stores/power-system-store";

import type { IPowerSystem } from "./types/power-system-types";
import { PowerSystemView } from "./view";

interface PowerSystemTabProps {
  bookId: string;
}

export function PowerSystemTab({ bookId }: PowerSystemTabProps) {
  // Store
  const { fetchSystems, getSystems, isLoading: isStoreLoading } = usePowerSystemStore();
  const systems = getSystems(bookId);
  const isLoadingSystems = isStoreLoading(bookId);

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

  const handleCreateSystem = async (name: string, iconImage?: string) => {
    try {
      await usePowerSystemStore.getState().addSystem(bookId, name, iconImage);

      setIsEditMode(true); // Enable edit mode when creating a new system
      setIsCreateSystemModalOpen(false);
    } catch (error) {
      console.error("Error creating system:", error);
    }
  };

  const handleUpdateSystem = async (systemId: string, name: string, iconImage?: string) => {
    try {
      await usePowerSystemStore.getState().updateSystemInCache(systemId, name, iconImage);

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
      await usePowerSystemStore.getState().deleteSystemFromCache(bookId, systemId);
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
