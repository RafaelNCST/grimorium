import {
  ArrowLeft,
  Pencil,
  PanelLeft,
  Trash2,
  Zap,
  Undo2,
  Redo2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { CreateGroupModal } from "../components/create-group-modal";
import { CreatePageModal } from "../components/create-page-modal";
import { CreateSectionModal } from "../components/create-section-modal";
import { DeleteSystemModal } from "../components/delete-system-modal";
import { EditSystemModal } from "../components/edit-system-modal";
import { NavigationSidebar } from "../components/navigation-sidebar";
import { PageContent } from "../components/page-content";
import { SelectBlockModal } from "../components/select-block-modal";

import type {
  IPowerSystem,
  IPowerGroup,
  IPowerPage,
  IPowerSection,
  IPowerBlock,
  BlockType,
  BlockContent,
} from "../types/power-system-types";

interface PowerSystemDetailViewProps {
  // Data
  system: IPowerSystem;
  currentPage: IPowerPage | null;
  groups: IPowerGroup[];
  pages: IPowerPage[];
  sections: IPowerSection[];
  blocks: IPowerBlock[];
  bookId: string; // For entity data loading

  // UI State
  isEditMode: boolean;
  isLeftSidebarOpen: boolean;

  // Undo/Redo State
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;

  // Loading States
  isLoadingGroups: boolean;
  isLoadingPages: boolean;
  isLoadingSections: boolean;
  isLoadingBlocks: boolean;

  // Modal States
  isEditSystemModalOpen: boolean;
  isCreateGroupModalOpen: boolean;
  isCreatePageModalOpen: boolean;
  isCreateSectionModalOpen: boolean;
  isSelectBlockModalOpen: boolean;
  isDeleteSystemModalOpen: boolean;

  // Modal Context
  selectedGroupForPage?: string;
  selectedSectionForBlock?: string;

  // System Handlers
  onBackToList: () => void;
  onUpdateSystem: (systemId: string, name: string, iconImage?: string) => void;
  onDeleteSystem: () => void;

  // Group Handlers
  onCreateGroup: (name: string) => void;
  onUpdateGroup: (groupId: string, name: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onReorderGroups: (groups: IPowerGroup[]) => void;

  // Page Handlers
  onPageSelect: (pageId: string) => void;
  onCreatePage: (name: string, groupId?: string) => void;
  onUpdatePage: (pageId: string, name: string) => void;
  onMovePage: (pageId: string, newGroupId?: string) => void;
  onDeletePage: (pageId: string) => void;
  onReorderPages: (pages: IPowerPage[]) => void;
  onDuplicatePage: (pageId: string) => void;

  // Section Handlers
  onCreateSection: (title: string) => void;
  onUpdateSection: (sectionId: string, title: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onReorderSections: (sections: IPowerSection[]) => void;

  // Block Handlers
  onCreateBlock: (
    sectionId: string,
    type: BlockType,
    content: BlockContent
  ) => void;
  onUpdateBlock: (blockId: string, content: BlockContent) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (sectionId: string, blocks: IPowerBlock[]) => void;

  // UI Handlers
  onToggleEditMode: () => void;
  onToggleLeftSidebar: () => void;

  // Modal Handlers
  onOpenEditSystemModal: () => void;
  onCloseEditSystemModal: () => void;
  onOpenCreateGroupModal: () => void;
  onCloseCreateGroupModal: () => void;
  onOpenCreatePageModal: (groupId?: string) => void;
  onCloseCreatePageModal: () => void;
  onOpenCreateSectionModal: () => void;
  onCloseCreateSectionModal: () => void;
  onOpenSelectBlockModal: (sectionId: string) => void;
  onCloseSelectBlockModal: () => void;
  onOpenDeleteSystemModal: () => void;
  onCloseDeleteSystemModal: () => void;

  // Link Handlers
  onManagePageLinks?: (pageId: string) => void;
  onManageSectionLinks?: (sectionId: string) => void;

  // Selection tracking for keyboard shortcuts
  onItemSelect?: (itemId: string, itemType: "page" | "group") => void;

  // Children (for modals)
  children?: React.ReactNode;
}

export function PowerSystemDetailView({
  // Data
  system,
  currentPage,
  groups,
  pages,
  sections,
  blocks,
  bookId,

  // UI State
  isEditMode,
  isLeftSidebarOpen,

  // Undo/Redo State
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,

  // Loading States
  isLoadingPages,

  // Modal States
  isEditSystemModalOpen,
  isCreateGroupModalOpen,
  isCreatePageModalOpen,
  isCreateSectionModalOpen,
  isSelectBlockModalOpen,
  isDeleteSystemModalOpen,

  // Modal Context
  selectedGroupForPage,
  selectedSectionForBlock,

  // System Handlers
  onBackToList,
  onUpdateSystem,
  onDeleteSystem,

  // Group Handlers
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  onReorderGroups,

  // Page Handlers
  onPageSelect,
  onCreatePage,
  onUpdatePage,
  onMovePage,
  onDeletePage,
  onReorderPages,
  onDuplicatePage,

  // Section Handlers
  onCreateSection,
  onUpdateSection,
  onDeleteSection,
  onReorderSections,

  // Block Handlers
  onCreateBlock,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,

  // UI Handlers
  onToggleEditMode,
  onToggleLeftSidebar,

  // Modal Handlers
  onOpenEditSystemModal,
  onCloseEditSystemModal,
  onOpenCreateGroupModal,
  onCloseCreateGroupModal,
  onOpenCreatePageModal,
  onCloseCreatePageModal,
  onOpenCreateSectionModal,
  onCloseCreateSectionModal,
  onOpenSelectBlockModal,
  onCloseSelectBlockModal,
  onOpenDeleteSystemModal,
  onCloseDeleteSystemModal,

  // Link Handlers
  onManagePageLinks,
  onManageSectionLinks,

  // Selection tracking
  onItemSelect,

  // Children
  children,
}: PowerSystemDetailViewProps) {
  const { t } = useTranslation("power-system");

  // ============================================================================
  // EMPTY STATE - NO PAGES
  // ============================================================================

  if (!currentPage && !isLoadingPages) {
    return (
      <div className="flex h-full overflow-hidden">
        {/* Navigation Sidebar */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isLeftSidebarOpen ? "w-80" : "w-0"
          )}
        >
          <NavigationSidebar
            systemId={system.id}
            isOpen={isLeftSidebarOpen}
            onToggle={onToggleLeftSidebar}
            groups={groups}
            pages={pages}
            currentPageId={currentPage?.id}
            isEditMode={isEditMode}
            onPageSelect={onPageSelect}
            onCreateGroup={onOpenCreateGroupModal}
            onCreatePage={onOpenCreatePageModal}
            onEditGroup={(groupId, newName) => onUpdateGroup(groupId, newName)}
            onDeleteGroup={onDeleteGroup}
            onEditPage={(pageId, newName) => onUpdatePage(pageId, newName)}
            onDeletePage={onDeletePage}
            onDuplicatePage={onDuplicatePage}
            onMovePage={onMovePage}
            onReorderPages={(pageIds) => {
              const reorderedPages = pageIds
                .map((id, index) => {
                  const page = pages.find((p) => p.id === id);
                  return page ? { ...page, orderIndex: index } : null;
                })
                .filter(Boolean) as IPowerPage[];
              onReorderPages(reorderedPages);
            }}
            onReorderGroups={(groupIds) => {
              const reorderedGroups = groupIds
                .map((id, index) => {
                  const group = groups.find((g) => g.id === id);
                  return group ? { ...group, orderIndex: index } : null;
                })
                .filter(Boolean) as IPowerGroup[];
              onReorderGroups(reorderedGroups);
            }}
            onItemSelect={onItemSelect}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="border-b bg-card px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToList}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              {/* Sidebar Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleLeftSidebar}
                className="cursor-pointer"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>

              {/* System Icon */}
              <Avatar className="w-8 h-8 rounded-md flex-shrink-0">
                <AvatarImage src={system.iconImage} className="object-cover" />
                <AvatarFallback className="rounded-md bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                  <Zap className="w-4 h-4 text-purple-500/50" />
                </AvatarFallback>
              </Avatar>

              {/* System Name */}
              <h2 className="text-lg font-semibold">{system.name}</h2>

              {/* Edit System Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenEditSystemModal}
                    className="cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">
                    {t("modals.edit_system.title")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-4">
              {/* Edit Mode Toggle Switch */}
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="edit-mode-toggle-no-page"
                  className="text-sm cursor-pointer"
                >
                  {isEditMode ? t("modes.edit") : t("modes.view")}
                </Label>
                <Switch
                  id="edit-mode-toggle-no-page"
                  checked={isEditMode}
                  onCheckedChange={onToggleEditMode}
                />
              </div>

              {/* Delete System Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenDeleteSystemModal}
                    className="text-destructive hover:bg-red-500/20 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">
                    {t("modals.delete_system.title")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Empty State - Simple message instead of CTA */}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">
              {t("empty.no_pages_description")}
            </p>
          </div>
        </div>

        {/* Modals */}
        <EditSystemModal
          isOpen={isEditSystemModalOpen}
          system={system}
          onClose={onCloseEditSystemModal}
          onSubmit={onUpdateSystem}
        />
        <CreateGroupModal
          isOpen={isCreateGroupModalOpen}
          onClose={onCloseCreateGroupModal}
          onSubmit={onCreateGroup}
        />
        <CreatePageModal
          isOpen={isCreatePageModalOpen}
          onClose={onCloseCreatePageModal}
          onSubmit={onCreatePage}
          groups={groups}
          preselectedGroupId={selectedGroupForPage}
        />
        <CreateSectionModal
          isOpen={isCreateSectionModalOpen}
          onClose={onCloseCreateSectionModal}
          onSubmit={onCreateSection}
        />
        <SelectBlockModal
          isOpen={isSelectBlockModalOpen}
          onClose={onCloseSelectBlockModal}
          onSelect={(type) => {
            if (selectedSectionForBlock) {
              // Create default empty content for the block type
              let defaultContent: BlockContent = {};

              switch (type) {
                case "heading":
                  defaultContent = { text: "", level: 1, alignment: "left" };
                  break;
                case "paragraph":
                  defaultContent = { text: "" };
                  break;
                case "unordered-list":
                  defaultContent = { items: [] };
                  break;
                case "numbered-list":
                  defaultContent = { items: [] };
                  break;
                case "tag-list":
                  defaultContent = { tags: [] };
                  break;
                case "dropdown":
                  defaultContent = { options: [], selectedValue: "" };
                  break;
                case "multi-dropdown":
                  defaultContent = { options: [], selectedValues: [] };
                  break;
                case "image":
                  defaultContent = { imageUrl: "", caption: "" };
                  break;
                case "icon":
                  defaultContent = { imageUrl: "", title: "", description: "" };
                  break;
                case "icon-group":
                  defaultContent = { icons: [] };
                  break;
                case "informative":
                  defaultContent = { icon: "info", text: "" };
                  break;
                case "divider":
                  defaultContent = {};
                  break;
                case "stars":
                  defaultContent = { rating: 0 };
                  break;
                case "attributes":
                  defaultContent = { max: 5, current: 0 };
                  break;
                case "navigator":
                  defaultContent = { linkedPageId: undefined, title: "" };
                  break;
              }

              onCreateBlock(selectedSectionForBlock, type, defaultContent);
            }
          }}
        />
        <DeleteSystemModal
          isOpen={isDeleteSystemModalOpen}
          onClose={onCloseDeleteSystemModal}
          onConfirm={onDeleteSystem}
          systemName={system.name}
        />
      </div>
    );
  }

  // ============================================================================
  // MAIN VIEW - WITH PAGE CONTENT
  // ============================================================================

  return (
    <div className="flex h-full overflow-hidden">
      {/* Navigation Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isLeftSidebarOpen ? "w-80" : "w-0"
        )}
      >
        <NavigationSidebar
          systemId={system.id}
          isOpen={isLeftSidebarOpen}
          onToggle={onToggleLeftSidebar}
          groups={groups}
          pages={pages}
          currentPageId={currentPage?.id}
          isEditMode={isEditMode}
          onPageSelect={onPageSelect}
          onCreateGroup={onOpenCreateGroupModal}
          onCreatePage={onOpenCreatePageModal}
          onEditGroup={(groupId, newName) => onUpdateGroup(groupId, newName)}
          onDeleteGroup={onDeleteGroup}
          onEditPage={(pageId, newName) => onUpdatePage(pageId, newName)}
          onDeletePage={onDeletePage}
          onDuplicatePage={onDuplicatePage}
          onMovePage={onMovePage}
          onReorderPages={(pageIds) => {
            const reorderedPages = pageIds
              .map((id, index) => {
                const page = pages.find((p) => p.id === id);
                return page ? { ...page, orderIndex: index } : null;
              })
              .filter(Boolean) as IPowerPage[];
            onReorderPages(reorderedPages);
          }}
          onReorderGroups={(groupIds) => {
            const reorderedGroups = groupIds
              .map((id, index) => {
                const group = groups.find((g) => g.id === id);
                return group ? { ...group, orderIndex: index } : null;
              })
              .filter(Boolean) as IPowerGroup[];
            onReorderGroups(reorderedGroups);
          }}
          onItemSelect={onItemSelect}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="border-b bg-card px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToList}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLeftSidebar}
              className="cursor-pointer"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>

            {/* System Icon */}
            <Avatar className="w-8 h-8 rounded-md flex-shrink-0">
              <AvatarImage src={system.iconImage} className="object-cover" />
              <AvatarFallback className="rounded-md bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                <Zap className="w-4 h-4 text-purple-500/50" />
              </AvatarFallback>
            </Avatar>

            {/* System Name */}
            <h2 className="text-lg font-semibold">{system.name}</h2>

            {/* Edit System Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenEditSystemModal}
                  className="cursor-pointer"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {t("modals.edit_system.title")}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-4">
            {/* Undo/Redo Buttons - Only visible in edit mode */}
            {isEditMode && (
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onUndo}
                      disabled={!canUndo}
                      className="cursor-pointer"
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">Undo (Ctrl+Z)</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onRedo}
                      disabled={!canRedo}
                      className="cursor-pointer"
                    >
                      <Redo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">Redo (Ctrl+Y)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Edit Mode Toggle Switch */}
            <div className="flex items-center gap-2">
              <Label
                htmlFor="edit-mode-toggle"
                className="text-sm cursor-pointer"
              >
                {isEditMode ? t("modes.edit") : t("modes.view")}
              </Label>
              <Switch
                id="edit-mode-toggle"
                checked={isEditMode}
                onCheckedChange={onToggleEditMode}
              />
            </div>

            {/* Delete System Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenDeleteSystemModal}
                  className="text-destructive hover:bg-red-500/20 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {t("modals.delete_system.title")}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Page Content */}
        {currentPage && system && (
          <PageContent
            system={system}
            page={currentPage}
            pages={pages}
            sections={sections}
            blocks={blocks}
            bookId={bookId}
            isEditMode={isEditMode}
            onUpdatePageName={(name) => onUpdatePage(currentPage.id, name)}
            onAddSection={onOpenCreateSectionModal}
            onUpdateSection={onUpdateSection}
            onDeleteSection={onDeleteSection}
            onReorderSections={onReorderSections}
            onAddBlock={onOpenSelectBlockModal}
            onUpdateBlock={onUpdateBlock}
            onDeleteBlock={onDeleteBlock}
            onReorderBlocks={onReorderBlocks}
            onPageSelect={onPageSelect}
            onManagePageLinks={onManagePageLinks}
            onManageSectionLinks={onManageSectionLinks}
          />
        )}
      </div>

      {/* Modals */}
      <EditSystemModal
        isOpen={isEditSystemModalOpen}
        system={system}
        onClose={onCloseEditSystemModal}
        onSubmit={onUpdateSystem}
      />
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={onCloseCreateGroupModal}
        onSubmit={onCreateGroup}
      />
      <CreatePageModal
        isOpen={isCreatePageModalOpen}
        onClose={onCloseCreatePageModal}
        onSubmit={onCreatePage}
        groups={groups}
        preselectedGroupId={selectedGroupForPage}
      />
      <CreateSectionModal
        isOpen={isCreateSectionModalOpen}
        onClose={onCloseCreateSectionModal}
        onSubmit={onCreateSection}
      />
      <SelectBlockModal
        isOpen={isSelectBlockModalOpen}
        onClose={() => {
          onCloseSelectBlockModal();
        }}
        onSelect={(type) => {
          if (selectedSectionForBlock) {
            // Create default empty content for the block type
            let defaultContent: BlockContent = {};

            switch (type) {
              case "heading":
                defaultContent = { text: "", level: 1, alignment: "left" };
                break;
              case "paragraph":
                defaultContent = { text: "" };
                break;
              case "unordered-list":
                defaultContent = { items: [] };
                break;
              case "numbered-list":
                defaultContent = { items: [] };
                break;
              case "tag-list":
                defaultContent = { tags: [] };
                break;
              case "dropdown":
                defaultContent = { options: [], selectedValue: "" };
                break;
              case "multi-dropdown":
                defaultContent = { options: [], selectedValues: [] };
                break;
              case "image":
                defaultContent = { imageUrl: "", caption: "" };
                break;
              case "icon":
                defaultContent = { imageUrl: "", title: "", description: "" };
                break;
              case "icon-group":
                defaultContent = { icons: [] };
                break;
              case "informative":
                defaultContent = { icon: "info", text: "" };
                break;
              case "divider":
                defaultContent = {};
                break;
              case "stars":
                defaultContent = { rating: 0 };
                break;
              case "attributes":
                defaultContent = { max: 5, current: 0 };
                break;
              case "navigator":
                defaultContent = { linkedPageId: undefined, title: "" };
                break;
            }

            onCreateBlock(selectedSectionForBlock, type, defaultContent);
          }
        }}
      />
      <DeleteSystemModal
        isOpen={isDeleteSystemModalOpen}
        onClose={onCloseDeleteSystemModal}
        onConfirm={onDeleteSystem}
        systemName={system.name}
      />

      {/* Render children (for ManageLinksModal) */}
      {children}
    </div>
  );
}
