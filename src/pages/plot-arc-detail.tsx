import { useState, useEffect } from "react";

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
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

interface IPlotArc {
  id: string;
  name: string;
  size: "pequeno" | "médio" | "grande";
  focus: string;
  description: string;
  events: IPlotEvent[];
  progress: number;
  status: "planejamento" | "andamento" | "finalizado";
}

interface IPlotEvent {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  order: number;
}

// Mock data
const mockArcs: IPlotArc[] = [
  {
    id: "1",
    name: "A Ascensão do Herói",
    size: "grande",
    focus: "Desenvolvimento do protagonista",
    description:
      "O jovem pastor descobre seus poderes e aprende a controlá-los enquanto enfrenta os primeiros desafios.",
    progress: 65,
    status: "andamento",
    events: [
      {
        id: "1",
        name: "Descoberta dos poderes",
        description: "O protagonista manifesta sua magia pela primeira vez",
        completed: true,
        order: 1,
      },
      {
        id: "2",
        name: "Encontro com o mentor",
        description: "Conhece o sábio que o guiará",
        completed: true,
        order: 2,
      },
      {
        id: "3",
        name: "Primeiro desafio",
        description: "Enfrenta seu primeiro inimigo real",
        completed: false,
        order: 3,
      },
      {
        id: "4",
        name: "Revelação sobre o passado",
        description: "Descobre a verdade sobre sua origem",
        completed: false,
        order: 4,
      },
    ],
  },
  {
    id: "2",
    name: "A Guerra das Sombras",
    size: "grande",
    focus: "Conflito principal",
    description:
      "O protagonista lidera uma guerra contra as forças das trevas que ameaçam consumir o reino.",
    progress: 0,
    status: "planejamento",
    events: [
      {
        id: "5",
        name: "Chamado à guerra",
        description: "O reino pede ajuda ao protagonista",
        completed: false,
        order: 1,
      },
      {
        id: "6",
        name: "Formação da aliança",
        description: "Reúne heróis para a batalha final",
        completed: false,
        order: 2,
      },
    ],
  },
];

export function PlotArcDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [arc, setArc] = useState<PlotArc | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PlotArc>>({});
  const [showDeleteArcDialog, setShowDeleteArcDialog] = useState(false);
  const [showDeleteEventDialog, setShowDeleteEventDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  useEffect(() => {
    const foundArc = mockArcs.find((a) => a.id === id);
    if (foundArc) {
      setArc(foundArc);
      setEditForm(foundArc);
    }
  }, [id]);

  if (!arc) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Arco não encontrado</h2>
          <Button onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </div>
    );
  }

  const getSizeColor = (size: string) => {
    switch (size) {
      case "pequeno":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "médio":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "grande":
        return "bg-red-500/20 text-red-400 border-red-400/30";
      default:
        return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finalizado":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "andamento":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "planejamento":
        return "bg-orange-500/20 text-orange-400 border-orange-400/30";
      default:
        return "bg-muted";
    }
  };

  const toggleEventCompletion = (eventId: string) => {
    setArc((prev) => {
      if (!prev) return prev;
      const updatedEvents = prev.events.map((event) =>
        event.id === eventId ? { ...event, completed: !event.completed } : event
      );
      const completedCount = updatedEvents.filter((e) => e.completed).length;
      const progress =
        updatedEvents.length > 0
          ? (completedCount / updatedEvents.length) * 100
          : 0;

      return { ...prev, events: updatedEvents, progress };
    });
  };

  const handleSave = () => {
    if (
      editForm.name &&
      editForm.focus &&
      editForm.description &&
      editForm.size &&
      editForm.status
    ) {
      setArc({ ...arc, ...editForm } as PlotArc);
      setIsEditing(false);
      toast("Arco atualizado com sucesso!");
    }
  };

  const handleDeleteArc = () => {
    toast("Arco excluído com sucesso!");
    navigate(-1);
  };

  const handleDeleteEvent = () => {
    if (eventToDelete) {
      setArc((prev) => {
        if (!prev) return prev;
        const updatedEvents = prev.events.filter((e) => e.id !== eventToDelete);
        const completedCount = updatedEvents.filter((e) => e.completed).length;
        const progress =
          updatedEvents.length > 0
            ? (completedCount / updatedEvents.length) * 100
            : 0;

        return { ...prev, events: updatedEvents, progress };
      });
      setEventToDelete(null);
      setShowDeleteEventDialog(false);
      toast("Evento excluído com sucesso!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
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
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      placeholder="Nome do arco"
                    />
                    <Input
                      value={editForm.focus || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, focus: e.target.value })
                      }
                      placeholder="Foco do arco"
                    />
                    <Textarea
                      value={editForm.description || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Descrição do arco"
                      rows={3}
                    />
                    <div className="flex gap-4">
                      <Select
                        value={editForm.size}
                        onValueChange={(v) =>
                          setEditForm({ ...editForm, size: v as any })
                        }
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
                        onValueChange={(v) =>
                          setEditForm({ ...editForm, status: v as any })
                        }
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
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteArcDialog(true)}
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
                    onClick={() => toggleEventCompletion(event.id)}
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
                      onClick={() => {
                        setEventToDelete(event.id);
                        setShowDeleteEventDialog(true);
                      }}
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
        onOpenChange={setShowDeleteArcDialog}
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
              onClick={handleDeleteArc}
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
        onOpenChange={setShowDeleteEventDialog}
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
            <AlertDialogCancel onClick={() => setEventToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
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
