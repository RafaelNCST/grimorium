import { Edit, Save, X, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TYPE_COLORS_CONSTANT } from "../../constants/type-colors-constant";
import { IRaceWithSpeciesName, RaceType } from "../../types/species-types";

interface PropsRaceHeader {
  race: IRaceWithSpeciesName;
  isEditing: boolean;
  editFormName: string;
  editFormType: RaceType;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onEditFormChange: (field: string, value: string) => void;
}

export function RaceHeader({
  race,
  isEditing,
  editFormName,
  editFormType,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onEditFormChange,
}: PropsRaceHeader) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={editFormName}
                onChange={(e) => onEditFormChange("name", e.target.value)}
                placeholder="Nome da raça"
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={editFormType}
                onValueChange={(value: RaceType) =>
                  onEditFormChange("type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aquática">Aquática</SelectItem>
                  <SelectItem value="Terrestre">Terrestre</SelectItem>
                  <SelectItem value="Voadora">Voadora</SelectItem>
                  <SelectItem value="Espacial">Espacial</SelectItem>
                  <SelectItem value="Espiritual">Espiritual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div>
            <CardTitle className="text-3xl mb-2">{race.name}</CardTitle>
            <CardDescription className="text-lg mb-4">
              Espécie: {race.speciesName}
            </CardDescription>
            <Badge className={TYPE_COLORS_CONSTANT[race.type]}>
              {race.type}
            </Badge>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button onClick={onSave} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button onClick={onDeleteModalOpen} variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
