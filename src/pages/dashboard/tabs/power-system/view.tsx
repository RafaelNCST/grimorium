import { RefObject } from "react";

import {
  HelpCircle,
  Copy,
  ArrowLeft,
  Square,
  Zap,
  BookOpen,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import { HelpDialog } from "./components/help-dialog";
import { PowerElement } from "./components/power-element";
import { PropertiesPanel } from "./components/properties-panel";
import { TemplateDialog } from "./components/template-dialog";
import { TutorialDialog } from "./components/tutorial-dialog";
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
  isHeaderHidden: boolean;
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
  isHeaderHidden,
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
  const { t } = useTranslation("power-system");

  // Calculate header height based on isHeaderHidden to align with TabsBar padding
  // TabsBar uses pt-2 (8px) when hidden, pt-6 (24px) when visible
  // We need to compensate the 16px difference (24px - 8px)
  const headerHeight = isHeaderHidden ? "h-[88px]" : "h-[72px]";

  return (
    <div className="h-full flex">
      <div className="w-64 bg-background border-r flex flex-col">
          <div className={`${headerHeight} px-4 py-4 flex flex-col justify-center border-b`}>
            <h3 className="font-semibold mb-1">{t("page.elements")}</h3>
            <p className="text-xs text-muted-foreground">
              {t("page.elements_description")}
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
        </div>

      <div className="flex-1 flex flex-col">
        <div className={`${headerHeight} flex items-center justify-between px-4 py-4 border-b bg-background`}>
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{t("page.title")}</h2>
              <p className="text-muted-foreground">{t("page.description")}</p>
            </div>

            {currentMap.parentMapId && (
              <Button variant="outline" size="sm" onClick={onGoBackToParent}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("page.back")}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetShowTutorialDialog(true)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {t("page.tutorial")}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetShowTemplateDialog(true)}
            >
              <Copy className="w-4 h-4 mr-2" />
              {t("page.templates")}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetShowHelpDialog(true)}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              {t("page.help")}
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
                isEditMode={true}
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
                    {t("empty_state.no_system")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t("empty_state.edit_mode_hint")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {showPropertiesPanel && selectedElementData && (
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
