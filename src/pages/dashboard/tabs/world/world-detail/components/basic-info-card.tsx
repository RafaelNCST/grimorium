import { Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { IWorldDetailEntity, IOrganization } from "../types/world-detail-types";

interface PropsBasicInfoCard {
  entity: IWorldDetailEntity;
  isEditing: boolean;
  editData: IWorldDetailEntity;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  mockOrganizations: IOrganization[];
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditDataChange: (field: string, value: any) => void;
}

export function BasicInfoCard({
  entity,
  isEditing,
  editData,
  imagePreview,
  fileInputRef,
  mockOrganizations,
  onImageChange,
  onEditDataChange,
}: PropsBasicInfoCard) {
  return (
    <Card className="card-magical">
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Imagem</Label>
              <div
                className="flex items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : entity.image ? (
                  <div className="relative w-full h-full">
                    <img
                      src={entity.image}
                      alt="Current"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                    <span className="text-sm text-muted-foreground text-center">
                      Clique para enviar imagem ou mapa
                    </span>
                    <span className="text-xs text-muted-foreground/70 text-center mt-1">
                      Recomendado: 16:9 para melhor visualização
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => onEditDataChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) =>
                  onEditDataChange("description", e.target.value)
                }
                className="min-h-[100px]"
              />
            </div>

            {entity.type === "Location" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="classification">Classificação</Label>
                  <Input
                    id="classification"
                    value={editData.classification || ""}
                    onChange={(e) =>
                      onEditDataChange("classification", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="climate">Clima</Label>
                  <Input
                    id="climate"
                    value={editData.climate || ""}
                    onChange={(e) => onEditDataChange("climate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={editData.location || ""}
                    onChange={(e) =>
                      onEditDataChange("location", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terrain">Solo</Label>
                  <Input
                    id="terrain"
                    value={editData.terrain || ""}
                    onChange={(e) => onEditDataChange("terrain", e.target.value)}
                  />
                </div>
              </>
            )}

            {(entity.type === "World" || entity.type === "Continent") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    value={editData.age || ""}
                    onChange={(e) => onEditDataChange("age", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dominantOrganization">
                    Organização Dominante
                  </Label>
                  <Select
                    value={editData.dominantOrganization || ""}
                    onValueChange={(value) =>
                      onEditDataChange(
                        "dominantOrganization",
                        value === "none" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma organização" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {mockOrganizations.map((org) => (
                        <SelectItem key={org.id} value={org.name}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {entity.image && (
              <div className="w-full">
                <img
                  src={entity.image}
                  alt={entity.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-2">{entity.name}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {entity.description}
              </p>
            </div>

            {entity.age && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Idade:</span>
                <span>{entity.age}</span>
              </div>
            )}

            {entity.classification && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Classificação:</span>
                <Badge variant="secondary">{entity.classification}</Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
