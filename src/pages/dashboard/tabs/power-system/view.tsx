import { RefObject } from "react";

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
  ChevronRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type ElementType = "section-card" | "details-card" | "visual-card" | "text-box";

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

interface PowerMap {
  id: string;
  name: string;
  elements: PowerElement[];
  connections: any[];
  parentMapId?: string;
}

interface Template {
  id: string;
  name: string;
  map: Omit<PowerMap, "id" | "name">;
}

interface ElementTypeInfo {
  type: ElementType;
  name: string;
  description: string;
}

interface TutorialStep {
  title: string;
  content: string;
  target: string | null;
}

interface PowerSystemViewProps {
  // State
  isEditMode: boolean;
  currentMap: PowerMap;
  maps: PowerMap[];
  templates: Template[];
  selectedElement: string | null;
  viewOffset: { x: number; y: number };
  showCreateDialog: boolean;
  newElementType: ElementType;
  showTemplateDialog: boolean;
  showTutorialDialog: boolean;
  tutorialStep: number;
  showHelpDialog: boolean;
  showPropertiesPanel: boolean;
  selectedElementData: PowerElement | null;

  // Constants
  ELEMENT_TYPES: ElementTypeInfo[];
  DEFAULT_COLORS: string[];
  TUTORIAL_STEPS: TutorialStep[];

  // Refs
  canvasRef: RefObject<HTMLDivElement>;

  // Handlers
  onToggleEditMode: () => void;
  onSave: () => void;
  onSetShowHelpDialog: (show: boolean) => void;
  onGoBackToParent: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onElementClick: (element: PowerElement) => void;
  onSetShowCreateDialog: (show: boolean) => void;
  onSetNewElementType: (type: ElementType) => void;
  onCreateElement: (type: ElementType) => void;
  onSetShowTutorialDialog: (show: boolean) => void;
  onSetShowTemplateDialog: (show: boolean) => void;
  onUpdateElement: (id: string, updates: Partial<PowerElement>) => void;
  onDeleteElement: (id: string) => void;
  onTutorialNext: () => void;
  onTutorialPrev: () => void;
  onTutorialClose: () => void;
  onPropertiesClose: () => void;
  onPropertiesDelete: () => void;
}

export function PowerSystemView({
  isEditMode,
  currentMap,
  maps,
  templates,
  selectedElement,
  viewOffset,
  showCreateDialog,
  newElementType,
  showTemplateDialog,
  showTutorialDialog,
  tutorialStep,
  showHelpDialog,
  showPropertiesPanel,
  selectedElementData,
  ELEMENT_TYPES,
  DEFAULT_COLORS,
  TUTORIAL_STEPS,
  canvasRef,
  onToggleEditMode,
  onSave,
  onSetShowHelpDialog,
  onGoBackToParent,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onElementClick,
  onSetShowCreateDialog,
  onSetNewElementType,
  onCreateElement,
  onSetShowTutorialDialog,
  onSetShowTemplateDialog,
  onUpdateElement,
  onDeleteElement,
  onTutorialNext,
  onTutorialPrev,
  onTutorialClose,
  onPropertiesClose,
  onPropertiesDelete,
}: PowerSystemViewProps) {
  const renderElement = (element: PowerElement) => {
    const isSelected = selectedElement === element.id;

    const baseStyle = {
      left: element.x + viewOffset.x,
      top: element.y + viewOffset.y,
      width: element.width,
      height: element.height,
      backgroundColor: element.color,
    };

    const baseClasses = `absolute cursor-${isEditMode ? "move" : "pointer"} transition-all rounded-lg shadow-sm ${isSelected ? "ring-2 ring-primary shadow-lg" : ""}`;

    switch (element.type) {
      case "section-card":
        return (
          <div
            key={element.id}
            className={baseClasses}
            style={baseStyle}
            onClick={() => onElementClick(element)}
          >
            <div className="p-4 h-full flex flex-col">
              <h3
                className="font-semibold text-sm mb-2"
                style={{ color: element.textColor }}
              >
                {element.title}
              </h3>
              {element.compressed ? (
                <HoverCard>
                  <HoverCardTrigger>
                    <p
                      className="text-xs line-clamp-3 flex-1"
                      style={{ color: `${element.textColor}80` }}
                    >
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
                <p
                  className="text-xs flex-1"
                  style={{ color: `${element.textColor}80` }}
                >
                  {element.content}
                </p>
              )}
            </div>
          </div>
        );

      case "details-card":
        return (
          <div
            key={element.id}
            className={baseClasses}
            style={baseStyle}
            onClick={() => onElementClick(element)}
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
                <h3
                  className="font-semibold text-sm"
                  style={{ color: element.textColor }}
                >
                  {element.title}
                </h3>
                <ChevronRight
                  className="w-3 h-3 ml-auto"
                  style={{ color: `${element.textColor}60` }}
                />
              </div>
              <p
                className="text-xs flex-1"
                style={{ color: `${element.textColor}80` }}
              >
                {element.content}
              </p>
            </div>
          </div>
        );

      case "visual-card":
        return (
          <div
            key={element.id}
            className={`${baseClasses} overflow-hidden`}
            style={baseStyle}
            onClick={() => onElementClick(element)}
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
                      <Image
                        className="w-8 h-8 mb-2"
                        style={{ color: `${element.textColor}60` }}
                      />
                      <p
                        className="text-xs text-center px-2"
                        style={{ color: element.textColor }}
                      >
                        {element.title}
                      </p>
                    </div>
                  )}
                  {element.canOpenSubmap && (
                    <div className="absolute top-2 right-2">
                      <ChevronRight
                        className="w-3 h-3"
                        style={{ color: `${element.textColor}80` }}
                      />
                    </div>
                  )}
                </div>
              </HoverCardTrigger>
              {element.showHover && (
                <HoverCardContent>
                  <div>
                    <h4 className="font-semibold">{element.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {element.content}
                    </p>
                  </div>
                </HoverCardContent>
              )}
            </HoverCard>
          </div>
        );

      case "text-box":
        return (
          <div
            key={element.id}
            className={`${baseClasses} p-3`}
            style={baseStyle}
            onClick={() => onElementClick(element)}
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
            <p className="text-xs text-muted-foreground">
              Clique para adicionar ao mapa
            </p>
          </div>

          <div className="flex-1 p-4 space-y-3">
            {ELEMENT_TYPES.map((elementType) => (
              <Button
                key={elementType.type}
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent"
                onClick={() => onCreateElement(elementType.type)}
              >
                <Square className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{elementType.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {elementType.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="p-4 border-t space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onSetShowTutorialDialog(true)}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Tutorial
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onSetShowTemplateDialog(true)}
            >
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
              <p className="text-muted-foreground">
                Crie mapas visuais conectáveis do seu sistema
              </p>
            </div>

            {currentMap.parentMapId && (
              <Button variant="outline" size="sm" onClick={onGoBackToParent}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={onToggleEditMode}
            >
              {isEditMode ? (
                <Edit className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {isEditMode ? "Editando" : "Visualizando"}
            </Button>

            {isEditMode && (
              <Button variant="outline" size="sm" onClick={onSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetShowHelpDialog(true)}
            >
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
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(180deg, hsl(var(--border)) 1px, transparent 1px)
            `,
                backgroundSize: "20px 20px",
                transform: `translate(${viewOffset.x % 20}px, ${viewOffset.y % 20}px)`,
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
                  <h3 className="text-lg font-semibold mb-2">
                    Sistema de Poder Vazio
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isEditMode
                      ? "Use a barra lateral para adicionar elementos"
                      : "Ative o modo de edição para começar"}
                  </p>
                  {!isEditMode && (
                    <Button onClick={onToggleEditMode}>
                      <Edit className="w-4 h-4 mr-2" />
                      Entrar no Modo Edição
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Properties Panel - Only in Edit Mode */}
          {isEditMode && showPropertiesPanel && selectedElementData && (
            <div className="w-80 bg-background border-l">
              <PropertiesPanel
                element={selectedElementData}
                defaultColors={DEFAULT_COLORS}
                onUpdate={(updates) =>
                  onUpdateElement(selectedElementData.id, updates)
                }
                onDelete={onPropertiesDelete}
                onClose={onPropertiesClose}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <TutorialDialog
        isOpen={showTutorialDialog}
        step={tutorialStep}
        steps={TUTORIAL_STEPS}
        onNext={onTutorialNext}
        onPrev={onTutorialPrev}
        onClose={onTutorialClose}
      />

      <HelpDialog isOpen={showHelpDialog} onOpenChange={onSetShowHelpDialog} />

      <TemplateDialog
        isOpen={showTemplateDialog}
        templates={templates}
        onOpenChange={onSetShowTemplateDialog}
      />
    </div>
  );
}

// Subcomponents
interface PropertiesPanelProps {
  element: PowerElement;
  defaultColors: string[];
  onUpdate: (updates: Partial<PowerElement>) => void;
  onDelete: () => void;
  onClose: () => void;
}

function PropertiesPanel({
  element,
  defaultColors,
  onUpdate,
  onDelete,
  onClose,
}: PropertiesPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Propriedades</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={element.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Digite o título..."
          />
        </div>

        <div className="space-y-2">
          <Label>Conteúdo</Label>
          <Textarea
            value={element.content || ""}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Digite o conteúdo..."
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Cor de Fundo</Label>
            <div className="grid grid-cols-5 gap-2">
              {defaultColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded border-2 ${element.color === color ? "border-primary" : "border-transparent"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onUpdate({ color })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir Elemento
        </Button>
      </div>
    </div>
  );
}

interface TutorialDialogProps {
  isOpen: boolean;
  step: number;
  steps: TutorialStep[];
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

function TutorialDialog({
  isOpen,
  step,
  steps,
  onNext,
  onPrev,
  onClose,
}: TutorialDialogProps) {
  if (!isOpen) return null;

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

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
            {step + 1} de {steps.length}
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

interface HelpDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function HelpDialog({ isOpen, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                Use cores consistentes para categorizar elementos relacionados.
                Agrupe conceitos similares próximos uns dos outros.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Hierarquia Clara</h4>
              <p className="text-sm text-muted-foreground">
                Use sub-mapas para detalhar sistemas complexos. Mantenha o mapa
                principal com visão geral.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="features" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Navegação</h4>
              <p className="text-sm text-muted-foreground">
                No modo visualização, arraste para navegar pelo mapa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Edição</h4>
              <p className="text-sm text-muted-foreground">
                No modo edição, arraste elementos, use Delete para excluir.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface TemplateDialogProps {
  isOpen: boolean;
  templates: Template[];
  onOpenChange: (open: boolean) => void;
}

function TemplateDialog({
  isOpen,
  templates,
  onOpenChange,
}: TemplateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="text-sm">{template.name}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      Usar
                    </Button>
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
  );
}
