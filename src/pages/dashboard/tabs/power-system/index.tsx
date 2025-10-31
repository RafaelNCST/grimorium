import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import { toast } from "@/hooks/use-toast";

import { TUTORIAL_STEPS_CONSTANT } from "./constants/tutorial-steps-constant";
import {
  IPowerMap,
  IPowerElement,
  IConnection,
  ToolType,
  ITemplate,
  ElementType,
} from "./types/power-system-types";
import {
  createArrowConnection,
  createLineConnection,
} from "./utils/connection-factory";
import { createElement } from "./utils/element-factory";
import { snapPositionToGrid } from "./utils/grid-utils";
import { PowerSystemView } from "./view";

interface PropsPowerSystemTab {
  isHeaderHidden: boolean;
}

export function PowerSystemTab({ isHeaderHidden }: PropsPowerSystemTab) {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Main state
  const initialMainMap: IPowerMap = {
    id: "main",
    bookId: "temp-book-id",
    name: "Sistema de Poder Principal",
    gridEnabled: true,
    gridSize: 20,
    elements: [],
    connections: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const [currentMap, setCurrentMap] = useState<IPowerMap>(initialMainMap);
  const [maps, setMaps] = useState<IPowerMap[]>([initialMainMap]);
  const [templates] = useState<ITemplate[]>([]);

  // Sync currentMap changes back to maps array
  useEffect(() => {
    setMaps((prev) =>
      prev.map((m) => (m.id === currentMap.id ? currentMap : m))
    );
  }, [currentMap]);

  // UI state
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<
    string | null
  >(null);
  const [viewOffset, setViewOffset] = useState({ x: 100, y: 100 });
  const [zoom, setZoom] = useState(1);

  // Selection box state (for drag selection)
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Ref para armazenar posição inicial antes de criar selection box
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null);

  // Dialog state
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showTutorialDialog, setShowTutorialDialog] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Connection creation state
  const [pendingConnection, setPendingConnection] = useState<{
    type: "arrow" | "line";
    fromElementId: string;
  } | null>(null);

  // Connection draft state (visual feedback during connection creation)
  const [connectionDraft, setConnectionDraft] = useState<{
    fromElementId: string;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Arrow handle dragging state (for moving arrow tip after creation)
  const [draggingArrowHandle, setDraggingArrowHandle] = useState<{
    connectionId: string;
    startX: number;
    startY: number;
  } | null>(null);

  // Pan state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Clipboard state
  const [copiedElement, setCopiedElement] = useState<IPowerElement | null>(
    null
  );

  // Undo/Redo state
  const [history, setHistory] = useState<IPowerMap[]>([initialMainMap]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Real-time drag/resize tracking state (for wrapper updates during interaction)
  const [dragPositions, setDragPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  // Real-time resize tracking state (for text element resize feedback)
  const [resizeSizes, setResizeSizes] = useState<
    Record<string, { width: number; height: number; scale?: number }>
  >({});

  // Real-time connection positions during drag/resize
  const [tempConnectionPositions, setTempConnectionPositions] = useState<
    Record<string, { x1: number; y1: number; x2: number; y2: number }>
  >({});

  // Breadcrumb items
  const breadcrumbItems = useMemo(() => {
    const items: Array<{ id: string; name: string }> = [
      { id: "main", name: "Sistema Principal" },
    ];

    // Build breadcrumb trail
    let current = currentMap;
    const trail: IPowerMap[] = [];

    while (current.parentMapId) {
      const parent = maps.find((m) => m.id === current.parentMapId);
      if (!parent) break;
      trail.unshift(current);
      current = parent;
    }

    trail.forEach((map) => {
      items.push({ id: map.id, name: map.name });
    });

    if (
      currentMap.id !== "main" &&
      !trail.find((m) => m.id === currentMap.id)
    ) {
      items.push({ id: currentMap.id, name: currentMap.name });
    }

    return items;
  }, [currentMap, maps]);

  // Save to history when currentMap changes (with debounce to avoid saving every drag frame)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only save if the map actually changed (deep comparison on relevant fields)
      const lastHistoryItem = history[historyIndex];
      const hasChanged =
        JSON.stringify(lastHistoryItem?.elements) !==
          JSON.stringify(currentMap.elements) ||
        JSON.stringify(lastHistoryItem?.connections) !==
          JSON.stringify(currentMap.connections) ||
        lastHistoryItem?.gridEnabled !== currentMap.gridEnabled ||
        lastHistoryItem?.gridSize !== currentMap.gridSize;

      if (hasChanged) {
        // Remove any future history if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ ...currentMap });

        // Limit history to 50 items to prevent memory issues
        if (newHistory.length > 50) {
          newHistory.shift();
          setHistoryIndex(newHistory.length - 1);
        } else {
          setHistoryIndex(newHistory.length - 1);
        }

        setHistory(newHistory);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [currentMap]);

  // Event handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentMap(history[newIndex]);
      setSelectedElementIds([]);
      setSelectedConnectionId(null);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentMap(history[newIndex]);
      setSelectedElementIds([]);
      setSelectedConnectionId(null);
    }
  }, [historyIndex, history]);

  // Event handlers
  const handleElementDelete = useCallback((id: string) => {
    setCurrentMap((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
      connections: prev.connections.filter(
        (conn) => conn.fromElementId !== id && conn.toElementId !== id
      ),
      updatedAt: Date.now(),
    }));
    setSelectedElementIds([]);
  }, []);

  const handleElementDuplicate = useCallback(
    (elementId?: string) => {
      const element = elementId
        ? currentMap.elements.find((el) => el.id === elementId)
        : copiedElement;

      if (!element) return;

      // Calculate center of visible viewport
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const centerX = (rect.width / 2 - viewOffset.x) / zoom;
      const centerY = (rect.height / 2 - viewOffset.y) / zoom;

      // Create duplicate with new ID and centered position
      const now = Date.now();
      const duplicatedElement: IPowerElement = {
        ...element,
        id: `${element.type}-${now}`,
        x: centerX - element.width / 2,
        y: centerY - element.height / 2,
        submapId: undefined, // Don't copy submap reference
        createdAt: now,
        updatedAt: now,
      };

      setCurrentMap((prev) => ({
        ...prev,
        elements: [...prev.elements, duplicatedElement],
        updatedAt: Date.now(),
      }));

      setSelectedElementIds([duplicatedElement.id]);
    },
    [currentMap.elements, copiedElement, viewOffset, zoom]
  );

  const handleConnectionDelete = useCallback((id: string) => {
    setCurrentMap((prev) => ({
      ...prev,
      connections: prev.connections.filter((conn) => conn.id !== id),
      updatedAt: Date.now(),
    }));
    setSelectedConnectionId(null);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs
      const target = e.target as HTMLElement;

      // Check if user is typing in any input field
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        target.isContentEditable; // More reliable check for contentEditable

      console.log("[DEBUG] Keyboard event:", {
        key: e.key,
        target: target.tagName,
        contentEditable: target.contentEditable,
        isContentEditable: target.isContentEditable,
        isTyping,
        targetId: target.id,
        targetClass: target.className,
      });

      if (isTyping) {
        console.log("[DEBUG] Ignoring keyboard shortcut - user is typing");
        return;
      }

      // Deselect with Escape
      if (e.key === "Escape") {
        setSelectedElementIds([]);
        setSelectedConnectionId(null);
        setSelectionBox(null);
        return;
      }

      // Delete selected elements or connection
      if (e.key === "Delete") {
        if (selectedElementIds.length > 0) {
          // Delete all selected elements
          selectedElementIds.forEach((id) => handleElementDelete(id));
        } else if (selectedConnectionId) {
          handleConnectionDelete(selectedConnectionId);
        }
        return;
      }

      // Copy element (Ctrl+C) - only for single selection
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "c" &&
        selectedElementIds.length === 1
      ) {
        const element = currentMap.elements.find(
          (el) => el.id === selectedElementIds[0]
        );
        if (element) {
          setCopiedElement(element);
        }
        return;
      }

      // Paste element (Ctrl+V)
      if ((e.ctrlKey || e.metaKey) && e.key === "v" && copiedElement) {
        handleElementDuplicate();
        return;
      }

      // Undo (Ctrl+Z)
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo (Ctrl+Y or Ctrl+Shift+Z)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Tool shortcuts
      if (e.ctrlKey || e.metaKey) return; // Skip if modifier keys are pressed

      const toolShortcuts: Record<string, ToolType | "grid"> = {
        v: "select",
        h: "hand",
        b: "paragraph-block",
        d: "section-block",
        c: "circle",
        s: "square",
        l: "diamond",
        t: "text",
        a: "arrow",
        r: "line",
        g: "grid",
      };

      const keyLower = e.key.toLowerCase();
      const toolAction = toolShortcuts[keyLower];

      if (toolAction) {
        console.log("[DEBUG] Tool shortcut activated:", {
          key: keyLower,
          tool: toolAction,
          previousTool: activeTool,
        });

        if (toolAction === "grid") {
          handleToggleGrid();
        } else {
          setActiveTool(toolAction as ToolType);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedElementIds,
    selectedConnectionId,
    currentMap.elements,
    copiedElement,
    handleElementDuplicate,
    handleElementDelete,
    handleConnectionDelete,
    handleUndo,
    handleRedo,
  ]);

  // Zoom with Ctrl/Cmd + Scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        // Calculate zoom delta (smoother zoom)
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        // Zoom limits: min 0.25 (25%), max 3 (300%)
        const newZoom = Math.max(0.25, Math.min(3, zoom * delta));

        // Get mouse position relative to canvas
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate zoom point in canvas space
        const canvasX = (mouseX - viewOffset.x) / zoom;
        const canvasY = (mouseY - viewOffset.y) / zoom;

        // Update zoom
        setZoom(newZoom);

        // Adjust pan to keep mouse position stable
        setViewOffset({
          x: mouseX - canvasX * newZoom,
          y: mouseY - canvasY * newZoom,
        });
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => canvas.removeEventListener("wheel", handleWheel);
    }
  }, [zoom, viewOffset]);

  // Handlers
  const handleToolChange = useCallback((tool: ToolType) => {
    setActiveTool(tool);
    setSelectedElementIds([]);
    setSelectedConnectionId(null);
    setPendingConnection(null);
    setSelectionBox(null);
  }, []);

  const handleToggleGrid = useCallback(() => {
    setCurrentMap((prev) => ({
      ...prev,
      gridEnabled: !prev.gridEnabled,
      updatedAt: Date.now(),
    }));
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicked on canvas itself or the canvas content container
      const isCanvasBackground =
        e.target === e.currentTarget ||
        target.dataset?.canvasContent === "true";

      console.log("[DEBUG] handleCanvasClick:", {
        activeTool,
        isCanvasBackground,
        targetElement: target.tagName,
        targetDataset: target.dataset,
        currentTarget: e.currentTarget,
        target: e.target,
      });

      // Handle panning with hand tool or middle mouse button
      if (activeTool === "hand" || e.button === 1) {
        setIsPanning(true);
        setPanStart({
          x: e.clientX - viewOffset.x,
          y: e.clientY - viewOffset.y,
        });
        return;
      }

      // Handle element creation (only on canvas background)
      if (
        isCanvasBackground &&
        activeTool !== "select" &&
        activeTool !== "arrow" &&
        activeTool !== "line" &&
        activeTool !== "hand"
      ) {
        console.log("[DEBUG] Creating element:", { activeTool });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - viewOffset.x) / zoom;
        const y = (e.clientY - rect.top - viewOffset.y) / zoom;

        const snappedPos = snapPositionToGrid(
          { x, y },
          currentMap.gridEnabled,
          currentMap.gridSize
        );

        let newElement: IPowerElement;

        // Map shape tools to visual-section with specific shape
        if (activeTool === "circle") {
          newElement = createElement(
            "visual-section",
            snappedPos.x,
            snappedPos.y
          );
          // Shape is already 'circle' by default
        } else if (activeTool === "square") {
          const baseElement = createElement(
            "visual-section",
            snappedPos.x,
            snappedPos.y
          );
          newElement = {
            ...baseElement,
            shape: "rounded-square",
          } as IPowerElement;
        } else if (activeTool === "diamond") {
          const baseElement = createElement(
            "visual-section",
            snappedPos.x,
            snappedPos.y
          );
          newElement = { ...baseElement, shape: "diamond" } as IPowerElement;
        } else {
          newElement = createElement(
            activeTool as ElementType,
            snappedPos.x,
            snappedPos.y
          );
        }

        console.log("[DEBUG] Element created:", {
          elementId: newElement.id,
          type: newElement.type,
          position: { x: newElement.x, y: newElement.y },
          size: { width: newElement.width, height: newElement.height },
          content:
            newElement.type === "text"
              ? (newElement as any).content
              : undefined,
        });

        setCurrentMap((prev) => {
          const newMap = {
            ...prev,
            elements: [...prev.elements, newElement],
            updatedAt: Date.now(),
          };
          console.log("[DEBUG] Element added to map:", {
            elementId: newElement.id,
            totalElements: newMap.elements.length,
            elements: newMap.elements.map((e) => ({ id: e.id, type: e.type })),
          });
          return newMap;
        });

        setSelectedElementIds([newElement.id]);

        // Always switch to select tool after creating any element
        // This allows users to click outside to deselect and interact normally
        setActiveTool("select");
        return;
      }

      // Handle arrow/line creation (only on canvas background for arrow, on elements handled in handleElementClick)
      if (
        (activeTool === "arrow" || activeTool === "line") &&
        activeTool !== "hand"
      ) {
        if (pendingConnection) {
          // Second click: create arrow to coordinates
          if (activeTool === "arrow" && isCanvasBackground) {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - viewOffset.x) / zoom;
            const y = (e.clientY - rect.top - viewOffset.y) / zoom;

            const newConnection = createArrowConnection(
              pendingConnection.fromElementId,
              x,
              y
            );

            setCurrentMap((prev) => ({
              ...prev,
              connections: [...prev.connections, newConnection],
              updatedAt: Date.now(),
            }));

            setPendingConnection(null);
            setConnectionDraft(null);
            setActiveTool("select");
            return;
          }
        }
      }

      // Deselect if clicking on canvas background with select tool
      if (isCanvasBackground && activeTool === "select") {
        // If not holding shift, deselect all
        if (!e.shiftKey) {
          setSelectedElementIds([]);
          setSelectedConnectionId(null);
        }

        // Armazenar posição inicial para possível selection box (só cria se arrastar)
        if (!e.shiftKey) {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const rect = canvas.getBoundingClientRect();
          const x = (e.clientX - rect.left - viewOffset.x) / zoom;
          const y = (e.clientY - rect.top - viewOffset.y) / zoom;

          // Armazenar na ref, mas não criar selection box ainda
          selectionStartRef.current = { x, y };
        }
      }
    },
    [
      activeTool,
      viewOffset,
      zoom,
      currentMap.gridEnabled,
      currentMap.gridSize,
      pendingConnection,
    ]
  );

  const handleElementUpdate = useCallback(
    (id: string, updates: Partial<IPowerElement>) => {
      // Check if element should be deleted (empty text element)
      if (updates.content === "__DELETE__") {
        setCurrentMap((prev) => {
          const newMap = {
            ...prev,
            elements: prev.elements.filter((el) => el.id !== id),
            connections: prev.connections.filter(
              (conn) => conn.fromElementId !== id && conn.toElementId !== id
            ),
            updatedAt: Date.now(),
          };
          console.log(
            "[DEBUG] Element deleted, totalElements:",
            newMap.elements.length
          );
          return newMap;
        });
        setSelectedElementIds([]);
        return;
      }

      // If multiple elements are selected, apply updates to all of them
      if (selectedElementIds.length > 1 && selectedElementIds.includes(id)) {
        setCurrentMap((prev) => ({
          ...prev,
          elements: prev.elements.map((el) =>
            selectedElementIds.includes(el.id)
              ? { ...el, ...updates, updatedAt: Date.now() }
              : el
          ),
          updatedAt: Date.now(),
        }));
      } else {
        // Single element update
        setCurrentMap((prev) => ({
          ...prev,
          elements: prev.elements.map((el) =>
            el.id === id ? { ...el, ...updates, updatedAt: Date.now() } : el
          ),
          updatedAt: Date.now(),
        }));
      }
    },
    [selectedElementIds]
  );

  const handleElementPositionChange = useCallback(
    (id: string, x: number, y: number) => {
      // Snap is now handled in DraggableElementWrapper on mouseUp for smooth dragging
      handleElementUpdate(id, { x, y });
    },
    [handleElementUpdate]
  );

  // Helper function to calculate connection positions
  const calculateConnectionPositions = useCallback(
    (
      connection: IConnection,
      fromElement: IPowerElement | undefined,
      toElement: IPowerElement | undefined
    ): { x1: number; y1: number; x2: number; y2: number } | null => {
      if (!fromElement) return null;

      const x1 = fromElement.x + fromElement.width / 2;
      const y1 = fromElement.y + fromElement.height / 2;

      let x2: number;
      let y2: number;

      if (
        connection.type === "arrow" &&
        connection.toX !== undefined &&
        connection.toY !== undefined
      ) {
        // Arrow: free-form endpoint
        x2 = connection.toX;
        y2 = connection.toY;
      } else if (connection.type === "line" && toElement) {
        // Line: connected to another element
        x2 = toElement.x + toElement.width / 2;
        y2 = toElement.y + toElement.height / 2;
      } else {
        return null;
      }

      return { x1, y1, x2, y2 };
    },
    []
  );

  // Real-time drag callback (called during mousemove)
  const handleElementDragMove = useCallback(
    (id: string, x: number, y: number) => {
      setDragPositions((prev) => ({ ...prev, [id]: { x, y } }));

      // Update connections linked to this element in real-time
      const relatedConnections = currentMap.connections.filter(
        (conn) => conn.fromElementId === id || conn.toElementId === id
      );

      if (relatedConnections.length > 0) {
        const newTempPositions: Record<
          string,
          { x1: number; y1: number; x2: number; y2: number }
        > = {};

        relatedConnections.forEach((conn) => {
          // Get elements with temporary positions
          const fromElement = currentMap.elements.find(
            (el) => el.id === conn.fromElementId
          );
          const toElement = conn.toElementId
            ? currentMap.elements.find((el) => el.id === conn.toElementId)
            : undefined;

          if (!fromElement) return;

          // Create temp element data with dragged position
          const tempFromElement =
            conn.fromElementId === id ? { ...fromElement, x, y } : fromElement;

          const tempToElement =
            toElement && conn.toElementId === id
              ? { ...toElement, x, y }
              : toElement;

          const positions = calculateConnectionPositions(
            conn,
            tempFromElement,
            tempToElement
          );
          if (positions) {
            newTempPositions[conn.id] = positions;
          }
        });

        setTempConnectionPositions((prev) => ({
          ...prev,
          ...newTempPositions,
        }));
      }
    },
    [currentMap.connections, currentMap.elements, calculateConnectionPositions]
  );

  // Clear drag position when drag ends
  const handleElementDragEnd = useCallback(
    (id: string) => {
      setDragPositions((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      // Clear temp connection positions for this element
      const relatedConnections = currentMap.connections.filter(
        (conn) => conn.fromElementId === id || conn.toElementId === id
      );

      if (relatedConnections.length > 0) {
        setTempConnectionPositions((prev) => {
          const next = { ...prev };
          relatedConnections.forEach((conn) => {
            delete next[conn.id];
          });
          return next;
        });
      }
    },
    [currentMap.connections]
  );

  const handleMultipleElementsPositionChange = useCallback(
    (updates: Array<{ id: string; x: number; y: number }>) => {
      setCurrentMap((prev) => ({
        ...prev,
        elements: prev.elements.map((el) => {
          const update = updates.find((u) => u.id === el.id);
          return update
            ? { ...el, x: update.x, y: update.y, updatedAt: Date.now() }
            : el;
        }),
        updatedAt: Date.now(),
      }));
    },
    []
  );

  const handleMultipleElementsSizeChange = useCallback(
    (updates: Array<{ id: string; width: number; height: number }>) => {
      setCurrentMap((prev) => ({
        ...prev,
        elements: prev.elements.map((el) => {
          const update = updates.find((u) => u.id === el.id);
          return update
            ? {
                ...el,
                width: update.width,
                height: update.height,
                updatedAt: Date.now(),
              }
            : el;
        }),
        updatedAt: Date.now(),
      }));
    },
    []
  );

  // Real-time drag callback for multiple elements (called during mousemove)
  const handleMultipleElementsDragMove = useCallback(
    (updates: Array<{ id: string; x: number; y: number }>) => {
      // Update dragPositions for all elements
      const newDragPositions: Record<string, { x: number; y: number }> = {};
      updates.forEach((update) => {
        newDragPositions[update.id] = { x: update.x, y: update.y };
      });
      setDragPositions((prev) => ({ ...prev, ...newDragPositions }));

      // Update connections linked to these elements in real-time
      const elementIds = new Set(updates.map((u) => u.id));
      const relatedConnections = currentMap.connections.filter(
        (conn) =>
          elementIds.has(conn.fromElementId) ||
          (conn.toElementId && elementIds.has(conn.toElementId))
      );

      if (relatedConnections.length > 0) {
        const newTempPositions: Record<
          string,
          { x1: number; y1: number; x2: number; y2: number }
        > = {};

        relatedConnections.forEach((conn) => {
          // Get elements with temporary positions
          const fromElement = currentMap.elements.find(
            (el) => el.id === conn.fromElementId
          );
          const toElement = conn.toElementId
            ? currentMap.elements.find((el) => el.id === conn.toElementId)
            : undefined;

          if (!fromElement) return;

          // Create temp element data with dragged positions
          const fromUpdate = updates.find((u) => u.id === conn.fromElementId);
          const tempFromElement = fromUpdate
            ? { ...fromElement, x: fromUpdate.x, y: fromUpdate.y }
            : fromElement;

          const toUpdate = toElement
            ? updates.find((u) => u.id === conn.toElementId)
            : undefined;
          const tempToElement =
            toElement && toUpdate
              ? { ...toElement, x: toUpdate.x, y: toUpdate.y }
              : toElement;

          const positions = calculateConnectionPositions(
            conn,
            tempFromElement,
            tempToElement
          );
          if (positions) {
            newTempPositions[conn.id] = positions;
          }
        });

        setTempConnectionPositions((prev) => ({
          ...prev,
          ...newTempPositions,
        }));
      }
    },
    [currentMap.connections, currentMap.elements, calculateConnectionPositions]
  );

  // Clear drag positions when multi-element drag ends
  const handleMultipleElementsDragEnd = useCallback(() => {
    setDragPositions({});
    setTempConnectionPositions({});
  }, []);

  // Real-time resize callback (called during resize)
  const handleElementResizeMove = useCallback(
    (
      id: string,
      width: number,
      height: number,
      mode?: "diagonal" | "horizontal" | "vertical"
    ) => {
      // For text elements, no scaling - just update dimensions
      // Font size changes are handled via properties panel only
      setResizeSizes((prev) => ({ ...prev, [id]: { width, height } }));
    },
    []
  );

  // Clear resize size when resize ends
  const handleElementResizeEnd = useCallback((id: string) => {
    setResizeSizes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleElementClick = useCallback(
    (id: string, event?: { shiftKey?: boolean }) => {
      setSelectedConnectionId(null);

      // Handle multi-selection with Shift key
      if (event?.shiftKey) {
        setSelectedElementIds((prev) => {
          if (prev.includes(id)) {
            // Deselect if already selected
            return prev.filter((selectedId) => selectedId !== id);
          } else {
            // Add to selection
            return [...prev, id];
          }
        });
      } else {
        // Single selection (no shift)
        setSelectedElementIds([id]);
      }

      // Handle connection creation
      if (
        (activeTool === "arrow" || activeTool === "line") &&
        activeTool !== "hand"
      ) {
        if (pendingConnection) {
          // Second click: create line connection
          if (activeTool === "line") {
            const newConnection = createLineConnection(
              pendingConnection.fromElementId,
              id
            );

            setCurrentMap((prev) => ({
              ...prev,
              connections: [...prev.connections, newConnection],
              updatedAt: Date.now(),
            }));

            setPendingConnection(null);
            setConnectionDraft(null);
            setActiveTool("select");
          }
        } else {
          // First click: start connection
          setPendingConnection({
            type: activeTool,
            fromElementId: id,
          });

          // Start draft for visual feedback
          const element = currentMap.elements.find((el) => el.id === id);
          if (element) {
            setConnectionDraft({
              fromElementId: id,
              currentX: element.x + element.width / 2,
              currentY: element.y + element.height / 2,
            });
          }
        }
      }
    },
    [activeTool, pendingConnection]
  );

  const handleElementNavigate = useCallback(
    (element: IPowerElement) => {
      if (!element.canNavigate) return;

      // Check navigation depth - limit to 3 levels
      // Calculate current depth by traversing parentMapId chain
      let depth = 0;
      let current = currentMap;
      while (current.parentMapId && depth < 10) {
        const parent = maps.find((m) => m.id === current.parentMapId);
        if (!parent) break;
        depth++;
        current = parent;
      }

      // If already at depth 3, show warning and don't navigate
      if (depth >= 3) {
        // Show toast notification
        toast({
          title: "Limite de navegação atingido",
          description: "Você atingiu o limite máximo de 3 níveis de navegação.",
          variant: "destructive",
        });
        return;
      }

      // Create or navigate to submap
      if (element.submapId) {
        const submap = maps.find((m) => m.id === element.submapId);
        if (submap) {
          setCurrentMap(submap);
          setViewOffset({ x: 100, y: 100 });
        }
      } else {
        // Get name for the new area based on element type
        let defaultName = "Nova Área";

        if (element.type === "paragraph-block" && element.content) {
          defaultName =
            element.content.substring(0, 20) +
            (element.content.length > 20 ? "..." : "");
        } else if (element.type === "section-block" && element.title) {
          defaultName = element.title;
        } else if (element.type === "visual-section" && element.hoverTitle) {
          defaultName = element.hoverTitle;
        } else if (element.type === "text" && element.content) {
          // Use first 20 characters of text content
          defaultName =
            element.content.substring(0, 20) +
            (element.content.length > 20 ? "..." : "");
        }

        const newSubmap: IPowerMap = {
          id: `submap-${Date.now()}`,
          bookId: currentMap.bookId,
          name: defaultName,
          gridEnabled: currentMap.gridEnabled,
          gridSize: currentMap.gridSize,
          elements: [],
          connections: [],
          parentMapId: currentMap.id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        setMaps((prev) => [...prev, newSubmap]);
        handleElementUpdate(element.id, { submapId: newSubmap.id });
        setCurrentMap(newSubmap);
        setViewOffset({ x: 100, y: 100 });
      }
    },
    [maps, currentMap, handleElementUpdate]
  );

  // Arrow handle drag handlers
  const handleArrowHandleDragStart = useCallback(
    (connectionId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const connection = currentMap.connections.find(
        (c) => c.id === connectionId
      );
      if (!connection || connection.type !== "arrow") return;

      setDraggingArrowHandle({ connectionId });
      setSelectedConnectionId(connectionId);
    },
    [currentMap.connections]
  );

  const handleConnectionClick = useCallback((id: string) => {
    setSelectedConnectionId(id);
    setSelectedElementIds([]);
  }, []);

  const handleBreadcrumbNavigate = useCallback(
    (mapId: string) => {
      const map = maps.find((m) => m.id === mapId);
      if (map) {
        setCurrentMap(map);
        setViewOffset({ x: 100, y: 100 });
      }
    },
    [maps]
  );

  const handlePropertiesClose = useCallback(() => {
    setSelectedElementIds([]);
    setSelectedConnectionId(null);
  }, []);

  const handleTutorialNext = useCallback(() => {
    setTutorialStep((prev) =>
      Math.min(prev + 1, TUTORIAL_STEPS_CONSTANT.length - 1)
    );
  }, []);

  const handleTutorialPrev = useCallback(() => {
    setTutorialStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleTutorialClose = useCallback(() => {
    setShowTutorialDialog(false);
    setTutorialStep(0);
  }, []);

  const handleElementFirstInput = useCallback(() => {
    console.log(
      "[DEBUG] handleElementFirstInput - keeping text tool active to maintain focus"
    );
    // Don't change tool to prevent deselection and maintain textarea focus
    // User can manually switch to select tool by pressing 'V' or clicking elsewhere
  }, []);

  // Panning handlers
  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e: MouseEvent) => {
      setViewOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning, panStart]);

  // Connection draft handlers - update draft line position on mouse move
  useEffect(() => {
    if (!connectionDraft) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - viewOffset.x) / zoom;
      const y = (e.clientY - rect.top - viewOffset.y) / zoom;

      setConnectionDraft((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentX: x,
          currentY: y,
        };
      });
    };

    const handleMouseUp = () => {
      // Don't clear draft on mouse up - only when connection is completed or cancelled
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [connectionDraft, viewOffset, zoom]);

  // Arrow handle drag handlers
  useEffect(() => {
    if (!draggingArrowHandle) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - viewOffset.x) / zoom;
      const y = (e.clientY - rect.top - viewOffset.y) / zoom;

      // Atualizar posição temporária da conexão
      setCurrentMap((prev) => ({
        ...prev,
        connections: prev.connections.map((conn) =>
          conn.id === draggingArrowHandle.connectionId
            ? { ...conn, toX: x, toY: y }
            : conn
        ),
      }));
    };

    const handleMouseUp = () => {
      setDraggingArrowHandle(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingArrowHandle, viewOffset, zoom]);

  // Selection box handlers - sempre ativo para detectar arrasto
  useEffect(() => {
    const threshold = 5; // pixels mínimos para considerar arrasto

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - viewOffset.x) / zoom;
      const y = (e.clientY - rect.top - viewOffset.y) / zoom;

      // Se já tem selection box, atualizar posição
      if (selectionBox) {
        setSelectionBox((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            currentX: x,
            currentY: y,
          };
        });
      }
      // Se tem posição inicial mas ainda não tem selection box, verificar se deve criar
      else if (selectionStartRef.current) {
        const deltaX = Math.abs(x - selectionStartRef.current.x);
        const deltaY = Math.abs(y - selectionStartRef.current.y);

        // Se moveu mais que threshold, criar selection box
        if (deltaX > threshold || deltaY > threshold) {
          setSelectionBox({
            startX: selectionStartRef.current.x,
            startY: selectionStartRef.current.y,
            currentX: x,
            currentY: y,
          });
        }
      }
    };

    const handleMouseUp = () => {
      // Se tem selection box, finalizar seleção
      if (selectionBox) {
        // Calculate selection box bounds
        const minX = Math.min(selectionBox.startX, selectionBox.currentX);
        const minY = Math.min(selectionBox.startY, selectionBox.currentY);
        const maxX = Math.max(selectionBox.startX, selectionBox.currentX);
        const maxY = Math.max(selectionBox.startY, selectionBox.currentY);

        // Find elements within selection box
        const selectedElements = currentMap.elements.filter((element) => {
          const centerX = element.x + element.width / 2;
          const centerY = element.y + element.height / 2;
          return (
            centerX >= minX &&
            centerX <= maxX &&
            centerY >= minY &&
            centerY <= maxY
          );
        });

        // Select found elements
        if (selectedElements.length > 0) {
          setSelectedElementIds(selectedElements.map((el) => el.id));
        }

        setSelectionBox(null);
      }

      // Limpar ref de posição inicial
      selectionStartRef.current = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectionBox, viewOffset, zoom, currentMap.elements]);

  return (
    <PowerSystemView
      isHeaderHidden={isHeaderHidden}
      currentMap={currentMap}
      templates={templates}
      selectedElementIds={selectedElementIds}
      selectedConnectionId={selectedConnectionId}
      activeTool={activeTool}
      viewOffset={viewOffset}
      zoom={zoom}
      breadcrumbItems={breadcrumbItems}
      selectionBox={selectionBox}
      connectionDraft={connectionDraft}
      showHelpDialog={showHelpDialog}
      showTemplateDialog={showTemplateDialog}
      showTutorialDialog={showTutorialDialog}
      tutorialStep={tutorialStep}
      tutorialSteps={TUTORIAL_STEPS_CONSTANT}
      canvasRef={canvasRef}
      dragPositions={dragPositions}
      resizeSizes={resizeSizes}
      tempConnectionPositions={tempConnectionPositions}
      onToolChange={handleToolChange}
      onToggleGrid={handleToggleGrid}
      onCanvasClick={handleCanvasClick}
      onElementUpdate={handleElementUpdate}
      onElementPositionChange={handleElementPositionChange}
      onElementDragMove={handleElementDragMove}
      onElementDragEnd={handleElementDragEnd}
      onElementResizeMove={handleElementResizeMove}
      onElementResizeEnd={handleElementResizeEnd}
      onMultipleElementsPositionChange={handleMultipleElementsPositionChange}
      onMultipleElementsSizeChange={handleMultipleElementsSizeChange}
      onMultipleElementsDragMove={handleMultipleElementsDragMove}
      onMultipleElementsDragEnd={handleMultipleElementsDragEnd}
      onElementClick={handleElementClick}
      onElementNavigate={handleElementNavigate}
      onElementDelete={handleElementDelete}
      onElementDuplicate={handleElementDuplicate}
      onElementFirstInput={handleElementFirstInput}
      onConnectionClick={handleConnectionClick}
      onConnectionDelete={handleConnectionDelete}
      onArrowHandleDragStart={handleArrowHandleDragStart}
      onBreadcrumbNavigate={handleBreadcrumbNavigate}
      onPropertiesClose={handlePropertiesClose}
      onSetShowHelpDialog={setShowHelpDialog}
      onSetShowTemplateDialog={setShowTemplateDialog}
      onSetShowTutorialDialog={setShowTutorialDialog}
      onTutorialNext={handleTutorialNext}
      onTutorialPrev={handleTutorialPrev}
      onTutorialClose={handleTutorialClose}
      canUndo={historyIndex > 0}
      canRedo={historyIndex < history.length - 1}
      onUndo={handleUndo}
      onRedo={handleRedo}
    />
  );
}
