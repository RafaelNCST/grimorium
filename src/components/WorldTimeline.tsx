import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Clock, Calendar, Users, Building, Info, ChevronDown, Sparkles, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Interfaces
interface TimelineEvent {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  reason: string;
  outcome: string;
  startDate: string;
  endDate: string;
  charactersInvolved: string[];
  organizationsInvolved: string[];
}

interface TimelineEra {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  events: TimelineEvent[];
}

interface WorldTimelineProps {
  worldId: string;
  worldType: "World" | "Continent";
  isEditing: boolean;
}

// Mock data for select options
const mockCharacters = [
  { id: "1", name: "Aldara, a Guardiã" },
  { id: "2", name: "Theron Sombraluna" },
  { id: "3", name: "Lyria Ventolâmina" },
  { id: "4", name: "Kael Forjacerta" }
];

const mockOrganizations = [
  { id: "1", name: "Ordem dos Guardiões" },
  { id: "2", name: "Culto das Sombras" },
  { id: "3", name: "Reino de Aethermoor" },
  { id: "4", name: "Academia Arcana" }
];

// Mock timeline data
const mockTimeline: TimelineEra[] = [
  {
    id: "1",
    name: "Era dos Primórdios",
    description: "Era inicial do mundo, quando a magia ainda era selvagem e as primeiras civilizações começaram a se formar.",
    startDate: "0 EP (Era Primordial)",
    endDate: "1000 EP",
    events: [
      {
        id: "1",
        name: "A Grande Convergência",
        description: "Um evento cataclísmico que uniu múltiplas dimensões mágicas em uma única realidade, criando o mundo como conhecemos hoje. As energias mágicas se estabilizaram e permitiram o desenvolvimento das primeiras formas de vida inteligente.",
        shortDescription: "Evento que uniu dimensões mágicas e criou o mundo atual",
        reason: "Instabilidade dimensional causada por antigos rituais arcanos",
        outcome: "Estabilização da magia e surgimento das primeiras civilizações",
        startDate: "50 EP",
        endDate: "52 EP",
        charactersInvolved: ["1"],
        organizationsInvolved: ["1"]
      },
      {
        id: "2", 
        name: "Nascimento dos Guardiões",
        description: "Formação da primeira ordem dedicada a proteger o equilíbrio mágico do mundo. Os primeiros Guardiões foram escolhidos pelos próprios elementos.",
        shortDescription: "Criação da primeira ordem de guardiões mágicos",
        reason: "Necessidade de proteger o mundo de ameaças mágicas",
        outcome: "Estabelecimento da Ordem dos Guardiões",
        startDate: "250 EP",
        endDate: "260 EP",
        charactersInvolved: ["1"],
        organizationsInvolved: ["1"]
      }
    ]
  },
  {
    id: "2",
    name: "Era das Trevas",
    description: "Período sombrio marcado por guerras e o surgimento de forças maléficas que ameaçaram destruir o mundo.",
    startDate: "1001 EP",
    endDate: "2500 EP",
    events: [
      {
        id: "3",
        name: "A Corrupção das Sombras",
        description: "Surgimento de uma força sombria que corrompeu várias regiões do mundo, transformando terras férteis em desertos amaldiçoados e criando criaturas aberrantes.",
        shortDescription: "Surgimento de força sombria que corrompeu o mundo",
        reason: "Experimentos proibidos com magia sombria",
        outcome: "Criação do Culto das Sombras e corrupção de vastas áreas",
        startDate: "1200 EP",
        endDate: "1350 EP",
        charactersInvolved: ["2"],
        organizationsInvolved: ["2"]
      }
    ]
  }
];

export function WorldTimeline({ worldId, worldType, isEditing }: WorldTimelineProps) {
  const [timeline, setTimeline] = useState<TimelineEra[]>(mockTimeline);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateEraModal, setShowCreateEraModal] = useState(false);
  const [showEditEraModal, setShowEditEraModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedEraId, setSelectedEraId] = useState<string>("");
  const [editingEra, setEditingEra] = useState<TimelineEra | null>(null);
  const [editingEvent, setEditingEvent] = useState<boolean>(false);
  
  const [newEra, setNewEra] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "", 
    shortDescription: "",
    reason: "",
    outcome: "",
    startDate: "",
    endDate: "",
    charactersInvolved: [] as string[],
    organizationsInvolved: [] as string[]
  });

  const [editEra, setEditEra] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  const handleCreateEra = () => {
    if (!newEra.name.trim()) {
      toast.error("Nome da era é obrigatório");
      return;
    }

    const era: TimelineEra = {
      id: Date.now().toString(),
      ...newEra,
      events: []
    };

    setTimeline([...timeline, era]);
    setNewEra({ name: "", description: "", startDate: "", endDate: "" });
    setShowCreateEraModal(false);
    toast.success("Era criada com sucesso!");
  };

  const handleCreateEvent = () => {
    if (!newEvent.name.trim() || !selectedEraId) {
      toast.error("Nome do evento e era são obrigatórios");
      return;
    }

    const event: TimelineEvent = {
      id: Date.now().toString(),
      ...newEvent
    };

    setTimeline(prev => prev.map(era => 
      era.id === selectedEraId 
        ? { ...era, events: [...era.events, event] }
        : era
    ));

    setNewEvent({
      name: "",
      description: "", 
      shortDescription: "",
      reason: "",
      outcome: "",
      startDate: "",
      endDate: "",
      charactersInvolved: [],
      organizationsInvolved: []
    });
    setSelectedEraId("");
    setShowCreateEventModal(false);
    toast.success("Evento criado com sucesso!");
  };

  const openEventDetails = (event: TimelineEvent, edit: boolean = false) => {
    setSelectedEvent(event);
    setEditingEvent(edit);
    if (edit) {
      setNewEvent({
        name: event.name,
        description: event.description,
        shortDescription: event.shortDescription,
        reason: event.reason,
        outcome: event.outcome,
        startDate: event.startDate,
        endDate: event.endDate,
        charactersInvolved: [...event.charactersInvolved],
        organizationsInvolved: [...event.organizationsInvolved]
      });
    }
    setShowEventModal(true);
  };

  const handleEditEra = (era: TimelineEra) => {
    setEditingEra(era);
    setEditEra({
      name: era.name,
      description: era.description,
      startDate: era.startDate,
      endDate: era.endDate
    });
    setShowEditEraModal(true);
  };

  const handleUpdateEra = () => {
    if (!editEra.name.trim() || !editingEra) {
      toast.error("Nome da era é obrigatório");
      return;
    }

    setTimeline(prev => prev.map(era => 
      era.id === editingEra.id 
        ? { ...era, ...editEra }
        : era
    ));

    setEditEra({ name: "", description: "", startDate: "", endDate: "" });
    setEditingEra(null);
    setShowEditEraModal(false);
    toast.success("Era atualizada com sucesso!");
  };

  const handleUpdateEvent = () => {
    if (!newEvent.name.trim() || !selectedEvent) {
      toast.error("Nome do evento é obrigatório");
      return;
    }

    const updatedEvent: TimelineEvent = {
      ...selectedEvent,
      ...newEvent
    };

    setTimeline(prev => prev.map(era => ({
      ...era,
      events: era.events.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      )
    })));

    setNewEvent({
      name: "",
      description: "", 
      shortDescription: "",
      reason: "",
      outcome: "",
      startDate: "",
      endDate: "",
      charactersInvolved: [],
      organizationsInvolved: []
    });
    setSelectedEvent(null);
    setEditingEvent(false);
    setShowEventModal(false);
    toast.success("Evento atualizado com sucesso!");
  };

  const handleDeleteEra = (eraId: string) => {
    setTimeline(prev => prev.filter(era => era.id !== eraId));
    toast.success("Era excluída com sucesso!");
  };

  const handleDeleteEvent = (eventId: string) => {
    setTimeline(prev => prev.map(era => ({
      ...era,
      events: era.events.filter(event => event.id !== eventId)
    })));
    setSelectedEvent(null);
    setEditingEvent(false);
    setShowEventModal(false);
    toast.success("Evento excluído com sucesso!");
  };

  const getCharacterName = (id: string) => {
    return mockCharacters.find(c => c.id === id)?.name || "Personagem não encontrado";
  };

  const getOrganizationName = (id: string) => {
    return mockOrganizations.find(o => o.id === id)?.name || "Organização não encontrada";
  };

  if (timeline.length === 0) {
    return (
      <Card className="card-magical">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Clock className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma Linha do Tempo Definida</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Crie a primeira era para começar a documentar a história deste {worldType === "World" ? "mundo" : "continente"}.
          </p>
          {isEditing && (
            <Button onClick={() => setShowCreateEraModal(true)} className="btn-magical">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Era
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-magical">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Linha do Tempo
            </CardTitle>
            <CardDescription>
              História cronológica de {worldType === "World" ? "mundo" : "continente"}
            </CardDescription>
          </div>
          {isEditing && (
            <Button onClick={() => setShowCreateEraModal(true)} size="sm" className="btn-magical">
              <Plus className="w-4 h-4 mr-2" />
              Nova Era
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Enhanced Timeline Line with Gradient and Glow */}
          <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/40 rounded-full shadow-lg">
            <div className="absolute inset-0 w-1 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 rounded-full blur-sm"></div>
          </div>
          
          <Accordion type="multiple" className="space-y-6">
            {timeline.map((era, eraIndex) => (
              <AccordionItem key={era.id} value={era.id} className="border-none">
                <div className="relative">
                  {/* Era Marker with Enhanced Design */}
                  <div className="absolute left-8 top-6 z-20">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 border-4 border-background shadow-xl flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <div className="absolute inset-0 w-8 h-8 rounded-full bg-primary/20 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Era Card with Enhanced Styling */}
                  <div className="ml-20 relative">
                    <AccordionTrigger className="hover:no-underline p-0 [&[data-state=open]>div]:shadow-lg">
                      <div className="w-full bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                         <div className="flex items-center justify-between w-full">
                          <div className="text-left">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                              {era.name}
                            </h3>
                            <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-primary/20">
                              <Clock className="w-3 h-3 mr-1" />
                              {era.startDate} - {era.endDate}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {isEditing && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditEra(era);
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-primary/10"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEra(era.id);
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            {era.events.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {era.events.length} evento{era.events.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                          {era.description}
                        </p>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="pt-4 pb-0">
                      <div className="ml-6 border-l-2 border-dashed border-muted-foreground/20 pl-6 space-y-4">
                        {era.events.length > 0 ? (
                          <>
                            {era.events.map((event, eventIndex) => (
                              <div key={event.id} className="relative">
                                {/* Event Marker */}
                                <div className="absolute -left-8 top-3">
                                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary/60 to-primary/40 border-2 border-background shadow-md"></div>
                                </div>
                                
                                {/* Event Card */}
                                 <Card 
                                  className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] bg-gradient-to-r from-card to-card/80 border-border/50 hover:border-primary/30"
                                  onClick={() => openEventDetails(event)}
                                >
                                  <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-foreground/90 mb-1">
                                          {event.name}
                                        </h4>
                                        <Badge variant="outline" className="text-xs bg-muted/50">
                                          <Calendar className="w-3 h-3 mr-1" />
                                          {event.startDate} - {event.endDate}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {isEditing && (
                                          <>
                                            <Button 
                                              size="sm" 
                                              variant="ghost" 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                openEventDetails(event, true);
                                              }}
                                              className="h-6 w-6 p-0 hover:bg-primary/10"
                                            >
                                              <Edit className="w-3 h-3" />
                                            </Button>
                                            <Button 
                                              size="sm" 
                                              variant="ghost" 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteEvent(event.id);
                                              }}
                                              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </Button>
                                          </>
                                        )}
                                        <Info className="w-4 h-4 text-muted-foreground/60" />
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                      {event.shortDescription}
                                    </p>
                                    {(event.charactersInvolved.length > 0 || event.organizationsInvolved.length > 0) && (
                                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                                        {event.charactersInvolved.length > 0 && (
                                          <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">
                                              {event.charactersInvolved.length} personagem{event.charactersInvolved.length !== 1 ? 's' : ''}
                                            </span>
                                          </div>
                                        )}
                                        {event.organizationsInvolved.length > 0 && (
                                          <div className="flex items-center gap-1">
                                            <Building className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">
                                              {event.organizationsInvolved.length} organização{event.organizationsInvolved.length !== 1 ? 'ões' : ''}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            ))}
                            
                            {/* Add Event Button */}
                            {isEditing && (
                              <div className="relative">
                                <div className="absolute -left-8 top-3">
                                  <div className="w-3 h-3 rounded-full border-2 border-dashed border-muted-foreground/40 bg-muted/20"></div>
                                </div>
                                <Button 
                                  onClick={() => {
                                    setSelectedEraId(era.id);
                                    setShowCreateEventModal(true);
                                  }}
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-muted-foreground hover:text-primary hover:bg-primary/5 border border-dashed border-muted-foreground/30 hover:border-primary/30 w-full justify-start"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Adicionar Evento
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          isEditing && (
                            <div className="text-center py-8">
                              <div className="relative">
                                <div className="absolute -left-8 top-6">
                                  <div className="w-3 h-3 rounded-full border-2 border-dashed border-muted-foreground/40 bg-muted/20"></div>
                                </div>
                                <div className="bg-muted/20 rounded-lg p-6 border border-dashed border-muted-foreground/30">
                                  <Clock className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                                  <p className="text-sm text-muted-foreground mb-4">
                                    Esta era ainda não possui eventos
                                  </p>
                                  <Button 
                                    onClick={() => {
                                      setSelectedEraId(era.id);
                                      setShowCreateEventModal(true);
                                    }}
                                    size="sm" 
                                    className="btn-magical"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Criar Primeiro Evento
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </AccordionContent>
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>

      {/* Event Details/Edit Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {editingEvent ? "Editar Evento" : selectedEvent?.name}
            </DialogTitle>
            <DialogDescription>
              {editingEvent ? "Modifique as informações do evento" : `${selectedEvent?.startDate} - ${selectedEvent?.endDate}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            editingEvent ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="edit-event-name">Nome do Evento *</Label>
                  <Input
                    id="edit-event-name"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: A Grande Convergência"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-event-short-desc">Descrição Resumida *</Label>
                  <Textarea
                    id="edit-event-short-desc"
                    value={newEvent.shortDescription}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="Descrição breve que aparece no card da timeline"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-event-desc">Descrição Completa</Label>
                  <Textarea
                    id="edit-event-desc"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição detalhada que aparece no modal"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-reason">Motivo</Label>
                    <Textarea
                      id="edit-event-reason"
                      value={newEvent.reason}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Por que aconteceu?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-outcome">Como Terminou</Label>
                    <Textarea
                      id="edit-event-outcome"
                      value={newEvent.outcome}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, outcome: e.target.value }))}
                      placeholder="Qual foi o resultado?"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-start">Data Início</Label>
                    <Input
                      id="edit-event-start"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                      placeholder="Ex: 50 EP"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-end">Data Fim</Label>
                    <Input
                      id="edit-event-end"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                      placeholder="Ex: 52 EP"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-event-characters">Personagens Envolvidos</Label>
                  <Select 
                    value={""} 
                    onValueChange={(value) => {
                      if (!newEvent.charactersInvolved.includes(value)) {
                        setNewEvent(prev => ({ 
                          ...prev, 
                          charactersInvolved: [...prev.charactersInvolved, value] 
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar personagens" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCharacters.map(char => (
                        <SelectItem key={char.id} value={char.id}>
                          {char.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newEvent.charactersInvolved.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newEvent.charactersInvolved.map(id => (
                        <Badge 
                          key={id} 
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => setNewEvent(prev => ({
                            ...prev,
                            charactersInvolved: prev.charactersInvolved.filter(cid => cid !== id)
                          }))}
                        >
                          {getCharacterName(id)} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-event-organizations">Organizações Envolvidas</Label>
                  <Select 
                    value={""} 
                    onValueChange={(value) => {
                      if (!newEvent.organizationsInvolved.includes(value)) {
                        setNewEvent(prev => ({ 
                          ...prev, 
                          organizationsInvolved: [...prev.organizationsInvolved, value] 
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar organizações" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockOrganizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newEvent.organizationsInvolved.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newEvent.organizationsInvolved.map(id => (
                        <Badge 
                          key={id} 
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => setNewEvent(prev => ({
                            ...prev,
                            organizationsInvolved: prev.organizationsInvolved.filter(oid => oid !== id)
                          }))}
                        >
                          {getOrganizationName(id)} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setEditingEvent(false);
                    setShowEventModal(false);
                  }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateEvent} className="btn-magical">
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Descrição</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Motivo</h4>
                    <p className="text-muted-foreground text-sm">
                      {selectedEvent.reason}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Como Terminou</h4>
                    <p className="text-muted-foreground text-sm">
                      {selectedEvent.outcome}
                    </p>
                  </div>
                </div>

                {selectedEvent.charactersInvolved.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Personagens Envolvidos
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.charactersInvolved.map(id => (
                        <Badge key={id} variant="secondary">
                          {getCharacterName(id)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.organizationsInvolved.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Organizações Envolvidas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.organizationsInvolved.map(id => (
                        <Badge key={id} variant="outline">
                          {getOrganizationName(id)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => openEventDetails(selectedEvent, true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar Evento
                    </Button>
                  </div>
                )}
              </div>
            )
          )}
        </DialogContent>
      </Dialog>

      {/* Create Era Modal */}
      <Dialog open={showCreateEraModal} onOpenChange={setShowCreateEraModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Era</DialogTitle>
            <DialogDescription>
              Crie uma nova era na linha do tempo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="era-name">Nome da Era *</Label>
              <Input
                id="era-name"
                value={newEra.name}
                onChange={(e) => setNewEra(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Era dos Primórdios"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="era-description">Descrição</Label>
              <Textarea
                id="era-description"
                value={newEra.description}
                onChange={(e) => setNewEra(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Breve descrição da era (máximo 2 linhas)"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="era-start">Início</Label>
                <Input
                  id="era-start"
                  value={newEra.startDate}
                  onChange={(e) => setNewEra(prev => ({ ...prev, startDate: e.target.value }))}
                  placeholder="Ex: 0 EP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="era-end">Fim</Label>
                <Input
                  id="era-end"
                  value={newEra.endDate}
                  onChange={(e) => setNewEra(prev => ({ ...prev, endDate: e.target.value }))}
                  placeholder="Ex: 1000 EP"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowCreateEraModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateEra} className="btn-magical">
              Criar Era
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog open={showCreateEventModal} onOpenChange={setShowCreateEventModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Evento</DialogTitle>
            <DialogDescription>
              Adicione um novo evento à linha do tempo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="event-name">Nome do Evento *</Label>
              <Input
                id="event-name"
                value={newEvent.name}
                onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: A Grande Convergência"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-short-desc">Descrição Resumida *</Label>
              <Textarea
                id="event-short-desc"
                value={newEvent.shortDescription}
                onChange={(e) => setNewEvent(prev => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="Descrição breve que aparece no card da timeline"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-desc">Descrição Completa</Label>
              <Textarea
                id="event-desc"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição detalhada que aparece no modal"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-reason">Motivo</Label>
                <Textarea
                  id="event-reason"
                  value={newEvent.reason}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Por que aconteceu?"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-outcome">Como Terminou</Label>
                <Textarea
                  id="event-outcome"
                  value={newEvent.outcome}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, outcome: e.target.value }))}
                  placeholder="Qual foi o resultado?"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-start">Data Início</Label>
                <Input
                  id="event-start"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                  placeholder="Ex: 50 EP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-end">Data Fim</Label>
                <Input
                  id="event-end"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                  placeholder="Ex: 52 EP"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-characters">Personagens Envolvidos</Label>
              <Select 
                value={""} 
                onValueChange={(value) => {
                  if (!newEvent.charactersInvolved.includes(value)) {
                    setNewEvent(prev => ({ 
                      ...prev, 
                      charactersInvolved: [...prev.charactersInvolved, value] 
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar personagens" />
                </SelectTrigger>
                <SelectContent>
                  {mockCharacters.map(char => (
                    <SelectItem key={char.id} value={char.id}>
                      {char.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newEvent.charactersInvolved.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newEvent.charactersInvolved.map(id => (
                    <Badge 
                      key={id} 
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setNewEvent(prev => ({
                        ...prev,
                        charactersInvolved: prev.charactersInvolved.filter(cid => cid !== id)
                      }))}
                    >
                      {getCharacterName(id)} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-organizations">Organizações Envolvidas</Label>
              <Select 
                value={""} 
                onValueChange={(value) => {
                  if (!newEvent.organizationsInvolved.includes(value)) {
                    setNewEvent(prev => ({ 
                      ...prev, 
                      organizationsInvolved: [...prev.organizationsInvolved, value] 
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar organizações" />
                </SelectTrigger>
                <SelectContent>
                  {mockOrganizations.map(org => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newEvent.organizationsInvolved.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newEvent.organizationsInvolved.map(id => (
                    <Badge 
                      key={id} 
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setNewEvent(prev => ({
                        ...prev,
                        organizationsInvolved: prev.organizationsInvolved.filter(oid => oid !== id)
                      }))}
                    >
                      {getOrganizationName(id)} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowCreateEventModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateEvent} className="btn-magical">
              Criar Evento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Era Modal */}
      <Dialog open={showEditEraModal} onOpenChange={setShowEditEraModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Era</DialogTitle>
            <DialogDescription>
              Modifique as informações da era.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-era-name">Nome da Era *</Label>
              <Input
                id="edit-era-name"
                value={editEra.name}
                onChange={(e) => setEditEra(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Era dos Primórdios"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-era-description">Descrição</Label>
              <Textarea
                id="edit-era-description"
                value={editEra.description}
                onChange={(e) => setEditEra(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Breve descrição da era (máximo 2 linhas)"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-era-start">Início</Label>
                <Input
                  id="edit-era-start"
                  value={editEra.startDate}
                  onChange={(e) => setEditEra(prev => ({ ...prev, startDate: e.target.value }))}
                  placeholder="Ex: 0 EP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-era-end">Fim</Label>
                <Input
                  id="edit-era-end"
                  value={editEra.endDate}
                  onChange={(e) => setEditEra(prev => ({ ...prev, endDate: e.target.value }))}
                  placeholder="Ex: 1000 EP"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowEditEraModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateEra} className="btn-magical">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}