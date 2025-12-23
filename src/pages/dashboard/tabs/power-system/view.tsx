import { useTranslation } from "react-i18next";

import { CreateSystemModal } from "./components/create-system-modal";
import { DeleteSystemModal } from "./components/delete-system-modal";
import { EditSystemModal } from "./components/edit-system-modal";
import { SystemListView } from "./components/system-list-view";

import type { IPowerSystem } from "./types/power-system-types";

interface PowerSystemViewProps {
  // Data
  systems: IPowerSystem[];
  systemToEdit: IPowerSystem | null;
  bookId: string;

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
  bookId,

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
  onOpenDeleteSystemModal: _onOpenDeleteSystemModal,
  onCloseDeleteSystemModal,
}: PowerSystemViewProps) {
  const _t = useTranslation("power-system").t;

  return (
    <>
      <SystemListView
        systems={systems}
        isEditMode={isEditMode}
        isLoading={isLoadingSystems}
        onEditSystem={onEditSystemClick}
        onCreateSystem={onOpenCreateSystemModal}
      />

      {/* Modals */}
      <CreateSystemModal
        isOpen={isCreateSystemModalOpen}
        onClose={onCloseCreateSystemModal}
        onSubmit={onCreateSystem}
        existingSystems={systems}
        bookId={bookId}
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
    </>
  );
}
