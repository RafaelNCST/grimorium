import { MapPin } from "lucide-react";

import { LinkedNotesModal } from "@/components/annotations/linked-notes-modal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorldTimeline } from "@/components/world-timeline";

import { BasicInfoCard } from "./components/basic-info-card";
import { EntityHeader } from "./components/entity-header";
import { LocationDetails } from "./components/location-details";
import { SidebarSection } from "./components/sidebar-section";
import {
  IWorldDetailEntity,
  IStickyNote,
  IOrganization,
  IWorld,
  IContinent,
  ILinkedNote,
} from "./types/world-detail-types";

interface PropsWorldDetailView {
  entity: IWorldDetailEntity;
  isEditing: boolean;
  isDeleteModalOpen: boolean;
  editData: IWorldDetailEntity;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  stickyNotes: IStickyNote[];
  isLinkedNotesModalOpen: boolean;
  linkedNotes: ILinkedNote[];
  mockOrganizations: IOrganization[];
  mockWorlds: IWorld[];
  mockContinents: IContinent[];
  dashboardId: string;
  worldId: string;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onDeleteModalClose: () => void;
  onDelete: () => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditDataChange: (field: string, value: any) => void;
  onAddStickyNote: () => void;
  onLinkedNotesModalOpen: () => void;
  onLinkedNotesModalClose: () => void;
  getEntityIcon: () => React.ReactNode;
  getWorldName: (worldId?: string) => string | null;
  getContinentName: (continentId?: string) => string | null;
  getEntityTypeForModal: () => string;
}

const getEntityTypeLabel = (type: string): string => {
  if (type === "World") return "Mundo";
  if (type === "Continent") return "Continente";
  return "Local";
};

export function WorldDetailView({
  entity,
  isEditing,
  isDeleteModalOpen,
  editData,
  imagePreview,
  fileInputRef,
  stickyNotes,
  isLinkedNotesModalOpen,
  linkedNotes,
  mockOrganizations,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onDeleteModalClose,
  onDelete,
  onImageChange,
  onEditDataChange,
  onAddStickyNote,
  onLinkedNotesModalOpen,
  onLinkedNotesModalClose,
  getEntityIcon,
  getWorldName,
  getContinentName,
  getEntityTypeForModal,
}: PropsWorldDetailView) {
  return (
    <div className="min-h-screen bg-background">
      <EntityHeader
        entityName={entity.name}
        entityType={getEntityTypeLabel(entity.type)}
        isEditing={isEditing}
        linkedNotesCount={linkedNotes.length}
        entityIcon={getEntityIcon()}
        onBack={onBack}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        onDeleteModalOpen={onDeleteModalOpen}
        onLinkedNotesModalOpen={onLinkedNotesModalOpen}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BasicInfoCard
              entity={entity}
              isEditing={isEditing}
              editData={editData}
              imagePreview={imagePreview}
              fileInputRef={fileInputRef}
              mockOrganizations={mockOrganizations}
              onImageChange={onImageChange}
              onEditDataChange={onEditDataChange}
            />

            <LocationDetails entity={entity} />

            {entity.dominantOrganization && (
              <Card>
                <CardHeader>
                  <CardTitle>Organização Dominante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{entity.dominantOrganization}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <SidebarSection
            entity={entity}
            stickyNotes={stickyNotes}
            onAddStickyNote={onAddStickyNote}
            getWorldName={getWorldName}
            getContinentName={getContinentName}
          />
        </div>

        {(entity.type === "World" || entity.type === "Continent") && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Espécies e Raças</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Timeline de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <WorldTimeline
                worldId={entity.id}
                worldType={entity.type as "World" | "Continent"}
                isEditing={isEditing}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        title={`Excluir ${getEntityTypeLabel(entity.type)}`}
        description={`Tem certeza que deseja excluir "${entity.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={onDelete}
      />

      <LinkedNotesModal
        isOpen={isLinkedNotesModalOpen}
        onClose={onLinkedNotesModalClose}
        entityId={entity.id}
        entityName={entity.name}
        entityType={getEntityTypeForModal()}
        linkedNotes={linkedNotes}
      />
    </div>
  );
}
