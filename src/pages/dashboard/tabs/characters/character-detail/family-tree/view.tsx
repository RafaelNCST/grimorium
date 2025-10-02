import { ArrowLeft, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Character, type TreeNode } from "@/mocks/local/family-data";

interface PropsFamilyTreeView {
  character: Character;
  treeNodes: TreeNode[];
  generations: number[];
  zoom: number;
  isFullscreen: boolean;
  onBack: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  getGenerationLabel: (generation: number) => string;
  getRelationColor: (relation: string) => string;
}

export function FamilyTreeView({
  character,
  treeNodes,
  generations,
  zoom,
  isFullscreen,
  onBack,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  getGenerationLabel,
  getRelationColor,
}: PropsFamilyTreeView) {
  if (treeNodes.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">
            Árvore Genealógica - {character.name}
          </h1>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhuma relação familiar foi definida para este personagem.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Adicione relações familiares no modo de edição do personagem.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`container mx-auto py-8 px-4 ${isFullscreen ? "max-w-full h-screen" : "max-w-7xl"}`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">
            Árvore Genealógica - {character.name}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            disabled={zoom >= 2}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToggleFullscreen}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className={`flex-1 overflow-auto p-6 bg-muted/20 rounded-lg ${isFullscreen ? "h-[calc(100vh-200px)]" : "min-h-[70vh]"}`}
      >
        <div
          className="min-w-max min-h-full flex flex-col items-center justify-center space-y-8 transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          {generations.map((generation) => {
            const generationNodes = treeNodes.filter(
              (n) => n.generation === generation
            );

            return (
              <div key={generation} className="w-full">
                <div className="text-center mb-4">
                  <Badge variant="outline" className="text-xs">
                    {getGenerationLabel(generation)}
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-6 flex-wrap">
                  {generationNodes.map((node) => (
                    <Card
                      key={node.id}
                      className={`w-48 ${node.id === character.id ? "ring-2 ring-primary" : ""}`}
                    >
                      <CardContent className="p-4 text-center">
                        <Avatar className="w-12 h-12 mx-auto mb-3">
                          <AvatarImage src={node.image} />
                          <AvatarFallback>
                            {node.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <h4 className="font-medium text-sm mb-2">
                          {node.name}
                        </h4>

                        <div className="flex flex-wrap gap-1 justify-center">
                          {node.relations.map((relation) => (
                            <Badge
                              key={relation}
                              className={`text-xs ${getRelationColor(relation)}`}
                            >
                              {relation === "main" ? "Personagem" : relation}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {generation > generations[generations.length - 1] && (
                  <div className="flex justify-center my-4">
                    <div className="w-px h-8 bg-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <p className="text-xs text-muted-foreground">
          Use os controles de zoom para navegar pela árvore genealógica
        </p>
      </div>
    </div>
  );
}
