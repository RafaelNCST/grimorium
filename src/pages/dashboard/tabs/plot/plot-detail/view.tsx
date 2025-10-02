import React from "react";

import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  Circle,
  Save,
  X,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IPlotArc } from "@/mocks/local/plot-arc-data";

interface PlotArcDetailViewProps {
  arc: IPlotArc;
  isEditing: boolean;
  editForm: Partial<IPlotArc>;
  showDeleteArcDialog: boolean;
  showDeleteEventDialog: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteArc: () => void;
  onDeleteEvent: () => void;
  onDeleteArcDialogChange: (open: boolean) => void;
  onDeleteEventDialogChange: (open: boolean) => void;
  onEditFormChange: (field: string, value: any) => void;
  onToggleEventCompletion: (eventId: string) => void;
  onEventDeleteRequest: (eventId: string) => void;
  getSizeColor: (size: string) => string;
  getStatusColor: (status: string) => string;
}

export function PlotArcDetailView({
  arc,
  isEditing,
  editForm,
  showDeleteArcDialog,
  showDeleteEventDialog,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDeleteArc,
  onDeleteEvent,
  onDeleteArcDialogChange,
  onDeleteEventDialogChange,
  onEditFormChange,
  onToggleEventCompletion,
  onEventDeleteRequest,
  getSizeColor,
  getStatusColor,
}: PlotArcDetailViewProps) {
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
            <h1 className="text-2xl font-bold">Detalhes do Arco</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Arc Details */}
        <Card className="card-magical">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => onEditFormChange("name", e.target.value)}
                      placeholder="Nome do arco"
                    />
                    <Input
                      value={editForm.focus || ""}
                      onChange={(e) =>
                        onEditFormChange("focus", e.target.value)
                      }
                      placeholder="Foco do arco"
                    />
                    <Textarea
                      value={editForm.description || ""}
                      onChange={(e) =>
                        onEditFormChange("description", e.target.value)
                      }
                      placeholder="Descrição do arco"
                      rows={3}
                    />
                    <div className="flex gap-4">
                      <Select
                        value={editForm.size}
                        onValueChange={(v) => onEditFormChange("size", v)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Tamanho" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pequeno">Pequeno</SelectItem>
                          <SelectItem value="médio">Médio</SelectItem>
                          <SelectItem value="grande">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={editForm.status}
                        onValueChange={(v) => onEditFormChange("status", v)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planejamento">
                            Em Planejamento
                          </SelectItem>
                          <SelectItem value="andamento">
                            Em Andamento
                          </SelectItem>
                          <SelectItem value="finalizado">Finalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <CardTitle className="flex items-center gap-2 mb-2">
                      {arc.name}
                      <Badge className={getStatusColor(arc.status)}>
                        {arc.status === "andamento" && (
                          <Star className="w-3 h-3 mr-1" />
                        )}
                        {arc.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{arc.description}</CardDescription>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={onCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={onSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={onEdit}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDeleteArcDialogChange(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir Arco
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          {!isEditing && (
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tamanho
                  </label>
                  <Badge className={`mt-1 ${getSizeColor(arc.size)}`}>
                    {arc.size}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Foco
                  </label>
                  <p className="mt-1">{arc.focus}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Progresso</span>
                  <span className="text-sm text-muted-foreground">
                    {arc.progress.toFixed(0)}%
                  </span>
                </div>
                <Progress value={arc.progress} className="h-3" />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Events Chain */}
        <Card className="card-magical">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Cadeia de Eventos</CardTitle>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Evento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {arc.events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  <button
                    onClick={() => onToggleEventCompletion(event.id)}
                    className="mt-1 text-primary hover:text-primary-glow transition-colors"
                  >
                    {event.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-muted-foreground">
                        #{event.order}
                      </span>
                      <h4
                        className={`font-medium ${event.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {event.name}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEventDeleteRequest(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Arc Dialog */}
      <AlertDialog
        open={showDeleteArcDialog}
        onOpenChange={onDeleteArcDialogChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão do Arco</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o arco "{arc.name}"? Esta ação não
              pode ser desfeita e todos os eventos do arco também serão
              excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteArc}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Event Dialog */}
      <AlertDialog
        open={showDeleteEventDialog}
        onOpenChange={onDeleteEventDialogChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão do Evento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteEvent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
