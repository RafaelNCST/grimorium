import React from "react";

import {
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Book as BookType } from "@/stores/book-store";

import { Header } from "./components/header";
import { TabsBar } from "./components/tabs-bar";
import { TopBar } from "./components/top-bar";
import { CharactersTab } from "./tabs/characters";
import { FactionsTab } from "./tabs/factions";
import { ItemsTab } from "./tabs/items";
import { OverviewTab } from "./tabs/overview";
import { PlotTab } from "./tabs/plot";
import { PowerSystemTab } from "./tabs/power-system";
import { SpeciesTab } from "./tabs/races";
import { WorldTab } from "./tabs/world";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  isDefault?: boolean;
}

interface PlotArc {
  id: string;
  name: string;
  size: "pequeno" | "médio" | "grande";
  focus: string;
  description: string;
  events: unknown[];
  progress: number;
  isCurrentArc: boolean;
}

interface PropsDashboardView {
  book: BookType;
  draftBook: BookType | null;
  bookId: string;
  activeTab: string;
  isEditingHeader: boolean;
  isHeaderHidden: boolean;
  isCustomizing: boolean;
  tabs: TabConfig[];
  visibleTabs: TabConfig[];
  currentArc?: PlotArc;
  sensors: SensorDescriptor<SensorOptions>[];
  showDeleteDialog: boolean;
  deleteInput: string;
  previewTabs?: TabConfig[];
  draggedTabId?: string | null;
  onBack: () => void;
  onActiveTabChange: (tab: string) => void;
  onEditingHeaderChange: (editing: boolean) => void;
  onHeaderHiddenChange: (hidden: boolean) => void;
  onCustomizingChange: (customizing: boolean) => void;
  onCustomizingToggle: () => void;
  onTabsUpdate: (tabs: TabConfig[]) => void;
  onToggleTabVisibility: (tabId: string) => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragMove: (event: DragMoveEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onToggleVisibility: (tabId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onDeleteBook: () => void;
  onNavigateToChapters: () => void;
  onNavigateToNotes: () => void;
  onShowDeleteDialog: (show: boolean) => void;
  onDeleteInputChange: (value: string) => void;
  onDraftBookChange: (updates: Partial<BookType>) => void;
}

// Componentes memoizados para evitar re-renders desnecessários
const MemoizedOverviewTab = React.memo(OverviewTab);
const MemoizedCharactersTab = React.memo(CharactersTab);
const MemoizedWorldTab = React.memo(WorldTab);
const MemoizedFactionsTab = React.memo(FactionsTab);
const MemoizedPlotTab = React.memo(PlotTab);
const MemoizedPowerSystemTab = React.memo(PowerSystemTab);
const MemoizedSpeciesTab = React.memo(SpeciesTab);
const MemoizedItemsTab = React.memo(ItemsTab);

export function DashboardView({
  book,
  draftBook,
  bookId,
  activeTab,
  isEditingHeader,
  isHeaderHidden,
  isCustomizing,
  tabs,
  visibleTabs,
  sensors,
  showDeleteDialog,
  deleteInput,
  previewTabs,
  draggedTabId,
  onBack,
  onActiveTabChange,
  onEditingHeaderChange,
  onHeaderHiddenChange,
  onCustomizingToggle,
  onDragStart,
  onDragMove,
  onDragEnd,
  onToggleVisibility,
  onSave,
  onCancel,
  onDelete,
  onNavigateToChapters,
  onNavigateToNotes,
  onShowDeleteDialog,
  onDeleteInputChange,
  onDraftBookChange,
}: PropsDashboardView) {
  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-background overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={onActiveTabChange}
          className="h-full flex flex-col overflow-hidden"
        >
          {/* Seção fixa do topo - Header + TabBar */}
          <div className="flex-shrink-0 bg-card border-b border-border">
            <div className="px-6 py-4">
              <TopBar
                isCustomizing={isCustomizing}
                isHeaderHidden={isHeaderHidden}
                onBack={onBack}
                onShowDeleteDialog={onShowDeleteDialog}
                onNavigateToChapters={onNavigateToChapters}
                onNavigateToNotes={onNavigateToNotes}
                onCustomizingToggle={onCustomizingToggle}
                onHeaderHiddenChange={onHeaderHiddenChange}
              />

              {!isHeaderHidden && (
                <Header
                  book={book}
                  draftBook={draftBook}
                  isEditingHeader={isEditingHeader}
                  onEditingHeaderChange={onEditingHeaderChange}
                  onDraftBookChange={onDraftBookChange}
                  onSave={onSave}
                  onCancel={onCancel}
                />
              )}
            </div>

            <TabsBar
              isCustomizing={isCustomizing}
              isHeaderHidden={isHeaderHidden}
              tabs={tabs}
              visibleTabs={visibleTabs}
              sensors={sensors}
              activeTab={activeTab}
              previewTabs={previewTabs}
              draggedTabId={draggedTabId}
              onDragStart={onDragStart}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
              onToggleVisibility={onToggleVisibility}
              onActiveTabChange={onActiveTabChange}
            />
          </div>

          {/* Container com altura fixa para as tabs - cada tab tem seu próprio scroll */}
          <div className="flex-1 relative overflow-hidden">
            {/* Todas as tabs são mantidas no DOM com scroll individual */}
            <div
              className="absolute inset-0 overflow-y-auto px-6 py-6"
              style={{ display: activeTab === "overview" ? "block" : "none" }}
            >
              <MemoizedOverviewTab
                book={book}
                bookId={bookId}
                isCustomizing={isCustomizing}
              />
            </div>
            <div
              className="absolute inset-0 overflow-y-auto px-6 py-6"
              style={{
                display: activeTab === "characters" ? "block" : "none",
              }}
            >
              <MemoizedCharactersTab bookId={bookId} />
            </div>
            <div
              className="absolute inset-0 overflow-y-auto px-6 py-6"
              style={{ display: activeTab === "world" ? "block" : "none" }}
            >
              <MemoizedWorldTab bookId={bookId} />
            </div>
            <div
              className="absolute inset-0 overflow-y-auto px-6 py-6"
              style={{
                display: activeTab === "factions" ? "block" : "none",
              }}
            >
              <MemoizedFactionsTab bookId={bookId} />
            </div>
            <div
              className="absolute inset-0 overflow-y-auto px-6 py-6"
              style={{ display: activeTab === "plot" ? "block" : "none" }}
            >
              <MemoizedPlotTab bookId={bookId} />
            </div>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ display: activeTab === "magic" ? "block" : "none" }}
            >
              <MemoizedPowerSystemTab isHeaderHidden={isHeaderHidden} />
            </div>
            <div
              className="absolute inset-0 overflow-y-auto px-6 py-6"
              style={{ display: activeTab === "species" ? "block" : "none" }}
            >
              <MemoizedSpeciesTab bookId={bookId} />
            </div>
            <div
              className="absolute inset-0 overflow-y-auto px-6 py-6"
              style={{ display: activeTab === "items" ? "block" : "none" }}
            >
              <MemoizedItemsTab bookId={bookId} />
            </div>
          </div>
        </Tabs>

        <AlertDialog open={showDeleteDialog} onOpenChange={onShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Para confirmar a exclusão,
                digite o nome do livro: <strong>{book.title}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4">
              <Input
                value={deleteInput}
                onChange={(e) => onDeleteInputChange(e.target.value)}
                placeholder={`Digite "${book.title}" para confirmar`}
                className="font-mono"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  onDeleteInputChange("");
                  onShowDeleteDialog(false);
                }}
              >
                Cancelar
              </AlertDialogCancel>
              <Button
                variant="destructive"
                size="lg"
                className="animate-glow-red"
                onClick={onDelete}
                disabled={deleteInput !== book.title}
              >
                Excluir Livro
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
