import { useState, useRef, useEffect, useCallback, useMemo } from "react";

import { DEFAULT_COLORS_CONSTANT } from "./constants/colors-constant";
import { ELEMENT_TYPES_CONSTANT } from "./constants/element-types-constant";
import { TUTORIAL_STEPS_CONSTANT } from "./constants/tutorial-steps-constant";
import { MOCK_POWER_MAPS } from "./mocks/mock-power-maps";
import {
  IPowerElement,
  IPowerMap,
  ITemplate,
  ElementType,
} from "./types/power-system-types";
import { PowerSystemView } from "./view";

export function PowerSystemTab() {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMap, setCurrentMap] = useState<IPowerMap>(MOCK_POWER_MAPS[0]);
  const [maps, setMaps] = useState<IPowerMap[]>([]);
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [isViewDragging, setIsViewDragging] = useState(false);
  const [viewDragStart, setViewDragStart] = useState({ x: 0, y: 0 });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newElementType, setNewElementType] =
    useState<ElementType>("section-card");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showTutorialDialog, setShowTutorialDialog] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);

  const selectedElementData = useMemo(
    () => currentMap.elements.find((el) => el.id === selectedElement) || null,
    [selectedElement, currentMap.elements]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode) {
        setIsViewDragging(true);
        setViewDragStart({
          x: e.clientX - viewOffset.x,
          y: e.clientY - viewOffset.y,
        });
      }
    },
    [isEditMode, viewOffset]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isViewDragging && !isEditMode) {
        setViewOffset({
          x: e.clientX - viewDragStart.x,
          y: e.clientY - viewDragStart.y,
        });
      }
    },
    [isViewDragging, isEditMode, viewDragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsViewDragging(false);
  }, []);

  const handleCreateElement = useCallback(
    (type: ElementType, x?: number, y?: number) => {
      const width = type === "text-box" ? 200 : 250;
      const height = type === "text-box" ? 100 : 150;

      let posX = x ?? 0;
      let posY = y ?? 0;

      if (x == null || y == null) {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          posX = -viewOffset.x + rect.width / 2 - width / 2;
          posY = -viewOffset.y + rect.height / 2 - height / 2;
        } else {
          posX = 100;
          posY = 100;
        }
      }

      const id = `element-${Date.now()}`;

      const newElement: IPowerElement = {
        id,
        type,
        x: posX,
        y: posY,
        width,
        height,
        title: type === "text-box" ? "" : "Novo Elemento",
        content: type === "text-box" ? "Texto..." : "Descrição...",
        color: DEFAULT_COLORS_CONSTANT[0],
        textColor: "#ffffff",
        canOpenSubmap: type === "details-card" || type === "visual-card",
        showHover: true,
        compressed: false,
      };

      setCurrentMap((prev) => ({
        ...prev,
        elements: [...prev.elements, newElement],
      }));
      setSelectedElement(id);
      setShowCreateDialog(false);
    },
    [viewOffset]
  );

  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<IPowerElement>) => {
      setCurrentMap((prev) => ({
        ...prev,
        elements: prev.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        ),
      }));
    },
    []
  );

  const handleDeleteElement = useCallback((id: string) => {
    setCurrentMap((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
      connections: prev.connections.filter(
        (conn) => conn.fromId !== id && conn.toId !== id
      ),
    }));
  }, []);

  const handleSubmapOpen = useCallback(
    (element: IPowerElement) => {
      if (!element.submapId) {
        const newSubmapId = `submap-${Date.now()}`;
        const newSubmap: IPowerMap = {
          id: newSubmapId,
          name: element.title || "Novo Sub Mapa",
          elements: [],
          connections: [],
          parentMapId: currentMap.id,
        };

        setMaps((prev) => [...prev, newSubmap]);
        handleUpdateElement(element.id, { submapId: newSubmapId });
        setCurrentMap(newSubmap);
      } else {
        const existingSubmap = maps.find((map) => map.id === element.submapId);
        if (existingSubmap) {
          setCurrentMap(existingSubmap);
        }
      }
    },
    [currentMap.id, maps, handleUpdateElement]
  );

  const handleGoBackToParent = useCallback(() => {
    if (currentMap.parentMapId) {
      const parentMap = maps.find((map) => map.id === currentMap.parentMapId);
      if (parentMap) {
        setCurrentMap(parentMap);
      } else if (currentMap.parentMapId === "main") {
        setCurrentMap({
          id: "main",
          name: "Sistema de Poder Principal",
          elements: [],
          connections: [],
        });
      }
    }
  }, [currentMap.parentMapId, maps]);

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
    setShowPropertiesPanel(false);
    setSelectedElement(null);
  }, []);

  const handleElementClick = useCallback(
    (element: IPowerElement) => {
      if (isEditMode) {
        setSelectedElement(element.id);
        setShowPropertiesPanel(true);
      } else if (element.canOpenSubmap) {
        handleSubmapOpen(element);
      }
    },
    [isEditMode, handleSubmapOpen]
  );

  const handleSave = useCallback(() => {}, []);

  const handleTutorialNext = useCallback(
    () => setTutorialStep((prev) => prev + 1),
    []
  );

  const handleTutorialPrev = useCallback(
    () => setTutorialStep((prev) => prev - 1),
    []
  );

  const handleTutorialClose = useCallback(() => {
    setShowTutorialDialog(false);
    setTutorialStep(0);
  }, []);

  const handlePropertiesClose = useCallback(() => {
    setShowPropertiesPanel(false);
    setSelectedElement(null);
  }, []);

  const handlePropertiesDelete = useCallback(() => {
    if (selectedElement) {
      handleDeleteElement(selectedElement);
      setSelectedElement(null);
      setShowPropertiesPanel(false);
    }
  }, [selectedElement, handleDeleteElement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedElement && isEditMode) {
        handleDeleteElement(selectedElement);
        setSelectedElement(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, isEditMode, handleDeleteElement]);

  return (
    <PowerSystemView
      isEditMode={isEditMode}
      currentMap={currentMap}
      maps={maps}
      templates={templates}
      selectedElement={selectedElement}
      viewOffset={viewOffset}
      showCreateDialog={showCreateDialog}
      newElementType={newElementType}
      showTemplateDialog={showTemplateDialog}
      showTutorialDialog={showTutorialDialog}
      tutorialStep={tutorialStep}
      showHelpDialog={showHelpDialog}
      showPropertiesPanel={showPropertiesPanel}
      selectedElementData={selectedElementData}
      elementTypes={ELEMENT_TYPES_CONSTANT}
      defaultColors={DEFAULT_COLORS_CONSTANT}
      tutorialSteps={TUTORIAL_STEPS_CONSTANT}
      canvasRef={canvasRef}
      onToggleEditMode={handleToggleEditMode}
      onSave={handleSave}
      onSetShowHelpDialog={setShowHelpDialog}
      onGoBackToParent={handleGoBackToParent}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onElementClick={handleElementClick}
      onSetShowCreateDialog={setShowCreateDialog}
      onSetNewElementType={setNewElementType}
      onCreateElement={handleCreateElement}
      onSetShowTutorialDialog={setShowTutorialDialog}
      onSetShowTemplateDialog={setShowTemplateDialog}
      onUpdateElement={handleUpdateElement}
      onDeleteElement={handleDeleteElement}
      onTutorialNext={handleTutorialNext}
      onTutorialPrev={handleTutorialPrev}
      onTutorialClose={handleTutorialClose}
      onPropertiesClose={handlePropertiesClose}
      onPropertiesDelete={handlePropertiesDelete}
    />
  );
}
