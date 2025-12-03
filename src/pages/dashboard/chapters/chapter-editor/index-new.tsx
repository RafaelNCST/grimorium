import { useState, useEffect, useCallback, useRef } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { getPlotArcsByBookId } from "@/lib/db/plot.service";
import { useChaptersStore } from "@/stores/chapters-store";
import type { IPlotArc } from "@/types/plot-types";

import { AllAnnotationsSidebar } from "./components/AllAnnotationsSidebar";
import { AnnotationsSidebar } from "./components/AnnotationsSidebar";
import { CreateAnnotationPopup } from "./components/CreateAnnotationPopup";
import { EditorHeader } from "./components/EditorHeader";
import { EditorSettingsModal } from "./components/EditorSettingsModal";
import { FormattingToolbar } from "./components/FormattingToolbar";
import { GoalsAndLimitsModal } from "./components/GoalsAndLimitsModal";
import { StatsBar } from "./components/StatsBar";
import { StatsDetailModal } from "./components/StatsDetailModal";
import { SummarySection } from "./components/SummarySection";
import { TextEditor, type TextEditorRef } from "./components/TextEditor";
import { WarningsSidebar } from "./components/WarningsSidebar";
import { WarningsProvider, useWarnings } from "./context/WarningsContext";
import { useChapterMetrics } from "./hooks/useChapterMetrics";
import { useGoalsAndLimitsMonitor } from "./hooks/useGoalsAndLimitsMonitor";
import { useSessionTimer } from "./hooks/useSessionTimer";
import { DEFAULT_EDITOR_SETTINGS } from "./types/editor-settings";
import {
  DEFAULT_CHAPTER_GOALS,
  DEFAULT_CHAPTER_LIMITS,
  type ChapterGoals,
  type ChapterLimits,
} from "./types/goals-and-limits";

import type {
  ChapterData,
  Annotation,
  AnnotationNote,
  EntityMention,
} from "./types";
import type { EditorSettings } from "./types/editor-settings";

function ChapterEditorContent() {
  const params = useParams({
    from: "/dashboard/$dashboardId/chapters/$editor-chapters-id",
  });
  const { dashboardId } = params;
  const editorChaptersId = params["editor-chapters-id"];
  const navigate = useNavigate();

  const { getChapter, updateChapter, getPreviousChapter, getNextChapter } =
    useChaptersStore();

  const { stats: warningStats, setShowWarningToasts } = useWarnings();

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

  // Editor settings state (includes fontSize and fontFamily now)
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    ...DEFAULT_EDITOR_SETTINGS,
    fontSize: initialChapter.fontSize || DEFAULT_EDITOR_SETTINGS.fontSize,
    fontFamily: initialChapter.fontFamily || DEFAULT_EDITOR_SETTINGS.fontFamily,
  });

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

  // Warnings state
  const [showWarningsSidebar, setShowWarningsSidebar] = useState(false);

  // Goals and Limits state
  const [goals, setGoals] = useState<ChapterGoals>(DEFAULT_CHAPTER_GOALS);
  const [limits, setLimits] = useState<ChapterLimits>(DEFAULT_CHAPTER_LIMITS);
  const [showGoalsAndLimitsModal, setShowGoalsAndLimitsModal] = useState(false);
  const [showStatsDetailModal, setShowStatsDetailModal] = useState(false);

  // Session timer hook
  const { sessionMinutes } = useSessionTimer();

  // Calculate chapter metrics
  const metrics = useChapterMetrics({
    content: chapter.content,
    sessionDuration: sessionMinutes,
  });

  // Monitor goals and limits
  const { addWarning } = useWarnings();
  useGoalsAndLimitsMonitor({
    metrics,
    goals,
    limits,
    onWarning: (type, severity, title, message) => {
      addWarning(type, severity, title, message);
    },
  });

  // Sync showWarningToasts setting with warnings context
  useEffect(() => {
    setShowWarningToasts(editorSettings.showWarningToasts);
  }, [editorSettings.showWarningToasts, setShowWarningToasts]);

  // Keep a ref to the latest chapter to avoid re-creating save functions
  const chapterRef = useRef(chapter);
  useEffect(() => {
    chapterRef.current = chapter;
  }, [chapter]);

  // Ref for TextEditor to access undo/redo
  const textEditorRef = useRef<TextEditorRef>(null);

  // Reload chapter when editorChaptersId changes (navigation between chapters)
  useEffect(() => {
    const loadedChapter = getChapter(editorChaptersId);
    if (loadedChapter) {
      setChapter(loadedChapter);
      // Load chapter-specific formatting settings into editor settings
      setEditorSettings((prev) => ({
        ...prev,
        fontSize: loadedChapter.fontSize || DEFAULT_EDITOR_SETTINGS.fontSize,
        fontFamily:
          loadedChapter.fontFamily || DEFAULT_EDITOR_SETTINGS.fontFamily,
      }));
    }
  }, [editorChaptersId, getChapter]);

  // Immediate/synchronous save (no setTimeout) - used when user is leaving
  const handleImmediateSave = useCallback(() => {
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

    // Update chapter in store immediately (synchronous)
    updateChapter(currentChapter.id, {
      ...currentChapter,
      wordCount: words,
      characterCount: chars,
      characterCountWithSpaces: charsWithSpaces,
      fontSize: editorSettings.fontSize,
      fontFamily: editorSettings.fontFamily,
      lastEdited: now,
    });
  }, [updateChapter, editorSettings.fontSize, editorSettings.fontFamily]);

  // Auto-save with UI feedback (async with setTimeout)
  const handleAutoSave = useCallback(() => {
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

    // Update chapter in store
    updateChapter(currentChapter.id, {
      ...currentChapter,
      wordCount: words,
      characterCount: chars,
      characterCountWithSpaces: charsWithSpaces,
      fontSize: editorSettings.fontSize,
      fontFamily: editorSettings.fontFamily,
      lastEdited: now,
    });

    setTimeout(() => {
      setChapter((prev) => ({
        ...prev,
        wordCount: words,
        characterCount: chars,
        characterCountWithSpaces: charsWithSpaces,
        fontSize: editorSettings.fontSize,
        fontFamily: editorSettings.fontFamily,
        lastEdited: now,
      }));
      setIsSaving(false);
    }, 500);
  }, [updateChapter, editorSettings.fontSize, editorSettings.fontFamily]);

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
    editorSettings.fontSize,
    editorSettings.fontFamily,
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
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
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

  // Save goals and limits
  const handleSaveGoalsAndLimits = (
    newGoals: ChapterGoals,
    newLimits: ChapterLimits
  ) => {
    setGoals(newGoals);
    setLimits(newLimits);
    // TODO: Persist to database/localStorage if needed
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
  const handleCancelSelection = () => {
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
  const wordCount = trimmedContent
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const characterCount = trimmedContent.replace(/\s+/g, "").length; // Without spaces
  // With spaces - counts ALL spaces, even if only spaces are typed. Only ignores the initial newline from contentEditable
  const characterCountWithSpaces =
    chapter.content === "" || chapter.content === "\n"
      ? 0
      : chapter.content.length;

  const selectedAnnotation =
    chapter.annotations.find((a) => a.id === selectedAnnotationId) || null;

  const hasSidebarOpen = showAnnotationsSidebar || showAllAnnotationsSidebar || showWarningsSidebar;

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
          showWarningsSidebar={showWarningsSidebar}
          showGoalsAndLimitsModal={showGoalsAndLimitsModal}
          warningsCount={warningStats.total}
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
            // Close warnings sidebar
            setShowWarningsSidebar(false);
            // Toggle all annotations sidebar
            setShowAllAnnotationsSidebar(!showAllAnnotationsSidebar);
          }}
          onShowWarnings={() => {
            // Close annotation sidebars if open
            setShowAnnotationsSidebar(false);
            setSelectedAnnotationId(null);
            setShowAllAnnotationsSidebar(false);
            // Toggle warnings sidebar
            setShowWarningsSidebar(!showWarningsSidebar);
          }}
          onShowSettings={() => setShowSettingsModal(true)}
          onShowGoalsAndLimits={() => setShowGoalsAndLimitsModal(true)}
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

      {/* Warnings Sidebar */}
      <WarningsSidebar
        isOpen={showWarningsSidebar}
        onClose={() => setShowWarningsSidebar(false)}
      />

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
        onSettingsChange={setEditorSettings}
      />

      {/* Goals and Limits Modal */}
      <GoalsAndLimitsModal
        open={showGoalsAndLimitsModal}
        onOpenChange={setShowGoalsAndLimitsModal}
        goals={goals}
        limits={limits}
        onSave={handleSaveGoalsAndLimits}
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
  return (
    <WarningsProvider showWarningToasts={true}>
      <ChapterEditorContent />
    </WarningsProvider>
  );
}
