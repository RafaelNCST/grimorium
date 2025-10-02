import { RefObject } from "react";
import {
  Eye,
  Edit,
  Save,
  HelpCircle,
  Copy,
  ArrowLeft,
  Square,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { HelpDialog } from "./components/help-dialog";
import { PropertiesPanel } from "./components/properties-panel";
import { TemplateDialog } from "./components/template-dialog";
import { TutorialDialog } from "./components/tutorial-dialog";
import { PowerElement } from "./components/power-element";
import {
  IPowerElement,
  IPowerMap,
  ITemplate,
  ElementType,
} from "./types/power-system-types";

interface IElementTypeInfo {
  type: ElementType;
  name: string;
  description: string;
}

interface ITutorialStep {
  title: string;
  content: string;
  target: string | null;
}

interface PropsPowerSystemView {
  isEditMode: boolean;
  currentMap: IPowerMap;
  maps: IPowerMap[];
  templates: ITemplate[];
  selectedElement: string | null;
  viewOffset: { x: number; y: number };
  showCreateDialog: boolean;
  newElementType: ElementType;
  showTemplateDialog: boolean;
  showTutorialDialog: boolean;
  tutorialStep: number;
  showHelpDialog: boolean;
  showPropertiesPanel: boolean;
  selectedElementData: IPowerElement | null;
  elementTypes: IElementTypeInfo[];
  defaultColors: string[];
  tutorialSteps: ITutorialStep[];
  canvasRef: RefObject<HTMLDivElement>;
  onToggleEditMode: () => void;
  onSave: () => void;
  onSetShowHelpDialog: (show: boolean) => void;
  onGoBackToParent: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onElementClick: (element: IPowerElement) => void;
  onSetShowCreateDialog: (show: boolean) => void;
  onSetNewElementType: (type: ElementType) => void;
  onCreateElement: (type: ElementType) => void;
  onSetShowTutorialDialog: (show: boolean) => void;
  onSetShowTemplateDialog: (show: boolean) => void;
  onUpdateElement: (id: string, updates: Partial<IPowerElement>) => void;
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
  elementTypes,
  defaultColors,
  tutorialSteps,
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
}: PropsPowerSystemView) {
  return (
    <div className="h-full flex">
      {isEditMode && (
        <div className="w-64 bg-background border-r flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-1">Elementos</h3>
            <p className="text-xs text-muted-foreground">
              Clique para adicionar ao mapa
            </p>
          </div>

          <div className="flex-1 p-4 space-y-3">
            {elementTypes.map((elementType) => (
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

      <div className="flex-1 flex flex-col">
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

        <div className="flex-1 flex relative">
          <div
            ref={canvasRef}
            className="flex-1 min-h-[60vh] relative overflow-hidden bg-muted/20 cursor-grab active:cursor-grabbing"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
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

            {currentMap.elements.map((element) => (
              <PowerElement
                key={element.id}
                element={element}
                viewOffset={viewOffset}
                isSelected={selectedElement === element.id}
                isEditMode={isEditMode}
                onClick={() => onElementClick(element)}
              />
            ))}

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

          {isEditMode && showPropertiesPanel && selectedElementData && (
            <div className="w-80 bg-background border-l">
              <PropertiesPanel
                element={selectedElementData}
                defaultColors={defaultColors}
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

      <TutorialDialog
        isOpen={showTutorialDialog}
        step={tutorialStep}
        steps={tutorialSteps}
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
