import { useState, useRef, useEffect } from "react";

import {
  Plus,
  Clock,
  Calendar,
  Users,
  Building,
  ChevronDown,
  Sparkles,
  Edit,
  Trash2,
  Swords,
  Package,
  X,
  Save,
  User,
  Shield,
  Dna,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  type IFactionTimelineEvent,
  type IFactionTimelineEra,
} from "@/types/faction-types";

interface PropsFactionTimeline {
  factionId: string;
  bookId: string;
  isEditing: boolean;
  timeline: IFactionTimelineEra[];
  onTimelineChange: (timeline: IFactionTimelineEra[]) => void;
  /** Controlled state for create era dialog - when true, opens the create era dialog */
  isCreateEraDialogOpen?: boolean;
  /** Callback when the create era dialog open state changes */
  onCreateEraDialogOpenChange?: (open: boolean) => void;
  /** Entities for display */
  mockCharacters?: Array<{ id: string; name: string; image?: string }>;
  mockFactions?: Array<{ id: string; name: string; image?: string }>;
  mockRaces?: Array<{ id: string; name: string; image?: string }>;
  mockItems?: Array<{ id: string; name: string; image?: string }>;
}

export function FactionTimeline({
  bookId,
  isEditing,
  timeline,
  onTimelineChange,
  isCreateEraDialogOpen: controlledIsCreateEraDialogOpen,
  onCreateEraDialogOpenChange,
  mockCharacters = [],
  mockFactions = [],
  mockRaces = [],
  mockItems = [],
}: PropsFactionTimeline) {
  const { t } = useTranslation("faction-detail");
  const [selectedEvent, setSelectedEvent] =
    useState<IFactionTimelineEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Support both controlled and uncontrolled modes for the create era dialog
  const [internalShowCreateEraModal, setInternalShowCreateEraModal] =
    useState(false);

  // Use controlled state if provided, otherwise use internal state
  const showCreateEraModal =
    controlledIsCreateEraDialogOpen ?? internalShowCreateEraModal;
  const setShowCreateEraModal = (open: boolean) => {
    if (onCreateEraDialogOpenChange) {
      onCreateEraDialogOpenChange(open);
    } else {
      setInternalShowCreateEraModal(open);
    }
  };
  const [showEditEraModal, setShowEditEraModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedEraId, setSelectedEraId] = useState<string>("");
  const [editingEra, setEditingEra] = useState<IFactionTimelineEra | null>(
    null
  );
  const [editingEvent, setEditingEvent] = useState<boolean>(false);
  const [openEras, setOpenEras] = useState<string[]>([]);

  const [newEra, setNewEra] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    reason: "",
    outcome: "",
    startDate: "",
    endDate: "",
    charactersInvolved: [] as string[],
    factionsInvolved: [] as string[],
    racesInvolved: [] as string[],
    itemsInvolved: [] as string[],
  });

  const [editEra, setEditEra] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [hasScrollCreateEra, setHasScrollCreateEra] = useState(false);
  const scrollContainerCreateEraRef = useRef<HTMLDivElement>(null);

  const [hasScrollEditEra, setHasScrollEditEra] = useState(false);
  const scrollContainerEditEraRef = useRef<HTMLDivElement>(null);

  const handleCreateEra = () => {
    if (!newEra.name.trim()) {
      return;
    }

    const era: IFactionTimelineEra = {
      id: Date.now().toString(),
      ...newEra,
      events: [],
    };

    onTimelineChange([...timeline, era]);
    setNewEra({ name: "", description: "", startDate: "", endDate: "" });
    setShowCreateEraModal(false);
  };

  const handleCreateEvent = () => {
    if (!newEvent.name.trim() || !selectedEraId) {
      return;
    }

    const event: IFactionTimelineEvent = {
      id: Date.now().toString(),
      ...newEvent,
    };

    onTimelineChange(
      timeline.map((era) =>
        era.id === selectedEraId
          ? { ...era, events: [...era.events, event] }
          : era
      )
    );

    // Abre a era automaticamente se estiver fechada
    if (!openEras.includes(selectedEraId)) {
      setOpenEras((prev) => [...prev, selectedEraId]);
    }

    setNewEvent({
      name: "",
      description: "",
      reason: "",
      outcome: "",
      startDate: "",
      endDate: "",
      charactersInvolved: [],
      factionsInvolved: [],
      racesInvolved: [],
      itemsInvolved: [],
    });
    setSelectedEraId("");
    setShowCreateEventModal(false);
  };

  const openEventDetails = (
    event: IFactionTimelineEvent,
    edit: boolean = false
  ) => {
    setSelectedEvent(event);
    setEditingEvent(edit);
    if (edit) {
      setNewEvent({
        name: event.name,
        description: event.description,
        reason: event.reason,
        outcome: event.outcome,
        startDate: event.startDate,
        endDate: event.endDate,
        charactersInvolved: [...event.charactersInvolved],
        factionsInvolved: [...event.factionsInvolved],
        racesInvolved: [...event.racesInvolved],
        itemsInvolved: [...event.itemsInvolved],
      });
    }
    setShowEventModal(true);
  };

  const handleEditEra = (era: IFactionTimelineEra) => {
    setEditingEra(era);
    setEditEra({
      name: era.name,
      description: era.description,
      startDate: era.startDate,
      endDate: era.endDate,
    });
    setShowEditEraModal(true);
  };

  const handleUpdateEra = () => {
    if (!editEra.name.trim() || !editingEra) {
      return;
    }

    onTimelineChange(
      timeline.map((era) =>
        era.id === editingEra.id ? { ...era, ...editEra } : era
      )
    );

    setEditEra({ name: "", description: "", startDate: "", endDate: "" });
    setEditingEra(null);
    setShowEditEraModal(false);
  };

  const handleUpdateEvent = () => {
    if (!newEvent.name.trim() || !selectedEvent) {
      return;
    }

    const updatedEvent: IFactionTimelineEvent = {
      ...selectedEvent,
      ...newEvent,
    };

    onTimelineChange(
      timeline.map((era) => ({
        ...era,
        events: era.events.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event
        ),
      }))
    );

    setNewEvent({
      name: "",
      description: "",
      reason: "",
      outcome: "",
      startDate: "",
      endDate: "",
      charactersInvolved: [],
      factionsInvolved: [],
      racesInvolved: [],
      itemsInvolved: [],
    });
    setSelectedEvent(null);
    setEditingEvent(false);
    setShowEventModal(false);
  };

  const handleDeleteEra = (eraId: string) => {
    onTimelineChange(timeline.filter((era) => era.id !== eraId));
  };

  const handleDeleteEvent = (eventId: string) => {
    onTimelineChange(
      timeline.map((era) => ({
        ...era,
        events: era.events.filter((event) => event.id !== eventId),
      }))
    );
    setSelectedEvent(null);
    setEditingEvent(false);
    setShowEventModal(false);
  };

  // Entity name getters
  const getCharacterName = (id: string) => {
    const character = mockCharacters.find((c) => c.id === id);
    return character?.name || id;
  };
  const getFactionName = (id: string) => {
    const faction = mockFactions.find((f) => f.id === id);
    return faction?.name || id;
  };
  const getRaceName = (id: string) => {
    const race = mockRaces.find((r) => r.id === id);
    return race?.name || id;
  };
  const getItemName = (id: string) => {
    const item = mockItems.find((i) => i.id === id);
    return item?.name || id;
  };

  // Detectar se há scroll no modal de criar era
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerCreateEraRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerCreateEraRef.current;
        setHasScrollCreateEra(scrollHeight > clientHeight);
      }
    };

    const timeoutId = setTimeout(checkScroll, 0);
    const observer = new ResizeObserver(checkScroll);
    if (scrollContainerCreateEraRef.current) {
      observer.observe(scrollContainerCreateEraRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [newEra, showCreateEraModal]);

  // Detectar se há scroll no modal de editar era
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerEditEraRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerEditEraRef.current;
        setHasScrollEditEra(scrollHeight > clientHeight);
      }
    };

    const timeoutId = setTimeout(checkScroll, 0);
    const observer = new ResizeObserver(checkScroll);
    if (scrollContainerEditEraRef.current) {
      observer.observe(scrollContainerEditEraRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [editEra, showEditEraModal]);

  return (
    <>
      {timeline.length > 0 && (
        <div>
          {/* Botão Nova Era no topo */}
          {isEditing && (
            <div className="mb-6">
              <Button
                onClick={() => setShowCreateEraModal(true)}
                size="sm"
                variant="magical"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("timeline.new_era")}
              </Button>
            </div>
          )}

          <div className="relative">
            {/* Enhanced Timeline Line with Gradient and Glow */}
            <div className="absolute left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/40 rounded-full shadow-lg">
              <div className="absolute inset-0 w-1 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 rounded-full blur-sm" />
            </div>

            <Accordion
              type="multiple"
              className="space-y-6"
              value={openEras}
              onValueChange={setOpenEras}
            >
              {timeline.map((era) => (
                <AccordionItem
                  key={era.id}
                  value={era.id}
                  className="border-none"
                >
                  <div className="relative">
                    {/* Era Marker with Enhanced Design */}
                    <div className="absolute -left-1 top-6 z-20">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 border-4 border-background shadow-xl flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-primary-foreground" />
                        </div>
                        <div className="absolute inset-0 w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
                      </div>
                    </div>

                    {/* Era Card with Enhanced Styling */}
                    <div className="ml-10 relative">
                      <AccordionTrigger className="hover:no-underline p-0 [&[data-state=open]>div]:shadow-lg [&>svg]:hidden [&[data-state=open]_.chevron-icon]:rotate-0 [&[data-state=closed]_.chevron-icon]:-rotate-90">
                        <div className="w-full bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm rounded-xl p-6 pr-10 border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/20 relative">
                          <div className="text-left flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                {era.name}
                              </h3>
                              {era.events.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {era.events.length}{" "}
                                  {era.events.length !== 1
                                    ? t("timeline.events")
                                    : t("timeline.event")}
                                </Badge>
                              )}
                            </div>
                            <Badge
                              variant="secondary"
                              className="mt-2 bg-primary/10 text-primary border-primary/20"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {era.startDate} - {era.endDate}
                            </Badge>
                            {era.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                                {era.description}
                              </p>
                            )}
                          </div>
                          <ChevronDown className="chevron-icon absolute right-4 top-6 w-4 h-4 text-muted-foreground transition-transform duration-200" />
                        </div>
                      </AccordionTrigger>

                      {/* Action buttons positioned absolutely outside the trigger */}
                      {isEditing && (
                        <div className="absolute top-6 right-12 flex gap-0.5 z-10">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEraId(era.id);
                                  setNewEvent({
                                    name: "",
                                    description: "",
                                    reason: "",
                                    outcome: "",
                                    startDate: "",
                                    endDate: "",
                                    charactersInvolved: [],
                                    factionsInvolved: [],
                                    racesInvolved: [],
                                    itemsInvolved: [],
                                  });
                                  setShowCreateEventModal(true);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>{t("timeline.add_event")}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditEra(era);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>{t("timeline.edit_era")}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEra(era.id);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>{t("timeline.delete_era")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )}

                      <AccordionContent className="pt-4 pb-0">
                        <div className="ml-6 border-l-2 border-dashed border-muted-foreground/20 pl-6 space-y-4">
                          {era.events.length > 0 ? (
                            <>
                              {era.events.map((event) => (
                                <div key={event.id} className="relative">
                                  {/* Event Marker */}
                                  <div className="absolute -left-8 top-3">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary/60 to-primary/40 border-2 border-background shadow-md" />
                                  </div>

                                  {/* Event Card */}
                                  <Card
                                    className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-r from-card to-card/80 border-border/50 hover:border-primary/30"
                                    onClick={() => openEventDetails(event)}
                                  >
                                    <CardContent className="p-5">
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-foreground/90 mb-1">
                                            {event.name}
                                          </h4>
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-muted/50"
                                          >
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
                                                className="h-6 w-6 p-0"
                                              >
                                                <Edit className="w-3 h-3" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="ghost-destructive"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeleteEvent(event.id);
                                                }}
                                                className="h-6 w-6 p-0"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </Button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground leading-relaxed">
                                        {event.description.length > 200
                                          ? `${event.description.substring(0, 200)}...`
                                          : event.description}
                                      </p>
                                      {(event.charactersInvolved.length > 0 ||
                                        event.factionsInvolved.length > 0 ||
                                        event.racesInvolved.length > 0 ||
                                        event.itemsInvolved.length > 0) && (
                                        <div className="mt-3 pt-3 border-t border-border/30">
                                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            {event.charactersInvolved.length > 0 && (
                                              <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                <span>{t("timeline.characters_involved")}: {event.charactersInvolved.length}</span>
                                              </div>
                                            )}
                                            {event.factionsInvolved.length > 0 && (
                                              <div className="flex items-center gap-1">
                                                <Building className="w-3 h-3" />
                                                <span>{t("timeline.factions_involved")}: {event.factionsInvolved.length}</span>
                                              </div>
                                            )}
                                            {event.racesInvolved.length > 0 && (
                                              <div className="flex items-center gap-1">
                                                <Swords className="w-3 h-3" />
                                                <span>{t("timeline.races_involved")}: {event.racesInvolved.length}</span>
                                              </div>
                                            )}
                                            {event.itemsInvolved.length > 0 && (
                                              <div className="flex items-center gap-1">
                                                <Package className="w-3 h-3" />
                                                <span>{t("timeline.items_involved")}: {event.itemsInvolved.length}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>
                              ))}
                            </>
                          ) : (
                            <div className="text-center py-8">
                              <div className="relative">
                                <div className="absolute -left-8 top-6">
                                  <div className="w-3 h-3 rounded-full border-2 border-dashed border-muted-foreground/40 bg-muted/20" />
                                </div>
                                <div className="bg-muted/20 rounded-lg p-6 border border-dashed border-muted-foreground/30">
                                  <Clock className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                                  <p className="text-sm text-muted-foreground">
                                    {t("timeline.era_no_events")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}

      {/* Event Details/Edit Modal */}
      <Dialog
        open={showEventModal}
        onOpenChange={(open) => {
          setShowEventModal(open);
          if (!open) {
            setSelectedEvent(null);
            setEditingEvent(false);
            setNewEvent({
              name: "",
              description: "",
              reason: "",
              outcome: "",
              startDate: "",
              endDate: "",
              charactersInvolved: [],
              factionsInvolved: [],
              racesInvolved: [],
              itemsInvolved: [],
            });
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {editingEvent ? t("timeline.edit_event") : selectedEvent?.name}
            </DialogTitle>
            <DialogDescription>
              {editingEvent
                ? t("timeline.edit_event_description")
                : `${selectedEvent?.startDate} - ${selectedEvent?.endDate}`}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent &&
            (editingEvent ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-event-name">
                    {t("timeline.event_name")} *
                  </Label>
                  <Input
                    id="edit-event-name"
                    value={newEvent.name}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={t("timeline.event_name_placeholder")}
                    maxLength={200}
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{newEvent.name.length}/200</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-event-desc">
                    {t("timeline.description")} *
                  </Label>
                  <Textarea
                    id="edit-event-desc"
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder={t("timeline.description_placeholder")}
                    rows={4}
                    maxLength={500}
                    className="resize-none"
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{newEvent.description.length}/500</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-reason">
                      {t("timeline.reason")}
                    </Label>
                    <Textarea
                      id="edit-event-reason"
                      value={newEvent.reason}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      placeholder={t("timeline.reason_placeholder")}
                      rows={2}
                      maxLength={500}
                      className="resize-none"
                    />
                    <div className="flex justify-end text-xs text-muted-foreground">
                      <span>{newEvent.reason.length}/500</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-outcome">
                      {t("timeline.outcome")}
                    </Label>
                    <Textarea
                      id="edit-event-outcome"
                      value={newEvent.outcome}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          outcome: e.target.value,
                        }))
                      }
                      placeholder={t("timeline.outcome_placeholder")}
                      rows={2}
                      maxLength={500}
                      className="resize-none"
                    />
                    <div className="flex justify-end text-xs text-muted-foreground">
                      <span>{newEvent.outcome.length}/500</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-start">
                      {t("timeline.start_date")}
                    </Label>
                    <Input
                      id="edit-event-start"
                      value={newEvent.startDate}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      placeholder={t("timeline.date_placeholder")}
                      maxLength={50}
                    />
                    <div className="flex justify-end text-xs text-muted-foreground">
                      <span>{newEvent.startDate.length}/50</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-end">
                      {t("timeline.end_date")}
                    </Label>
                    <Input
                      id="edit-event-end"
                      value={newEvent.endDate}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      placeholder={t("timeline.date_placeholder")}
                      maxLength={50}
                    />
                    <div className="flex justify-end text-xs text-muted-foreground">
                      <span>{newEvent.endDate.length}/50</span>
                    </div>
                  </div>
                </div>

                <FormEntityMultiSelectAuto
                  entityType="character"
                  bookId={bookId}
                  label={t("timeline.characters_involved")}
                  placeholder={t("timeline.select_characters")}
                  emptyText={t("timeline.no_characters")}
                  noSelectionText={t("timeline.no_characters_selected")}
                  searchPlaceholder={t("timeline.search_character")}
                  value={newEvent.charactersInvolved}
                  onChange={(value) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      charactersInvolved: value,
                    }))
                  }
                />

                <FormEntityMultiSelectAuto
                  entityType="faction"
                  bookId={bookId}
                  label={t("timeline.factions_involved")}
                  placeholder={t("timeline.select_factions")}
                  emptyText={t("timeline.no_factions")}
                  noSelectionText={t("timeline.no_factions_selected")}
                  searchPlaceholder={t("timeline.search_faction")}
                  value={newEvent.factionsInvolved}
                  onChange={(value) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      factionsInvolved: value,
                    }))
                  }
                />

                <FormEntityMultiSelectAuto
                  entityType="race"
                  bookId={bookId}
                  label={t("timeline.races_involved")}
                  placeholder={t("timeline.select_races")}
                  emptyText={t("timeline.no_races")}
                  noSelectionText={t("timeline.no_races_selected")}
                  searchPlaceholder={t("timeline.search_race")}
                  value={newEvent.racesInvolved}
                  onChange={(value) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      racesInvolved: value,
                    }))
                  }
                />

                <FormEntityMultiSelectAuto
                  entityType="item"
                  bookId={bookId}
                  label={t("timeline.items_involved")}
                  placeholder={t("timeline.select_items")}
                  emptyText={t("timeline.no_items")}
                  noSelectionText={t("timeline.no_items_selected")}
                  searchPlaceholder={t("timeline.search_item")}
                  value={newEvent.itemsInvolved}
                  onChange={(value) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      itemsInvolved: value,
                    }))
                  }
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingEvent(false);
                      setShowEventModal(false);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t("timeline.cancel")}
                  </Button>
                  <Button
                    onClick={handleUpdateEvent}
                    variant="magical"
                    className="animate-glow"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t("timeline.save_changes")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    {t("timeline.description")}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t("timeline.reason")}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {selectedEvent.reason}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t("timeline.outcome")}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {selectedEvent.outcome}
                    </p>
                  </div>
                </div>

                {selectedEvent.charactersInvolved.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {t("timeline.characters_involved")}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedEvent.charactersInvolved.map((id) => {
                        const character = mockCharacters.find((c) => c.id === id);
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card"
                          >
                            {character?.image ? (
                              <Avatar className="w-8 h-8 rounded-full">
                                <AvatarImage src={character.image} alt={character.name} />
                              </Avatar>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-purple-950/40 flex items-center justify-center">
                                <User className="w-4 h-4 text-purple-400" />
                              </div>
                            )}
                            <span className="text-sm font-medium">
                              {character?.name || id}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedEvent.factionsInvolved.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {t("timeline.factions_involved")}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedEvent.factionsInvolved.map((id) => {
                        const faction = mockFactions.find((f) => f.id === id);
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card"
                          >
                            {faction?.image ? (
                              <Avatar className="w-8 h-8 rounded-sm">
                                <AvatarImage src={faction.image} alt={faction.name} />
                              </Avatar>
                            ) : (
                              <div className="w-8 h-8 rounded-sm bg-purple-950/40 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-purple-400" />
                              </div>
                            )}
                            <span className="text-sm font-medium">
                              {faction?.name || id}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedEvent.racesInvolved.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Swords className="w-4 h-4" />
                      {t("timeline.races_involved")}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedEvent.racesInvolved.map((id) => {
                        const race = mockRaces.find((r) => r.id === id);
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card"
                          >
                            {race?.image ? (
                              <Avatar className="w-8 h-8 rounded-sm">
                                <AvatarImage src={race.image} alt={race.name} />
                              </Avatar>
                            ) : (
                              <div className="w-8 h-8 rounded-sm bg-purple-950/40 flex items-center justify-center">
                                <Dna className="w-4 h-4 text-purple-400" />
                              </div>
                            )}
                            <span className="text-sm font-medium">
                              {race?.name || id}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedEvent.itemsInvolved.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {t("timeline.items_involved")}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedEvent.itemsInvolved.map((id) => {
                        const item = mockItems.find((i) => i.id === id);
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card"
                          >
                            {item?.image ? (
                              <Avatar className="w-8 h-8 rounded-sm">
                                <AvatarImage src={item.image} alt={item.name} />
                              </Avatar>
                            ) : (
                              <div className="w-8 h-8 rounded-sm bg-purple-950/40 flex items-center justify-center">
                                <Package className="w-4 h-4 text-purple-400" />
                              </div>
                            )}
                            <span className="text-sm font-medium">
                              {item?.name || id}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="secondary"
                      onClick={() => openEventDetails(selectedEvent, true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      {t("timeline.edit_event")}
                    </Button>
                  </div>
                )}
              </div>
            ))}
        </DialogContent>
      </Dialog>

      {/* Create Era Modal */}
      <Dialog
        open={showCreateEraModal}
        onOpenChange={(open) => {
          setShowCreateEraModal(open);
          if (!open) {
            setNewEra({
              name: "",
              description: "",
              startDate: "",
              endDate: "",
            });
          }
        }}
      >
        <DialogContent className="sm:min-w-[600px] max-h-[90vh] flex flex-col gap-0">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{t("timeline.new_era")}</DialogTitle>
            <DialogDescription>
              {t("timeline.new_era_description")}
            </DialogDescription>
          </DialogHeader>

          <div
            ref={scrollContainerCreateEraRef}
            className={cn(
              "flex-1 overflow-y-auto custom-scrollbar pb-6",
              hasScrollCreateEra && "pr-2"
            )}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="era-name" className="text-primary">
                  {t("timeline.era_name")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="px-1">
                  <Input
                    id="era-name"
                    value={newEra.name}
                    onChange={(e) =>
                      setNewEra((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={t("timeline.era_name_placeholder")}
                    maxLength={200}
                  />
                </div>
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{newEra.name.length}/200</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="era-description" className="text-primary">
                  {t("timeline.description")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="px-1">
                  <Textarea
                    id="era-description"
                    value={newEra.description}
                    onChange={(e) =>
                      setNewEra((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder={t("timeline.era_description_placeholder")}
                    rows={2}
                    maxLength={500}
                    className="resize-none"
                  />
                </div>
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{newEra.description.length}/500</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="era-start" className="text-primary">
                    {t("timeline.start")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="px-1">
                    <Input
                      id="era-start"
                      value={newEra.startDate}
                      onChange={(e) =>
                        setNewEra((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      placeholder={t("timeline.date_placeholder")}
                      maxLength={50}
                    />
                  </div>
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{newEra.startDate.length}/50</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="era-end" className="text-primary">
                    {t("timeline.end")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="px-1">
                    <Input
                      id="era-end"
                      value={newEra.endDate}
                      onChange={(e) =>
                        setNewEra((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                      placeholder={t("timeline.date_placeholder")}
                      maxLength={50}
                    />
                  </div>
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{newEra.endDate.length}/50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => setShowCreateEraModal(false)}
            >
              <X className="w-4 h-4 mr-2" />
              {t("timeline.cancel")}
            </Button>
            <Button
              onClick={handleCreateEra}
              variant="magical"
              className="animate-glow"
              disabled={
                !newEra.name.trim() ||
                !newEra.description.trim() ||
                !newEra.startDate.trim() ||
                !newEra.endDate.trim()
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("timeline.create_era")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog
        open={showCreateEventModal}
        onOpenChange={(open) => {
          setShowCreateEventModal(open);
          if (!open) {
            // Reset form when closing
            setNewEvent({
              name: "",
              description: "",
              reason: "",
              outcome: "",
              startDate: "",
              endDate: "",
              charactersInvolved: [],
              factionsInvolved: [],
              racesInvolved: [],
              itemsInvolved: [],
            });
          }
        }}
      >
        <DialogContent className="sm:min-w-[750px] max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{t("timeline.new_event")}</DialogTitle>
            <DialogDescription>
              {t("timeline.new_event_description")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 px-3 -mb-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="event-name" className="text-primary">
                {t("timeline.event_name")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event-name"
                value={newEvent.name}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={t("timeline.event_name_placeholder")}
                maxLength={200}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{newEvent.name.length}/200</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-desc" className="text-primary">
                {t("timeline.description")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="event-desc"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder={t("timeline.description_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{newEvent.description.length}/500</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-reason" className="text-primary">
                  {t("timeline.reason")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="event-reason"
                  value={newEvent.reason}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder={t("timeline.reason_placeholder")}
                  rows={2}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{newEvent.reason.length}/500</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-outcome" className="text-primary">
                  {t("timeline.outcome")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="event-outcome"
                  value={newEvent.outcome}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      outcome: e.target.value,
                    }))
                  }
                  placeholder={t("timeline.outcome_placeholder")}
                  rows={2}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{newEvent.outcome.length}/500</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-start" className="text-primary">
                  {t("timeline.start_date")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="event-start"
                  value={newEvent.startDate}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  placeholder={t("timeline.date_placeholder")}
                  maxLength={50}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{newEvent.startDate.length}/50</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-end" className="text-primary">
                  {t("timeline.end_date")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="event-end"
                  value={newEvent.endDate}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  placeholder={t("timeline.date_placeholder")}
                  maxLength={50}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{newEvent.endDate.length}/50</span>
                </div>
              </div>
            </div>

            <FormEntityMultiSelectAuto
              entityType="character"
              bookId={bookId}
              label={t("timeline.characters_involved")}
              placeholder={t("timeline.select_characters")}
              emptyText={t("timeline.no_characters")}
              noSelectionText={t("timeline.no_characters_selected")}
              searchPlaceholder={t("timeline.search_character")}
              value={newEvent.charactersInvolved}
              onChange={(value) =>
                setNewEvent((prev) => ({
                  ...prev,
                  charactersInvolved: value,
                }))
              }
              labelClassName="text-primary text-sm font-medium"
            />

            <FormEntityMultiSelectAuto
              entityType="faction"
              bookId={bookId}
              label={t("timeline.factions_involved")}
              placeholder={t("timeline.select_factions")}
              emptyText={t("timeline.no_factions")}
              noSelectionText={t("timeline.no_factions_selected")}
              searchPlaceholder={t("timeline.search_faction")}
              value={newEvent.factionsInvolved}
              onChange={(value) =>
                setNewEvent((prev) => ({
                  ...prev,
                  factionsInvolved: value,
                }))
              }
              labelClassName="text-primary text-sm font-medium"
            />

            <FormEntityMultiSelectAuto
              entityType="race"
              bookId={bookId}
              label={t("timeline.races_involved")}
              placeholder={t("timeline.select_races")}
              emptyText={t("timeline.no_races")}
              noSelectionText={t("timeline.no_races_selected")}
              searchPlaceholder={t("timeline.search_race")}
              value={newEvent.racesInvolved}
              onChange={(value) =>
                setNewEvent((prev) => ({
                  ...prev,
                  racesInvolved: value,
                }))
              }
              labelClassName="text-primary text-sm font-medium"
            />

            <FormEntityMultiSelectAuto
              entityType="item"
              bookId={bookId}
              label={t("timeline.items_involved")}
              placeholder={t("timeline.select_items")}
              emptyText={t("timeline.no_items")}
              noSelectionText={t("timeline.no_items_selected")}
              searchPlaceholder={t("timeline.search_item")}
              value={newEvent.itemsInvolved}
              onChange={(value) =>
                setNewEvent((prev) => ({
                  ...prev,
                  itemsInvolved: value,
                }))
              }
              labelClassName="text-primary text-sm font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t shrink-0">
            <Button
              variant="secondary"
              onClick={() => setShowCreateEventModal(false)}
            >
              <X className="w-4 h-4 mr-2" />
              {t("timeline.cancel")}
            </Button>
            <Button
              onClick={handleCreateEvent}
              variant="magical"
              className="animate-glow"
              disabled={
                !newEvent.name.trim() ||
                !newEvent.description.trim() ||
                !newEvent.reason.trim() ||
                !newEvent.outcome.trim() ||
                !newEvent.startDate.trim() ||
                !newEvent.endDate.trim()
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("timeline.create_event")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Era Modal */}
      <Dialog
        open={showEditEraModal}
        onOpenChange={(open) => {
          setShowEditEraModal(open);
          if (!open) {
            setEditEra({
              name: "",
              description: "",
              startDate: "",
              endDate: "",
            });
            setEditingEra(null);
          }
        }}
      >
        <DialogContent className="sm:min-w-[600px] max-h-[90vh] flex flex-col gap-0">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{t("timeline.edit_era")}</DialogTitle>
            <DialogDescription>
              {t("timeline.edit_era_description")}
            </DialogDescription>
          </DialogHeader>

          <div
            ref={scrollContainerEditEraRef}
            className={cn(
              "flex-1 overflow-y-auto custom-scrollbar pb-6",
              hasScrollEditEra && "pr-2"
            )}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-era-name" className="text-primary">
                  {t("timeline.era_name")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="px-1">
                  <Input
                    id="edit-era-name"
                    value={editEra.name}
                    onChange={(e) =>
                      setEditEra((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={t("timeline.era_name_placeholder")}
                    maxLength={200}
                  />
                </div>
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editEra.name.length}/200</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-era-description" className="text-primary">
                  {t("timeline.description")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="px-1">
                  <Textarea
                    id="edit-era-description"
                    value={editEra.description}
                    onChange={(e) =>
                      setEditEra((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder={t("timeline.era_description_placeholder")}
                    rows={2}
                    maxLength={500}
                    className="resize-none"
                  />
                </div>
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editEra.description.length}/500</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-era-start" className="text-primary">
                    {t("timeline.start")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="px-1">
                    <Input
                      id="edit-era-start"
                      value={editEra.startDate}
                      onChange={(e) =>
                        setEditEra((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      placeholder={t("timeline.date_placeholder")}
                      maxLength={50}
                    />
                  </div>
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{editEra.startDate.length}/50</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-era-end" className="text-primary">
                    {t("timeline.end")}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="px-1">
                    <Input
                      id="edit-era-end"
                      value={editEra.endDate}
                      onChange={(e) =>
                        setEditEra((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                      placeholder={t("timeline.date_placeholder")}
                      maxLength={50}
                    />
                  </div>
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{editEra.endDate.length}/50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => setShowEditEraModal(false)}
            >
              <X className="w-4 h-4 mr-2" />
              {t("timeline.cancel")}
            </Button>
            <Button
              onClick={handleUpdateEra}
              variant="magical"
              className="animate-glow"
            >
              <Save className="w-4 h-4 mr-2" />
              {t("timeline.save_changes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
