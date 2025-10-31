import { RefObject, useMemo } from "react";

import { HelpCircle, BookOpen, Copy, Zap, Undo, Redo } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import { BreadcrumbNavigation } from "./components/breadcrumb-navigation";
import { Canvas } from "./components/canvas";
import { ConnectionsLayer } from "./components/connections/connections-layer";
import { MultiSelectionDraggableWrapper } from "./components/elements/multi-selection-draggable-wrapper";
import { MultiSelectionWrapper } from "./components/elements/multi-selection-wrapper";
import { PowerElement } from "./components/elements/power-element";
import { SelectionWrapper } from "./components/elements/selection-wrapper";
import { HelpDialog } from "./components/help-dialog";
import { PropertiesPanel } from "./components/properties-panel";
import { TemplateDialog } from "./components/template-dialog";
import { Toolbar } from "./components/toolbar";
import { TutorialDialog } from "./components/tutorial-dialog";
import {
  IPowerMap,
  IPowerElement,
  ITemplate,
  ToolType,
} from "./types/power-system-types";
import {
  isElementInViewport,
  isConnectionInViewport,
  Viewport,
} from "./utils/viewport-utils";

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface ITutorialStep {
  title: string;
  content: string;
  target: string | null;
}

interface PropsPowerSystemViewNew {
  isHeaderHidden: boolean;
  currentMap: IPowerMap;
  templates: ITemplate[];
  selectedElementIds: string[];
  selectedConnectionId: string | null;
  activeTool: ToolType;
  viewOffset: { x: number; y: number };
  zoom: number;
  breadcrumbItems: BreadcrumbItem[];
  selectionBox: {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null;
  connectionDraft: {
    fromElementId: string;
    currentX: number;
    currentY: number;
  } | null;
  showHelpDialog: boolean;
  showTemplateDialog: boolean;
  showTutorialDialog: boolean;
  tutorialStep: number;
  tutorialSteps: ITutorialStep[];
  canvasRef: RefObject<HTMLDivElement>;
  dragPositions: Record<string, { x: number; y: number }>;
  resizeSizes: Record<
    string,
    { width: number; height: number; scale?: number }
  >;
  tempConnectionPositions: Record<
    string,
    { x1: number; y1: number; x2: number; y2: number }
  >;
  onToolChange: (tool: ToolType) => void;
  onToggleGrid: () => void;
  onCanvasClick: (e: React.MouseEvent) => void;
  onElementUpdate: (id: string, updates: Partial<IPowerElement>) => void;
  onElementPositionChange: (id: string, x: number, y: number) => void;
  onElementDragMove: (id: string, x: number, y: number) => void;
  onElementDragEnd: (id: string) => void;
  onElementResizeMove: (
    id: string,
    width: number,
    height: number,
    mode?: "diagonal" | "horizontal" | "vertical"
  ) => void;
  onElementResizeEnd: (id: string) => void;
  onMultipleElementsPositionChange: (
    updates: Array<{ id: string; x: number; y: number }>
  ) => void;
  onMultipleElementsSizeChange: (
    updates: Array<{ id: string; width: number; height: number }>
  ) => void;
  onMultipleElementsDragMove: (
    updates: Array<{ id: string; x: number; y: number }>
  ) => void;
  onMultipleElementsDragEnd: () => void;
  onElementClick: (id: string, event?: { shiftKey?: boolean }) => void;
  onElementNavigate: (element: IPowerElement) => void;
  onElementDelete: (id: string) => void;
  onElementDuplicate: (elementId?: string) => void;
  onElementFirstInput?: () => void;
  onConnectionClick: (id: string) => void;
  onConnectionDelete: (id: string) => void;
  onArrowHandleDragStart: (connectionId: string, e: React.MouseEvent) => void;
  onBreadcrumbNavigate: (mapId: string) => void;
  onPropertiesClose: () => void;
  onSetShowHelpDialog: (show: boolean) => void;
  onSetShowTemplateDialog: (show: boolean) => void;
  onSetShowTutorialDialog: (show: boolean) => void;
  onTutorialNext: () => void;
  onTutorialPrev: () => void;
  onTutorialClose: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function PowerSystemView({
  isHeaderHidden,
  currentMap,
  templates,
  selectedElementIds,
  selectedConnectionId,
  activeTool,
  viewOffset,
  zoom,
  breadcrumbItems,
  selectionBox,
  connectionDraft,
  showHelpDialog,
  showTemplateDialog,
  showTutorialDialog,
  tutorialStep,
  tutorialSteps,
  canvasRef,
  dragPositions,
  resizeSizes,
  tempConnectionPositions,
  onToolChange,
  onToggleGrid,
  onCanvasClick,
  onElementUpdate,
  onElementPositionChange,
  onElementDragMove,
  onElementDragEnd,
  onElementResizeMove,
  onElementResizeEnd,
  onMultipleElementsPositionChange,
  onMultipleElementsSizeChange,
  onMultipleElementsDragMove,
  onMultipleElementsDragEnd,
  onElementClick,
  onElementNavigate,
  onElementDelete,
  onElementDuplicate,
  onElementFirstInput,
  onConnectionClick,
  onConnectionDelete,
  onArrowHandleDragStart,
  onBreadcrumbNavigate,
  onPropertiesClose,
  onSetShowHelpDialog,
  onSetShowTemplateDialog,
  onSetShowTutorialDialog,
  onTutorialNext,
  onTutorialPrev,
  onTutorialClose,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: PropsPowerSystemViewNew) {
  const { t } = useTranslation("power-system");

  // Get all selected elements for multi-selection wrapper
  const selectedElements = currentMap.elements.filter((el) =>
    selectedElementIds.includes(el.id)
  );

  // Determine if properties panel should be shown and which element to show
  const shouldShowPropertiesPanel = () => {
    if (selectedElementIds.length === 0 || activeTool === "hand") return false;

    // Single selection: always show
    if (selectedElementIds.length === 1) return true;

    // Multiple selection: only show if all same type or compatible types
    const types = new Set(selectedElements.map((el) => el.type));

    // All forms (visual-section): show
    if (types.size === 1 && types.has("visual-section")) return true;

    // Cards (basic-section and/or detailed-section): show
    if (
      types.size <= 2 &&
      [...types].every(
        (type) => type === "basic-section" || type === "detailed-section"
      )
    ) {
      return true;
    }

    // All text elements: show
    if (types.size === 1 && types.has("text")) return true;

    // Mixed types: don't show
    return false;
  };

  // Get representative element for properties panel
  const selectedElement =
    selectedElementIds.length === 1
      ? currentMap.elements.find((el) => el.id === selectedElementIds[0]) ||
        null
      : selectedElementIds.length > 1 && shouldShowPropertiesPanel()
        ? currentMap.elements.find((el) => el.id === selectedElementIds[0]) ||
          null
        : null;

  // Calculate viewport for culling
  const viewport = useMemo<Viewport>(() => {
    if (!canvasRef.current) {
      return {
        x: viewOffset.x,
        y: viewOffset.y,
        width: 1920,
        height: 1080,
        zoom,
      };
    }

    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: viewOffset.x,
      y: viewOffset.y,
      width: rect.width,
      height: rect.height,
      zoom,
    };
  }, [canvasRef, viewOffset, zoom]);

  // Filter visible elements (viewport culling)
  const visibleElements = useMemo(
    () =>
      currentMap.elements.filter((element) =>
        isElementInViewport(element, viewport)
      ),
    [currentMap.elements, viewport]
  );

  // Filter visible connections (viewport culling)
  const visibleConnections = useMemo(
    () =>
      currentMap.connections.filter((connection) =>
        isConnectionInViewport(connection, currentMap.elements, viewport)
      ),
    [currentMap.connections, currentMap.elements, viewport]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header Principal - 2 colunas: Título | Botões */}
      <div className="flex items-center justify-between px-6 py-6 border-b bg-background">
        {/* Coluna Esquerda - Título */}
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold">{t("page.title")}</h2>
          <p className="text-sm text-muted-foreground">{currentMap.name}</p>
        </div>

        {/* Coluna Direita - Botões */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetShowTutorialDialog(true)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {t("page.tutorial")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetShowTemplateDialog(true)}
          >
            <Copy className="w-4 h-4 mr-2" />
            {t("page.templates")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetShowHelpDialog(true)}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {t("page.help")}
          </Button>
        </div>
      </div>

      {/* Content Area: Toolbar + Canvas */}
      <div className="flex-1 flex">
        {/* Toolbar */}
        <Toolbar
          activeTool={activeTool}
          gridEnabled={currentMap.gridEnabled}
          onToolChange={onToolChange}
          onToggleGrid={onToggleGrid}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Breadcrumb - Centralizado na área de edição com botões de undo/redo */}
          <div className="w-full flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur-sm z-10">
            {/* Undo/Redo buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onUndo}
                disabled={!canUndo}
                className="h-8 w-8"
                title="Desfazer (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRedo}
                disabled={!canRedo}
                className="h-8 w-8"
                title="Refazer (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>

            {/* Breadcrumb - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <BreadcrumbNavigation
                items={breadcrumbItems}
                onNavigate={onBreadcrumbNavigate}
              />
            </div>

            {/* Empty div for layout balance */}
            <div className="w-[72px]" />
          </div>

          <Canvas
            ref={canvasRef}
            gridEnabled={currentMap.gridEnabled}
            gridSize={currentMap.gridSize}
            viewOffset={viewOffset}
            zoom={zoom}
            onMouseDown={onCanvasClick}
            className={
              activeTool === "hand"
                ? "cursor-grab active:cursor-grabbing"
                : "cursor-crosshair"
            }
          >
            {/* Connections Layer (below elements) - Only render visible connections */}
            <ConnectionsLayer
              connections={visibleConnections}
              elements={currentMap.elements}
              selectedConnectionId={selectedConnectionId}
              onConnectionClick={onConnectionClick}
              onArrowHandleDragStart={onArrowHandleDragStart}
              connectionDraft={connectionDraft}
              tempConnectionPositions={tempConnectionPositions}
            />

            {/* Elements - Only render visible elements (viewport culling) */}
            {visibleElements.map((element) => {
              // Get temporary resize size if available
              const tempSize = resizeSizes[element.id];

              return (
                <PowerElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElementIds.includes(element.id)}
                  isEditMode={activeTool !== "hand"}
                  gridEnabled={currentMap.gridEnabled}
                  gridSize={currentMap.gridSize}
                  zoom={zoom}
                  onUpdate={(updates) => onElementUpdate(element.id, updates)}
                  onPositionChange={(x, y) =>
                    onElementPositionChange(element.id, x, y)
                  }
                  onDragMove={(x, y) => onElementDragMove(element.id, x, y)}
                  onDragEnd={() => onElementDragEnd(element.id)}
                  onResizeMove={(width, height, mode) =>
                    onElementResizeMove(element.id, width, height, mode)
                  }
                  onResizeEnd={() => onElementResizeEnd(element.id)}
                  onClick={(e) =>
                    onElementClick(element.id, { shiftKey: e?.shiftKey })
                  }
                  onNavigate={() => onElementNavigate(element)}
                  onFirstInput={onElementFirstInput}
                  isMultiSelected={
                    selectedElementIds.length > 1 &&
                    selectedElementIds.includes(element.id)
                  }
                  tempSize={tempSize}
                  isHandMode={activeTool === "hand"}
                />
              );
            })}

            {/* Selection Wrappers - For single element selections */}
            {selectedElementIds.length === 1 &&
              activeTool !== "hand" &&
              visibleElements
                .filter((el) => selectedElementIds.includes(el.id))
                .map((element) => {
                  // Use temporary drag position if available (real-time updates)
                  const tempPos = dragPositions[element.id];

                  // Don't show wrapper for empty text elements
                  const shouldShowWrapper = !(
                    element.type === "text" && element.content === ""
                  );

                  return (
                    <SelectionWrapper
                      key={`wrapper-${element.id}`}
                      x={tempPos?.x ?? element.x}
                      y={tempPos?.y ?? element.y}
                      width={element.width}
                      height={element.height}
                      isVisible={shouldShowWrapper}
                    />
                  );
                })}

            {/* Multi-Selection Wrapper - For multiple selected elements */}
            {selectedElementIds.length > 1 && activeTool !== "hand" && (
              <>
                <MultiSelectionWrapper
                  elements={selectedElements.map((el) => ({
                    id: el.id,
                    x: el.x,
                    y: el.y,
                    width: el.width,
                    height: el.height,
                  }))}
                  isVisible
                  dragPositions={dragPositions}
                />
                <MultiSelectionDraggableWrapper
                  elements={selectedElements}
                  isEditMode={activeTool !== "hand"}
                  gridEnabled={currentMap.gridEnabled}
                  gridSize={currentMap.gridSize}
                  zoom={zoom}
                  dragPositions={dragPositions}
                  onPositionChange={onMultipleElementsPositionChange}
                  onDragMove={onMultipleElementsDragMove}
                  onDragEnd={onMultipleElementsDragEnd}
                />
              </>
            )}

            {/* Selection Box - Visual feedback during drag selection */}
            {selectionBox && activeTool === "select" && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${Math.min(selectionBox.startX, selectionBox.currentX)}px`,
                  top: `${Math.min(selectionBox.startY, selectionBox.currentY)}px`,
                  width: `${Math.abs(selectionBox.currentX - selectionBox.startX)}px`,
                  height: `${Math.abs(selectionBox.currentY - selectionBox.startY)}px`,
                  border: "2px dashed hsl(var(--primary))",
                  backgroundColor: "hsla(var(--primary), 0.1)",
                  borderRadius: "4px",
                  zIndex: 999,
                }}
              />
            )}
          </Canvas>

          {/* Empty State - Positioned outside canvas transform to be centered on viewport */}
          {currentMap.elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Zap className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("empty_state.title")}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {t("empty_state.description")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activeTool === "hand"
                    ? t("empty_state.hint_hand")
                    : t("empty_state.hint_edit")}
                </p>
              </div>
            </div>
          )}

          {/* Properties Panel */}
          {selectedElement && shouldShowPropertiesPanel() && (
            <PropertiesPanel
              element={selectedElement}
              selectedCount={selectedElementIds.length}
              onUpdate={(updates) =>
                onElementUpdate(selectedElement.id, updates)
              }
              onDelete={() => {
                // Delete all selected elements
                if (selectedElementIds.length > 1) {
                  selectedElementIds.forEach((id) => onElementDelete(id));
                } else {
                  onElementDelete(selectedElement.id);
                }
              }}
              onDuplicate={() => onElementDuplicate(selectedElement.id)}
              onClose={onPropertiesClose}
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <HelpDialog isOpen={showHelpDialog} onOpenChange={onSetShowHelpDialog} />

      <TemplateDialog
        isOpen={showTemplateDialog}
        templates={templates}
        onOpenChange={onSetShowTemplateDialog}
      />

      <TutorialDialog
        isOpen={showTutorialDialog}
        step={tutorialStep}
        steps={tutorialSteps}
        onNext={onTutorialNext}
        onPrev={onTutorialPrev}
        onClose={onTutorialClose}
      />
    </div>
  );
}
