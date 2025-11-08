import { Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

import { CreateSystemModal } from "./components/create-system-modal";
import { DeleteSystemModal } from "./components/delete-system-modal";
import { EditSystemModal } from "./components/edit-system-modal";
import { SystemListView } from "./components/system-list-view";

import type { IPowerSystem } from "./types/power-system-types";

interface PowerSystemViewProps {
  // Data
  systems: IPowerSystem[];
  systemToEdit: IPowerSystem | null;

  // UI State
  isEditMode: boolean;

  // Loading States
  isLoadingSystems: boolean;

  // Modal States
  isCreateSystemModalOpen: boolean;
  isEditSystemModalOpen: boolean;
  isDeleteSystemModalOpen: boolean;

  // System Handlers
  onCreateSystem: (name: string, iconImage?: string) => void;
  onUpdateSystem: (systemId: string, name: string, iconImage?: string) => void;
  onEditSystemClick: (system: IPowerSystem) => void;
  onDeleteSystem: (systemId: string) => void;

  // Modal Handlers
  onOpenCreateSystemModal: () => void;
  onCloseCreateSystemModal: () => void;
  onCloseEditSystemModal: () => void;
  onOpenDeleteSystemModal: () => void;
  onCloseDeleteSystemModal: () => void;
}

export function PowerSystemView({
  // Data
  systems,
  systemToEdit,

  // UI State
  isEditMode,

  // Loading States
  isLoadingSystems,

  // Modal States
  isCreateSystemModalOpen,
  isEditSystemModalOpen,
  isDeleteSystemModalOpen,

  // System Handlers
  onCreateSystem,
  onUpdateSystem,
  onEditSystemClick,
  onDeleteSystem,

  // Modal Handlers
  onOpenCreateSystemModal,
  onCloseCreateSystemModal,
  onCloseEditSystemModal,
  onOpenDeleteSystemModal,
  onCloseDeleteSystemModal,
}: PowerSystemViewProps) {
  const { t } = useTranslation("power-system");

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (isLoadingSystems) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            {t("loading.systems")}
          </p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // EMPTY STATE - NO SYSTEMS
  // ============================================================================

  if (systems.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col space-y-6 px-6 py-6">
        {/* Header with Create System button */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t("page.title")}</h2>
            <p className="text-muted-foreground">{t("page.description")}</p>
          </div>
          <Button
            variant="magical"
            size="lg"
            className="animate-glow"
            onClick={onOpenCreateSystemModal}
          >
            <Zap className="w-5 h-5 mr-2" />
            {t("empty_state.action")}
          </Button>
        </div>

        {/* Empty State */}
        <EmptyState
          icon={Zap}
          title={t("empty_state.title")}
          description={t("empty_state.description")}
        />

        {/* Modals */}
        <CreateSystemModal
          isOpen={isCreateSystemModalOpen}
          onClose={onCloseCreateSystemModal}
          onSubmit={onCreateSystem}
          existingSystems={systems}
        />
        <EditSystemModal
          isOpen={isEditSystemModalOpen}
          system={systemToEdit}
          onClose={onCloseEditSystemModal}
          onSubmit={onUpdateSystem}
        />
      </div>
    );
  }

  // ============================================================================
  // SYSTEM LIST VIEW
  // ============================================================================

  return (
    <div className="flex flex-col h-full">
      <SystemListView
        systems={systems}
        isEditMode={isEditMode}
        onEditSystem={onEditSystemClick}
        onCreateSystem={onOpenCreateSystemModal}
      />

      {/* Modals */}
      <CreateSystemModal
        isOpen={isCreateSystemModalOpen}
        onClose={onCloseCreateSystemModal}
        onSubmit={onCreateSystem}
        existingSystems={systems}
      />
      <EditSystemModal
        isOpen={isEditSystemModalOpen}
        system={systemToEdit}
        onClose={onCloseEditSystemModal}
        onSubmit={onUpdateSystem}
      />
      <DeleteSystemModal
        isOpen={isDeleteSystemModalOpen}
        onClose={onCloseDeleteSystemModal}
        onConfirm={() => {
          if (systemToEdit) {
            onDeleteSystem(systemToEdit.id);
          }
        }}
        systemName={systemToEdit?.name}
      />
    </div>
  );
}
