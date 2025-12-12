import React from "react";

import {
  ArrowLeft,
  Save,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link,
  MessageCircle,
  Palette,
  Type,
  Plus,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ChapterStatus = "draft" | "in-progress" | "review" | "finished";

interface ChapterEditorViewProps {
  chapter: any;
  selectedText: string;
  selectedAnnotation: string | null;
  showLinkModal: boolean;
  showCommentModal: boolean;
  showSummaryModal: boolean;
  showCommentSidebar: boolean;
  newComment: string;
  editingComment: string | null;
  editCommentText: string;
  isAutoSaving: boolean;
  isReadOnly: boolean;
  editorRef: React.RefObject<HTMLDivElement>;
  statusConfig: Record<ChapterStatus, { label: string; color: string }>;
  mockEntities: Record<string, string[]>;
  onBack: () => void;
  onSave: () => void;
  onChapterTitleChange: (title: string) => void;
  onChapterStatusChange: (status: ChapterStatus) => void;
  onChapterSummaryChange: (summary: string) => void;
  onShowSummaryModal: () => void;
  onHideSummaryModal: () => void;
  onTextSelection: () => void;
  onShowLinkModal: () => void;
  onHideLinkModal: () => void;
  onShowCommentModal: () => void;
  onHideCommentModal: () => void;
  onExecCommand: (command: string, value?: string) => void;
  onAddEntityLink: (entityType: string, entityId: string) => void;
  onAddComment: () => void;
  onAddCommentToAnnotation: () => void;
  onEditComment: (commentId: string) => void;
  onSaveEditedComment: () => void;
  onDeleteComment: (commentId: string) => void;
  onCloseSidebar: () => void;
  onNewCommentChange: (comment: string) => void;
  onEditCommentTextChange: (text: string) => void;
  onCancelEditComment: () => void;
  onEditorClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  getWordCount: () => number;
  renderAnnotatedText: () => (string | JSX.Element)[];
  getAnnotationComments: (annotationId: string) => any[];
}

export function ChapterEditorView({
  chapter,
  selectedText,
  selectedAnnotation,
  showLinkModal,
  showCommentModal,
  showSummaryModal,
  showCommentSidebar,
  newComment,
  editingComment,
  editCommentText,
  isAutoSaving,
  isReadOnly,
  editorRef,
  statusConfig,
  mockEntities,
  onBack,
  onSave,
  onChapterTitleChange,
  onChapterStatusChange,
  onChapterSummaryChange,
  onShowSummaryModal,
  onHideSummaryModal,
  onTextSelection,
  onShowLinkModal,
  onHideLinkModal,
  onShowCommentModal,
  onHideCommentModal,
  onExecCommand,
  onAddEntityLink,
  onAddComment,
  onAddCommentToAnnotation,
  onEditComment,
  onSaveEditedComment,
  onDeleteComment,
  onCloseSidebar,
  onNewCommentChange,
  onEditCommentTextChange,
  onCancelEditComment,
  onEditorClick,
  getWordCount,
  renderAnnotatedText,
  getAnnotationComments,
}: ChapterEditorViewProps) {
  const { t } = useTranslation([
    "forms",
    "chapter-editor",
    "chapters",
    "common",
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-muted"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <Input
                  value={chapter.title}
                  onChange={(e) => onChapterTitleChange(e.target.value)}
                  className="text-lg font-semibold border-0 p-0 h-auto bg-transparent"
                  disabled={isReadOnly}
                />
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={statusConfig[chapter.status].color}>
                    {statusConfig[chapter.status].label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {t("chapter-editor:toolbar.word_count", {
                      count: getWordCount(),
                    })}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {t("chapter-editor:toolbar.comments_count", {
                      count: chapter.comments.length,
                    })}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {t("chapter-editor:toolbar.links_count", {
                      count: chapter.entityLinks.length,
                    })}
                  </Badge>
                  {isAutoSaving && (
                    <span className="text-sm text-muted-foreground">
                      {t("common:actions.saving")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onShowSummaryModal}>
                <FileText className="w-4 h-4 mr-2" />
                {t("chapter-editor:toolbar.summary_button")}
              </Button>

              <Select
                value={chapter.status}
                onValueChange={(value: ChapterStatus) =>
                  onChapterStatusChange(value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    {t("chapters:status.draft")}
                  </SelectItem>
                  <SelectItem value="in-progress">
                    {t("chapters:status.in_progress")}
                  </SelectItem>
                  <SelectItem value="review">
                    {t("chapters:status.review")}
                  </SelectItem>
                  <SelectItem value="finished">
                    {t("chapters:status.finished")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={onSave} className="btn-magical">
                <Save className="w-4 h-4 mr-2" />
                {t("common:actions.save")}
              </Button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        {!isReadOnly && (
          <>
            <Separator />
            <div className="px-6 py-2">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Format buttons */}
                <ToggleGroup type="multiple" className="mr-2">
                  <ToggleGroupItem
                    value="bold"
                    onClick={() => onExecCommand("bold")}
                    aria-label={t("chapter-editor:formatting.bold_aria_label")}
                  >
                    <Bold className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="italic"
                    onClick={() => onExecCommand("italic")}
                    aria-label={t(
                      "chapter-editor:formatting.italic_aria_label"
                    )}
                  >
                    <Italic className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="underline"
                    onClick={() => onExecCommand("underline")}
                    aria-label={t(
                      "chapter-editor:formatting.underline_aria_label"
                    )}
                  >
                    <Underline className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>

                <Separator orientation="vertical" className="h-6" />

                {/* Alignment */}
                <ToggleGroup type="single" className="mr-2">
                  <ToggleGroupItem
                    value="left"
                    onClick={() => onExecCommand("justifyLeft")}
                    aria-label={t(
                      "chapter-editor:formatting.align_left_aria_label"
                    )}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="center"
                    onClick={() => onExecCommand("justifyCenter")}
                    aria-label={t(
                      "chapter-editor:formatting.align_center_aria_label"
                    )}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="right"
                    onClick={() => onExecCommand("justifyRight")}
                    aria-label={t(
                      "chapter-editor:formatting.align_right_aria_label"
                    )}
                  >
                    <AlignRight className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="justify"
                    onClick={() => onExecCommand("justifyFull")}
                    aria-label={t(
                      "chapter-editor:formatting.justify_aria_label"
                    )}
                  >
                    <AlignJustify className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>

                <Separator orientation="vertical" className="h-6" />

                {/* Lists */}
                <ToggleGroup type="single" className="mr-2">
                  <ToggleGroupItem
                    value="ul"
                    onClick={() => onExecCommand("insertUnorderedList")}
                    aria-label={t(
                      "chapter-editor:formatting.unordered_list_aria_label"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="ol"
                    onClick={() => onExecCommand("insertOrderedList")}
                    aria-label={t(
                      "chapter-editor:formatting.ordered_list_aria_label"
                    )}
                  >
                    <ListOrdered className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>

                <Separator orientation="vertical" className="h-6" />

                {/* Font Size */}
                <Select
                  onValueChange={(value) => onExecCommand("fontSize", value)}
                >
                  <SelectTrigger className="w-20">
                    <Type className="w-4 h-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">8pt</SelectItem>
                    <SelectItem value="2">10pt</SelectItem>
                    <SelectItem value="3">12pt</SelectItem>
                    <SelectItem value="4">14pt</SelectItem>
                    <SelectItem value="5">18pt</SelectItem>
                    <SelectItem value="6">24pt</SelectItem>
                    <SelectItem value="7">36pt</SelectItem>
                  </SelectContent>
                </Select>

                {/* Font Color */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Palette className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="grid grid-cols-6 gap-1">
                      {[
                        "#000000",
                        "#FF0000",
                        "#00FF00",
                        "#0000FF",
                        "#FFFF00",
                        "#FF00FF",
                        "#00FFFF",
                        "#FFA500",
                        "#800080",
                        "#FFC0CB",
                        "#A52A2A",
                        "#808080",
                      ].map((color) => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => onExecCommand("foreColor", color)}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Quote */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExecCommand("formatBlock", "blockquote")}
                >
                  <Quote className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Selected Text Actions */}
        {selectedText && (
          <>
            <Separator />
            <div className="px-6 py-2 bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t("chapter-editor:toolbar.selected_text", { selectedText })}
                </span>
                <Button variant="outline" size="sm" onClick={onShowLinkModal}>
                  <Link className="w-4 h-4 mr-1" />
                  {t("chapter-editor:link.link_button")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowCommentModal}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {t("chapter-editor:toolbar.comment_button")}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex">
        {/* Main Editor */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div
              ref={editorRef}
              contentEditable={!isReadOnly}
              className={`min-h-[500px] p-6 bg-card border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                isReadOnly ? "bg-muted/30" : ""
              }`}
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                fontFamily: "Georgia, serif",
              }}
              onMouseUp={onTextSelection}
              onKeyUp={onTextSelection}
              onClick={onEditorClick}
            >
              {renderAnnotatedText()}
            </div>
          </div>
        </div>

        {/* Comments Sidebar - Only when annotation is selected */}
        {showCommentSidebar && selectedAnnotation && (
          <div className="w-80 border-l border-border p-4 bg-muted/20">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">
                  {t("chapter-editor:comments.comments_label")}
                </h3>
                <Button variant="ghost" size="sm" onClick={onCloseSidebar}>
                  ✕
                </Button>
              </div>

              <div className="space-y-3 mb-4">
                {getAnnotationComments(selectedAnnotation).map((comment) => (
                  <Card key={comment.id} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        {editingComment === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editCommentText}
                              onChange={(e) =>
                                onEditCommentTextChange(e.target.value)
                              }
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={onSaveEditedComment}>
                                {t("common:actions.save")}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={onCancelEditComment}
                              >
                                {t("common:actions.cancel")}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm">{comment.text}</p>
                        )}
                      </div>

                      {editingComment !== comment.id && (
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEditComment(comment.id)}
                            className="p-1 h-6 w-6"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteComment(comment.id)}
                            className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {comment.timestamp.toLocaleString()}
                    </p>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => onNewCommentChange(e.target.value)}
                  placeholder={t("forms:placeholders.add_comment")}
                  rows={3}
                />
                <Button
                  onClick={onAddCommentToAnnotation}
                  size="sm"
                  className="w-full"
                  disabled={!newComment.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("chapter-editor:comments.add_comment")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>
                {t("chapter-editor:link.create_link_with_text", {
                  selectedText,
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(mockEntities).map(([type, entities]) => (
                <div key={type}>
                  <h4 className="font-medium mb-2 capitalize">{type}</h4>
                  <div className="grid gap-2">
                    {entities.map((entity) => (
                      <Button
                        key={entity}
                        variant="outline"
                        size="sm"
                        onClick={() => onAddEntityLink(type, entity)}
                        className="justify-start"
                      >
                        {entity}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={onHideLinkModal}>
                {t("common:actions.cancel")}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>{t("chapter-editor:comments.add_comment")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => onNewCommentChange(e.target.value)}
                placeholder={t("forms:placeholders.type_your_comment")}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={onAddComment} className="flex-1">
                  {t("common:actions.add")}
                </Button>
                <Button variant="outline" onClick={onHideCommentModal}>
                  {t("common:actions.cancel")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[600px]">
            <CardHeader>
              <CardTitle>
                {t("chapter-editor:toolbar.summary_modal_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={chapter.summary}
                onChange={(e) => onChapterSummaryChange(e.target.value)}
                placeholder={t("forms:placeholders.chapter_summary")}
                rows={6}
                disabled={isReadOnly}
              />
              <div className="flex gap-2">
                <Button onClick={onHideSummaryModal} className="flex-1">
                  {t("chapter-editor:toolbar.close_button")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
