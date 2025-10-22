import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, UserPlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { IRace, IRaceGroup } from "../types/race-types";
import { RaceCard } from "./race-card";

interface RaceGroupAccordionProps {
  group: IRaceGroup;
  onAddRacesToGroup: (groupId: string) => void;
  onCreateRaceInGroup: (groupId: string) => void;
  onEditGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onToggleRemoveMode: (groupId: string) => void;
  onRaceClick: (raceId: string) => void;
  onRemoveRaceFromGroup?: (raceId: string) => void;
  isRemoveMode: boolean;
}

export function RaceGroupAccordion({
  group,
  onAddRacesToGroup,
  onCreateRaceInGroup,
  onEditGroup,
  onDeleteGroup,
  onToggleRemoveMode,
  onRaceClick,
  onRemoveRaceFromGroup,
  isRemoveMode,
}: RaceGroupAccordionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `group-${group.id}`,
    data: {
      type: 'group',
      groupId: group.id,
    },
  });

  const shouldTruncateDescription = group.description.length > 200;
  const displayDescription = isDescriptionExpanded
    ? group.description
    : shouldTruncateDescription
      ? group.description.slice(0, 200) + "..."
      : group.description;

  const handleRaceClick = (raceId: string) => {
    if (isRemoveMode && onRemoveRaceFromGroup) {
      onRemoveRaceFromGroup(raceId);
    } else {
      onRaceClick(raceId);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`border rounded-lg bg-card/50 backdrop-blur-sm transition-all ${
        isOver ? "bg-primary/10 border-2 border-primary border-dashed" : ""
      }`}
    >
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <h3 className="text-xl font-bold">{group.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      ({group.races.length} {group.races.length === 1 ? "raça" : "raças"})
                    </span>
                  </div>
                </CollapsibleTrigger>
              </div>

              {/* Description */}
              <CollapsibleTrigger asChild>
                <div className="ml-8 cursor-pointer">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {displayDescription}
                  </p>
                  {shouldTruncateDescription && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDescriptionExpanded(!isDescriptionExpanded);
                      }}
                      className="text-sm text-primary hover:underline mt-1"
                    >
                      {isDescriptionExpanded ? "Ler menos" : "Ler mais"}
                    </button>
                  )}
                </div>
              </CollapsibleTrigger>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddRacesToGroup(group.id)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar no grupo
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCreateRaceInGroup(group.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar raça no grupo
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEditGroup(group.id)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar grupo
              </Button>
              <Button
                size="sm"
                variant={isRemoveMode ? "destructive" : "outline"}
                onClick={() => onToggleRemoveMode(group.id)}
              >
                <X className="h-4 w-4 mr-2" />
                {isRemoveMode ? "Sair do modo exclusão" : "Excluir do grupo"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeleteGroup(group.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir grupo
              </Button>
            </div>
          </div>

          {/* Content */}
          <CollapsibleContent>
            <div className="ml-8 mt-4 rounded-lg transition-all min-h-[120px]">
              {group.races.length === 0 ? (
                <div className={`text-center flex items-center justify-center h-full min-h-[120px] text-muted-foreground ${isOver ? "scale-105" : ""} transition-transform`}>
                  <div>
                    <p className="font-medium">
                      {isOver
                        ? "Solte aqui para adicionar ao grupo"
                        : "Nenhuma raça neste grupo ainda."}
                    </p>
                    {!isOver && (
                      <p className="text-sm mt-1">
                        Arraste raças para cá ou clique em "Adicionar no grupo"
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`p-4 ${isOver ? "p-6" : ""} transition-all`}>
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
                      isRemoveMode ? "opacity-75" : ""
                    }`}
                  >
                    {group.races.map((race) => (
                      <div
                        key={race.id}
                        className={isRemoveMode ? "relative group/remove" : ""}
                      >
                        <RaceCard
                          race={race}
                          onClick={handleRaceClick}
                          isDragDisabled={isRemoveMode}
                        />
                        {isRemoveMode && (
                          <div className="absolute inset-0 bg-destructive/10 rounded-lg border-2 border-destructive pointer-events-none group-hover/remove:bg-destructive/20 transition-colors">
                            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                              <X className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
