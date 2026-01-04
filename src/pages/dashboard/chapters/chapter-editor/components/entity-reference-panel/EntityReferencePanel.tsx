import { useEffect, useState, useMemo } from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  X,
  Search,
  User,
  MapPin,
  Shield,
  Sparkles,
  Users,
  ChevronDown,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCharactersStore } from "@/stores/characters-store";
import { useFactionsStore } from "@/stores/factions-store";
import { useItemsStore } from "@/stores/items-store";
import { useRacesStore } from "@/stores/races-store";
import { useRegionsStore } from "@/stores/regions-store";

import { EntityListItem } from "./EntityListItem";
import { useEntitySearch } from "./hooks/useEntitySearch";
import { usePinnedEntities } from "./hooks/usePinnedEntities";
import { PinnedEntityCard } from "./PinnedEntityCard";
import { SortablePinnedCard } from "./SortablePinnedCard";
import type { EntityReferencePanelProps, EntityType } from "./types";

const ENTITY_CONFIG = {
  character: { icon: User, color: "text-blue-500", translationKey: "character" },
  region: { icon: MapPin, color: "text-green-500", translationKey: "region" },
  faction: { icon: Shield, color: "text-purple-500", translationKey: "faction" },
  item: { icon: Sparkles, color: "text-amber-500", translationKey: "item" },
  race: { icon: Users, color: "text-pink-500", translationKey: "race" },
};

export function EntityReferencePanel({
  chapterId,
  bookId,
  isListVisible,
  onToggleList,
  onClose,
}: EntityReferencePanelProps) {
  const { t } = useTranslation(["entity-reference"]);
  const params = useParams({ from: "/dashboard/$dashboardId/chapters/$editor-chapters-id" });

  // Fetch entities from stores
  const fetchCharacters = useCharactersStore((state) => state.fetchCharacters);
  const fetchRegions = useRegionsStore((state) => state.fetchRegions);
  const fetchFactions = useFactionsStore((state) => state.fetchFactions);
  const fetchItems = useItemsStore((state) => state.fetchItems);
  const fetchRaces = useRacesStore((state) => state.fetchRaces);

  // Load all entities on mount and ensure fresh data
  useEffect(() => {
    // Always fetch fresh data when panel is mounted/visible
    const loadEntities = async () => {
      await Promise.all([
        fetchCharacters(bookId),
        fetchRegions(bookId),
        fetchFactions(bookId),
        fetchItems(bookId),
        fetchRaces(bookId),
      ]);
    };

    loadEntities();

    // Refetch when window regains focus (after suspension/tab switch)
    const handleFocus = () => {
      loadEntities();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [bookId, fetchCharacters, fetchRegions, fetchFactions, fetchItems, fetchRaces]);

  // Hooks
  const { searchTerm, setSearchTerm, selectedType, setSelectedType, filteredEntities } =
    useEntitySearch(bookId);

  const { pinnedEntities, pinEntity, unpinEntity, isPinned, reorderPinnedEntities, pinnedData } =
    usePinnedEntities(chapterId, bookId);

  // Track active drag item and drop target
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  // DnD sensors - leve e responsivo
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Distância mínima para iniciar drag (mais leve)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag over - para mostrar indicador visual
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? (over.id as string) : null);
  };

  // Handle drag end - troca simples de posição (swap)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pinnedEntities.findIndex(
        (p) => `${p.type}-${p.id}` === active.id
      );
      const newIndex = pinnedEntities.findIndex(
        (p) => `${p.type}-${p.id}` === over.id
      );

      // Cria novo array com swap simples (troca apenas os dois cards)
      const newOrder = [...pinnedEntities];
      [newOrder[oldIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[oldIndex]];

      reorderPinnedEntities(newOrder);
    }

    setActiveId(null);
    setOverId(null);
  };

  // Get active entity for drag overlay
  const activeEntity = useMemo(() => {
    if (!activeId) return null;

    const allEntities = pinnedEntities.map((pin) => {
      let entityData: any = null;
      if (pin.type === "character") {
        entityData = pinnedData.characters.find((c) => c.id === pin.id);
      } else if (pin.type === "region") {
        entityData = pinnedData.regions.find((r: any) => r.id === pin.id);
      } else if (pin.type === "faction") {
        entityData = pinnedData.factions.find((f: any) => f.id === pin.id);
      } else if (pin.type === "item") {
        entityData = pinnedData.items.find((i: any) => i.id === pin.id);
      } else if (pin.type === "race") {
        entityData = pinnedData.races.find((r: any) => r.id === pin.id);
      }
      return { type: pin.type, id: pin.id, data: entityData };
    }).filter(e => e.data !== null);

    return allEntities.find(e => `${e.type}-${e.id}` === activeId) || null;
  }, [activeId, pinnedEntities, pinnedData]);

  const renderEntityList = (type: EntityType, entities: any[]) => {
    if (entities.length === 0) return null;

    const Icon = ENTITY_CONFIG[type].icon;

    return (
      <Collapsible defaultOpen className="space-y-2">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg group">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${ENTITY_CONFIG[type].color}`} />
            <span className="text-sm font-medium">
              {t(`entity_types_plural.${type}`)}
            </span>
            <span className="text-xs text-muted-foreground">({entities.length})</span>
          </div>
          <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {entities.map((entity) => (
            <EntityListItem
              key={entity.id}
              type={type}
              id={entity.id}
              name={entity.name}
              image={entity.image}
              isPinned={isPinned(type, entity.id)}
              onPin={() => pinEntity(type, entity.id)}
              onUnpin={() => unpinEntity(type, entity.id)}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // Memoize column calculation for performance
  const { leftColumn, rightColumn } = useMemo(() => {
    const allEntities = pinnedEntities.map((pin) => {
      let entityData: any = null;
      if (pin.type === "character") {
        entityData = pinnedData.characters.find((c) => c.id === pin.id);
      } else if (pin.type === "region") {
        entityData = pinnedData.regions.find((r: any) => r.id === pin.id);
      } else if (pin.type === "faction") {
        entityData = pinnedData.factions.find((f: any) => f.id === pin.id);
      } else if (pin.type === "item") {
        entityData = pinnedData.items.find((i: any) => i.id === pin.id);
      } else if (pin.type === "race") {
        entityData = pinnedData.races.find((r: any) => r.id === pin.id);
      }
      return { type: pin.type, id: pin.id, data: entityData };
    }).filter(e => e.data !== null);

    return {
      leftColumn: allEntities.filter((_, index) => index % 2 === 0),
      rightColumn: allEntities.filter((_, index) => index % 2 === 1),
    };
  }, [pinnedEntities, pinnedData]);

  return (
    <div
      className="fixed right-0 top-8 bottom-0 bg-card border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300"
      style={{ width: isListVisible ? '1000px' : '600px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">{t("title")}</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleList}
            className="h-8 w-8"
            title={isListVisible ? t("actions.hide_list") : t("actions.show_list")}
          >
            {isListVisible ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content: Two columns */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Entity List */}
        <div
          className="flex flex-col border-r border-border overflow-hidden transition-all duration-300 ease-in-out absolute left-0 top-0 bottom-0 bg-card z-10"
          style={{
            width: isListVisible ? '400px' : '0px',
            opacity: isListVisible ? 1 : 0,
            pointerEvents: isListVisible ? 'auto' : 'none'
          }}
        >
          {/* Search and Filter */}
          <div className="p-4 space-y-3 border-b border-border bg-card">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as EntityType | "all")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filter.all")}</SelectItem>
                <SelectItem value="character">{t("entity_types_plural.character")}</SelectItem>
                <SelectItem value="region">{t("entity_types_plural.region")}</SelectItem>
                <SelectItem value="faction">{t("entity_types_plural.faction")}</SelectItem>
                <SelectItem value="item">{t("entity_types_plural.item")}</SelectItem>
                <SelectItem value="race">{t("entity_types_plural.race")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Entity Lists */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {renderEntityList("character", filteredEntities.characters)}
              {renderEntityList("region", filteredEntities.regions)}
              {renderEntityList("faction", filteredEntities.factions)}
              {renderEntityList("item", filteredEntities.items)}
              {renderEntityList("race", filteredEntities.races)}

              {/* Empty State */}
              {filteredEntities.characters.length === 0 &&
                filteredEntities.regions.length === 0 &&
                filteredEntities.factions.length === 0 &&
                filteredEntities.items.length === 0 &&
                filteredEntities.races.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">{t("empty_state")}</p>
                  </div>
                )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Column: Pinned Cards */}
        <div
          className="flex-1 flex flex-col overflow-hidden bg-muted/30 absolute right-0 top-0 bottom-0 transition-all duration-300 ease-in-out"
          style={{ left: '0px', paddingLeft: isListVisible ? '400px' : '0px' }}
        >
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{t("pinned_section")}</h3>
              <span className="text-xs text-muted-foreground">
                ({pinnedEntities.length})
              </span>
            </div>
          </div>

          {/* Pinned Cards Grid */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              {pinnedEntities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">
                    {t("no_pinned_entities")}
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={pinnedEntities.map((p) => `${p.type}-${p.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex gap-3">
                      {/* Left Column */}
                      <div className="flex-1 space-y-3">
                        {leftColumn.map((entity) => (
                          <SortablePinnedCard
                            key={`${entity.type}-${entity.id}`}
                            id={`${entity.type}-${entity.id}`}
                            isOver={overId === `${entity.type}-${entity.id}` && activeId !== overId}
                          >
                            <PinnedEntityCard
                              type={entity.type}
                              id={entity.id}
                              bookId={bookId}
                              onUnpin={() => unpinEntity(entity.type, entity.id)}
                            />
                          </SortablePinnedCard>
                        ))}
                      </div>

                      {/* Right Column */}
                      <div className="flex-1 space-y-3">
                        {rightColumn.map((entity) => (
                          <SortablePinnedCard
                            key={`${entity.type}-${entity.id}`}
                            id={`${entity.type}-${entity.id}`}
                            isOver={overId === `${entity.type}-${entity.id}` && activeId !== overId}
                          >
                            <PinnedEntityCard
                              type={entity.type}
                              id={entity.id}
                              bookId={bookId}
                              onUnpin={() => unpinEntity(entity.type, entity.id)}
                            />
                          </SortablePinnedCard>
                        ))}
                      </div>
                    </div>
                  </SortableContext>

                  {/* Drag Overlay - mostra cópia durante arraste */}
                  <DragOverlay dropAnimation={null}>
                    {activeEntity ? (
                      <div className="w-[280px] opacity-90 shadow-2xl ring-2 ring-primary/50 cursor-grabbing">
                        <PinnedEntityCard
                          type={activeEntity.type}
                          id={activeEntity.id}
                          bookId={bookId}
                          onUnpin={() => {}}
                        />
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
