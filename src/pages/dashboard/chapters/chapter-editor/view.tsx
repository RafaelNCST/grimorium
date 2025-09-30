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

import { LinkTooltip } from "@/components/link-tooltip";
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
                    {getWordCount()} palavras
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {chapter.comments.length} comentários
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {chapter.entityLinks.length} links
                  </Badge>
                  {isAutoSaving && (
                    <span className="text-sm text-muted-foreground">
                      Salvando...
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onShowSummaryModal}>
                <FileText className="w-4 h-4 mr-2" />
                Resumo
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
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="in-progress">Em andamento</SelectItem>
                  <SelectItem value="review">Em revisão</SelectItem>
                  <SelectItem value="finished">Finalizado</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={onSave} className="btn-magical">
                <Save className="w-4 h-4 mr-2" />
                Salvar
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
                    aria-label="Negrito"
                  >
                    <Bold className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="italic"
                    onClick={() => onExecCommand("italic")}
                    aria-label="Itálico"
                  >
                    <Italic className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="underline"
                    onClick={() => onExecCommand("underline")}
                    aria-label="Sublinhado"
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
                    aria-label="Alinhar à esquerda"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="center"
                    onClick={() => onExecCommand("justifyCenter")}
                    aria-label="Centralizar"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="right"
                    onClick={() => onExecCommand("justifyRight")}
                    aria-label="Alinhar à direita"
                  >
                    <AlignRight className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="justify"
                    onClick={() => onExecCommand("justifyFull")}
                    aria-label="Justificar"
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
                    aria-label="Lista com marcadores"
                  >
                    <List className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="ol"
                    onClick={() => onExecCommand("insertOrderedList")}
                    aria-label="Lista numerada"
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
                  Texto selecionado: "{selectedText}"
                </span>
                <Button variant="outline" size="sm" onClick={onShowLinkModal}>
                  <Link className="w-4 h-4 mr-1" />
                  Linkar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowCommentModal}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Comentar
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
                <h3 className="font-semibold">Comentários</h3>
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
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={onCancelEditComment}
                              >
                                Cancelar
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
                  placeholder="Adicione um novo comentário..."
                  rows={3}
                />
                <Button
                  onClick={onAddCommentToAnnotation}
                  size="sm"
                  className="w-full"
                  disabled={!newComment.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Comentário
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
              <CardTitle>Criar Link: "{selectedText}"</CardTitle>
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
                Cancelar
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
              <CardTitle>Adicionar Comentário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => onNewCommentChange(e.target.value)}
                placeholder="Digite seu comentário..."
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={onAddComment} className="flex-1">
                  Adicionar
                </Button>
                <Button variant="outline" onClick={onHideCommentModal}>
                  Cancelar
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
              <CardTitle>Resumo do Capítulo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={chapter.summary}
                onChange={(e) => onChapterSummaryChange(e.target.value)}
                placeholder="Escreva um resumo do que acontece neste capítulo..."
                rows={6}
                disabled={isReadOnly}
              />
              <div className="flex gap-2">
                <Button onClick={onHideSummaryModal} className="flex-1">
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
