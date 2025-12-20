import { Edit, Save, X, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation(["common", "race-detail", "create-race", "races"]);

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t("race-detail:fields.name")} *</Label>
              <Input
                id="name"
                value={editFormName}
                onChange={(e) => onEditFormChange("name", e.target.value)}
                placeholder={t("create-race:name_placeholder")}
              />
            </div>
            <div>
              <Label htmlFor="type">{t("races:type.label")} *</Label>
              <Select
                value={editFormType}
                onValueChange={(value: RaceType) =>
                  onEditFormChange("type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("races:type.select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aquática">{t("races:types.aquatic.label")}</SelectItem>
                  <SelectItem value="Terrestre">{t("races:types.terrestrial.label")}</SelectItem>
                  <SelectItem value="Voadora">{t("races:types.flying.label")}</SelectItem>
                  <SelectItem value="Espacial">{t("races:types.spatial.label")}</SelectItem>
                  <SelectItem value="Espiritual">{t("races:types.ethereal.label")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div>
            <CardTitle className="text-3xl mb-2">{race.name}</CardTitle>
            <CardDescription className="text-lg mb-4">
              {t("race-detail:fields.species")}: {race.speciesName}
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
              {t("common:actions.save")}
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" />
              {t("common:actions.cancel")}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              {t("common:actions.edit")}
            </Button>
            <Button onClick={onDeleteModalOpen} variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              {t("common:actions.delete")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
