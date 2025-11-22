import { useState } from "react";

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
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { MultiSelect } from "@/components/modals/create-region-modal/components/multi-select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  type IFactionTimelineEvent,
  type IFactionTimelineEra,
} from "@/types/faction-types";

interface PropsFactionTimeline {
  factionId: string;
  isEditing: boolean;
  timeline: IFactionTimelineEra[];
  onTimelineChange: (timeline: IFactionTimelineEra[]) => void;
  // Real data from the app
  characters: Array<{ id: string; name: string; image?: string }>;
  factions: Array<{ id: string; name: string; image?: string }>;
  races: Array<{ id: string; name: string; image?: string }>;
  items: Array<{ id: string; name: string; image?: string }>;
}

export function FactionTimeline({
  isEditing,
  timeline,
  onTimelineChange,
  characters,
  factions,
  races,
  items,
}: PropsFactionTimeline) {
  const { t } = useTranslation("faction-detail");
  const [selectedEvent, setSelectedEvent] =
    useState<IFactionTimelineEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateEraModal, setShowCreateEraModal] = useState(false);
  const [showEditEraModal, setShowEditEraModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedEraId, setSelectedEraId] = useState<string>("");
  const [editingEra, setEditingEra] = useState<IFactionTimelineEra | null>(
    null
  );
  const [editingEvent, setEditingEvent] = useState<boolean>(false);

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

  const handleCreateEra = () => {
    if (!newEra.name.trim()) {
      toast.error(t("timeline.era_name_required"));
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
    toast.success(t("timeline.era_created"));
  };

  const handleCreateEvent = () => {
    if (!newEvent.name.trim() || !selectedEraId) {
      toast.error(t("timeline.event_name_era_required"));
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
    toast.success(t("timeline.event_created"));
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
      toast.error(t("timeline.era_name_required"));
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
    toast.success(t("timeline.era_updated"));
  };

  const handleUpdateEvent = () => {
    if (!newEvent.name.trim() || !selectedEvent) {
      toast.error(t("timeline.event_name_required"));
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
    toast.success(t("timeline.event_updated"));
  };

  const handleDeleteEra = (eraId: string) => {
    onTimelineChange(timeline.filter((era) => era.id !== eraId));
    toast.success(t("timeline.era_deleted"));
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
    toast.success(t("timeline.event_deleted"));
  };

  const getCharacterName = (id: string) =>
    characters.find((c) => c.id === id)?.name ||
    t("timeline.character_not_found");

  const getFactionName = (id: string) =>
    factions.find((f) => f.id === id)?.name || t("timeline.faction_not_found");

  const getRaceName = (id: string) =>
    races.find((r) => r.id === id)?.name || t("timeline.race_not_found");

  const getItemName = (id: string) =>
    items.find((i) => i.id === id)?.name || t("timeline.item_not_found");

  return (
    <>
      {timeline.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Clock className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {t("timeline.empty_state.title")}
          </h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            {isEditing
              ? t("timeline.empty_state.description_edit")
              : t("timeline.empty_state.description")}
          </p>
          {isEditing && (
            <Button
              onClick={() => setShowCreateEraModal(true)}
              variant="magical"
              className="animate-glow"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("timeline.create_first_era")}
            </Button>
          )}
        </div>
      ) : (
        <div>
          <div className="relative">
            {/* Enhanced Timeline Line with Gradient and Glow */}
            <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/40 rounded-full shadow-lg">
              <div className="absolute inset-0 w-1 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 rounded-full blur-sm" />
            </div>

            <Accordion type="multiple" className="space-y-6">
              {timeline.map((era) => (
                <AccordionItem
                  key={era.id}
                  value={era.id}
                  className="border-none"
                >
                  <div className="relative">
                    {/* Era Marker with Enhanced Design */}
                    <div className="absolute left-8 top-6 z-20">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 border-4 border-background shadow-xl flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-primary-foreground" />
                        </div>
                        <div className="absolute inset-0 w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
                      </div>
                    </div>

                    {/* Era Card with Enhanced Styling */}
                    <div className="ml-20 relative">
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
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30 flex-wrap">
                                          {event.charactersInvolved.length >
                                            0 && (
                                            <div className="flex items-center gap-1">
                                              <Users className="w-3 h-3 text-muted-foreground" />
                                              <span className="text-xs text-muted-foreground">
                                                {
                                                  event.charactersInvolved
                                                    .length
                                                }{" "}
                                                {event.charactersInvolved
                                                  .length !== 1
                                                  ? t(
                                                      "timeline.characters_plural"
                                                    )
                                                  : t(
                                                      "timeline.character_singular"
                                                    )}
                                              </span>
                                            </div>
                                          )}
                                          {event.factionsInvolved.length >
                                            0 && (
                                            <div className="flex items-center gap-1">
                                              <Building className="w-3 h-3 text-muted-foreground" />
                                              <span className="text-xs text-muted-foreground">
                                                {event.factionsInvolved.length}{" "}
                                                {event.factionsInvolved
                                                  .length !== 1
                                                  ? t(
                                                      "timeline.factions_plural"
                                                    )
                                                  : t(
                                                      "timeline.faction_singular"
                                                    )}
                                              </span>
                                            </div>
                                          )}
                                          {event.racesInvolved.length > 0 && (
                                            <div className="flex items-center gap-1">
                                              <Swords className="w-3 h-3 text-muted-foreground" />
                                              <span className="text-xs text-muted-foreground">
                                                {event.racesInvolved.length}{" "}
                                                {event.racesInvolved.length !==
                                                1
                                                  ? t("timeline.races_plural")
                                                  : t("timeline.race_singular")}
                                              </span>
                                            </div>
                                          )}
                                          {event.itemsInvolved.length > 0 && (
                                            <div className="flex items-center gap-1">
                                              <Package className="w-3 h-3 text-muted-foreground" />
                                              <span className="text-xs text-muted-foreground">
                                                {event.itemsInvolved.length}{" "}
                                                {event.itemsInvolved.length !==
                                                1
                                                  ? t("timeline.items_plural")
                                                  : t("timeline.item_singular")}
                                              </span>
                                            </div>
                                          )}
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
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {t("timeline.era_no_events")}
                                  </p>
                                  {isEditing && (
                                    <Button
                                      onClick={() => {
                                        setSelectedEraId(era.id);
                                        setShowCreateEventModal(true);
                                      }}
                                      size="sm"
                                      variant="magical"
                                      className="animate-glow"
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      {t("timeline.create_first_event")}
                                    </Button>
                                  )}
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

          {isEditing && (
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setShowCreateEraModal(true)}
                size="sm"
                variant="magical"
                className="animate-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("timeline.new_era")}
              </Button>
            </div>
          )}
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
              {editingEvent
                ? t("timeline.edit_event")
                : selectedEvent?.name}
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

                <MultiSelect
                  label={t("timeline.characters_involved")}
                  placeholder={t("timeline.select_characters")}
                  emptyText={t("timeline.no_characters")}
                  noSelectionText={t("timeline.no_characters_selected")}
                  searchPlaceholder={t("timeline.search_character")}
                  options={characters}
                  value={newEvent.charactersInvolved}
                  onChange={(value) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      charactersInvolved: value,
                    }))
                  }
                />

                <MultiSelect
                  label={t("timeline.factions_involved")}
                  placeholder={t("timeline.select_factions")}
                  emptyText={t("timeline.no_factions")}
                  noSelectionText={t("timeline.no_factions_selected")}
                  searchPlaceholder={t("timeline.search_faction")}
                  options={factions}
                  value={newEvent.factionsInvolved}
                  onChange={(value) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      factionsInvolved: value,
                    }))
                  }
                />

                <MultiSelect
                  label={t("timeline.races_involved")}
                  placeholder={t("timeline.select_races")}
                  emptyText={t("timeline.no_races")}
                  noSelectionText={t("timeline.no_races_selected")}
                  searchPlaceholder={t("timeline.search_race")}
                  options={races}
                  value={newEvent.racesInvolved}
                  onChange={(value) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      racesInvolved: value,
                    }))
                  }
                />

                <MultiSelect
                  label={t("timeline.items_involved")}
                  placeholder={t("timeline.select_items")}
                  emptyText={t("timeline.no_items")}
                  noSelectionText={t("timeline.no_items_selected")}
                  searchPlaceholder={t("timeline.search_item")}
                  options={items}
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
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.charactersInvolved.map((id) => (
                        <Badge key={id} variant="secondary">
                          {getCharacterName(id)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.factionsInvolved.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {t("timeline.factions_involved")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.factionsInvolved.map((id) => (
                        <Badge key={id} variant="secondary">
                          {getFactionName(id)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.racesInvolved.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Swords className="w-4 h-4" />
                      {t("timeline.races_involved")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.racesInvolved.map((id) => (
                        <Badge key={id} variant="secondary">
                          {getRaceName(id)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.itemsInvolved.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {t("timeline.items_involved")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.itemsInvolved.map((id) => (
                        <Badge key={id} variant="secondary">
                          {getItemName(id)}
                        </Badge>
                      ))}
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
            setNewEra({ name: "", description: "", startDate: "", endDate: "" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("timeline.new_era")}</DialogTitle>
            <DialogDescription>
              {t("timeline.new_era_description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="era-name">{t("timeline.era_name")} <span className="text-destructive">*</span></Label>
              <Input
                id="era-name"
                value={newEra.name}
                onChange={(e) =>
                  setNewEra((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={t("timeline.era_name_placeholder")}
                maxLength={200}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{newEra.name.length}/200</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="era-description">
                {t("timeline.description")} <span className="text-destructive">*</span>
              </Label>
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
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{newEra.description.length}/500</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="era-start">{t("timeline.start")} <span className="text-destructive">*</span></Label>
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
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{newEra.startDate.length}/50</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="era-end">{t("timeline.end")} <span className="text-destructive">*</span></Label>
                <Input
                  id="era-end"
                  value={newEra.endDate}
                  onChange={(e) =>
                    setNewEra((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  placeholder={t("timeline.date_placeholder")}
                  maxLength={50}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{newEra.endDate.length}/50</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
          </div>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("timeline.new_event")}</DialogTitle>
            <DialogDescription>
              {t("timeline.new_event_description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">{t("timeline.event_name")} *</Label>
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
              <Label htmlFor="event-desc">{t("timeline.description")} *</Label>
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
                <Label htmlFor="event-reason">{t("timeline.reason")} *</Label>
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
                <Label htmlFor="event-outcome">{t("timeline.outcome")} *</Label>
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
                <Label htmlFor="event-start">{t("timeline.start_date")} *</Label>
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
                <Label htmlFor="event-end">{t("timeline.end_date")} *</Label>
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

            <MultiSelect
              label={t("timeline.characters_involved")}
              placeholder={t("timeline.select_characters")}
              emptyText={t("timeline.no_characters")}
              noSelectionText={t("timeline.no_characters_selected")}
              searchPlaceholder={t("timeline.search_character")}
              options={characters}
              value={newEvent.charactersInvolved}
              onChange={(value) =>
                setNewEvent((prev) => ({
                  ...prev,
                  charactersInvolved: value,
                }))
              }
            />

            <MultiSelect
              label={t("timeline.factions_involved")}
              placeholder={t("timeline.select_factions")}
              emptyText={t("timeline.no_factions")}
              noSelectionText={t("timeline.no_factions_selected")}
              searchPlaceholder={t("timeline.search_faction")}
              options={factions}
              value={newEvent.factionsInvolved}
              onChange={(value) =>
                setNewEvent((prev) => ({
                  ...prev,
                  factionsInvolved: value,
                }))
              }
            />

            <MultiSelect
              label={t("timeline.races_involved")}
              placeholder={t("timeline.select_races")}
              emptyText={t("timeline.no_races")}
              noSelectionText={t("timeline.no_races_selected")}
              searchPlaceholder={t("timeline.search_race")}
              options={races}
              value={newEvent.racesInvolved}
              onChange={(value) =>
                setNewEvent((prev) => ({
                  ...prev,
                  racesInvolved: value,
                }))
              }
            />

            <MultiSelect
              label={t("timeline.items_involved")}
              placeholder={t("timeline.select_items")}
              emptyText={t("timeline.no_items")}
              noSelectionText={t("timeline.no_items_selected")}
              searchPlaceholder={t("timeline.search_item")}
              options={items}
              value={newEvent.itemsInvolved}
              onChange={(value) =>
                setNewEvent((prev) => ({
                  ...prev,
                  itemsInvolved: value,
                }))
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
            setEditEra({ name: "", description: "", startDate: "", endDate: "" });
            setEditingEra(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("timeline.edit_era")}</DialogTitle>
            <DialogDescription>
              {t("timeline.edit_era_description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-era-name">{t("timeline.era_name")} *</Label>
              <Input
                id="edit-era-name"
                value={editEra.name}
                onChange={(e) =>
                  setEditEra((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={t("timeline.era_name_placeholder")}
                maxLength={200}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editEra.name.length}/200</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-era-description">
                {t("timeline.description")}
              </Label>
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
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editEra.description.length}/500</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-era-start">{t("timeline.start")}</Label>
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
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editEra.startDate.length}/50</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-era-end">{t("timeline.end")}</Label>
                <Input
                  id="edit-era-end"
                  value={editEra.endDate}
                  onChange={(e) =>
                    setEditEra((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  placeholder={t("timeline.date_placeholder")}
                  maxLength={50}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editEra.endDate.length}/50</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
