import { ExternalLink, X, MapPin, User, Swords, Building2, Dna, Map } from "lucide-react";
import { useTranslation } from "react-i18next";

import { CHARACTER_ROLES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-roles";
import { CHARACTER_STATUS_CONSTANT } from "@/components/modals/create-character-modal/constants/character-status";
import { GENDERS_CONSTANT } from "@/components/modals/create-character-modal/constants/genders";
import { ITEM_CATEGORIES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-categories";
import { ITEM_STATUSES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-statuses";
import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import { getDomainDisplayData } from "@/pages/dashboard/tabs/races/helpers/domain-filter-config";
import { REGION_SCALES_CONSTANT } from "@/pages/dashboard/tabs/world/constants/scale-colors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { EntityLink } from "../types/entity-link";

interface EntityHoverCardProps {
  entityLink: EntityLink;
  onViewDetails: () => void;
  onRemoveLink: () => void;
  onClose: () => void;
}

/**
 * Hover card that shows basic entity information
 * Appears when hovering over an entity link in the editor
 */
export function EntityHoverCard({
  entityLink,
  onViewDetails,
  onRemoveLink,
  onClose,
}: EntityHoverCardProps) {
  const { t } = useTranslation([
    "create-character",
    "create-item",
    "create-faction",
    "world",
  ]);

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      character: "Personagem",
      region: "Local",
      item: "Item",
      faction: "Facção",
      race: "Raça",
    };
    return labels[type] || type;
  };

  // Translate character role
  const translateRole = (role?: string) => {
    if (!role) return role;
    return t(`create-character:role.${role}`, role);
  };

  // Translate character status
  const translateCharacterStatus = (status?: string) => {
    if (!status) return status;
    return t(`create-character:status.${status}`, status);
  };

  // Translate character gender
  const translateGender = (gender?: string) => {
    if (!gender) return gender;
    return t(`create-character:gender.${gender}`, gender);
  };

  // Translate item category
  const translateItemCategory = (category?: string) => {
    if (!category) return category;
    return t(`create-item:category.${category}`, category);
  };

  // Translate item status
  const translateItemStatus = (status?: string) => {
    if (!status) return status;
    return t(`create-item:status.${status}`, status);
  };

  // Translate faction type
  const translateFactionType = (factionType?: string) => {
    if (!factionType) return factionType;
    return t(`create-faction:faction_type.${factionType}`, factionType);
  };

  // Translate faction status
  const translateFactionStatus = (status?: string) => {
    if (!status) return status;
    return t(`create-faction:status.${status}`, status);
  };


  // Translate region scale
  const translateScale = (scale?: string) => {
    if (!scale) return scale;
    return t(`world:scales.${scale}`, scale);
  };

  // Get badge config for character role
  const getRoleConfig = (role?: string) => {
    if (!role) return null;
    return CHARACTER_ROLES_CONSTANT.find((r) => r.value === role);
  };

  // Get badge config for character status
  const getCharacterStatusConfig = (status?: string) => {
    if (!status) return null;
    return CHARACTER_STATUS_CONSTANT.find((s) => s.value === status);
  };

  // Get badge config for item category
  const getItemCategoryConfig = (category?: string) => {
    if (!category) return null;
    return ITEM_CATEGORIES_CONSTANT.find((c) => c.value === category);
  };

  // Get badge config for item status
  const getItemStatusConfig = (status?: string) => {
    if (!status) return null;
    return ITEM_STATUSES_CONSTANT.find((s) => s.value === status);
  };

  // Get badge config for faction type
  const getFactionTypeConfig = (factionType?: string) => {
    if (!factionType) return null;
    return FACTION_TYPES_CONSTANT.find((f) => f.value === factionType);
  };

  // Get badge config for faction status
  const getFactionStatusConfig = (status?: string) => {
    if (!status) return null;
    return FACTION_STATUS_CONSTANT.find((s) => s.value === status);
  };


  // Get badge config for region scale
  const getScaleConfig = (scale?: string) => {
    if (!scale) return null;
    return REGION_SCALES_CONSTANT.find((s) => s.value === scale);
  };

  const getEntityIcon = (type: string) => {
    const icons: Record<string, any> = {
      character: User,
      region: Map,
      item: Swords,
      faction: Building2,
      race: Dna,
    };
    return icons[type] || User;
  };

  const getEntityInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const renderEntityDetails = () => {
    const entity = entityLink.entity;

    switch (entityLink.entityType) {
      case "character":
        const roleConfig = getRoleConfig(entity.role);
        const characterStatusConfig = getCharacterStatusConfig(entity.status);
        const RoleIcon = roleConfig?.icon;
        const CharacterStatusIcon = characterStatusConfig?.icon;

        return (
          <>
            {/* Character badges */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {roleConfig && RoleIcon && (
                <Badge
                  className={`${roleConfig.bgColorClass} ${roleConfig.colorClass} border px-2 py-0.5 text-xs pointer-events-none`}
                >
                  <RoleIcon className="w-3 h-3 mr-1" />
                  {translateRole(entity.role)}
                </Badge>
              )}
              {characterStatusConfig && CharacterStatusIcon && (
                <Badge
                  className={`${characterStatusConfig.bgColorClass} ${characterStatusConfig.colorClass} border px-2 py-0.5 text-xs pointer-events-none`}
                >
                  <CharacterStatusIcon className="w-3 h-3 mr-1" />
                  {translateCharacterStatus(entity.status)}
                </Badge>
              )}
            </div>
            {/* Character info */}
            <div className="space-y-1 text-xs mb-2">
              {entity.age && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Idade:</span> {entity.age}
                </p>
              )}
              {entity.gender && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Gênero:</span> {translateGender(entity.gender)}
                </p>
              )}
            </div>
            {/* Description */}
            {entity.description && (
              <p className="text-xs text-muted-foreground line-clamp-3">
                {entity.description}
              </p>
            )}
          </>
        );

      case "item":
        const itemCategoryConfig = getItemCategoryConfig(entity.category);
        const itemStatusConfig = getItemStatusConfig(entity.status);
        const ItemCategoryIcon = itemCategoryConfig?.icon;
        const ItemStatusIcon = itemStatusConfig?.icon;

        return (
          <>
            {/* Item badges */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {itemCategoryConfig && ItemCategoryIcon && (
                <Badge
                  className={`${itemCategoryConfig.bgColorClass} ${itemCategoryConfig.colorClass} border px-2 py-0.5 text-xs pointer-events-none`}
                >
                  <ItemCategoryIcon className="w-3 h-3 mr-1" />
                  {translateItemCategory(entity.category)}
                </Badge>
              )}
              {itemStatusConfig && ItemStatusIcon && (
                <Badge
                  className={`${itemStatusConfig.bgColorClass} ${itemStatusConfig.colorClass} border px-2 py-0.5 text-xs pointer-events-none`}
                >
                  <ItemStatusIcon className="w-3 h-3 mr-1" />
                  {translateItemStatus(entity.status)}
                </Badge>
              )}
            </div>
            {/* Basic description */}
            {entity.basicDescription && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {entity.basicDescription}
              </p>
            )}
          </>
        );

      case "faction":
        const factionTypeConfig = getFactionTypeConfig(entity.factionType);
        const factionStatusConfig = getFactionStatusConfig(entity.status);
        const FactionTypeIcon = factionTypeConfig?.icon;
        const FactionStatusIcon = factionStatusConfig?.icon;

        return (
          <>
            {/* Faction badges */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {factionTypeConfig && FactionTypeIcon && (
                <Badge
                  className={`${factionTypeConfig.bgColorClass} ${factionTypeConfig.colorClass} border px-2 py-0.5 text-xs pointer-events-none`}
                >
                  <FactionTypeIcon className="w-3 h-3 mr-1" />
                  {translateFactionType(entity.factionType)}
                </Badge>
              )}
              {factionStatusConfig && FactionStatusIcon && (
                <Badge
                  className={`${factionStatusConfig.bgColorClass} ${factionStatusConfig.colorClass} border px-2 py-0.5 text-xs pointer-events-none`}
                >
                  <FactionStatusIcon className="w-3 h-3 mr-1" />
                  {translateFactionStatus(entity.status)}
                </Badge>
              )}
            </div>
            {/* Summary */}
            {entity.summary && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {entity.summary}
              </p>
            )}
          </>
        );

      case "race":
        return (
          <>
            {/* Scientific name */}
            {entity.scientificName && (
              <p className="text-xs italic text-muted-foreground mb-2">
                {entity.scientificName}
              </p>
            )}
            {/* Domain badges */}
            {entity.domain && entity.domain.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {entity.domain.map((d) => {
                  const { icon: DomainIcon, colorConfig } = getDomainDisplayData(d as any);

                  if (!DomainIcon || !colorConfig) return null;

                  return (
                    <Badge
                      key={d}
                      className={`flex items-center gap-1 ${colorConfig.inactiveClasses} px-2 py-0.5 pointer-events-none`}
                    >
                      <DomainIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">{d}</span>
                    </Badge>
                  );
                })}
              </div>
            )}
            {/* Summary */}
            {entity.summary && (
              <p className="text-xs text-muted-foreground line-clamp-3">
                {entity.summary}
              </p>
            )}
          </>
        );

      case "region":
        const scaleConfig = getScaleConfig(entity.scale);
        const ScaleIcon = scaleConfig?.icon;

        return (
          <>
            {/* Scale badge */}
            {scaleConfig && ScaleIcon && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                <Badge
                  className={`${scaleConfig.bgColorClass} ${scaleConfig.colorClass} border px-2 py-0.5 text-xs pointer-events-none`}
                >
                  <ScaleIcon className="w-3 h-3 mr-1" />
                  {translateScale(entity.scale)}
                </Badge>
              </div>
            )}
            {/* Parent region */}
            {entity.parentName && (
              <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{entity.parentName}</span>
              </div>
            )}
            {/* Summary */}
            {entity.summary && (
              <p className="text-xs text-muted-foreground line-clamp-3">
                {entity.summary}
              </p>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const EntityIcon = getEntityIcon(entityLink.entityType);

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-4 min-w-[280px] max-w-[360px] animate-in fade-in-0 zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Entity Avatar/Image */}
          {entityLink.entity.image ? (
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage src={entityLink.entity.image} className="object-cover" />
              <AvatarFallback className="text-sm bg-gradient-to-br from-primary/20 to-primary/10">
                {getEntityInitials(entityLink.entity.name)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <EntityIcon className="w-6 h-6 text-primary" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">
              {entityLink.entity.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              {getEntityTypeLabel(entityLink.entityType)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Entity-specific details */}
      <div className="mb-3">{renderEntityDetails()}</div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
        >
          <ExternalLink className="h-3 w-3 mr-1.5" />
          Ver Detalhes
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveLink();
          }}
        >
          Não linkar essa entidade
        </Button>
      </div>
    </div>
  );
}
