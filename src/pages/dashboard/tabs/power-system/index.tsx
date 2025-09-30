import { useState, useRef, useEffect, useCallback } from "react";

import { PowerSystemView } from "./view";

type ElementType = "section-card" | "details-card" | "visual-card" | "text-box";
type ConnectionType = "arrow" | "line";

interface PowerElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  content?: string;
  imageUrl?: string;
  color: string;
  textColor: string;
  canOpenSubmap: boolean;
  showHover: boolean;
  compressed?: boolean;
  submapId?: string;
}

interface Connection {
  id: string;
  type: ConnectionType;
  fromId: string;
  toId: string;
  text?: string;
  color: string;
}

interface PowerMap {
  id: string;
  name: string;
  elements: PowerElement[];
  connections: Connection[];
  parentMapId?: string;
}

interface Template {
  id: string;
  name: string;
  map: Omit<PowerMap, "id" | "name">;
}

const DEFAULT_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#84CC16",
  "#6366F1",
];

const ELEMENT_TYPES = [
  {
    type: "section-card" as ElementType,
    name: "Card de Seção",
    description: "Para seções principais do sistema",
  },
  {
    type: "details-card" as ElementType,
    name: "Card de Detalhes",
    description: "Cria submapas navegáveis",
  },
  {
    type: "visual-card" as ElementType,
    name: "Card Visual",
    description: "Focado em representações visuais",
  },
  {
    type: "text-box" as ElementType,
    name: "Caixa de Texto",
    description: "Anotações e descrições livres",
  },
];

const TUTORIAL_STEPS = [
  {
    title: "Bem-vindo ao Sistema de Poder!",
    content:
      "Crie mapas visuais interativos para organizar seu sistema de mundo.",
    target: null,
  },
  {
    title: "Modo de Edição",
    content:
      "Clique em 'Visualizando' para entrar no modo de edição e acessar as ferramentas.",
    target: ".edit-button",
  },
  {
    title: "Barra de Elementos",
    content:
      "Use a barra lateral para adicionar diferentes tipos de elementos ao seu mapa.",
    target: ".sidebar-toolbox",
  },
  {
    title: "Cards de Seção",
    content:
      "Ideais para seções principais do seu sistema. Podem ser comprimidos para economizar espaço.",
    target: "[data-element-type='section-card']",
  },
  {
    title: "Cards de Detalhes",
    content:
      "Criam submapas navegáveis para organizar informações hierarquicamente.",
    target: "[data-element-type='details-card']",
  },
  {
    title: "Cards Visuais",
    content:
      "Focados em imagens, perfeitos para representações visuais do seu sistema.",
    target: "[data-element-type='visual-card']",
  },
  {
    title: "Caixas de Texto",
    content: "Elementos livres para anotações e descrições adicionais.",
    target: "[data-element-type='text-box']",
  },
];

export function PowerSystemTab() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMap, setCurrentMap] = useState<PowerMap>({
    id: "main",
    name: "Sistema de Poder Principal",
    elements: [],
    connections: [],
  });
  const [maps, setMaps] = useState<PowerMap[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
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

  // Canvas panning for view mode
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

  // Element creation
  const createElement = useCallback(
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

      const newElement: PowerElement = {
        id,
        type,
        x: posX,
        y: posY,
        width,
        height,
        title: type === "text-box" ? "" : "Novo Elemento",
        content: type === "text-box" ? "Texto..." : "Descrição...",
        color: DEFAULT_COLORS[0],
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

  const updateElement = useCallback(
    (id: string, updates: Partial<PowerElement>) => {
      setCurrentMap((prev) => ({
        ...prev,
        elements: prev.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        ),
      }));
    },
    []
  );

  const deleteElement = useCallback((id: string) => {
    setCurrentMap((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
      connections: prev.connections.filter(
        (conn) => conn.fromId !== id && conn.toId !== id
      ),
    }));
  }, []);

  // Submap navigation
  const handleSubmapOpen = useCallback(
    (element: PowerElement) => {
      if (!element.submapId) {
        // Create new submap
        const newSubmapId = `submap-${Date.now()}`;
        const newSubmap: PowerMap = {
          id: newSubmapId,
          name: element.title || "Novo Sub Mapa",
          elements: [],
          connections: [],
          parentMapId: currentMap.id,
        };

        setMaps((prev) => [...prev, newSubmap]);
        updateElement(element.id, { submapId: newSubmapId });
        setCurrentMap(newSubmap);
      } else {
        // Open existing submap
        const existingSubmap = maps.find((map) => map.id === element.submapId);
        if (existingSubmap) {
          setCurrentMap(existingSubmap);
        }
      }
    },
    [currentMap.id, maps, updateElement]
  );

  const goBackToParent = useCallback(() => {
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

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedElement && isEditMode) {
        deleteElement(selectedElement);
        setSelectedElement(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, isEditMode, deleteElement]);

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setShowPropertiesPanel(false);
    setSelectedElement(null);
  };

  const handleElementClick = (element: PowerElement) => {
    if (isEditMode) {
      setSelectedElement(element.id);
      setShowPropertiesPanel(true);
    } else if (element.canOpenSubmap) {
      handleSubmapOpen(element);
    }
  };

  const handleSave = () => {
    // Save functionality would go here
    console.log("Saving power system...");
  };

  const handleTutorialNext = () => setTutorialStep((prev) => prev + 1);
  const handleTutorialPrev = () => setTutorialStep((prev) => prev - 1);
  const handleTutorialClose = () => {
    setShowTutorialDialog(false);
    setTutorialStep(0);
  };

  const handlePropertiesClose = () => {
    setShowPropertiesPanel(false);
    setSelectedElement(null);
  };

  const handlePropertiesDelete = () => {
    if (selectedElement) {
      deleteElement(selectedElement);
      setSelectedElement(null);
      setShowPropertiesPanel(false);
    }
  };

  const selectedElementData = selectedElement
    ? currentMap.elements.find((el) => el.id === selectedElement)
    : null;

  return (
    <PowerSystemView
      // State
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
      // Constants
      ELEMENT_TYPES={ELEMENT_TYPES}
      DEFAULT_COLORS={DEFAULT_COLORS}
      TUTORIAL_STEPS={TUTORIAL_STEPS}
      // Refs
      canvasRef={canvasRef}
      // Handlers
      onToggleEditMode={handleToggleEditMode}
      onSave={handleSave}
      onSetShowHelpDialog={setShowHelpDialog}
      onGoBackToParent={goBackToParent}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onElementClick={handleElementClick}
      onSetShowCreateDialog={setShowCreateDialog}
      onSetNewElementType={setNewElementType}
      onCreateElement={createElement}
      onSetShowTutorialDialog={setShowTutorialDialog}
      onSetShowTemplateDialog={setShowTemplateDialog}
      onUpdateElement={updateElement}
      onDeleteElement={deleteElement}
      onTutorialNext={handleTutorialNext}
      onTutorialPrev={handleTutorialPrev}
      onTutorialClose={handleTutorialClose}
      onPropertiesClose={handlePropertiesClose}
      onPropertiesDelete={handlePropertiesDelete}
    />
  );
}
