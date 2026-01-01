import { useState, useRef, useEffect } from "react";

import {
  User,
  MapPin,
  Shield,
  Sparkles,
  Users,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCharactersStore } from "@/stores/characters-store";
import { useFactionsStore } from "@/stores/factions-store";
import { useItemsStore } from "@/stores/items-store";
import { useRacesStore } from "@/stores/races-store";
import { useRegionsStore } from "@/stores/regions-store";

import type { PinnedEntityCardProps } from "./types";

const ENTITY_CONFIG = {
  character: { icon: User, color: "text-blue-500" },
  region: { icon: MapPin, color: "text-green-500" },
  faction: { icon: Shield, color: "text-purple-500" },
  item: { icon: Sparkles, color: "text-amber-500" },
  race: { icon: Users, color: "text-pink-500" },
};

export function PinnedEntityCard({
  type,
  id,
  bookId,
  onUnpin,
}: PinnedEntityCardProps) {
  const { t } = useTranslation([
    "entity-reference",
    "character-detail",
    "region-detail",
    "faction-detail",
    "item-detail",
    "race-detail",
    "characters",
    "create-character",
    "create-faction",
    "create-item",
    "races",
    "world"
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});

  // Get entity data from stores
  const getCharacters = useCharactersStore((state) => state.getCharacters);
  const getRegions = useRegionsStore((state) => state.getRegions);
  const getFactions = useFactionsStore((state) => state.getFactions);
  const getItems = useItemsStore((state) => state.getItems);
  const getRaces = useRacesStore((state) => state.getRaces);

  // Get the specific entity
  const entity =
    type === "character"
      ? getCharacters(bookId).find((e) => e.id === id)
      : type === "region"
        ? getRegions(bookId).find((e) => e.id === id)
        : type === "faction"
          ? getFactions(bookId).find((e) => e.id === id)
          : type === "item"
            ? getItems(bookId).find((e) => e.id === id)
            : getRaces(bookId).find((e) => e.id === id);

  if (!entity) return null;

  const Icon = ENTITY_CONFIG[type].icon;

  // Helper to translate fixed values
  const translateValue = (field: string, value: string, entityType?: string) => {
    if (!value) return value;

    const normalizeKey = (str: string) => str.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_").replace(/[áàâã]/g, "a").replace(/[éèê]/g, "e").replace(/[íì]/g, "i").replace(/[óòôõ]/g, "o").replace(/[úù]/g, "u").replace(/ç/g, "c");

    // Character fields
    if (field === "role") {
      const roleKey = normalizeKey(value);
      return t(`create-character:role.${roleKey}`, { defaultValue: value });
    }
    if (field === "characterStatus") {
      const statusKey = normalizeKey(value);
      return t(`create-character:status.${statusKey}`, { defaultValue: value });
    }
    if (field === "gender") {
      const genderKey = normalizeKey(value);
      return t(`create-character:gender.${genderKey}`, { defaultValue: value });
    }
    if (field === "physicalType") {
      const typeKey = normalizeKey(value);
      return t(`create-character:physical_type.${typeKey}`, { defaultValue: value });
    }
    if (field === "archetype") {
      const archetypeKey = normalizeKey(value);
      return t(`create-character:archetype.${archetypeKey}`, { defaultValue: value });
    }
    if (field === "alignment") {
      const alignmentKey = normalizeKey(value);
      return t(`create-character:alignment.${alignmentKey}`, { defaultValue: value });
    }

    // Region fields
    if (field === "scale") {
      const scaleKey = normalizeKey(value);
      return t(`world:scales.${scaleKey}`, { defaultValue: value });
    }
    if (field === "currentSeason") {
      const seasonKey = normalizeKey(value);
      return t(`region-detail:seasons.${seasonKey}`, { defaultValue: value });
    }

    // Faction fields
    if (field === "factionStatus") {
      const statusKey = normalizeKey(value);
      return t(`create-faction:status.${statusKey}`, { defaultValue: value });
    }
    if (field === "factionType") {
      const typeKey = normalizeKey(value);
      return t(`create-faction:faction_type.${typeKey}`, { defaultValue: value });
    }
    if (field === "influence") {
      const influenceKey = normalizeKey(value);
      return t(`create-faction:influence.${influenceKey}`, { defaultValue: value });
    }
    if (field === "publicReputation") {
      const reputationKey = normalizeKey(value);
      return t(`create-faction:reputation.${reputationKey}`, { defaultValue: value });
    }
    if (field === "factionAlignment") {
      const alignmentKey = normalizeKey(value);
      return t(`create-faction:alignment.${alignmentKey}`, { defaultValue: value });
    }

    // Item fields
    if (field === "itemCategory") {
      const categoryKey = normalizeKey(value);
      return t(`create-item:category.${categoryKey}`, { defaultValue: value });
    }
    if (field === "itemStatus") {
      const statusKey = normalizeKey(value);
      return t(`create-item:status.${statusKey}`, { defaultValue: value });
    }
    if (field === "storyRarity") {
      const rarityKey = normalizeKey(value);
      return t(`create-item:rarity.${rarityKey}`, { defaultValue: value });
    }

    // Race fields
    if (field === "domain") {
      const domainKey = normalizeKey(value);
      return t(`races:domains.${domainKey}.label`, { defaultValue: value });
    }
    if (field === "diet") {
      const dietKey = normalizeKey(value);
      return t(`races:diets.${dietKey}.label`, { defaultValue: value });
    }
    if (field === "communication") {
      const commKey = normalizeKey(value);
      return t(`races:communications.${commKey}.label`, { defaultValue: value });
    }
    if (field === "moralTendency") {
      const tendencyKey = normalizeKey(value);
      return t(`races:moral_tendencies.${tendencyKey}.label`, { defaultValue: value });
    }
    if (field === "reproductiveCycle") {
      const cycleKey = normalizeKey(value);
      return t(`races:reproductive_cycles.${cycleKey}.label`, { defaultValue: value });
    }
    if (field === "habits") {
      const habitKey = normalizeKey(value);
      return t(`races:habits.${habitKey}.label`, { defaultValue: value });
    }
    if (field === "physicalCapacity") {
      const capacityKey = normalizeKey(value);
      return t(`races:physical_capacities.${capacityKey}.label`, { defaultValue: value });
    }

    return value;
  };

  // Check if description needs "read more" button
  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      // Check if content is truncated (scrollHeight > clientHeight)
      setShowReadMore(element.scrollHeight > element.clientHeight);
    }
  }, [entity]);

  const renderBasicInfo = () => {
    if (type === "character") {
      const char = entity as any;
      return (
        <>
          {char.age && <InfoRow label={t("character-detail:fields.age")} value={char.age} />}
          {char.role && <InfoRow label={t("character-detail:fields.role")} value={translateValue("role", char.role)} />}
          {char.status && <InfoRow label={t("character-detail:fields.status")} value={translateValue("characterStatus", char.status)} />}
          {char.gender && <InfoRow label={t("character-detail:fields.gender")} value={translateValue("gender", char.gender)} />}
        </>
      );
    }

    if (type === "region") {
      const region = entity as any;
      return (
        <>
          {region.scale && <InfoRow label={t("region-detail:fields.scale")} value={translateValue("scale", region.scale)} />}
          {region.climate && <InfoRow label={t("region-detail:fields.climate")} value={region.climate} />}
          {region.currentSeason && <InfoRow label={t("region-detail:fields.current_season")} value={translateValue("currentSeason", region.currentSeason)} />}
        </>
      );
    }

    if (type === "faction") {
      const faction = entity as any;
      return (
        <>
          {faction.factionType && <InfoRow label={t("faction-detail:fields.faction_type")} value={translateValue("factionType", faction.factionType)} />}
          {faction.status && <InfoRow label={t("faction-detail:fields.status")} value={translateValue("factionStatus", faction.status)} />}
          {faction.influence && <InfoRow label={t("faction-detail:fields.influence")} value={translateValue("influence", faction.influence)} />}
          {faction.publicReputation && <InfoRow label={t("faction-detail:fields.public_reputation")} value={translateValue("publicReputation", faction.publicReputation)} />}
        </>
      );
    }

    if (type === "item") {
      const item = entity as any;
      return (
        <>
          {item.category && <InfoRow label={t("item-detail:fields.category")} value={translateValue("itemCategory", item.category)} />}
          {item.status && <InfoRow label={t("item-detail:fields.status")} value={translateValue("itemStatus", item.status)} />}
        </>
      );
    }

    if (type === "race") {
      const race = entity as any;
      return (
        <>
          {race.domain && race.domain.length > 0 && (
            <div className="text-xs">
              <span className="text-purple-600 dark:text-purple-400 font-medium">{t("race-detail:fields.domain")}: </span>
              <span className="text-foreground">
                {race.domain.map((d: string) => translateValue("domain", d)).join(", ")}
              </span>
            </div>
          )}
        </>
      );
    }

    return null;
  };

  const toggleField = (key: string) => {
    setExpandedFields(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if entity has any advanced info
  const hasAdvancedInfo = () => {
    const e = entity as any;

    if (type === "character") {
      return !!(
        e.height || e.weight || e.hair || e.eyes || e.skinTone ||
        e.physicalType || e.face || e.distinguishingFeatures ||
        (e.speciesAndRace && e.speciesAndRace.length > 0) ||
        e.personality || e.archetype || e.alignment || e.hobbies ||
        e.dreamsAndGoals || e.fearsAndTraumas || e.favoriteFood ||
        e.favoriteMusic || e.past ||
        (e.birthPlace && e.birthPlace.length > 0) ||
        (e.nicknames && e.nicknames.length > 0) ||
        e.affiliatedPlace || e.organization
      );
    }

    if (type === "region") {
      return !!(
        e.customSeasonName || e.generalDescription || e.regionAnomalies ||
        e.narrativePurpose || e.uniqueCharacteristics || e.politicalImportance ||
        e.religiousImportance || e.worldPerception || e.regionMysteries || e.inspirations
      );
    }

    if (type === "faction") {
      return !!(
        e.governmentForm || e.economy || e.symbolsAndSecrets || e.factionMotto ||
        e.uniformAndAesthetics || e.alignment || e.rulesAndLaws ||
        e.foundationDate || e.foundationHistorySummary ||
        e.mainResources || e.currencies || e.dominatedAreas || e.mainBase || e.areasOfInterest ||
        e.traditionsAndRituals || e.beliefsAndValues || e.languagesUsed ||
        e.militaryPower !== undefined || e.politicalPower !== undefined ||
        e.culturalPower !== undefined || e.economicPower !== undefined ||
        e.organizationObjectives || e.narrativeImportance || e.inspirations
      );
    }

    if (type === "item") {
      return !!(
        e.appearance || e.origin || (e.alternativeNames && e.alternativeNames.length > 0) ||
        e.storyRarity || e.itemUsage || e.usageRequirements || e.usageConsequences ||
        e.narrativePurpose
      );
    }

    if (type === "race") {
      return !!(
        e.alternativeNames || e.culturalNotes || e.scientificName ||
        e.generalAppearance || e.lifeExpectancy || e.averageHeight || e.averageWeight ||
        e.specialPhysicalCharacteristics || e.habits || e.reproductiveCycle ||
        e.otherReproductiveCycleDescription || e.diet || e.elementalDiet || e.communication ||
        e.otherCommunication || e.moralTendency || e.socialOrganization || e.habitat ||
        e.physicalCapacity || e.specialCharacteristics || e.weaknesses ||
        e.storyMotivation || e.inspirations
      );
    }

    return false;
  };

  // Get all entities from stores
  const allRaces = getRaces(bookId);
  const allRegions = getRegions(bookId);

  // Helper functions to get entity names
  const getRaceName = (raceId: string) => {
    const race = allRaces.find(r => r.id === raceId);
    return race?.name || raceId;
  };

  const getRegionName = (regionId: string) => {
    const region = allRegions.find(r => r.id === regionId);
    return region?.name || regionId;
  };

  const renderAdvancedInfo = () => {
    if (type === "character") {
      const char = entity as any;

      return (
        <div className="space-y-4">
          {/* Appearance */}
          {(char.height || char.weight || char.skinTone || char.physicalType || char.hair || char.eyes || char.face || char.distinguishingFeatures || (char.speciesAndRace && char.speciesAndRace.length > 0)) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">{t("character-detail:sections.appearance")}</p>
              <div className="space-y-1.5">
                {char.height && <InfoRow label={t("character-detail:fields.height")} value={char.height} compact />}
                {char.weight && <InfoRow label={t("character-detail:fields.weight")} value={char.weight} compact />}
                {char.skinTone && <InfoRow label={t("character-detail:fields.skin_tone")} value={char.skinTone} compact />}

                {/* Physical Type (grid -> badge) */}
                {char.physicalType && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("character-detail:fields.physical_type")}:</span>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-0.5 bg-purple-600/10 text-white rounded text-xs border border-purple-600">
                        {translateValue("physicalType", char.physicalType)}
                      </span>
                    </div>
                  </div>
                )}

                {char.hair && <InfoRow label={t("character-detail:fields.hair")} value={char.hair} compact />}
                {char.eyes && <InfoRow label={t("character-detail:fields.eyes")} value={char.eyes} compact />}
                {char.face && <ExpandableField label={t("character-detail:fields.face")} value={char.face} fieldKey="face" expandedFields={expandedFields} onToggle={toggleField} />}
                {char.distinguishingFeatures && <ExpandableField label={t("character-detail:fields.distinguishing_features")} value={char.distinguishingFeatures} fieldKey="distinguishingFeatures" expandedFields={expandedFields} onToggle={toggleField} />}

                {/* Species and Race (raças) */}
                {char.speciesAndRace && char.speciesAndRace.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("character-detail:fields.race")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {char.speciesAndRace.map((raceId: string) => (
                        <span key={raceId} className="px-2 py-0.5 bg-purple-600/10 text-white rounded text-xs border border-purple-600">
                          {getRaceName(raceId)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Behavior */}
          {(char.archetype || char.alignment || char.favoriteFood || char.favoriteMusic || char.personality || char.hobbies || char.dreamsAndGoals || char.fearsAndTraumas) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">{t("character-detail:sections.behavior")}</p>
              <div className="space-y-1.5">
                {/* Archetype (grid -> badge) */}
                {char.archetype && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("character-detail:fields.archetype")}:</span>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-0.5 bg-purple-600/10 text-white rounded text-xs border border-purple-600">
                        {translateValue("archetype", char.archetype)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Alignment (grid -> badge) */}
                {char.alignment && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("character-detail:fields.alignment")}:</span>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-0.5 bg-purple-600/10 text-white rounded text-xs border border-purple-600">
                        {translateValue("alignment", char.alignment)}
                      </span>
                    </div>
                  </div>
                )}

                {char.favoriteFood && <InfoRow label={t("character-detail:fields.favorite_food")} value={char.favoriteFood} compact />}
                {char.favoriteMusic && <InfoRow label={t("character-detail:fields.favorite_music")} value={char.favoriteMusic} compact />}
                {char.personality && <ExpandableField label={t("character-detail:fields.personality")} value={char.personality} fieldKey="personality" expandedFields={expandedFields} onToggle={toggleField} />}
                {char.hobbies && <ExpandableField label={t("character-detail:fields.hobbies")} value={char.hobbies} fieldKey="hobbies" expandedFields={expandedFields} onToggle={toggleField} />}
                {char.dreamsAndGoals && <ExpandableField label={t("character-detail:fields.dreams_and_goals")} value={char.dreamsAndGoals} fieldKey="dreamsAndGoals" expandedFields={expandedFields} onToggle={toggleField} />}
                {char.fearsAndTraumas && <ExpandableField label={t("character-detail:fields.fears_and_traumas")} value={char.fearsAndTraumas} fieldKey="fearsAndTraumas" expandedFields={expandedFields} onToggle={toggleField} />}
              </div>
            </div>
          )}

          {/* Locations & Organizations */}
          {((char.birthPlace && char.birthPlace.length > 0) || (char.nicknames && char.nicknames.length > 0) || char.past || char.affiliatedPlace || char.organization) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">{t("character-detail:sections.locations_orgs")}</p>
              <div className="space-y-1.5">
                {/* Birth Place (buscar nome da região) */}
                {char.birthPlace && char.birthPlace.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("character-detail:fields.birth_place")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {char.birthPlace.map((regionId: string) => (
                        <span key={regionId} className="px-2 py-0.5 bg-purple-600/10 text-white rounded text-xs border border-purple-600">
                          {getRegionName(regionId)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nicknames (lista simples sem badges) */}
                {char.nicknames && char.nicknames.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("character-detail:fields.nicknames")}:</span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {char.nicknames.map((nick: string, i: number) => (
                        <li key={i}>{nick}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {char.past && <ExpandableField label={t("character-detail:fields.past")} value={char.past} fieldKey="past" expandedFields={expandedFields} onToggle={toggleField} />}
                {char.affiliatedPlace && <InfoRow label={t("character-detail:fields.affiliated_place")} value={char.affiliatedPlace} compact />}
                {char.organization && <InfoRow label={t("character-detail:fields.organization")} value={char.organization} compact />}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (type === "region") {
      const region = entity as any;
      return (
        <div className="space-y-3">
          {/* Environment */}
          {(region.customSeasonName || region.generalDescription || region.regionAnomalies) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("region-detail:sections.environment")}</p>
              <div className="space-y-1.5">
                {region.customSeasonName && <InfoRow label={t("region-detail:fields.custom_season_name")} value={region.customSeasonName} compact />}
                {region.generalDescription && <ExpandableField label={t("region-detail:fields.general_description")} value={region.generalDescription} fieldKey="generalDescription" expandedFields={expandedFields} onToggle={toggleField} />}
                {region.regionAnomalies && JSON.parse(region.regionAnomalies).length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("region-detail:fields.region_anomalies")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {JSON.parse(region.regionAnomalies).map((anomaly: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded text-xs">
                          {anomaly}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Narrative */}
          {(region.narrativePurpose || region.uniqueCharacteristics || region.politicalImportance || region.religiousImportance || region.worldPerception || region.regionMysteries || region.inspirations) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("region-detail:sections.narrative")}</p>
              <div className="space-y-1.5">
                {region.narrativePurpose && <ExpandableField label={t("region-detail:fields.narrative_purpose")} value={region.narrativePurpose} fieldKey="narrativePurpose" expandedFields={expandedFields} onToggle={toggleField} />}
                {region.uniqueCharacteristics && <ExpandableField label={t("region-detail:fields.unique_characteristics")} value={region.uniqueCharacteristics} fieldKey="uniqueCharacteristics" expandedFields={expandedFields} onToggle={toggleField} />}
                {region.politicalImportance && <ExpandableField label={t("region-detail:fields.political_importance")} value={region.politicalImportance} fieldKey="politicalImportance" expandedFields={expandedFields} onToggle={toggleField} />}
                {region.religiousImportance && <ExpandableField label={t("region-detail:fields.religious_importance")} value={region.religiousImportance} fieldKey="religiousImportance" expandedFields={expandedFields} onToggle={toggleField} />}
                {region.worldPerception && <ExpandableField label={t("region-detail:fields.world_perception")} value={region.worldPerception} fieldKey="worldPerception" expandedFields={expandedFields} onToggle={toggleField} />}
                {region.regionMysteries && JSON.parse(region.regionMysteries).length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("region-detail:fields.region_mysteries")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {JSON.parse(region.regionMysteries).map((mystery: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-xs">
                          {mystery}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {region.inspirations && JSON.parse(region.inspirations).length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("region-detail:fields.inspirations")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {JSON.parse(region.inspirations).map((inspiration: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs">
                          {inspiration}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (type === "faction") {
      const faction = entity as any;
      return (
        <div className="space-y-3">
          {/* Organization */}
          {(faction.governmentForm || faction.economy || faction.symbolsAndSecrets || faction.factionMotto || faction.uniformAndAesthetics || faction.alignment || faction.rulesAndLaws) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("faction-detail:sections.organization")}</p>
              <div className="space-y-1.5">
                {faction.governmentForm && <InfoRow label={t("faction-detail:fields.government_form")} value={faction.governmentForm} compact />}
                {faction.economy && <ExpandableField label={t("faction-detail:fields.economy")} value={faction.economy} fieldKey="economy" expandedFields={expandedFields} onToggle={toggleField} />}
                {faction.symbolsAndSecrets && <ExpandableField label={t("faction-detail:fields.symbols_and_secrets")} value={faction.symbolsAndSecrets} fieldKey="symbolsAndSecrets" expandedFields={expandedFields} onToggle={toggleField} />}
                {faction.factionMotto && <InfoRow label={t("faction-detail:fields.faction_motto")} value={faction.factionMotto} compact />}
                {faction.uniformAndAesthetics && <ExpandableField label={t("faction-detail:fields.uniform_and_aesthetics")} value={faction.uniformAndAesthetics} fieldKey="uniformAndAesthetics" expandedFields={expandedFields} onToggle={toggleField} />}
                {faction.alignment && <InfoRow label={t("faction-detail:fields.alignment")} value={translateValue("factionAlignment", faction.alignment)} compact />}
                {faction.rulesAndLaws && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("faction-detail:fields.rules_and_laws")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {faction.rulesAndLaws.map((rule: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded text-xs">
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History */}
          {(faction.foundationDate || faction.foundationHistorySummary) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("faction-detail:sections.history")}</p>
              <div className="space-y-1.5">
                {faction.foundationDate && <InfoRow label={t("faction-detail:fields.foundation_date")} value={faction.foundationDate} compact />}
                {faction.foundationHistorySummary && <ExpandableField label={t("faction-detail:fields.foundation_history_summary")} value={faction.foundationHistorySummary} fieldKey="foundationHistorySummary" expandedFields={expandedFields} onToggle={toggleField} />}
              </div>
            </div>
          )}

          {/* Resources & Territory */}
          {(faction.mainResources || faction.currencies || faction.dominatedAreas || faction.mainBase || faction.areasOfInterest) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("faction-detail:sections.resources")}</p>
              <div className="space-y-1.5">
                {faction.mainResources && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("faction-detail:fields.main_resources")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {faction.mainResources.map((resource: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded text-xs">
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {faction.currencies && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("faction-detail:fields.currencies")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {faction.currencies.map((currency: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded text-xs">
                          {currency}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {faction.dominatedAreas && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("faction-detail:fields.dominated_areas")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {faction.dominatedAreas.map((area: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {faction.mainBase && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("faction-detail:fields.main_base")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {faction.mainBase.map((base: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs">
                          {base}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {faction.areasOfInterest && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("faction-detail:fields.areas_of_interest")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {faction.areasOfInterest.map((area: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Culture */}
          {(faction.traditionsAndRituals || faction.beliefsAndValues || faction.languagesUsed) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("faction-detail:sections.culture")}</p>
              <div className="space-y-1.5">
                {faction.traditionsAndRituals && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("faction-detail:fields.traditions_and_rituals")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {faction.traditionsAndRituals.map((tradition: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded text-xs">
                          {tradition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {faction.beliefsAndValues && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("faction-detail:fields.beliefs_and_values")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {faction.beliefsAndValues.map((belief: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded text-xs">
                          {belief}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {faction.languagesUsed && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("faction-detail:fields.languages_used")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {faction.languagesUsed.map((language: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded text-xs">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Power & Influence */}
          {(faction.militaryPower !== undefined || faction.politicalPower !== undefined || faction.culturalPower !== undefined || faction.economicPower !== undefined) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("faction-detail:sections.power")}</p>
              <div className="space-y-1.5">
                {faction.militaryPower !== undefined && <InfoRow label={t("faction-detail:fields.military_power")} value={`${faction.militaryPower}/10`} compact />}
                {faction.politicalPower !== undefined && <InfoRow label={t("faction-detail:fields.political_power")} value={`${faction.politicalPower}/10`} compact />}
                {faction.culturalPower !== undefined && <InfoRow label={t("faction-detail:fields.cultural_power")} value={`${faction.culturalPower}/10`} compact />}
                {faction.economicPower !== undefined && <InfoRow label={t("faction-detail:fields.economic_power")} value={`${faction.economicPower}/10`} compact />}
              </div>
            </div>
          )}

          {/* Narrative */}
          {(faction.organizationObjectives || faction.narrativeImportance || faction.inspirations) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("faction-detail:sections.narrative")}</p>
              <div className="space-y-1.5">
                {faction.organizationObjectives && <ExpandableField label={t("faction-detail:fields.organization_objectives")} value={faction.organizationObjectives} fieldKey="organizationObjectives" expandedFields={expandedFields} onToggle={toggleField} />}
                {faction.narrativeImportance && <ExpandableField label={t("faction-detail:fields.narrative_importance")} value={faction.narrativeImportance} fieldKey="narrativeImportance" expandedFields={expandedFields} onToggle={toggleField} />}
                {faction.inspirations && <InfoRow label={t("faction-detail:fields.inspirations")} value={faction.inspirations} compact />}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (type === "item") {
      const item = entity as any;
      return (
        <div className="space-y-3">
          {/* Details */}
          {(item.appearance || item.origin || item.alternativeNames || item.storyRarity) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("item-detail:sections.details")}</p>
              <div className="space-y-1.5">
                {item.appearance && <ExpandableField label={t("item-detail:fields.appearance")} value={item.appearance} fieldKey="appearance" expandedFields={expandedFields} onToggle={toggleField} />}
                {item.origin && <ExpandableField label={t("item-detail:fields.origin")} value={item.origin} fieldKey="origin" expandedFields={expandedFields} onToggle={toggleField} />}
                {item.alternativeNames && item.alternativeNames.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("item-detail:fields.alternative_names")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.alternativeNames.map((name: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded text-xs">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {item.storyRarity && <InfoRow label={t("item-detail:fields.story_rarity")} value={translateValue("storyRarity", item.storyRarity)} compact />}
              </div>
            </div>
          )}

          {/* Usage */}
          {(item.itemUsage || item.usageRequirements || item.usageConsequences) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("item-detail:sections.usage")}</p>
              <div className="space-y-1.5">
                {item.itemUsage && <ExpandableField label={t("item-detail:fields.item_usage")} value={item.itemUsage} fieldKey="itemUsage" expandedFields={expandedFields} onToggle={toggleField} />}
                {item.usageRequirements && <ExpandableField label={t("item-detail:fields.usage_requirements")} value={item.usageRequirements} fieldKey="usageRequirements" expandedFields={expandedFields} onToggle={toggleField} />}
                {item.usageConsequences && <ExpandableField label={t("item-detail:fields.usage_consequences")} value={item.usageConsequences} fieldKey="usageConsequences" expandedFields={expandedFields} onToggle={toggleField} />}
              </div>
            </div>
          )}

          {/* Narrative */}
          {item.narrativePurpose && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("item-detail:sections.narrative")}</p>
              <div className="space-y-1.5">
                {item.narrativePurpose && <ExpandableField label={t("item-detail:fields.narrative_purpose")} value={item.narrativePurpose} fieldKey="narrativePurpose" expandedFields={expandedFields} onToggle={toggleField} />}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (type === "race") {
      const race = entity as any;
      return (
        <div className="space-y-3">
          {/* Culture */}
          {(race.alternativeNames || race.culturalNotes || race.scientificName) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("race-detail:sections.culture")}</p>
              <div className="space-y-1.5">
                {race.scientificName && <InfoRow label={t("race-detail:fields.scientific_name")} value={race.scientificName} compact />}
                {race.alternativeNames && race.alternativeNames.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("race-detail:fields.alternative_names")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {race.alternativeNames.map((name: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded text-xs">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {race.culturalNotes && <ExpandableField label={t("race-detail:fields.cultural_notes")} value={race.culturalNotes} fieldKey="culturalNotes" expandedFields={expandedFields} onToggle={toggleField} />}
              </div>
            </div>
          )}

          {/* Appearance */}
          {(race.generalAppearance || race.lifeExpectancy || race.averageHeight || race.averageWeight || race.specialPhysicalCharacteristics) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("race-detail:sections.appearance")}</p>
              <div className="space-y-1.5">
                {race.generalAppearance && <ExpandableField label={t("race-detail:fields.general_appearance")} value={race.generalAppearance} fieldKey="generalAppearance" expandedFields={expandedFields} onToggle={toggleField} />}
                {race.lifeExpectancy && <InfoRow label={t("race-detail:fields.life_expectancy")} value={race.lifeExpectancy} compact />}
                {race.averageHeight && <InfoRow label={t("race-detail:fields.average_height")} value={race.averageHeight} compact />}
                {race.averageWeight && <InfoRow label={t("race-detail:fields.average_weight")} value={race.averageWeight} compact />}
                {race.specialPhysicalCharacteristics && <ExpandableField label={t("race-detail:fields.special_physical_characteristics")} value={race.specialPhysicalCharacteristics} fieldKey="specialPhysicalCharacteristics" expandedFields={expandedFields} onToggle={toggleField} />}
              </div>
            </div>
          )}

          {/* Behaviors */}
          {(race.habits || race.reproductiveCycle || race.otherReproductiveCycleDescription || race.diet || race.elementalDiet || race.communication || race.otherCommunication || race.moralTendency || race.socialOrganization || race.habitat) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("race-detail:sections.behaviors")}</p>
              <div className="space-y-1.5">
                {race.habits && <InfoRow label={t("race-detail:fields.habits")} value={translateValue("habits", race.habits)} compact />}
                {race.reproductiveCycle && <InfoRow label={t("race-detail:fields.reproductive_cycle")} value={translateValue("reproductiveCycle", race.reproductiveCycle)} compact />}
                {race.otherReproductiveCycleDescription && <ExpandableField label={t("race-detail:fields.other_reproductive_cycle_description")} value={race.otherReproductiveCycleDescription} fieldKey="otherReproductiveCycleDescription" expandedFields={expandedFields} onToggle={toggleField} />}
                {race.diet && <InfoRow label={t("race-detail:fields.diet")} value={translateValue("diet", race.diet)} compact />}
                {race.elementalDiet && <InfoRow label={t("race-detail:fields.elemental_diet")} value={race.elementalDiet} compact />}
                {race.communication && race.communication.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("race-detail:fields.communication")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {race.communication.map((comm: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded text-xs">
                          {translateValue("communication", comm)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {race.otherCommunication && <InfoRow label={t("race-detail:fields.other_communication")} value={race.otherCommunication} compact />}
                {race.moralTendency && <InfoRow label={t("race-detail:fields.moral_tendency")} value={translateValue("moralTendency", race.moralTendency)} compact />}
                {race.socialOrganization && <ExpandableField label={t("race-detail:fields.social_organization")} value={race.socialOrganization} fieldKey="socialOrganization" expandedFields={expandedFields} onToggle={toggleField} />}
                {race.habitat && race.habitat.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{t("race-detail:fields.habitat")}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {race.habitat.map((habitat: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-xs">
                          {habitat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Power */}
          {(race.physicalCapacity || race.specialCharacteristics || race.weaknesses) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("race-detail:sections.power")}</p>
              <div className="space-y-1.5">
                {race.physicalCapacity && <InfoRow label={t("race-detail:fields.physical_capacity")} value={translateValue("physicalCapacity", race.physicalCapacity)} compact />}
                {race.specialCharacteristics && <ExpandableField label={t("race-detail:fields.special_characteristics")} value={race.specialCharacteristics} fieldKey="specialCharacteristics" expandedFields={expandedFields} onToggle={toggleField} />}
                {race.weaknesses && <ExpandableField label={t("race-detail:fields.weaknesses")} value={race.weaknesses} fieldKey="weaknesses" expandedFields={expandedFields} onToggle={toggleField} />}
              </div>
            </div>
          )}

          {/* Narrative */}
          {(race.storyMotivation || race.inspirations) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase">{t("race-detail:sections.narrative")}</p>
              <div className="space-y-1.5">
                {race.storyMotivation && <ExpandableField label={t("race-detail:fields.story_motivation")} value={race.storyMotivation} fieldKey="storyMotivation" expandedFields={expandedFields} onToggle={toggleField} />}
                {race.inspirations && <InfoRow label={t("race-detail:fields.inspirations")} value={race.inspirations} compact />}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-2 p-3 border-b border-border">
        <Avatar className="w-10 h-10 flex-shrink-0 rounded-lg">
          <AvatarImage src={(entity as any).image} />
          <AvatarFallback className="rounded-lg">
            <Icon className={`w-5 h-5 ${ENTITY_CONFIG[type].color}`} />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{(entity as any).name}</h4>
          <p className="text-xs text-muted-foreground">{t(`entity_types.${type}`)}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={onUnpin}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="pt-3 px-3">
          {/* Description/Summary */}
          {((entity as any).description || (entity as any).summary || (entity as any).basicDescription) && (
            <div className="text-xs space-y-1 mb-3">
              <p
                ref={descriptionRef}
                className={`text-foreground ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}
              >
                {(entity as any).description || (entity as any).summary || (entity as any).basicDescription}
              </p>
              {showReadMore && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-primary hover:underline text-xs font-medium"
                >
                  {isDescriptionExpanded ? t("actions.read_less") : t("actions.read_more")}
                </button>
              )}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-1 text-xs mb-3">
            {renderBasicInfo()}
          </div>

          {/* Advanced Info Collapsible */}
          {hasAdvancedInfo() && (
            <div className="-mx-3">
              <Separator />
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors"
              >
                  <span className="text-xs font-medium text-foreground">
                    {isExpanded ? t("actions.hide_advanced") : t("actions.show_advanced")}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="px-3 pt-2 pb-3">
                  {renderAdvancedInfo()}
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// Helper component for info rows
function InfoRow({ label, value, compact }: { label: string; value: string | number; compact?: boolean }) {
  return (
    <div className={compact ? "text-xs" : "text-sm"}>
      <span className="text-purple-600 dark:text-purple-400 font-medium">{label}: </span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

// Helper component for expandable text fields
function ExpandableField({
  label,
  value,
  fieldKey,
  expandedFields,
  onToggle
}: {
  label: string;
  value: string;
  fieldKey: string;
  expandedFields: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  const { t } = useTranslation(["entity-reference"]);
  const ref = useRef<HTMLParagraphElement>(null);
  const [needsExpand, setNeedsExpand] = useState(false);
  const isExpanded = expandedFields[fieldKey];

  useEffect(() => {
    if (ref.current) {
      setNeedsExpand(ref.current.scrollHeight > ref.current.clientHeight);
    }
  }, [value]);

  return (
    <div className="text-xs">
      <span className="text-purple-600 dark:text-purple-400 font-medium">{label}:</span>
      <p
        ref={ref}
        className={`text-foreground mt-0.5 ${isExpanded ? '' : 'line-clamp-2'}`}
      >
        {value}
      </p>
      {needsExpand && (
        <button
          onClick={() => onToggle(fieldKey)}
          className="text-primary hover:underline text-xs font-medium mt-0.5"
        >
          {isExpanded ? t("actions.read_less") : t("actions.read_more")}
        </button>
      )}
    </div>
  );
}
