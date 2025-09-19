import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { 
  Plus, 
  Eye, 
  Edit, 
  Save, 
  Trash2, 
  Move, 
  Type, 
  Image, 
  Square, 
  Circle,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Palette,
  AlignCenter,
  Copy,
  ArrowLeft,
  Download,
  Upload
} from "lucide-react";

type ElementType = 'section-card' | 'submap-card' | 'visual-submap-card' | 'text-box';
type ConnectionType = 'arrow' | 'line';

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
  map: Omit<PowerMap, 'id' | 'name'>;
}

const DEFAULT_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#6366F1'
];

export function PowerSystemTab() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMap, setCurrentMap] = useState<PowerMap>({
    id: 'main',
    name: 'Sistema de Poder Principal',
    elements: [],
    connections: []
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
  const [newElementType, setNewElementType] = useState<ElementType>('section-card');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showTutorialDialog, setShowTutorialDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Canvas panning for view mode
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEditMode) {
      setIsViewDragging(true);
      setViewDragStart({ x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y });
    }
  }, [isEditMode, viewOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isViewDragging && !isEditMode) {
      setViewOffset({
        x: e.clientX - viewDragStart.x,
        y: e.clientY - viewDragStart.y
      });
    }
  }, [isViewDragging, isEditMode, viewDragStart]);

  const handleMouseUp = useCallback(() => {
    setIsViewDragging(false);
  }, []);

  // Element creation
  const createElement = useCallback((type: ElementType, x: number, y: number) => {
    const newElement: PowerElement = {
      id: `element-${Date.now()}`,
      type,
      x,
      y,
      width: type === 'text-box' ? 200 : 250,
      height: type === 'text-box' ? 100 : 150,
      title: type === 'text-box' ? '' : 'Novo Elemento',
      content: type === 'text-box' ? 'Texto...' : 'Descrição...',
      color: DEFAULT_COLORS[0],
      canOpenSubmap: type.includes('submap'),
      showHover: true,
      compressed: false
    };

    setCurrentMap(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
    setShowCreateDialog(false);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<PowerElement>) => {
    setCurrentMap(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...updates } : el)
    }));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setCurrentMap(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
      connections: prev.connections.filter(conn => conn.fromId !== id && conn.toId !== id)
    }));
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedElement && isEditMode) {
        deleteElement(selectedElement);
        setSelectedElement(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, isEditMode, deleteElement]);

  const renderElement = (element: PowerElement) => {
    const isSelected = selectedElement === element.id;
    
    switch (element.type) {
      case 'section-card':
        return (
          <Card 
            key={element.id}
            className={`absolute cursor-${isEditMode ? 'move' : 'pointer'} transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
            style={{
              left: element.x + viewOffset.x,
              top: element.y + viewOffset.y,
              width: element.width,
              height: element.height,
              backgroundColor: element.color + '20',
              borderColor: element.color
            }}
            onClick={() => isEditMode && setSelectedElement(element.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm" style={{ color: element.color }}>
                {element.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {element.compressed ? (
                <HoverCard>
                  <HoverCardTrigger>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {element.content}
                    </p>
                  </HoverCardTrigger>
                  {element.showHover && (
                    <HoverCardContent className="w-80">
                      <p className="text-sm">{element.content}</p>
                    </HoverCardContent>
                  )}
                </HoverCard>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {element.content}
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 'submap-card':
        return (
          <Card 
            key={element.id}
            className={`absolute cursor-${isEditMode ? 'move' : 'pointer'} transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
            style={{
              left: element.x + viewOffset.x,
              top: element.y + viewOffset.y,
              width: element.width,
              height: element.height,
              backgroundColor: element.color + '20',
              borderColor: element.color
            }}
            onClick={() => {
              if (isEditMode) {
                setSelectedElement(element.id);
              } else if (element.canOpenSubmap) {
                // Open submap logic here
              }
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {element.imageUrl && (
                  <img 
                    src={element.imageUrl} 
                    alt={element.title}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <CardTitle className="text-sm" style={{ color: element.color }}>
                  {element.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">
                {element.content}
              </p>
            </CardContent>
          </Card>
        );

      case 'visual-submap-card':
        return (
          <div
            key={element.id}
            className={`absolute cursor-${isEditMode ? 'move' : 'pointer'} transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
            style={{
              left: element.x + viewOffset.x,
              top: element.y + viewOffset.y,
              width: element.width,
              height: element.height
            }}
            onClick={() => {
              if (isEditMode) {
                setSelectedElement(element.id);
              } else if (element.canOpenSubmap) {
                // Open submap logic here
              }
            }}
          >
            <HoverCard>
              <HoverCardTrigger>
                <div className="w-full h-full rounded-lg overflow-hidden border-2" style={{ borderColor: element.color }}>
                  {element.imageUrl ? (
                    <img 
                      src={element.imageUrl} 
                      alt={element.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Image className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </HoverCardTrigger>
              {element.showHover && (
                <HoverCardContent>
                  <div>
                    <h4 className="font-semibold">{element.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{element.content}</p>
                  </div>
                </HoverCardContent>
              )}
            </HoverCard>
          </div>
        );

      case 'text-box':
        return (
          <div
            key={element.id}
            className={`absolute cursor-${isEditMode ? 'move' : 'default'} p-2 rounded transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
            style={{
              left: element.x + viewOffset.x,
              top: element.y + viewOffset.y,
              width: element.width,
              height: element.height,
              backgroundColor: element.color + '20',
              borderLeft: `4px solid ${element.color}`
            }}
            onClick={() => isEditMode && setSelectedElement(element.id)}
          >
            <p className="text-sm" style={{ color: element.color }}>
              {element.content}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Sistema de Poder</h2>
            <p className="text-muted-foreground">Crie mapas visuais conectáveis do seu sistema</p>
          </div>
          
          {currentMap.parentMapId && (
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? <Edit className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isEditMode ? "Editando" : "Visualizando"}
          </Button>

          {isEditMode && (
            <>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Elemento</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex-col"
                      onClick={() => createElement('section-card', 100, 100)}
                    >
                      <Square className="w-6 h-6 mb-2" />
                      Card de Seção
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col"
                      onClick={() => createElement('submap-card', 100, 100)}
                    >
                      <BookOpen className="w-6 h-6 mb-2" />
                      Sub Mapa
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col"
                      onClick={() => createElement('visual-submap-card', 100, 100)}
                    >
                      <Image className="w-6 h-6 mb-2" />
                      Sub Mapa Visual
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col"
                      onClick={() => createElement('text-box', 100, 100)}
                    >
                      <Type className="w-6 h-6 mb-2" />
                      Caixa de Texto
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </>
          )}

          <Button variant="outline" size="sm" onClick={() => setShowTemplateDialog(true)}>
            <Copy className="w-4 h-4 mr-2" />
            Templates
          </Button>

          <Button variant="outline" size="sm" onClick={() => setShowTutorialDialog(true)}>
            <BookOpen className="w-4 h-4 mr-2" />
            Tutorial
          </Button>

          <Button variant="outline" size="sm" onClick={() => setShowHelpDialog(true)}>
            <HelpCircle className="w-4 h-4 mr-2" />
            Ajuda
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-muted/20 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(180deg, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            transform: `translate(${viewOffset.x % 20}px, ${viewOffset.y % 20}px)`
          }}
        />

        {/* Elements */}
        {currentMap.elements.map(renderElement)}

        {/* Empty state */}
        {currentMap.elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sistema de Poder Vazio</h3>
              <p className="text-muted-foreground mb-4">
                {isEditMode ? "Adicione elementos para começar a criar seu mapa" : "Ative o modo de edição para começar"}
              </p>
              {isEditMode && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Elemento
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tutorial Dialog */}
      <Dialog open={showTutorialDialog} onOpenChange={setShowTutorialDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tutorial - Sistema de Poder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Cards de Seção</h4>
              <p className="text-sm text-muted-foreground">
                Use para criar seções principais do seu sistema. Podem ser comprimidos para economizar espaço.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sub Mapas</h4>
              <p className="text-sm text-muted-foreground">
                Criam novos mapas quando clicados, permitindo organização hierárquica do sistema.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sub Mapas Visuais</h4>
              <p className="text-sm text-muted-foreground">
                Focados em imagens, ideais para representações visuais com informações no hover.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Caixas de Texto</h4>
              <p className="text-sm text-muted-foreground">
                Elementos livres para anotações e descrições adicionais.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajuda - Criando um Bom Sistema de Poder</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="tips">
            <TabsList>
              <TabsTrigger value="tips">Dicas</TabsTrigger>
              <TabsTrigger value="features">Recursos</TabsTrigger>
            </TabsList>
            <TabsContent value="tips" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Organização Visual</h4>
                <p className="text-sm text-muted-foreground">
                  Use cores consistentes para categorizar elementos relacionados. Agrupe conceitos similares próximos uns dos outros.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Hierarquia Clara</h4>
                <p className="text-sm text-muted-foreground">
                  Use sub-mapas para detalhar sistemas complexos. Mantenha o mapa principal com visão geral.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Conexões Lógicas</h4>
                <p className="text-sm text-muted-foreground">
                  Use setas e linhas para mostrar relacionamentos, fluxos de poder e dependências.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="features" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Navegação</h4>
                <p className="text-sm text-muted-foreground">
                  No modo visualização, arraste para navegar pelo mapa. Use zoom para ver detalhes.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Edição</h4>
                <p className="text-sm text-muted-foreground">
                  No modo edição, arraste elementos, use Delete para excluir, e clique duplo para editar.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Templates</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Salvar como Template
              </Button>
              <Button size="sm" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Carregar Template
              </Button>
            </div>
            
            {templates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum template salvo ainda</p>
              </div>
            ) : (
              <div className="space-y-2">
                {templates.map(template => (
                  <div key={template.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{template.name}</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">Usar</Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}