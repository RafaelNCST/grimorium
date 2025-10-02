import { ArrowLeft } from "lucide-react";

import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { RaceHeader } from "./components/race-header";
import { RaceSection } from "./components/race-section";
import { IRaceWithSpeciesName, RaceType } from "../types/species-types";

interface IEditForm {
  name: string;
  description: string;
  history: string;
  type: RaceType;
  physicalCharacteristics: string;
  culture: string;
}

interface PropsRaceDetailView {
  race: IRaceWithSpeciesName;
  editForm: IEditForm;
  isEditing: boolean;
  isDeleteModalOpen: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onDeleteModalClose: () => void;
  onDelete: () => void;
  onEditFormChange: (field: string, value: string) => void;
}

export function RaceDetailView({
  race,
  editForm,
  isEditing,
  isDeleteModalOpen,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onDeleteModalClose,
  onDelete,
  onEditFormChange,
}: PropsRaceDetailView) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Espécies
          </Button>
        </div>

        <Card>
          <CardHeader>
            <RaceHeader
              race={race}
              isEditing={isEditing}
              editFormName={editForm.name}
              editFormType={editForm.type}
              onEdit={onEdit}
              onSave={onSave}
              onCancel={onCancel}
              onDeleteModalOpen={onDeleteModalOpen}
              onEditFormChange={onEditFormChange}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <RaceSection
                title="Descrição"
                content={race.description}
                isEditing={isEditing}
                editValue={editForm.description}
                fieldName="description"
                placeholder="Descrição da raça"
                onEditFormChange={onEditFormChange}
              />

              <RaceSection
                title="História"
                content={race.history}
                isEditing={isEditing}
                editValue={editForm.history}
                fieldName="history"
                placeholder="História da raça"
                minHeight="min-h-[120px]"
                onEditFormChange={onEditFormChange}
              />

              <RaceSection
                title="Características Físicas"
                content={race.physicalCharacteristics}
                isEditing={isEditing}
                editValue={editForm.physicalCharacteristics}
                fieldName="physicalCharacteristics"
                placeholder="Características físicas da raça (opcional)"
                minHeight="min-h-[100px]"
                onEditFormChange={onEditFormChange}
              />

              <RaceSection
                title="Cultura"
                content={race.culture}
                isEditing={isEditing}
                editValue={editForm.culture}
                fieldName="culture"
                placeholder="Cultura da raça (opcional)"
                minHeight="min-h-[100px]"
                onEditFormChange={onEditFormChange}
              />
            </div>
          </CardContent>
        </Card>

        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          onClose={onDeleteModalClose}
          onConfirm={onDelete}
          title="Excluir Raça"
          description={`Tem certeza que deseja excluir "${race.name}"? Esta ação não pode ser desfeita.`}
        />
      </div>
    </div>
  );
}
