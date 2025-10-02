import { useState, useCallback, useMemo } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { ItemDetailView } from "./view";

import { useToast } from "@/hooks/use-toast";
import {
  Item,
  mockItems,
  mockLinkedNotes,
} from "@/mocks/local/item-data";

interface MythologyEntry {
  id: string;
  people: string;
  version: string;
}

export default function ItemDetail() {
  const { itemId, dashboardId } = useParams({ from: "/dashboard/$dashboardId/tabs/item/$itemId" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const [item, setItem] = useState<Item | null>(
    itemId ? mockItems[itemId] || null : null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newMythologyPeople, setNewMythologyPeople] = useState("");
  const [newMythologyVersion, setNewMythologyVersion] = useState("");
  const [isLinkedNotesModalOpen, setIsLinkedNotesModalOpen] = useState(false);

  // Mock linked notes - in real app would come from API/state
  const linkedNotes = useMemo(() => mockLinkedNotes, []);

  // Navigation handlers with useCallback
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleLinkedNotesModalOpen = useCallback(() => {
    setIsLinkedNotesModalOpen(true);
  }, []);

  const handleLinkedNotesModalClose = useCallback(() => {
    setIsLinkedNotesModalOpen(false);
  }, []);

  const handleOpenTimeline = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/item/$itemId/timeline",
      params: { dashboardId: dashboardId!, itemId: itemId! },
    });
  }, [navigate, dashboardId, itemId]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    setIsEditing(false);
    toast({
      title: "Item salvo",
      description: "As alterações foram salvas com sucesso.",
    });
  }, [toast]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleDeleteModalOpen = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleDelete = useCallback(
    (itemName: string) => {
      if (item && itemName === item.name) {
        toast({
          title: "Item excluído",
          description: "O item foi excluído permanentemente.",
        });
        window.history.back();
      }
    },
    [item, toast]
  );

  const handleItemChange = useCallback(
    (field: string, value: any) => {
      if (!item) return;
      setItem({ ...item, [field]: value });
    },
    [item]
  );

  const handleAddMythology = useCallback(() => {
    if (item && newMythologyPeople && newMythologyVersion) {
      const newEntry: MythologyEntry = {
        id: Date.now().toString(),
        people: newMythologyPeople,
        version: newMythologyVersion,
      };
      setItem({
        ...item,
        mythology: [...item.mythology, newEntry],
      });
      setNewMythologyPeople("");
      setNewMythologyVersion("");
    }
  }, [item, newMythologyPeople, newMythologyVersion]);

  const handleRemoveMythology = useCallback(
    (mythologyId: string) => {
      if (!item) return;
      setItem({
        ...item,
        mythology: item.mythology.filter((m) => m.id !== mythologyId),
      });
    },
    [item]
  );

  const handleNewMythologyPeopleChange = useCallback((value: string) => {
    setNewMythologyPeople(value);
  }, []);

  const handleNewMythologyVersionChange = useCallback((value: string) => {
    setNewMythologyVersion(value);
  }, []);

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item não encontrado</h1>
          <button onClick={handleBack} className="btn btn-primary">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <ItemDetailView
      item={item}
      isEditing={isEditing}
      showDeleteModal={showDeleteModal}
      newMythologyPeople={newMythologyPeople}
      newMythologyVersion={newMythologyVersion}
      isLinkedNotesModalOpen={isLinkedNotesModalOpen}
      linkedNotes={linkedNotes}
      onBack={handleBack}
      onLinkedNotesModalOpen={handleLinkedNotesModalOpen}
      onLinkedNotesModalClose={handleLinkedNotesModalClose}
      onOpenTimeline={handleOpenTimeline}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDeleteModalOpen={handleDeleteModalOpen}
      onDeleteModalClose={handleDeleteModalClose}
      onDelete={handleDelete}
      onItemChange={handleItemChange}
      onAddMythology={handleAddMythology}
      onRemoveMythology={handleRemoveMythology}
      onNewMythologyPeopleChange={handleNewMythologyPeopleChange}
      onNewMythologyVersionChange={handleNewMythologyVersionChange}
    />
  );
}
