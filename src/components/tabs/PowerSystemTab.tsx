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
import { Separator } from "@/components/ui/separator";
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
  Upload,
  X,
  Settings,
  Zap,
  FileText,
  ChevronRight
} from "lucide-react";

type ElementType = 'section-card' | 'details-card' | 'visual-card' | 'text-box';
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
  textColor: string;
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

const ELEMENT_TYPES = [
  {
    type: 'section-card' as ElementType,
    name: 'Card de Seção',
    icon: Square,
    description: 'Para seções principais do sistema'
  },
  {
    type: 'details-card' as ElementType,
    name: 'Card de Detalhes',
    icon: BookOpen,
    description: 'Cria submapas navegáveis'
  },
  {
    type: 'visual-card' as ElementType,
    name: 'Card Visual',
    icon: Image,
    description: 'Focado em representações visuais'
  },
  {
    type: 'text-box' as ElementType,
    name: 'Caixa de Texto',
    icon: Type,
    description: 'Anotações e descrições livres'
  }
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
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);

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
  const createElement = useCallback((type: ElementType, x?: number, y?: number) => {
    console.log('[PowerSystem] createElement clicked', { type, x, y });
    const width = type === 'text-box' ? 200 : 250;
    const height = type === 'text-box' ? 100 : 150;

    let posX = x ?? 0;
    let posY = y ?? 0;

    if (x == null || y == null) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        posX = -viewOffset.x + rect.width / 2 - width / 2;
        posY = -viewOffset.y + rect.height / 2 - height / 2;
        console.log('[PowerSystem] computed center position', { rect, viewOffset, posX, posY });
      } else {
        posX = 100;
        posY = 100;
        console.log('[PowerSystem] canvas not ready, using fallback', { posX, posY });
      }
    }

    const id = `element-${Date.now()}`;

    const newElement: PowerElement = {
      id,
      type,
      x: posX,
      y: posY,
      width,
      height,
      title: type === 'text-box' ? '' : 'Novo Elemento',
      content: type === 'text-box' ? 'Texto...' : 'Descrição...',
      color: DEFAULT_COLORS[0],
      textColor: '#ffffff',
      canOpenSubmap: type === 'details-card' || type === 'visual-card',
      showHover: true,
      compressed: false
    };

    setCurrentMap(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
    setSelectedElement(id);
    setShowCreateDialog(false);
    console.log('[PowerSystem] element added', { id, type, posX, posY });
  }, [viewOffset]);

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

  // Submap navigation
  const handleSubmapOpen = useCallback((element: PowerElement) => {
    if (!element.submapId) {
      // Create new submap
      const newSubmapId = `submap-${Date.now()}`;
      const newSubmap: PowerMap = {
        id: newSubmapId,
        name: element.title || 'Novo Sub Mapa',
        elements: [],
        connections: [],
        parentMapId: currentMap.id
      };
      
      setMaps(prev => [...prev, newSubmap]);
      updateElement(element.id, { submapId: newSubmapId });
      setCurrentMap(newSubmap);
    } else {
      // Open existing submap
      const existingSubmap = maps.find(map => map.id === element.submapId);
      if (existingSubmap) {
        setCurrentMap(existingSubmap);
      }
    }
  }, [currentMap.id, maps, updateElement]);

  const goBackToParent = useCallback(() => {
    if (currentMap.parentMapId) {
      const parentMap = maps.find(map => map.id === currentMap.parentMapId);
      if (parentMap) {
        setCurrentMap(parentMap);
      } else if (currentMap.parentMapId === 'main') {
        setCurrentMap({
          id: 'main',
          name: 'Sistema de Poder Principal',
          elements: [],
          connections: []
        });
      }
    }
  }, [currentMap.parentMapId, maps]);

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
          <div
            key={element.id}
            className={`absolute cursor-${isEditMode ? 'move' : 'pointer'} transition-all rounded-lg shadow-sm ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}`}
            style={{
              left: element.x + viewOffset.x,
              top: element.y + viewOffset.y,
              width: element.width,
              height: element.height,
              backgroundColor: element.color,
            }}
            onClick={() => {
              if (isEditMode) {
                setSelectedElement(element.id);
                setShowPropertiesPanel(true);
              }
            }}
          >
            <div className="p-4 h-full flex flex-col">
              <h3 className="font-semibold text-sm mb-2" style={{ color: element.textColor }}>
                {element.title}
              </h3>
              {element.compressed ? (
                <HoverCard>
                  <HoverCardTrigger>
                    <p className="text-xs line-clamp-3 flex-1" style={{ color: element.textColor + '80' }}>
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
                <p className="text-xs flex-1" style={{ color: element.textColor + '80' }}>
                  {element.content}
                </p>
              )}
            </div>
          </div>
        );

      case 'details-card':
        return (
          <div
            key={element.id}
            className={`absolute cursor-${isEditMode ? 'move' : 'pointer'} transition-all rounded-lg shadow-sm ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}`}
            style={{
              left: element.x + viewOffset.x,
              top: element.y + viewOffset.y,
              width: element.width,
              height: element.height,
              backgroundColor: element.color,
            }}
            onClick={() => {
              if (isEditMode) {
                setSelectedElement(element.id);
                setShowPropertiesPanel(true);
              } else if (element.canOpenSubmap) {
                handleSubmapOpen(element);
              }
            }}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                {element.imageUrl && (
                  <img 
                    src={element.imageUrl} 
                    alt={element.title}
                    className="w-6 h-6 rounded object-cover"
                  />
                )}
                <h3 className="font-semibold text-sm" style={{ color: element.textColor }}>
                  {element.title}
                </h3>
                <ChevronRight className="w-3 h-3 ml-auto" style={{ color: element.textColor + '60' }} />
              </div>
              <p className="text-xs flex-1" style={{ color: element.textColor + '80' }}>
                {element.content}
              </p>
            </div>
          </div>
        );

      case 'visual-card':
        return (
          <div
            key={element.id}
            className={`absolute cursor-${isEditMode ? 'move' : 'pointer'} transition-all rounded-lg shadow-sm overflow-hidden ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}`}
            style={{
              left: element.x + viewOffset.x,
              top: element.y + viewOffset.y,
              width: element.width,
              height: element.height,
              backgroundColor: element.color
            }}
            onClick={() => {
              if (isEditMode) {
                setSelectedElement(element.id);
                setShowPropertiesPanel(true);
              } else if (element.canOpenSubmap) {
                handleSubmapOpen(element);
              }
            }}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="w-full h-full">
                  {element.imageUrl ? (
                    <img 
                      src={element.imageUrl} 
                      alt={element.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Image className="w-8 h-8 mb-2" style={{ color: element.textColor + '60' }} />
                      <p className="text-xs text-center px-2" style={{ color: element.textColor }}>
                        {element.title}
                      </p>
                    </div>
                  )}
                  {element.canOpenSubmap && (
                    <div className="absolute top-2 right-2">
                      <ChevronRight className="w-3 h-3" style={{ color: element.textColor + '80' }} />
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
            className={`absolute cursor-${isEditMode ? 'move' : 'default'} p-3 rounded-lg shadow-sm transition-all ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}`}
            style={{
              left: element.x + viewOffset.x,
              top: element.y + viewOffset.y,
              width: element.width,
              height: element.height,
              backgroundColor: element.color,
            }}
            onClick={() => {
              if (isEditMode) {
                setSelectedElement(element.id);
                setShowPropertiesPanel(true);
              }
            }}
          >
            <p className="text-sm" style={{ color: element.textColor }}>
              {element.content}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      {/* Sidebar Toolbox - Only in Edit Mode */}
      {isEditMode && (
        <div className="w-64 bg-background border-r flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-1">Elementos</h3>
            <p className="text-xs text-muted-foreground">Clique para adicionar ao mapa</p>
          </div>
          
          <div className="flex-1 p-4 space-y-3">
            {ELEMENT_TYPES.map((elementType) => {
              const IconComponent = elementType.icon;
              return (
                <Button
                  key={elementType.type}
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent"
                  onClick={() => createElement(elementType.type)}
                >
                  <IconComponent className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{elementType.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{elementType.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
          
          <div className="p-4 border-t space-y-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => setShowTutorialDialog(true)}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Tutorial
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setShowTemplateDialog(true)}>
              <Copy className="w-4 h-4 mr-2" />
              Templates
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Sistema de Poder</h2>
              <p className="text-muted-foreground">Crie mapas visuais conectáveis do seu sistema</p>
            </div>
            
            {currentMap.parentMapId && (
              <Button variant="outline" size="sm" onClick={goBackToParent}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setIsEditMode(!isEditMode);
                setShowPropertiesPanel(false);
                setSelectedElement(null);
              }}
            >
              {isEditMode ? <Edit className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isEditMode ? "Editando" : "Visualizando"}
            </Button>

            {isEditMode && (
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={() => setShowHelpDialog(true)}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Ajuda
            </Button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 flex relative">
          {/* Canvas */}
          <div 
            ref={canvasRef}
            className="flex-1 min-h-[60vh] relative overflow-hidden bg-muted/20 cursor-grab active:cursor-grabbing"
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
                    <Zap className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Sistema de Poder Vazio</h3>
                  <p className="text-muted-foreground mb-4">
                    {isEditMode ? "Use a barra lateral para adicionar elementos" : "Ative o modo de edição para começar"}
                  </p>
                  {!isEditMode && (
                    <Button onClick={() => setIsEditMode(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Entrar no Modo Edição
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Properties Panel - Only in Edit Mode */}
          {isEditMode && showPropertiesPanel && selectedElement && (
            <div className="w-80 bg-background border-l">
              <PropertiesPanel
                element={currentMap.elements.find(el => el.id === selectedElement)!}
                onUpdate={(updates) => updateElement(selectedElement, updates)}
                onDelete={() => {
                  deleteElement(selectedElement);
                  setSelectedElement(null);
                  setShowPropertiesPanel(false);
                }}
                onClose={() => {
                  setShowPropertiesPanel(false);
                  setSelectedElement(null);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tutorial Overlay */}
      {showTutorialDialog && (
        <TutorialOverlay
          step={tutorialStep}
          onNext={() => setTutorialStep(prev => prev + 1)}
          onPrev={() => setTutorialStep(prev => prev - 1)}
          onClose={() => {
            setShowTutorialDialog(false);
            setTutorialStep(0);
          }}
        />
      )}

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

// Properties Panel Component
interface PropertiesPanelProps {
  element: PowerElement;
  onUpdate: (updates: Partial<PowerElement>) => void;
  onDelete: () => void;
  onClose: () => void;
}

function PropertiesPanel({ element, onUpdate, onDelete, onClose }: PropertiesPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Propriedades</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Title */}
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={element.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Digite o título..."
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label>Conteúdo</Label>
          <Textarea
            value={element.content || ''}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Digite o conteúdo..."
            rows={3}
          />
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Cor de Fundo</Label>
            <div className="grid grid-cols-5 gap-2">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded border-2 ${element.color === color ? 'border-primary' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onUpdate({ color })}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor do Texto</Label>
            <div className="grid grid-cols-5 gap-2">
              {['#ffffff', '#000000', '#374151', '#6B7280', '#9CA3AF'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded border-2 ${element.textColor === color ? 'border-primary' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onUpdate({ textColor: color })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Image URL for visual cards */}
        {(element.type === 'visual-card' || element.type === 'details-card') && (
          <div className="space-y-2">
            <Label>URL da Imagem</Label>
            <Input
              value={element.imageUrl || ''}
              onChange={(e) => onUpdate({ imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        )}

        {/* Switches */}
        <div className="space-y-4">
          {element.type === 'section-card' && (
            <div className="flex items-center justify-between">
              <Label>Comprimido</Label>
              <Switch
                checked={element.compressed}
                onCheckedChange={(compressed) => onUpdate({ compressed })}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Label>Mostrar Hover</Label>
            <Switch
              checked={element.showHover}
              onCheckedChange={(showHover) => onUpdate({ showHover })}
            />
          </div>

          {(element.type === 'details-card' || element.type === 'visual-card') && (
            <div className="flex items-center justify-between">
              <Label>Permite Submapa</Label>
              <Switch
                checked={element.canOpenSubmap}
                onCheckedChange={(canOpenSubmap) => onUpdate({ canOpenSubmap })}
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t">
        <Button variant="destructive" size="sm" className="w-full" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir Elemento
        </Button>
      </div>
    </div>
  );
}

// Tutorial Overlay Component
interface TutorialOverlayProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: "Bem-vindo ao Sistema de Poder!",
    content: "Crie mapas visuais interativos para organizar seu sistema de mundo.",
    target: null
  },
  {
    title: "Modo de Edição",
    content: "Clique em 'Visualizando' para entrar no modo de edição e acessar as ferramentas.",
    target: ".edit-button"
  },
  {
    title: "Barra de Elementos",
    content: "Use a barra lateral para adicionar diferentes tipos de elementos ao seu mapa.",
    target: ".sidebar-toolbox"
  },
  {
    title: "Cards de Seção",
    content: "Ideais para seções principais do seu sistema. Podem ser comprimidos para economizar espaço.",
    target: "[data-element-type='section-card']"
  },
  {
    title: "Cards de Detalhes",
    content: "Criam submapas navegáveis para organizar informações hierarquicamente.",
    target: "[data-element-type='details-card']"
  },
  {
    title: "Cards Visuais",
    content: "Focados em imagens, perfeitos para representações visuais do seu sistema.",
    target: "[data-element-type='visual-card']"
  },
  {
    title: "Caixas de Texto",
    content: "Elementos livres para anotações e descrições adicionais.",
    target: "[data-element-type='text-box']"
  }
];

function TutorialOverlay({ step, onNext, onPrev, onClose }: TutorialOverlayProps) {
  const currentStep = TUTORIAL_STEPS[step];
  const isLastStep = step === TUTORIAL_STEPS.length - 1;
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{currentStep.title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-muted-foreground mb-6">{currentStep.content}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {step + 1} de {TUTORIAL_STEPS.length}
          </div>
          
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={onPrev}>
                Anterior
              </Button>
            )}
            
            {isLastStep ? (
              <Button size="sm" onClick={onClose}>
                Finalizar
              </Button>
            ) : (
              <Button size="sm" onClick={onNext}>
                Próximo
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}