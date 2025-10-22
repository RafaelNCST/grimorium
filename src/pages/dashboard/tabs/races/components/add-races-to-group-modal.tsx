import { useState, useMemo } from "react";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { IRace } from "../types/race-types";

interface AddRacesToGroupModalProps {
  open: boolean;
  groupName: string;
  availableRaces: IRace[];
  onClose: () => void;
  onConfirm: (raceIds: string[]) => void;
}

export function AddRacesToGroupModal({
  open,
  groupName,
  availableRaces,
  onClose,
  onConfirm,
}: AddRacesToGroupModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRaceIds, setSelectedRaceIds] = useState<string[]>([]);

  // Filter races by search term
  const filteredRaces = useMemo(() => {
    if (!searchTerm.trim()) return availableRaces;
    return availableRaces.filter((race) =>
      race.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableRaces, searchTerm]);

  const handleToggleRace = (raceId: string) => {
    setSelectedRaceIds((prev) =>
      prev.includes(raceId)
        ? prev.filter((id) => id !== raceId)
        : [...prev, raceId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedRaceIds);
    setSelectedRaceIds([]);
    setSearchTerm("");
  };

  const handleCancel = () => {
    setSelectedRaceIds([]);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Raças ao Grupo</DialogTitle>
          <DialogDescription>
            Selecione as raças que deseja adicionar ao grupo "{groupName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar raça por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Races List */}
          <ScrollArea className="h-[400px] border rounded-lg">
            {filteredRaces.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchTerm
                  ? "Nenhuma raça encontrada"
                  : "Não há raças disponíveis para adicionar"}
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredRaces.map((race) => (
                  <div
                    key={race.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleToggleRace(race.id)}
                  >
                    <Checkbox
                      checked={selectedRaceIds.includes(race.id)}
                      onCheckedChange={() => handleToggleRace(race.id)}
                    />

                    {/* Race Image */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10">
                      {race?.image ? (
                        <img
                          src={race.image}
                          alt={race?.name || "Race"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                          {race.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Race Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{race.name}</p>
                      {race.scientificName && (
                        <p className="text-sm text-muted-foreground italic truncate">
                          {race.scientificName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Selection Counter */}
          {selectedRaceIds.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedRaceIds.length} {selectedRaceIds.length === 1 ? "raça selecionada" : "raças selecionadas"}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              variant="magical"
              onClick={handleConfirm}
              disabled={selectedRaceIds.length === 0}
            >
              Adicionar {selectedRaceIds.length > 0 && `(${selectedRaceIds.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
