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

type ChapterStatus = 'draft' | 'in-progress' | 'review' | 'finished';

interface Comment {
  id: string;
  text: string;
  position: number;
  timestamp: Date;
}

interface EntityLink {
  text: string;
  type: 'character' | 'location' | 'item' | 'organization' | 'beast';
  entityId: string;
}

interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
  status: ChapterStatus;
  summary: string;
  lastSaved: Date;
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
    content: '<p>Era uma vez, em uma terra distante...</p>',
    status: 'draft',
    summary: '',
    lastSaved: new Date(),
    comments: [],
    entityLinks: []
  });

  const [selectedText, setSelectedText] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [newComment, setNewComment] = useState('');
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
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  const addEntityLink = (entityType: string, entityId: string) => {
    if (!selectedText) return;
    
    const newLink: EntityLink = {
      text: selectedText,
      type: entityType as any,
      entityId
    };
    
    setChapter(prev => ({
      ...prev,
      entityLinks: [...prev.entityLinks, newLink]
    }));

    // Wrap selected text with link styling
    execCommand('createLink', `#${entityType}-${entityId}`);
    setShowLinkModal(false);
    setSelectedText('');
    toast.success('Link adicionado com sucesso!');
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: String(Date.now()),
      text: newComment,
      position: editorRef.current?.innerText.length || 0,
      timestamp: new Date()
    };

    setChapter(prev => ({
      ...prev,
      comments: [...prev.comments, comment]
    }));

    setNewComment('');
    setShowCommentModal(false);
    toast.success('Comentário adicionado!');
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
              dangerouslySetInnerHTML={{ __html: chapter.content }}
              suppressContentEditableWarning
            />

          </div>
        </div>

        {/* Comments Sidebar */}
        <div className="w-80 border-l border-border p-4 bg-muted/20">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Comentários</h3>
            {!isReadOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCommentModal(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Comentário
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {chapter.comments.map((comment) => (
              <Card key={comment.id} className="p-3">
                <p className="text-sm">{comment.text}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {comment.timestamp.toLocaleString()}
                </p>
              </Card>
            ))}
          </div>

          {/* Entity Links */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Links de Entidades</h3>
            <div className="space-y-2">
              {chapter.entityLinks.map((link, index) => (
                <Badge key={index} variant="outline" className="block text-xs p-2">
                  {link.text} → {link.type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
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