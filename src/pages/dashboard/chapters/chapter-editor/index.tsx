import { useState, useRef, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { mockEntities } from "@/mocks/local/editor-data";

import { ChapterEditorView } from "./view";

type ChapterStatus = "draft" | "in-progress" | "review" | "finished";

interface TextAnnotation {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
  type: "comment" | "link";
}

interface Comment {
  id: string;
  text: string;
  annotationId: string;
  timestamp: Date;
}

interface EntityLink {
  text: string;
  type: "character" | "location" | "item" | "organization" | "beast";
  entityId: string;
  annotationId: string;
}

interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
  status: ChapterStatus;
  summary: string;
  lastSaved: Date;
  annotations: TextAnnotation[];
  comments: Comment[];
  entityLinks: EntityLink[];
}

const statusConfig = {
  draft: { label: "Rascunho", color: "bg-muted" },
  "in-progress": { label: "Em andamento", color: "bg-blue-500" },
  review: { label: "Em revisão", color: "bg-yellow-500" },
  finished: { label: "Finalizado", color: "bg-green-500" },
};

export function ChapterEditor() {
  const { dashboardId, editorChaptersId } = useParams({
    from: "/dashboard/$dashboardId/chapter/editor-chapters/$editor-chaptersId",
  });
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState<Chapter>({
    id: editorChaptersId || "1",
    number: 1,
    title: "O Chamado da Aventura",
    content:
      "Era uma vez, em uma terra distante, vivia um jovem chamado João que sonhava em se tornar um grande aventureiro.",
    status: "draft",
    summary: "",
    lastSaved: new Date(),
    annotations: [],
    comments: [],
    entityLinks: [],
  });

  const [selectedText, setSelectedText] = useState("");
  const [selectedRange, setSelectedRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(
    null
  );
  const [showCommentSidebar, setShowCommentSidebar] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const isReadOnly =
    chapter.status === "finished" || chapter.status === "review";

  useEffect(() => {
    // Auto-save every 30 seconds
    const interval = setInterval(() => {
      if (chapter.content) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [chapter.content]);

  const handleAutoSave = () => {
    setIsAutoSaving(true);
    setTimeout(() => {
      setChapter((prev) => ({ ...prev, lastSaved: new Date() }));
      setIsAutoSaving(false);
      toast.success("Capítulo salvo automaticamente");
    }, 1000);
  };

  const handleSave = () => {
    handleAutoSave();
    toast.success("Capítulo salvo com sucesso!");
  };

  const handleBack = () => {
    navigate({
      to: "/dashboard/$dashboardId/chapters",
      params: { dashboardId: dashboardId! },
    });
  };

  const handleChapterTitleChange = (title: string) => {
    setChapter((prev) => ({ ...prev, title }));
  };

  const handleChapterStatusChange = (status: ChapterStatus) => {
    setChapter((prev) => ({ ...prev, status }));
  };

  const handleChapterSummaryChange = (summary: string) => {
    setChapter((prev) => ({ ...prev, summary }));
  };

  const handleShowSummaryModal = () => setShowSummaryModal(true);
  const handleHideSummaryModal = () => setShowSummaryModal(false);
  const handleShowLinkModal = () => setShowLinkModal(true);
  const handleHideLinkModal = () => setShowLinkModal(false);
  const handleShowCommentModal = () => setShowCommentModal(true);
  const handleHideCommentModal = () => setShowCommentModal(false);

  const execCommand = (command: string, value?: string) => {
    if (isReadOnly) return;
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() && selection.rangeCount > 0) {
      const text = selection.toString().trim();
      const range = selection.getRangeAt(0);

      // Calculate text offsets
      const containerText = editorRef.current?.textContent || "";
      const beforeRange = containerText.substring(
        0,
        containerText.indexOf(text)
      );
      const startOffset = beforeRange.length;
      const endOffset = startOffset + text.length;

      setSelectedText(text);
      setSelectedRange({ start: startOffset, end: endOffset });
    }
  };

  const addEntityLink = (entityType: string, entityId: string) => {
    if (!selectedText || !selectedRange) return;

    const annotationId = `annotation-${Date.now()}`;

    const newAnnotation: TextAnnotation = {
      id: annotationId,
      text: selectedText,
      startOffset: selectedRange.start,
      endOffset: selectedRange.end,
      type: "link",
    };

    const newLink: EntityLink = {
      text: selectedText,
      type: entityType as any,
      entityId,
      annotationId,
    };

    setChapter((prev) => ({
      ...prev,
      annotations: [...prev.annotations, newAnnotation],
      entityLinks: [...prev.entityLinks, newLink],
    }));

    setShowLinkModal(false);
    setSelectedText("");
    setSelectedRange(null);
    toast.success("Link adicionado com sucesso!");
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedText || !selectedRange) return;

    let annotationId = selectedAnnotation;

    // Create annotation if it doesn't exist
    if (!annotationId) {
      annotationId = `annotation-${Date.now()}`;
      const newAnnotation: TextAnnotation = {
        id: annotationId,
        text: selectedText,
        startOffset: selectedRange.start,
        endOffset: selectedRange.end,
        type: "comment",
      };

      setChapter((prev) => ({
        ...prev,
        annotations: [...prev.annotations, newAnnotation],
      }));
    }

    const comment: Comment = {
      id: String(Date.now()),
      text: newComment,
      annotationId,
      timestamp: new Date(),
    };

    setChapter((prev) => ({
      ...prev,
      comments: [...prev.comments, comment],
    }));

    setNewComment("");
    setShowCommentModal(false);
    setSelectedText("");
    setSelectedRange(null);
    setSelectedAnnotation(null);
    toast.success("Comentário adicionado!");
  };

  const addCommentToAnnotation = () => {
    if (!newComment.trim() || !selectedAnnotation) return;

    const comment: Comment = {
      id: String(Date.now()),
      text: newComment,
      annotationId: selectedAnnotation,
      timestamp: new Date(),
    };

    setChapter((prev) => ({
      ...prev,
      comments: [...prev.comments, comment],
    }));

    setNewComment("");
    toast.success("Comentário adicionado!");
  };

  const editComment = (commentId: string) => {
    const comment = chapter.comments.find((c) => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditCommentText(comment.text);
    }
  };

  const saveEditedComment = () => {
    if (!editCommentText.trim() || !editingComment) return;

    setChapter((prev) => ({
      ...prev,
      comments: prev.comments.map((comment) =>
        comment.id === editingComment
          ? { ...comment, text: editCommentText, timestamp: new Date() }
          : comment
      ),
    }));

    setEditingComment(null);
    setEditCommentText("");
    toast.success("Comentário editado!");
  };

  const deleteComment = (commentId: string) => {
    setChapter((prev) => ({
      ...prev,
      comments: prev.comments.filter((comment) => comment.id !== commentId),
    }));
    toast.success("Comentário excluído!");
  };

  const closeSidebar = () => {
    setShowCommentSidebar(false);
    setSelectedAnnotation(null);
    setEditingComment(null);
    setEditCommentText("");
    setNewComment("");
  };

  const handleNewCommentChange = (comment: string) => setNewComment(comment);
  const handleEditCommentTextChange = (text: string) =>
    setEditCommentText(text);
  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  const getAnnotationComments = (annotationId: string) =>
    chapter.comments.filter((comment) => comment.annotationId === annotationId);

  const getAnnotationLink = (annotationId: string) =>
    chapter.entityLinks.find((link) => link.annotationId === annotationId);

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("comment-badge")) {
      e.preventDefault();
      e.stopPropagation();
      const annotationId = target.getAttribute("data-annotation-id");
      setSelectedAnnotation(annotationId);
      setShowCommentSidebar(true);
    } else if (target.classList.contains("link-annotation")) {
      e.preventDefault();
      const entityType = target.getAttribute("data-entity-type");
      const entityId = target.getAttribute("data-entity-id");
      // Navigate to entity page
      navigate({
        to: "/$entityType/$entityId",
        params: { entityType, entityId },
      });
    }
  };

  const renderAnnotatedText = () => {
    if (!chapter.content) return [chapter.content];

    const { content } = chapter;
    const sortedAnnotations = [...chapter.annotations].sort(
      (a, b) => b.startOffset - a.startOffset
    );

    // For React rendering with proper tooltips
    let elements: (string | JSX.Element)[] = [content];

    sortedAnnotations.forEach((annotation, index) => {
      const newElements: (string | JSX.Element)[] = [];

      elements.forEach((element, elemIndex) => {
        if (typeof element === "string") {
          const beforeText = element.substring(0, annotation.startOffset);
          const annotatedText = element.substring(
            annotation.startOffset,
            annotation.endOffset
          );
          const afterText = element.substring(annotation.endOffset);

          if (annotation.type === "comment") {
            const comments = getAnnotationComments(annotation.id);
            const commentCount = comments.length;
            const isSelected =
              selectedAnnotation === annotation.id && showCommentSidebar;

            newElements.push(beforeText);
            newElements.push(
              <span
                key={`comment-${annotation.id}`}
                className="comment-annotation-wrapper"
                style={{ position: "relative", display: "inline" }}
              >
                <span
                  className="comment-text"
                  style={{
                    backgroundColor: isSelected
                      ? "rgba(59, 130, 246, 0.3)"
                      : "rgba(59, 130, 246, 0.1)",
                    borderRadius: "2px",
                    padding: "1px 2px",
                    transition: "background-color 0.2s",
                  }}
                >
                  {annotatedText}
                </span>
                <span
                  className="comment-badge"
                  data-annotation-id={annotation.id}
                  style={{
                    marginLeft: "4px",
                    background: isSelected ? "#1d4ed8" : "#3b82f6",
                    color: "white",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "9px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    cursor: "pointer",
                    verticalAlign: "super",
                    lineHeight: "1",
                    transition: "background-color 0.2s",
                  }}
                >
                  {commentCount}
                </span>
              </span>
            );
            newElements.push(afterText);
          } else if (annotation.type === "link") {
            const link = getAnnotationLink(annotation.id);
            if (link) {
              newElements.push(beforeText);
              newElements.push(
                <span
                  key={`link-${annotation.id}`}
                  className="link-annotation"
                  data-annotation-id={annotation.id}
                  data-entity-type={link.type}
                  data-entity-id={link.entityId}
                  style={{
                    color: "#059669",
                    backgroundColor: "rgba(5, 150, 105, 0.08)",
                    borderRadius: "2px",
                    padding: "1px 2px",
                    cursor: "pointer",
                    textDecoration: "none",
                    borderBottom: "1px solid #059669",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(5, 150, 105, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(5, 150, 105, 0.08)";
                  }}
                >
                  {annotatedText}
                </span>
              );
              newElements.push(afterText);
            }
          }
        } else {
          newElements.push(element);
        }
      });

      elements = newElements;
    });

    return elements;
  };

  const getWordCount = () => {
    const text = editorRef.current?.innerText || "";
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  return (
    <ChapterEditorView
      chapter={chapter}
      selectedText={selectedText}
      selectedAnnotation={selectedAnnotation}
      showLinkModal={showLinkModal}
      showCommentModal={showCommentModal}
      showSummaryModal={showSummaryModal}
      showCommentSidebar={showCommentSidebar}
      newComment={newComment}
      editingComment={editingComment}
      editCommentText={editCommentText}
      isAutoSaving={isAutoSaving}
      isReadOnly={isReadOnly}
      editorRef={editorRef}
      statusConfig={statusConfig}
      mockEntities={mockEntities}
      onBack={handleBack}
      onSave={handleSave}
      onChapterTitleChange={handleChapterTitleChange}
      onChapterStatusChange={handleChapterStatusChange}
      onChapterSummaryChange={handleChapterSummaryChange}
      onShowSummaryModal={handleShowSummaryModal}
      onHideSummaryModal={handleHideSummaryModal}
      onTextSelection={handleTextSelection}
      onShowLinkModal={handleShowLinkModal}
      onHideLinkModal={handleHideLinkModal}
      onShowCommentModal={handleShowCommentModal}
      onHideCommentModal={handleHideCommentModal}
      onExecCommand={execCommand}
      onAddEntityLink={addEntityLink}
      onAddComment={addComment}
      onAddCommentToAnnotation={addCommentToAnnotation}
      onEditComment={editComment}
      onSaveEditedComment={saveEditedComment}
      onDeleteComment={deleteComment}
      onCloseSidebar={closeSidebar}
      onNewCommentChange={handleNewCommentChange}
      onEditCommentTextChange={handleEditCommentTextChange}
      onCancelEditComment={handleCancelEditComment}
      onEditorClick={handleEditorClick}
      getWordCount={getWordCount}
      renderAnnotatedText={renderAnnotatedText}
      getAnnotationComments={getAnnotationComments}
    />
  );
}
