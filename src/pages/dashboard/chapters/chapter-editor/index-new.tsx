import { useState, useEffect, useCallback, useRef } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import {
  getChapterById,
  updateChapter as updateChapterInDB,
  getChapterNavigationDataByBookId,
} from "@/lib/db/chapters.service";
import {
  getPlotArcsByBookId,
  getPlotArcById,
  updatePlotArc,
} from "@/lib/db/plot.service";
import { useBookEditorSettingsStore } from "@/stores/book-editor-settings-store";
import { useChaptersStore } from "@/stores/chapters-store";
import type { IPlotArc } from "@/types/plot-types";

import { AllAnnotationsSidebar } from "./components/AllAnnotationsSidebar";
import { AnnotationsSidebar } from "./components/AnnotationsSidebar";
import { EditorHeader } from "./components/EditorHeader";
import { EditorSettingsModal } from "./components/EditorSettingsModal";
import { FormattingToolbar } from "./components/FormattingToolbar";
import { PlotArcEventsSidebar } from "./components/PlotArcEventsSidebar";
import { StatsBar } from "./components/StatsBar";
import { StatsDetailModal } from "./components/StatsDetailModal";
import { SummarySection } from "./components/SummarySection";
import { TextEditor, type TextEditorRef } from "./components/TextEditor";
import { useChapterMetrics } from "./hooks/useChapterMetrics";
import { useSessionTimer } from "./hooks/useSessionTimer";

import type { ChapterData, Annotation, AnnotationNote } from "./types";
import type { EditorSettings } from "./types/editor-settings";

function ChapterEditorContent() {
  const params = useParams({
    from: "/dashboard/$dashboardId/chapters/$editor-chapters-id",
  });
  const { dashboardId } = params;
  const editorChaptersId = params["editor-chapters-id"];
  const navigate = useNavigate();

  const {
    setCachedChapter,
    setCachedNavigationData,
    getChapter,
    getPreviousChapter,
    getNextChapter,
  } = useChaptersStore();

  const { getBookSettings, updateBookSettings } = useBookEditorSettingsStore();

  // Load chapter from store or create default
  const initialChapter = getChapter(editorChaptersId) || {
    id: editorChaptersId || "1",
    chapterNumber: "1",
    title: "Novo Capítulo",
    status: "draft" as const,
    plotArcId: undefined,
    summary: "",
    content: "",
    wordCount: 0,
    characterCount: 0,
    lastEdited: new Date().toISOString(),
    mentionedCharacters: [],
    mentionedRegions: [],
    mentionedItems: [],
    mentionedFactions: [],
    mentionedRaces: [],
    annotations: [],
  };

  // Chapter data state
  const [chapter, setChapter] = useState<ChapterData>(initialChapter);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [availableArcs, setAvailableArcs] = useState<IPlotArc[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Editor settings state (loaded from book-level settings)
  const [editorSettings, setEditorSettings] = useState<EditorSettings>(() =>
    getBookSettings(dashboardId)
  );

  // Annotation state
  const [selectedText, setSelectedText] = useState("");
  const [selectedRange, setSelectedRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<
    string | null
  >(null);
  const [showAnnotationsSidebar, setShowAnnotationsSidebar] = useState(false);
  const [showAllAnnotationsSidebar, setShowAllAnnotationsSidebar] =
    useState(false);
  const [scrollToAnnotation, setScrollToAnnotation] = useState<string | null>(
    null
  );

  // Plot Arc Events state
  const [showPlotArcEventsSidebar, setShowPlotArcEventsSidebar] =
    useState(false);
  const [currentPlotArc, setCurrentPlotArc] = useState<IPlotArc | null>(null);

  // Stats modal state
  const [showStatsDetailModal, setShowStatsDetailModal] = useState(false);

  // Session timer hook (GLOBAL - não reseta ao trocar de capítulo)
  const { sessionMinutes, sessionId: _sessionId } = useSessionTimer();

  // Calculate chapter metrics
  const metrics = useChapterMetrics({
    content: chapter.content,
    sessionDuration: sessionMinutes,
  });

  // Keep a ref to the latest chapter to avoid re-creating save functions
  const chapterRef = useRef(chapter);
  useEffect(() => {
    chapterRef.current = chapter;
  }, [chapter]);

  // Ref for TextEditor to access undo/redo
  const textEditorRef = useRef<TextEditorRef>(null);

  // Carrega dados de navegação uma única vez (apenas na montagem)
  // Isso popula o cache com dados mínimos de TODOS os capítulos do livro
  // Garantindo que as setas de navegação sempre funcionem
  useEffect(() => {
    const loadNavigationData = async () => {
      try {
        if (dashboardId) {
          const navData = await getChapterNavigationDataByBookId(dashboardId);
          setCachedNavigationData(navData);
        }
      } catch (error) {
        console.error(
          "[ChapterEditor] Erro ao carregar dados de navegação:",
          error
        );
      }
    };

    loadNavigationData();
    // Executa apenas uma vez na montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload chapter when editorChaptersId changes (navigation between chapters)
  useEffect(() => {
    const loadChapter = async () => {
      try {
        // Primeiro tenta do cache
        let loadedChapter = getChapter(editorChaptersId);

        // Se não estiver no cache, busca do banco
        if (!loadedChapter) {
          const chapterFromDB = await getChapterById(editorChaptersId);
          if (chapterFromDB) {
            loadedChapter = chapterFromDB;
            // Salva no cache
            setCachedChapter(chapterFromDB);
          }
        }

        if (loadedChapter) {
          setChapter(loadedChapter);
        }
        // Editor settings are loaded from book-level store, not from chapter
        // They persist across all chapters of the same book
      } catch (error) {
        console.error("[ChapterEditor] Erro ao carregar capítulo:", error);
      }
    };

    loadChapter();
  }, [editorChaptersId, getChapter, setCachedChapter]);

  // Handle settings change - updates both local state and book store
  const handleSettingsChange = useCallback(
    (newSettings: EditorSettings) => {
      setEditorSettings(newSettings);
      updateBookSettings(dashboardId, newSettings);
    },
    [dashboardId, updateBookSettings]
  );

  // Immediate/synchronous save (no setTimeout) - used when user is leaving
  const handleImmediateSave = useCallback(async () => {
    const currentChapter = chapterRef.current;

    // Calculate stats
    const trimmed = currentChapter.content.trim();
    const words = trimmed.split(/\s+/).filter((word) => word.length > 0).length;
    const chars = trimmed.replace(/\s+/g, "").length; // Without spaces
    const charsWithSpaces =
      currentChapter.content === "" || currentChapter.content === "\n"
        ? 0
        : currentChapter.content.length; // With spaces

    const now = new Date().toISOString();

    try {
      const updatedData = {
        ...currentChapter,
        wordCount: words,
        characterCount: chars,
        characterCountWithSpaces: charsWithSpaces,
        lastEdited: now,
      };

      // Update chapter in database
      await updateChapterInDB(currentChapter.id, updatedData);

      // Update cache
      setCachedChapter(updatedData);
    } catch (error) {
      console.error("[ChapterEditor] Erro ao salvar capítulo:", error);
    }
  }, [setCachedChapter]);

  // Auto-save with UI feedback (async with setTimeout)
  const handleAutoSave = useCallback(async () => {
    const currentChapter = chapterRef.current;

    setIsSaving(true);

    // Calculate stats
    const trimmed = currentChapter.content.trim();
    const words = trimmed.split(/\s+/).filter((word) => word.length > 0).length;
    const chars = trimmed.replace(/\s+/g, "").length; // Without spaces
    const charsWithSpaces =
      currentChapter.content === "" || currentChapter.content === "\n"
        ? 0
        : currentChapter.content.length; // With spaces

    const now = new Date().toISOString();

    try {
      const updatedData = {
        ...currentChapter,
        wordCount: words,
        characterCount: chars,
        characterCountWithSpaces: charsWithSpaces,
        lastEdited: now,
      };

      // Update chapter in database
      await updateChapterInDB(currentChapter.id, updatedData);

      // Update cache
      setCachedChapter(updatedData);

      setTimeout(() => {
        setChapter((prev) => ({
          ...prev,
          wordCount: words,
          characterCount: chars,
          characterCountWithSpaces: charsWithSpaces,
          lastEdited: now,
        }));
        setIsSaving(false);
      }, 500);
    } catch (error) {
      console.error("[ChapterEditor] Erro ao salvar capítulo:", error);
      setIsSaving(false);
    }
  }, [setCachedChapter]);

  // Load plot arcs
  useEffect(() => {
    const loadArcs = async () => {
      if (dashboardId) {
        try {
          const arcs = await getPlotArcsByBookId(dashboardId);
          setAvailableArcs(arcs);
        } catch (error) {
          console.error("Error loading arcs:", error);
        }
      }
    };
    loadArcs();
  }, [dashboardId]);

  // Load current plot arc when plotArcId changes
  useEffect(() => {
    const loadCurrentArc = async () => {
      if (chapter.plotArcId) {
        try {
          const arc = await getPlotArcById(chapter.plotArcId);
          setCurrentPlotArc(arc);
        } catch (error) {
          console.error("Error loading current arc:", error);
          setCurrentPlotArc(null);
        }
      } else {
        setCurrentPlotArc(null);
      }
    };
    loadCurrentArc();
  }, [chapter.plotArcId]);

  // Debounced auto-save (primary strategy - saves 2 seconds after user stops typing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleAutoSave();
    }, 2000); // 2 seconds after last change

    return () => clearTimeout(timeoutId);
  }, [
    chapter.content,
    chapter.summary,
    chapter.title,
    chapter.chapterNumber,
    chapter.status,
    chapter.plotArcId,
    chapter.annotations,
    chapter.mentionedCharacters,
    chapter.mentionedRegions,
    chapter.mentionedItems,
    chapter.mentionedFactions,
    chapter.mentionedRaces,
    handleAutoSave,
  ]);

  // Backup interval auto-save (saves every 3 minutes as backup)
  useEffect(() => {
    const interval = setInterval(() => {
      handleAutoSave();
    }, 180000); // Every 3 minutes

    return () => clearInterval(interval);
  }, [handleAutoSave]);

  // Save on window blur/beforeunload (protection against data loss)
  useEffect(() => {
    const handleBeforeUnload = (_e: BeforeUnloadEvent) => {
      // Always save immediately before unload (synchronous, no delay)
      handleImmediateSave();
    };

    const handleVisibilityChange = () => {
      // Save immediately when tab becomes hidden
      if (document.hidden) {
        handleImmediateSave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleImmediateSave]);

  const handleBack = () => {
    // Save immediately before navigating away
    handleImmediateSave();

    navigate({
      to: "/dashboard/$dashboardId/chapters",
      params: { dashboardId: dashboardId! },
    });
  };

  // Get previous and next chapters
  const previousChapter = getPreviousChapter(editorChaptersId);
  const nextChapter = getNextChapter(editorChaptersId);

  const handleNavigateToPrevious = () => {
    if (!previousChapter) return;

    // Save immediately before navigating
    handleImmediateSave();

    navigate({
      to: "/dashboard/$dashboardId/chapters/$editor-chapters-id",
      params: {
        dashboardId: dashboardId!,
        "editor-chapters-id": previousChapter.id,
      },
    });
  };

  const handleNavigateToNext = () => {
    if (!nextChapter) return;

    // Save immediately before navigating
    handleImmediateSave();

    navigate({
      to: "/dashboard/$dashboardId/chapters/$editor-chapters-id",
      params: {
        dashboardId: dashboardId!,
        "editor-chapters-id": nextChapter.id,
      },
    });
  };

  // Text selection handler
  const handleTextSelect = (
    text: string,
    startOffset: number,
    endOffset: number
  ) => {
    setSelectedText(text);
    setSelectedRange({ start: startOffset, end: endOffset });
  };

  // Create annotation
  const handleCreateAnnotation = () => {
    if (!selectedText || !selectedRange) return;

    // Check for overlapping annotations
    const overlappingAnnotations = chapter.annotations.filter(
      (ann) =>
        // Check if annotation overlaps with selected range
        (ann.startOffset >= selectedRange.start &&
          ann.startOffset < selectedRange.end) ||
        (ann.endOffset > selectedRange.start &&
          ann.endOffset <= selectedRange.end) ||
        (ann.startOffset <= selectedRange.start &&
          ann.endOffset >= selectedRange.end)
    );

    let mergedNotes: AnnotationNote[] = [];
    const annotationsToRemove: string[] = [];

    if (overlappingAnnotations.length > 0) {
      // Merge notes from all overlapping annotations
      overlappingAnnotations.forEach((ann) => {
        mergedNotes = [...mergedNotes, ...ann.notes];
        annotationsToRemove.push(ann.id);
      });
    }

    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      startOffset: selectedRange.start,
      endOffset: selectedRange.end,
      text: selectedText,
      notes: mergedNotes,
      createdAt: new Date().toISOString(),
    };

    setChapter((prev) => ({
      ...prev,
      annotations: [
        ...prev.annotations.filter((a) => !annotationsToRemove.includes(a.id)),
        newAnnotation,
      ],
    }));

    setSelectedAnnotationId(newAnnotation.id);
    setShowAnnotationsSidebar(true);
    setSelectedText("");
    setSelectedRange(null);
  };

  // Format text command
  const handleFormat = (command: string, value?: string) => {
    // Mark formatting changes as immediate undo points
    // These commands change text appearance and should create separate undo points
    const formattingCommands = [
      "bold",
      "italic",
      "underline",
      "justifyLeft",
      "justifyCenter",
      "justifyRight",
      "justifyFull",
    ];

    if (formattingCommands.includes(command)) {
      textEditorRef.current?.markNextAsImmediate();
    }

    document.execCommand(command, false, value);

    // Force format state update after execCommand
    // This ensures the formatting buttons reflect the new state immediately
    setTimeout(() => {
      // Dispatch a mouseup event to trigger format state update
      document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    }, 0);
  };

  // Cancel text selection
  const _handleCancelSelection = () => {
    setSelectedText("");
    setSelectedRange(null);
  };

  // Update annotations (called when text is modified)
  const handleUpdateAnnotations = (updatedAnnotations: Annotation[]) => {
    setChapter((prev) => ({
      ...prev,
      annotations: updatedAnnotations,
    }));
  };

  // Annotation click
  const handleAnnotationClick = (annotationId: string) => {
    // Close all annotations sidebar if open
    setShowAllAnnotationsSidebar(false);
    // Open specific annotation sidebar
    setSelectedAnnotationId(annotationId);
    setShowAnnotationsSidebar(true);
  };

  // Navigate to annotation
  const handleNavigateToAnnotation = (annotationId: string) => {
    // Close all annotations sidebar if open
    setShowAllAnnotationsSidebar(false);
    // Open specific annotation sidebar
    setSelectedAnnotationId(annotationId);
    setShowAnnotationsSidebar(true);
    // Scroll to annotation in editor
    setScrollToAnnotation(annotationId);
    // Clear scroll trigger after a short delay
    setTimeout(() => setScrollToAnnotation(null), 100);
  };

  // Add note to annotation
  const handleAddNote = (text: string, isImportant: boolean) => {
    if (!selectedAnnotationId) return;

    const now = new Date().toISOString();

    const newNote: AnnotationNote = {
      id: `note-${Date.now()}`,
      text,
      isImportant,
      createdAt: now,
      updatedAt: now,
    };

    setChapter((prev) => ({
      ...prev,
      annotations: prev.annotations.map((ann) =>
        ann.id === selectedAnnotationId
          ? { ...ann, notes: [...ann.notes, newNote] }
          : ann
      ),
    }));
  };

  // Edit note
  const handleEditNote = (noteId: string, text: string) => {
    if (!selectedAnnotationId) return;

    setChapter((prev) => ({
      ...prev,
      annotations: prev.annotations.map((ann) =>
        ann.id === selectedAnnotationId
          ? {
              ...ann,
              notes: ann.notes.map((note) =>
                note.id === noteId
                  ? { ...note, text, updatedAt: new Date().toISOString() }
                  : note
              ),
            }
          : ann
      ),
    }));
  };

  // Delete note
  const handleDeleteNote = (noteId: string) => {
    if (!selectedAnnotationId) return;

    setChapter((prev) => ({
      ...prev,
      annotations: prev.annotations.map((ann) =>
        ann.id === selectedAnnotationId
          ? { ...ann, notes: ann.notes.filter((note) => note.id !== noteId) }
          : ann
      ),
    }));

    // If annotation has no more notes, delete the annotation
    const annotation = chapter.annotations.find(
      (a) => a.id === selectedAnnotationId
    );
    if (annotation && annotation.notes.length === 1) {
      setChapter((prev) => ({
        ...prev,
        annotations: prev.annotations.filter(
          (a) => a.id !== selectedAnnotationId
        ),
      }));
      setShowAnnotationsSidebar(false);
      setSelectedAnnotationId(null);
    }
  };

  // Toggle note importance
  const handleToggleImportant = (noteId: string) => {
    if (!selectedAnnotationId) return;

    setChapter((prev) => ({
      ...prev,
      annotations: prev.annotations.map((ann) =>
        ann.id === selectedAnnotationId
          ? {
              ...ann,
              notes: ann.notes.map((note) =>
                note.id === noteId
                  ? {
                      ...note,
                      isImportant: !note.isImportant,
                      updatedAt: new Date().toISOString(),
                    }
                  : note
              ),
            }
          : ann
      ),
    }));
  };

  // Calculate stats
  const trimmedContent = chapter.content.trim();
  const _wordCount = trimmedContent
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const _characterCount = trimmedContent.replace(/\s+/g, "").length; // Without spaces
  // With spaces - counts ALL spaces, even if only spaces are typed. Only ignores the initial newline from contentEditable
  const _characterCountWithSpaces =
    chapter.content === "" || chapter.content === "\n"
      ? 0
      : chapter.content.length;

  const selectedAnnotation =
    chapter.annotations.find((a) => a.id === selectedAnnotationId) || null;

  // Plot arc events handlers
  const handleShowPlotArcEvents = () => {
    // Close other sidebars
    setShowAnnotationsSidebar(false);
    setSelectedAnnotationId(null);
    setShowAllAnnotationsSidebar(false);
    // Toggle plot arc events sidebar
    setShowPlotArcEventsSidebar(!showPlotArcEventsSidebar);
  };

  const handleToggleEventCompletion = async (eventId: string) => {
    if (!currentPlotArc) return;

    const updatedEvents = currentPlotArc.events.map((event) =>
      event.id === eventId ? { ...event, completed: !event.completed } : event
    );

    const completedCount = updatedEvents.filter((e) => e.completed).length;
    const progress =
      updatedEvents.length > 0
        ? (completedCount / updatedEvents.length) * 100
        : 0;

    try {
      await updatePlotArc(currentPlotArc.id, {
        events: updatedEvents,
        progress,
      });
      setCurrentPlotArc((prev) => {
        if (!prev) return prev;
        return { ...prev, events: updatedEvents, progress };
      });
    } catch (error) {
      console.error("Error updating event completion:", error);
    }
  };

  const hasSidebarOpen =
    showAnnotationsSidebar ||
    showAllAnnotationsSidebar ||
    showPlotArcEventsSidebar;

  return (
    <div className="h-full bg-background flex">
      {/* Main Content - Adjust width when sidebar is open */}
      <div
        className="flex-1 transition-all duration-300 flex flex-col overflow-hidden"
        style={{ marginRight: hasSidebarOpen ? "384px" : "0" }}
      >
        {/* Header */}
        <EditorHeader
          chapterNumber={chapter.chapterNumber}
          title={chapter.title}
          showAllAnnotationsSidebar={showAllAnnotationsSidebar}
          showPlotArcEventsSidebar={showPlotArcEventsSidebar}
          hasPlotArc={!!currentPlotArc}
          previousChapter={
            previousChapter
              ? {
                  id: previousChapter.id,
                  number: previousChapter.chapterNumber,
                  title: previousChapter.title,
                }
              : undefined
          }
          nextChapter={
            nextChapter
              ? {
                  id: nextChapter.id,
                  number: nextChapter.chapterNumber,
                  title: nextChapter.title,
                }
              : undefined
          }
          onBack={handleBack}
          onChapterNumberChange={(value) =>
            setChapter((prev) => ({ ...prev, chapterNumber: value }))
          }
          onTitleChange={(value) =>
            setChapter((prev) => ({ ...prev, title: value }))
          }
          onShowAllAnnotations={() => {
            // Close specific annotation sidebar if open
            setShowAnnotationsSidebar(false);
            setSelectedAnnotationId(null);
            // Close plot arc events sidebar
            setShowPlotArcEventsSidebar(false);
            // Toggle all annotations sidebar
            setShowAllAnnotationsSidebar(!showAllAnnotationsSidebar);
          }}
          onShowPlotArcEvents={handleShowPlotArcEvents}
          onShowSettings={() => setShowSettingsModal(true)}
          onNavigateToPrevious={handleNavigateToPrevious}
          onNavigateToNext={handleNavigateToNext}
        />

        {/* Formatting Toolbar */}
        <FormattingToolbar
          onFormat={handleFormat}
          status={chapter.status}
          onStatusChange={(status) =>
            setChapter((prev) => ({ ...prev, status }))
          }
          plotArcId={chapter.plotArcId}
          availableArcs={availableArcs}
          onPlotArcChange={(arcId) =>
            setChapter((prev) => ({ ...prev, plotArcId: arcId }))
          }
          onUndo={() => textEditorRef.current?.undo()}
          onRedo={() => textEditorRef.current?.redo()}
          canUndo={textEditorRef.current?.canUndo ?? false}
          canRedo={textEditorRef.current?.canRedo ?? false}
        />

        {/* Text Editor */}
        <div className="flex-1 overflow-hidden">
          <TextEditor
            ref={textEditorRef}
            content={chapter.content}
            annotations={chapter.annotations}
            selectedAnnotationId={selectedAnnotationId || undefined}
            fontSize={editorSettings.fontSize}
            fontFamily={editorSettings.fontFamily}
            settings={editorSettings}
            bookId={dashboardId}
            chapterId={editorChaptersId}
            summarySection={
              <SummarySection
                bookId={dashboardId!}
                summary={chapter.summary}
                mentionedCharacters={chapter.mentionedCharacters}
                mentionedRegions={chapter.mentionedRegions}
                mentionedItems={chapter.mentionedItems}
                mentionedFactions={chapter.mentionedFactions}
                mentionedRaces={chapter.mentionedRaces}
                onSummaryChange={(value) =>
                  setChapter((prev) => ({ ...prev, summary: value }))
                }
                onMentionedCharactersChange={(value) =>
                  setChapter((prev) => ({
                    ...prev,
                    mentionedCharacters: value,
                  }))
                }
                onMentionedRegionsChange={(value) =>
                  setChapter((prev) => ({ ...prev, mentionedRegions: value }))
                }
                onMentionedItemsChange={(value) =>
                  setChapter((prev) => ({ ...prev, mentionedItems: value }))
                }
                onMentionedFactionsChange={(value) =>
                  setChapter((prev) => ({ ...prev, mentionedFactions: value }))
                }
                onMentionedRacesChange={(value) =>
                  setChapter((prev) => ({ ...prev, mentionedRaces: value }))
                }
              />
            }
            onContentChange={(content) =>
              setChapter((prev) => ({ ...prev, content }))
            }
            onTextSelect={handleTextSelect}
            onAnnotationClick={handleAnnotationClick}
            onCreateAnnotation={handleCreateAnnotation}
            onUpdateAnnotations={handleUpdateAnnotations}
            scrollToAnnotation={scrollToAnnotation}
          />
        </div>
      </div>

      {/* Annotations Sidebar */}
      {showAnnotationsSidebar && (
        <AnnotationsSidebar
          annotation={selectedAnnotation}
          onClose={() => {
            // Delete annotation if it has no notes
            if (selectedAnnotationId) {
              const annotation = chapter.annotations.find(
                (a) => a.id === selectedAnnotationId
              );
              if (annotation && annotation.notes.length === 0) {
                setChapter((prev) => ({
                  ...prev,
                  annotations: prev.annotations.filter(
                    (a) => a.id !== selectedAnnotationId
                  ),
                }));
              }
            }
            setShowAnnotationsSidebar(false);
            setSelectedAnnotationId(null);
          }}
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
          onToggleImportant={handleToggleImportant}
          onNavigateToAnnotation={handleNavigateToAnnotation}
        />
      )}

      {/* All Annotations Sidebar */}
      {showAllAnnotationsSidebar && (
        <AllAnnotationsSidebar
          annotations={chapter.annotations}
          onClose={() => setShowAllAnnotationsSidebar(false)}
          onNavigateToAnnotation={handleNavigateToAnnotation}
        />
      )}

      {/* Plot Arc Events Sidebar */}
      {showPlotArcEventsSidebar && currentPlotArc && (
        <PlotArcEventsSidebar
          arc={currentPlotArc}
          onClose={() => setShowPlotArcEventsSidebar(false)}
          onToggleEventCompletion={handleToggleEventCompletion}
        />
      )}

      {/* Stats Bar */}
      <StatsBar
        metrics={metrics}
        isSaving={isSaving}
        onOpenDetails={() => setShowStatsDetailModal(true)}
      />

      {/* Editor Settings Modal */}
      <EditorSettingsModal
        open={showSettingsModal}
        onOpenChange={setShowSettingsModal}
        settings={editorSettings}
        onSettingsChange={handleSettingsChange}
      />

      {/* Stats Detail Modal */}
      <StatsDetailModal
        open={showStatsDetailModal}
        onOpenChange={setShowStatsDetailModal}
        metrics={metrics}
      />
    </div>
  );
}

export function ChapterEditorNew() {
  return <ChapterEditorContent />;
}
