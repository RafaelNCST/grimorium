import { DragEndEvent, SensorDescriptor, SensorOptions } from "@dnd-kit/core";

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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Book as BookType } from "@/stores/book-store";

import { Header } from "./components/header";
import { TabsBar } from "./components/tabs-bar";
import { TopBar } from "./components/top-bar";
import { BestiaryTab } from "./tabs/bestiary";
import { CharactersTab } from "./tabs/characters";
import { EncyclopediaTab } from "./tabs/encyclopedia";
import { ItemsTab } from "./tabs/items";
import { OrganizationsTab } from "./tabs/organizations";
import { OverviewTab } from "./tabs/overview";
import { PlotTab } from "./tabs/plot";
import { PowerSystemTab } from "./tabs/power-system";
import { SpeciesTab } from "./tabs/species";
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
  onBack: () => void;
  onActiveTabChange: (tab: string) => void;
  onEditingHeaderChange: (editing: boolean) => void;
  onHeaderHiddenChange: (hidden: boolean) => void;
  onCustomizingChange: (customizing: boolean) => void;
  onCustomizingToggle: () => void;
  onTabsUpdate: (tabs: TabConfig[]) => void;
  onToggleTabVisibility: (tabId: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onToggleVisibility: (tabId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onUpdateBook: (updates: Partial<BookType>) => void;
  onDeleteBook: () => void;
  onNavigateToChapters: () => void;
  onNavigateToNotes: () => void;
  onShowDeleteDialog: (show: boolean) => void;
  onDeleteInputChange: (value: string) => void;
  onDraftBookChange: (updates: Partial<BookType>) => void;
}

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
  currentArc,
  sensors,
  showDeleteDialog,
  deleteInput,
  onBack,
  onActiveTabChange,
  onEditingHeaderChange,
  onHeaderHiddenChange,
  onCustomizingToggle,
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
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
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
                currentArc={currentArc}
                onEditingHeaderChange={onEditingHeaderChange}
                onDraftBookChange={onDraftBookChange}
                onSave={onSave}
                onCancel={onCancel}
              />
            )}
          </div>
        </div>

        <div className="w-full">
          <Tabs
            value={activeTab}
            onValueChange={onActiveTabChange}
            className="w-full"
          >
            <TabsBar
              isCustomizing={isCustomizing}
              isHeaderHidden={isHeaderHidden}
              tabs={tabs}
              visibleTabs={visibleTabs}
              sensors={sensors}
              activeTab={activeTab}
              onDragEnd={onDragEnd}
              onToggleVisibility={onToggleVisibility}
              onActiveTabChange={onActiveTabChange}
            />

            <div className="px-6 mt-6 pb-6">
              <TabsContent value="overview" className="mt-0">
                <OverviewTab
                  book={book}
                  bookId={bookId}
                  isCustomizing={isCustomizing}
                />
              </TabsContent>
              <TabsContent value="characters" className="mt-0">
                <CharactersTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="world" className="mt-0">
                <WorldTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="organizations" className="mt-0">
                <OrganizationsTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="plot" className="mt-0">
                <PlotTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="magic" className="mt-0">
                <PowerSystemTab />
              </TabsContent>
              <TabsContent value="encyclopedia" className="mt-0">
                <EncyclopediaTab />
              </TabsContent>
              <TabsContent value="species" className="mt-0">
                <SpeciesTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="bestiary" className="mt-0">
                <BestiaryTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="items" className="mt-0">
                <ItemsTab bookId={bookId} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

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
              <AlertDialogAction
                onClick={onDelete}
                disabled={deleteInput !== book.title}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir Livro
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
