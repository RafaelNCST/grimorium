import {
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Star,
  GitBranch,
  ArrowUp,
  ArrowDown,
  Filter,
} from "lucide-react";

import { CreatePlotArcModal } from "@/components/modals/create-plot-arc-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  IPlotArc,
  IPlotEvent,
  PlotArcSize,
  PlotArcStatus,
} from "@/types/plot-types";

interface PropsPlotView {
  arcs: IPlotArc[];
  showCreateModal: boolean;
  statusFilter: string;
  filteredAndSortedArcs: IPlotArc[];
  bookId: string;
  onSetShowCreateModal: (show: boolean) => void;
  onSetStatusFilter: (filter: string) => void;
  onCreateArc: (arcData: Omit<IPlotArc, "id" | "events" | "progress">) => void;
  onMoveArc: (arcId: string, direction: "up" | "down") => void;
  onPlotTimelineClick: (bookId: string) => void;
  onArcClick: (arcId: string, bookId: string) => void;
  getSizeColor: (size: PlotArcSize) => string;
  getStatusColor: (status: PlotArcStatus) => string;
  getVisibleEvents: (events: IPlotEvent[]) => IPlotEvent[];
}

export function PlotView({
  arcs,
  showCreateModal,
  statusFilter,
  filteredAndSortedArcs,
  bookId,
  onSetShowCreateModal,
  onSetStatusFilter,
  onCreateArc,
  onMoveArc,
  onPlotTimelineClick,
  onArcClick,
  getSizeColor,
  getStatusColor,
  getVisibleEvents,
}: PropsPlotView) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Arcos Narrativos</h2>
          <p className="text-muted-foreground">
            Gerencie a estrutura da sua história
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={onSetStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="andamento">Em andamento</SelectItem>
              <SelectItem value="planejamento">Em planejamento</SelectItem>
              <SelectItem value="finalizado">Finalizados</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => onPlotTimelineClick(bookId)}>
            <GitBranch className="w-4 h-4 mr-2" />
            Árvore Visual
          </Button>
          <Button
            className="btn-magical"
            onClick={() => onSetShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Arco
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredAndSortedArcs.map((arc, index) => (
          <Card
            key={arc.id}
            className="card-magical cursor-pointer"
            onClick={() => onArcClick(arc.id, bookId)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {arc.name}
                    <Badge className={getStatusColor(arc.status)}>
                      {arc.status === "andamento" && (
                        <Star className="w-3 h-3 mr-1" />
                      )}
                      {arc.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {arc.description}
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getSizeColor(arc.size)}>{arc.size}</Badge>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveArc(arc.id, "up");
                      }}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveArc(arc.id, "down");
                      }}
                      disabled={index === filteredAndSortedArcs.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progresso</span>
                    <span className="text-sm text-muted-foreground">
                      {arc.progress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={arc.progress} className="h-2" />
                </div>

                {arc.events.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Próximos Eventos
                    </h4>
                    <div className="space-y-2">
                      {getVisibleEvents(arc.events).map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          {event.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span
                            className={
                              event.completed
                                ? "line-through text-muted-foreground"
                                : ""
                            }
                          >
                            {event.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreatePlotArcModal
        open={showCreateModal}
        onOpenChange={onSetShowCreateModal}
        onCreateArc={onCreateArc}
        existingArcs={arcs}
      />
    </div>
  );
}
