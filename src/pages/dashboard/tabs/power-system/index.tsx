import { useState, useRef, useEffect, useCallback, useMemo } from "react";

import { DEFAULT_COLORS_CONSTANT } from "./constants/colors-constant";
import { ELEMENT_TYPES_CONSTANT } from "./constants/element-types-constant";
import { TUTORIAL_STEPS_CONSTANT } from "./constants/tutorial-steps-constant";
import {
  IPowerElement,
  IPowerMap,
  ITemplate,
  ElementType,
} from "./types/power-system-types";
import { PowerSystemView } from "./view";

interface PropsPowerSystemTab {
  isHeaderHidden: boolean;
}

export function PowerSystemTab({ isHeaderHidden }: PropsPowerSystemTab) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentMap, setCurrentMap] = useState<IPowerMap>({
    id: "main",
    name: "Sistema de Poder Principal",
    elements: [],
    connections: [],
  });
  const [maps, setMaps] = useState<IPowerMap[]>([]);
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
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
      // Removido - sempre em modo edição
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Removido - sempre em modo edição
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    // Removido - sempre em modo edição
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

  const handleElementClick = useCallback(
    (element: IPowerElement) => {
      setSelectedElement(element.id);
      setShowPropertiesPanel(true);
    },
    []
  );

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
      if (e.key === "Delete" && selectedElement) {
        handleDeleteElement(selectedElement);
        setSelectedElement(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, handleDeleteElement]);

  return (
    <PowerSystemView
      isHeaderHidden={isHeaderHidden}
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
