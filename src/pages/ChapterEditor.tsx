import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Save, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Quote, Link, MessageCircle, Palette, Type, Plus, FileText } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { LinkTooltip } from "@/components/LinkTooltip";

type ChapterStatus = 'draft' | 'in-progress' | 'review' | 'finished';

interface TextAnnotation {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
  type: 'comment' | 'link';
}

interface Comment {
  id: string;
  text: string;
  annotationId: string;
  timestamp: Date;
}

interface EntityLink {
  text: string;
  type: 'character' | 'location' | 'item' | 'organization' | 'beast';
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
  draft: { label: 'Rascunho', color: 'bg-muted' },
  'in-progress': { label: 'Em andamento', color: 'bg-blue-500' },
  review: { label: 'Em revisão', color: 'bg-yellow-500' },
  finished: { label: 'Finalizado', color: 'bg-green-500' }
};

// Mock entities for linking
const mockEntities = {
  characters: ['Aragorn', 'Gandalf', 'Legolas', 'Gimli'],
  locations: ['Vila do Condado', 'Floresta Sombria', 'Minas Tirith'],
  items: ['Espada Élfica', 'Anel do Poder', 'Arco de Legolas'],
  organizations: ['A Sociedade do Anel', 'Conselho de Elrond'],
  beasts: ['Dragão Smaug', 'Águias Gigantes', 'Wargs']
};

export function ChapterEditor() {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState<Chapter>({
    id: chapterId || '1',
    number: 1,
    title: 'O Chamado da Aventura',
    content: 'Era uma vez, em uma terra distante, vivia um jovem chamado João que sonhava em se tornar um grande aventureiro.',
    status: 'draft',
    summary: '',
    lastSaved: new Date(),
    annotations: [],
    comments: [],
    entityLinks: []
  });

  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState<{start: number, end: number} | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [showCommentSidebar, setShowCommentSidebar] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const isReadOnly = chapter.status === 'finished' || chapter.status === 'review';

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
      setChapter(prev => ({ ...prev, lastSaved: new Date() }));
      setIsAutoSaving(false);
      toast.success('Capítulo salvo automaticamente');
    }, 1000);
  };

  const handleSave = () => {
    handleAutoSave();
    toast.success('Capítulo salvo com sucesso!');
  };

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
      const containerText = editorRef.current?.textContent || '';
      const beforeRange = containerText.substring(0, containerText.indexOf(text));
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
      type: 'link'
    };
    
    const newLink: EntityLink = {
      text: selectedText,
      type: entityType as any,
      entityId,
      annotationId
    };
    
    setChapter(prev => ({
      ...prev,
      annotations: [...prev.annotations, newAnnotation],
      entityLinks: [...prev.entityLinks, newLink]
    }));

    setShowLinkModal(false);
    setSelectedText('');
    setSelectedRange(null);
    toast.success('Link adicionado com sucesso!');
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
        type: 'comment'
      };
      
      setChapter(prev => ({
        ...prev,
        annotations: [...prev.annotations, newAnnotation]
      }));
    }

    const comment: Comment = {
      id: String(Date.now()),
      text: newComment,
      annotationId,
      timestamp: new Date()
    };

    setChapter(prev => ({
      ...prev,
      comments: [...prev.comments, comment]
    }));

    setNewComment('');
    setShowCommentModal(false);
    setSelectedText('');
    setSelectedRange(null);
    setSelectedAnnotation(null);
    toast.success('Comentário adicionado!');
  };

  const addCommentToAnnotation = () => {
    if (!newComment.trim() || !selectedAnnotation) return;

    const comment: Comment = {
      id: String(Date.now()),
      text: newComment,
      annotationId: selectedAnnotation,
      timestamp: new Date()
    };

    setChapter(prev => ({
      ...prev,
      comments: [...prev.comments, comment]
    }));

    setNewComment('');
    toast.success('Comentário adicionado!');
  };

  const editComment = (commentId: string) => {
    const comment = chapter.comments.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditCommentText(comment.text);
    }
  };

  const saveEditedComment = () => {
    if (!editCommentText.trim() || !editingComment) return;

    setChapter(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment.id === editingComment
          ? { ...comment, text: editCommentText, timestamp: new Date() }
          : comment
      )
    }));

    setEditingComment(null);
    setEditCommentText('');
    toast.success('Comentário editado!');
  };

  const deleteComment = (commentId: string) => {
    setChapter(prev => ({
      ...prev,
      comments: prev.comments.filter(comment => comment.id !== commentId)
    }));
    toast.success('Comentário excluído!');
  };

  const closeSidebar = () => {
    setShowCommentSidebar(false);
    setSelectedAnnotation(null);
    setEditingComment(null);
    setEditCommentText('');
    setNewComment('');
  };

  const getAnnotationComments = (annotationId: string) => {
    return chapter.comments.filter(comment => comment.annotationId === annotationId);
  };

  const getAnnotationLink = (annotationId: string) => {
    return chapter.entityLinks.find(link => link.annotationId === annotationId);
  };

  const renderAnnotatedText = () => {
    if (!chapter.content) return chapter.content;

    let content = chapter.content;
    const sortedAnnotations = [...chapter.annotations].sort((a, b) => b.startOffset - a.startOffset);

    // For React rendering with proper tooltips
    let elements: (string | JSX.Element)[] = [content];
    
    sortedAnnotations.forEach((annotation, index) => {
      const newElements: (string | JSX.Element)[] = [];
      
      elements.forEach((element, elemIndex) => {
        if (typeof element === 'string') {
          const beforeText = element.substring(0, annotation.startOffset);
          const annotatedText = element.substring(annotation.startOffset, annotation.endOffset);
          const afterText = element.substring(annotation.endOffset);

          if (annotation.type === 'comment') {
            const comments = getAnnotationComments(annotation.id);
            const commentCount = comments.length;
            const isSelected = selectedAnnotation === annotation.id && showCommentSidebar;
            
            newElements.push(beforeText);
            newElements.push(
              <span key={`comment-${annotation.id}`} className="comment-annotation-wrapper" style={{ position: 'relative', display: 'inline' }}>
                <span 
                  className="comment-text" 
                  style={{ 
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)', 
                    borderRadius: '2px', 
                    padding: '1px 2px',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {annotatedText}
                </span>
                <span 
                  className="comment-badge" 
                  data-annotation-id={annotation.id}
                  style={{ 
                    marginLeft: '4px', 
                    background: isSelected ? '#1d4ed8' : '#3b82f6', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: '16px', 
                    height: '16px', 
                    fontSize: '9px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    verticalAlign: 'super', 
                    lineHeight: '1',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {commentCount}
                </span>
              </span>
            );
            newElements.push(afterText);
          } else if (annotation.type === 'link') {
            const link = getAnnotationLink(annotation.id);
            if (link) {
              newElements.push(beforeText);
              newElements.push(
                <LinkTooltip 
                  key={`link-${annotation.id}`}
                  entityType={link.type}
                  entityId={link.entityId}
                  text={link.text}
                >
                  <span 
                    className="link-annotation" 
                    data-annotation-id={annotation.id}
                    data-entity-type={link.type}
                    data-entity-id={link.entityId}
                    style={{ 
                      color: '#059669', 
                      backgroundColor: 'rgba(5, 150, 105, 0.08)', 
                      borderRadius: '2px', 
                      padding: '1px 2px', 
                      cursor: 'pointer', 
                      textDecoration: 'none', 
                      borderBottom: '1px solid #059669', 
                      transition: 'all 0.2s' 
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(5, 150, 105, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(5, 150, 105, 0.08)';
                    }}
                  >
                    {annotatedText}
                  </span>
                </LinkTooltip>
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
    const text = editorRef.current?.innerText || '';
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

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
                onClick={() => navigate(`/book/${bookId}/chapters`)}
                className="hover:bg-muted"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <Input
                  value={chapter.title}
                  onChange={(e) => setChapter(prev => ({ ...prev, title: e.target.value }))}
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
              <Button 
                variant="outline" 
                onClick={() => setShowSummaryModal(true)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Resumo
              </Button>

              <Select
                value={chapter.status}
                onValueChange={(value: ChapterStatus) => 
                  setChapter(prev => ({ ...prev, status: value }))
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
              
              <Button onClick={handleSave} className="btn-magical">
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
                    onClick={() => execCommand('bold')}
                    aria-label="Negrito"
                  >
                    <Bold className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="italic"
                    onClick={() => execCommand('italic')}
                    aria-label="Itálico"
                  >
                    <Italic className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="underline"
                    onClick={() => execCommand('underline')}
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
                    onClick={() => execCommand('justifyLeft')}
                    aria-label="Alinhar à esquerda"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="center"
                    onClick={() => execCommand('justifyCenter')}
                    aria-label="Centralizar"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="right"
                    onClick={() => execCommand('justifyRight')}
                    aria-label="Alinhar à direita"
                  >
                    <AlignRight className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="justify"
                    onClick={() => execCommand('justifyFull')}
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
                    onClick={() => execCommand('insertUnorderedList')}
                    aria-label="Lista com marcadores"
                  >
                    <List className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="ol"
                    onClick={() => execCommand('insertOrderedList')}
                    aria-label="Lista numerada"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>

                <Separator orientation="vertical" className="h-6" />

                {/* Font Size */}
                <Select onValueChange={(value) => execCommand('fontSize', value)}>
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
                      {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', 
                        '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080'].map(color => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => execCommand('foreColor', color)}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Quote */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => execCommand('formatBlock', 'blockquote')}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLinkModal(true)}
                >
                  <Link className="w-4 h-4 mr-1" />
                  Linkar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCommentModal(true)}
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
                isReadOnly ? 'bg-muted/30' : ''
              }`}
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                fontFamily: 'Georgia, serif'
              }}
              onMouseUp={handleTextSelection}
              onKeyUp={handleTextSelection}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('comment-badge')) {
                  e.preventDefault();
                  e.stopPropagation();
                  const annotationId = target.getAttribute('data-annotation-id');
                  setSelectedAnnotation(annotationId);
                  setShowCommentSidebar(true);
                } else if (target.classList.contains('link-annotation')) {
                  e.preventDefault();
                  const entityType = target.getAttribute('data-entity-type');
                  const entityId = target.getAttribute('data-entity-id');
                  // Navigate to entity page
                  navigate(`/${entityType}/${entityId}`);
                }
              }}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeSidebar}
                >
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
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={saveEditedComment}>
                                Salvar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditCommentText('');
                                }}
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
                            onClick={() => editComment(comment.id)}
                            className="p-1 h-6 w-6"
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteComment(comment.id)}
                            className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                          >
                            🗑️
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
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicione um novo comentário..."
                  rows={3}
                />
                <Button
                  onClick={addCommentToAnnotation}
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
                        onClick={() => addEntityLink(type, entity)}
                        className="justify-start"
                      >
                        {entity}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => setShowLinkModal(false)}>
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
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Digite seu comentário..."
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={addComment} className="flex-1">
                  Adicionar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCommentModal(false)}
                >
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
                onChange={(e) => setChapter(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Escreva um resumo do que acontece neste capítulo..."
                rows={6}
                disabled={isReadOnly}
              />
              <div className="flex gap-2">
                <Button onClick={() => setShowSummaryModal(false)} className="flex-1">
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