import { memo } from "react";

import {
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  Search,
  X,
  SortAsc,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  EntityType,
  INote,
  INoteFormData,
  NoteSortOrder,
} from "@/types/note-types";

import { CreateNoteModal } from "./components/create-note-modal";
import { NoteListItem } from "./components/note-list-item";
import { NotesEmptyState } from "./components/notes-empty-state";

interface NotesViewProps {
  notes: INote[];
  filteredNotes: INote[];
  isLoading: boolean;
  searchTerm: string;
  sortOrder: NoteSortOrder;
  entityTypeFilters: EntityType[];
  showCreateModal: boolean;
  isDeletionMode: boolean;
  selectedNoteIds: string[];
  showDeleteConfirmModal: boolean;
  onBackToDashboard: () => void;
  onSearchTermChange: (term: string) => void;
  onSortOrderChange: (order: NoteSortOrder) => void;
  onEntityTypeFilterToggle: (entityType: EntityType) => void;
  onClearFilters: () => void;
  onNoteClick: (noteId: string) => void;
  onShowCreateModalChange: (show: boolean) => void;
  onCreateNote: (formData: INoteFormData) => void;
  onToggleDeletionMode: () => void;
  onCancelDeletionMode: () => void;
  onDeleteSelectedNotes: () => void;
  onConfirmDelete: () => void;
  onShowDeleteConfirmModalChange: (show: boolean) => void;
}

const ENTITY_TYPE_FILTERS: EntityType[] = [
  "character",
  "region",
  "faction",
  "race",
  "item",
];

function NotesViewComponent({
  notes,
  filteredNotes,
  isLoading,
  searchTerm,
  sortOrder,
  entityTypeFilters,
  showCreateModal,
  isDeletionMode,
  selectedNoteIds,
  showDeleteConfirmModal,
  onBackToDashboard,
  onSearchTermChange,
  onSortOrderChange,
  onEntityTypeFilterToggle,
  onClearFilters,
  onNoteClick,
  onShowCreateModalChange,
  onCreateNote,
  onToggleDeletionMode,
  onCancelDeletionMode,
  onDeleteSelectedNotes,
  onConfirmDelete,
  onShowDeleteConfirmModalChange,
}: NotesViewProps) {
  const { t } = useTranslation("notes");

  const hasActiveFilters =
    searchTerm.trim() !== "" || entityTypeFilters.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackToDashboard}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{t("page.title")}</h1>
      </div>

      {/* Sub-header */}
      <div className="px-6 py-4 border-b space-y-4">
        {/* First row: Search on left, Sort and Actions on right */}
        <div className="flex items-center gap-4">
          {/* Search - starts from left, takes half width */}
          <div className="relative w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("page.search_placeholder")}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchTermChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Spacer to push actions to right */}
          <div className="flex-1" />

          {/* Sort Toggle Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2"
                onClick={() =>
                  onSortOrderChange(
                    sortOrder === "alphabetical" ? "recent" : "alphabetical"
                  )
                }
              >
                <SortAsc className="h-4 w-4" />
                {sortOrder === "alphabetical"
                  ? t("sort.alphabetical")
                  : t("sort.recent")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t("sort.toggle_to", {
                order:
                  sortOrder === "alphabetical"
                    ? t("sort.recent")
                    : t("sort.alphabetical"),
              })}
            </TooltipContent>
          </Tooltip>

          {/* Action Buttons */}
          {isDeletionMode ? (
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={onCancelDeletionMode}>
                {t("page.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={onDeleteSelectedNotes}
                disabled={selectedNoteIds.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t("page.delete")} ({selectedNoteIds.length})
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="magical"
                onClick={() => onShowCreateModalChange(true)}
                className="animate-glow"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("page.new_note")}
              </Button>
              <Button
                variant="destructive"
                onClick={onToggleDeletionMode}
                disabled={notes.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t("page.delete_mode")}
              </Button>
            </div>
          )}
        </div>

        {/* Second row: Entity type filter badges - aligned with search */}
        <div className="flex items-center gap-2 h-8">
          {ENTITY_TYPE_FILTERS.map((entityType) => {
            const isActive = entityTypeFilters.includes(entityType);
            const filterKey =
              `filters.${entityType === "region" ? "regions" : `${entityType}s`}` as const;

            return (
              <Badge
                key={entityType}
                variant={isActive ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => onEntityTypeFilterToggle(entityType)}
              >
                {t(filterKey)}
              </Badge>
            );
          })}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className={`ml-2 text-muted-foreground transition-opacity ${
              hasActiveFilters ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <X className="h-3 w-3 mr-1" />
            {t("page.clear_filters")}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {notes.length === 0 ? (
          <NotesEmptyState />
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">
              {t("empty_state.no_results")}
            </h3>
            <p className="text-muted-foreground mt-1">
              {t("empty_state.no_results_description")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                isDeletionMode={isDeletionMode}
                isSelected={selectedNoteIds.includes(note.id)}
                showLinkedEntities={entityTypeFilters.length > 0}
                onClick={() => onNoteClick(note.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal
        open={showCreateModal}
        onOpenChange={onShowCreateModalChange}
        onCreateNote={onCreateNote}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={showDeleteConfirmModal}
        onOpenChange={onShowDeleteConfirmModalChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete_modal.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete_modal.message", { count: selectedNoteIds.length })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("delete_modal.cancel")}</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
            >
              {t("delete_modal.confirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const NotesView = memo(NotesViewComponent);
