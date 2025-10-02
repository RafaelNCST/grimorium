import React from "react";

import { ArrowLeft, CheckCircle2, Clock, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IPlotArc } from "@/mocks/local/plot-arcs";

interface PlotTimelineViewProps {
  sortedArcs: IPlotArc[];
  onBack: () => void;
  onArcClick: (arcId: string) => void;
  getSizeColor: (size: string) => string;
}

export function PlotTimelineView({
  sortedArcs,
  onBack,
  onArcClick,
  getSizeColor,
}: PlotTimelineViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Árvore Visual dos Arcos</h1>
          </div>
          <p className="text-muted-foreground">
            Visualização cronológica dos arcos narrativos da sua história
          </p>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Timeline visualization - showing all arcs in order */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-glow to-primary transform -translate-y-1/2 z-0" />

          {/* Timeline content - horizontal layout */}
          <div className="flex gap-6 justify-center items-center min-h-[400px] relative z-10 overflow-x-auto pb-4">
            {sortedArcs.map((arc, index) => (
              <div key={arc.id} className="flex-shrink-0 w-80 relative">
                {/* Position indicator */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Arc card */}
                <div
                  className={arc.status === "andamento" ? "transform scale-110" : ""}
                >
                  <Card
                    className="card-magical cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={() => onArcClick(arc.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {arc.status === "finalizado" && (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        )}
                        {arc.status === "andamento" && (
                          <Target className="w-5 h-5 text-blue-400" />
                        )}
                        {arc.status === "planejamento" && (
                          <Clock className="w-5 h-5 text-orange-400" />
                        )}
                        {arc.name}
                        <Badge
                          className={
                            arc.status === "finalizado"
                              ? "bg-green-500/20 text-green-400 border-green-400/30"
                              : arc.status === "andamento"
                                ? "bg-blue-500/20 text-blue-400 border-blue-400/30"
                                : "bg-orange-500/20 text-orange-400 border-orange-400/30"
                          }
                        >
                          {arc.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {arc.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Badge className={getSizeColor(arc.size)}>{arc.size}</Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            #{arc.order + 1}
                          </span>
                          <span className="text-sm font-medium">
                            {arc.progress.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Status indicator below */}
                <div className="text-center mt-2">
                  <Badge
                    className={
                      arc.status === "finalizado"
                        ? "bg-green-500/20 text-green-400 border-green-400/30"
                        : arc.status === "andamento"
                          ? "bg-blue-500/20 text-blue-400 border-blue-400/30"
                          : "bg-orange-500/20 text-orange-400 border-orange-400/30"
                    }
                  >
                    {arc.status === "finalizado"
                      ? "Finalizado"
                      : arc.status === "andamento"
                        ? "Em Andamento"
                        : "Planejamento"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 bg-card rounded-lg p-6 border border-border">
          <h4 className="font-semibold mb-4">Legenda</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Arcos finalizados</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Arco em andamento (destacado)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Arcos em planejamento</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Os números mostram a ordem cronológica dos arcos na sua história. Use as setas na
            aba Plot para reordenar.
          </p>
        </div>
      </div>
    </div>
  );
}
