import { useState, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { getPlotArcsByBookId } from "@/lib/db/plot.service";
import { useChaptersStore } from "@/stores/chapters-store";
import type { IPlotArc } from "@/types/plot-types";

import { AllAnnotationsSidebar } from "./components/AllAnnotationsSidebar";
import { AnnotationsSidebar } from "./components/AnnotationsSidebar";
import { CreateAnnotationPopup } from "./components/CreateAnnotationPopup";
import { EditorHeader } from "./components/EditorHeader";
import { FormattingToolbar } from "./components/FormattingToolbar";
import { StatsBar } from "./components/StatsBar";
import { SummarySection } from "./components/SummarySection";
import { TextEditor } from "./components/TextEditor";
import type { ChapterData, Annotation, AnnotationNote, EntityMention } from "./types";


export function ChapterEditorNew() {
  const params = useParams({
    from: "/dashboard/$dashboardId/chapters/$editor-chapters-id",
  });
  const dashboardId = params.dashboardId;
  const editorChaptersId = params["editor-chapters-id"];
  const navigate = useNavigate();

  const { getChapter, updateChapter } = useChaptersStore();

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

  // Annotation state
  const [selectedText, setSelectedText] = useState("");
  const [selectedRange, setSelectedRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [showAnnotationsSidebar, setShowAnnotationsSidebar] = useState(false);
  const [showAllAnnotationsSidebar, setShowAllAnnotationsSidebar] = useState(false);

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

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      handleAutoSave();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [chapter]);

  const handleAutoSave = () => {
    setIsSaving(true);

    // Calculate stats
    const trimmed = chapter.content.trim();
    const words = trimmed
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const chars = trimmed.replace(/\s+/g, '').length; // Without spaces

    const now = new Date().toISOString();

    // Update chapter in store
    updateChapter(chapter.id, {
      ...chapter,
      wordCount: words,
      characterCount: chars,
      lastEdited: now,
    });

    setTimeout(() => {
      setChapter((prev) => ({
        ...prev,
        wordCount: words,
        characterCount: chars,
        lastEdited: now
      }));
      setIsSaving(false);
    }, 500);
  };

  const handleSave = () => {
    handleAutoSave();
  };

  const handleBack = () => {
    navigate({
      to: "/dashboard/$dashboardId/chapters",
      params: { dashboardId: dashboardId! },
    });
  };

  // Text selection handler
  const handleTextSelect = (text: string, startOffset: number, endOffset: number) => {
    setSelectedText(text);
    setSelectedRange({ start: startOffset, end: endOffset });
  };

  // Create annotation
  const handleCreateAnnotation = () => {
    if (!selectedText || !selectedRange) return;

    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      startOffset: selectedRange.start,
      endOffset: selectedRange.end,
      text: selectedText,
      notes: [],
      createdAt: new Date().toISOString(),
    };

    setChapter((prev) => ({
      ...prev,
      annotations: [...prev.annotations, newAnnotation],
    }));

    setSelectedAnnotationId(newAnnotation.id);
    setShowAnnotationsSidebar(true);
    setSelectedText("");
    setSelectedRange(null);
  };

  // Format text command
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  // Cancel text selection
  const handleCancelSelection = () => {
    setSelectedText("");
    setSelectedRange(null);
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
    // TODO: Scroll to annotation in editor
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
    const annotation = chapter.annotations.find((a) => a.id === selectedAnnotationId);
    if (annotation && annotation.notes.length === 1) {
      setChapter((prev) => ({
        ...prev,
        annotations: prev.annotations.filter((a) => a.id !== selectedAnnotationId),
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
                  ? { ...note, isImportant: !note.isImportant, updatedAt: new Date().toISOString() }
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

  const characterCount = trimmedContent.replace(/\s+/g, '').length; // Without spaces
  // With spaces - counts ALL spaces, even if only spaces are typed. Only ignores the initial newline from contentEditable
  const characterCountWithSpaces = chapter.content === '' || chapter.content === '\n' ? 0 : chapter.content.length;

  const selectedAnnotation = chapter.annotations.find((a) => a.id === selectedAnnotationId) || null;

  const hasSidebarOpen = showAnnotationsSidebar || showAllAnnotationsSidebar;

  return (
    <div className="h-full bg-background flex">
      {/* Main Content - Adjust width when sidebar is open */}
      <div
        className="flex-1 transition-all duration-300 flex flex-col overflow-hidden"
        style={{ marginRight: hasSidebarOpen ? '384px' : '0' }}
      >
        {/* Header */}
        <EditorHeader
          chapterNumber={chapter.chapterNumber}
          title={chapter.title}
          isSaving={isSaving}
          showAllAnnotationsSidebar={showAllAnnotationsSidebar}
          onBack={handleBack}
          onSave={handleSave}
          onChapterNumberChange={(value) =>
            setChapter((prev) => ({ ...prev, chapterNumber: value }))
          }
          onTitleChange={(value) => setChapter((prev) => ({ ...prev, title: value }))}
          onShowAllAnnotations={() => {
            // Close specific annotation sidebar if open
            setShowAnnotationsSidebar(false);
            setSelectedAnnotationId(null);
            // Toggle all annotations sidebar
            setShowAllAnnotationsSidebar(!showAllAnnotationsSidebar);
          }}
        />

        {/* Formatting Toolbar */}
        <FormattingToolbar
          onFormat={handleFormat}
          onAnnotate={handleCreateAnnotation}
          hasSelection={!!selectedText}
          status={chapter.status}
          onStatusChange={(status) => setChapter((prev) => ({ ...prev, status }))}
          plotArcId={chapter.plotArcId}
          availableArcs={availableArcs}
          onPlotArcChange={(arcId) => setChapter((prev) => ({ ...prev, plotArcId: arcId }))}
        />

        {/* Text Editor */}
        <div className="flex-1 overflow-hidden">
          <TextEditor
            content={chapter.content}
            annotations={chapter.annotations}
            selectedAnnotationId={selectedAnnotationId || undefined}
            summarySection={
              <SummarySection
                bookId={dashboardId!}
                summary={chapter.summary}
                mentionedCharacters={chapter.mentionedCharacters}
                mentionedRegions={chapter.mentionedRegions}
                mentionedItems={chapter.mentionedItems}
                mentionedFactions={chapter.mentionedFactions}
                mentionedRaces={chapter.mentionedRaces}
                onSummaryChange={(value) => setChapter((prev) => ({ ...prev, summary: value }))}
                onMentionedCharactersChange={(value) =>
                  setChapter((prev) => ({ ...prev, mentionedCharacters: value }))
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
            onContentChange={(content) => setChapter((prev) => ({ ...prev, content }))}
            onTextSelect={handleTextSelect}
            onAnnotationClick={handleAnnotationClick}
          />
        </div>
      </div>

      {/* Annotations Sidebar */}
      {showAnnotationsSidebar && (
        <AnnotationsSidebar
          annotation={selectedAnnotation}
          onClose={() => {
            setShowAnnotationsSidebar(false);
            setSelectedAnnotationId(null);
          }}
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
          onToggleImportant={handleToggleImportant}
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

      {/* Stats Bar */}
      <StatsBar
        wordCount={wordCount}
        characterCount={characterCount}
        characterCountWithSpaces={characterCountWithSpaces}
      />
    </div>
  );
}
