import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Calendar, Users, Building, Info } from "lucide-react";
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
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedEraId, setSelectedEraId] = useState<string>("");
  
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

  const openEventDetails = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
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
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary opacity-30"></div>
          
          <div className="space-y-8">
            {timeline.map((era, eraIndex) => (
              <div key={era.id} className="relative">
                {/* Era Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg z-10 relative"></div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{era.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {era.startDate} - {era.endDate}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{era.description}</p>
                      {isEditing && era.events.length === 0 && (
                        <Button 
                          onClick={() => {
                            setSelectedEraId(era.id);
                            setShowCreateEventModal(true);
                          }}
                          size="sm" 
                          variant="outline" 
                          className="mt-3"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Primeiro Evento
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Events */}
                {era.events.length > 0 && (
                  <div className="ml-8 space-y-4 pb-4">
                    {era.events.map((event, eventIndex) => (
                      <div key={event.id} className="relative flex items-start gap-4">
                        <div className="relative">
                          <div className="w-2 h-2 rounded-full bg-primary/60 border-2 border-background relative z-10"></div>
                        </div>
                        <div className="flex-1">
                          <Card 
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => openEventDetails(event)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{event.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {event.startDate} - {event.endDate}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {event.shortDescription}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <div className="relative flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-dashed border-2 border-dashed border-muted-foreground/30"></div>
                        <Button 
                          onClick={() => {
                            setSelectedEraId(era.id);
                            setShowCreateEventModal(true);
                          }}
                          size="sm" 
                          variant="ghost" 
                          className="text-muted-foreground"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar Evento
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Event Details Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {selectedEvent?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent?.startDate} - {selectedEvent?.endDate}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
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
            </div>
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
    </Card>
  );
}