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
    "world",
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>(
    {}
  );

  // Get entity data directly from store cache (reactive)
  const characters = useCharactersStore(
    (state) => state.cache[bookId]?.characters || []
  );
  const regions = useRegionsStore(
    (state) => state.cache[bookId]?.regions || []
  );
  const factions = useFactionsStore(
    (state) => state.cache[bookId]?.factions || []
  );
  const items = useItemsStore((state) => state.cache[bookId]?.items || []);
  const races = useRacesStore((state) => state.cache[bookId]?.races || []);

  // Get the specific entity
  const entity =
    type === "character"
      ? characters.find((e) => e.id === id)
      : type === "region"
        ? regions.find((e) => e.id === id)
        : type === "faction"
          ? factions.find((e) => e.id === id)
          : type === "item"
            ? items.find((e) => e.id === id)
            : races.find((e) => e.id === id);

  const Icon = ENTITY_CONFIG[type].icon;

  // Helper to get domain color classes
  const getDomainColor = (domain: string) => {
    const normalizedDomain = domain
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const colorMap: Record<
      string,
      { bg: string; text: string; border: string }
    > = {
      aquatico: {
        bg: "from-cyan-600/20 to-cyan-500/20",
        text: "text-cyan-200",
        border: "border-cyan-600/30",
      },
      aquatic: {
        bg: "from-cyan-600/20 to-cyan-500/20",
        text: "text-cyan-200",
        border: "border-cyan-600/30",
      },
      terrestre: {
        bg: "from-green-600/20 to-green-500/20",
        text: "text-green-200",
        border: "border-green-600/30",
      },
      terrestrial: {
        bg: "from-green-600/20 to-green-500/20",
        text: "text-green-200",
        border: "border-green-600/30",
      },
      aereo: {
        bg: "from-sky-600/20 to-sky-500/20",
        text: "text-sky-200",
        border: "border-sky-600/30",
      },
      aerial: {
        bg: "from-sky-600/20 to-sky-500/20",
        text: "text-sky-200",
        border: "border-sky-600/30",
      },
      subterraneo: {
        bg: "from-stone-600/20 to-stone-500/20",
        text: "text-stone-200",
        border: "border-stone-600/30",
      },
      underground: {
        bg: "from-stone-600/20 to-stone-500/20",
        text: "text-stone-200",
        border: "border-stone-600/30",
      },
      elevado: {
        bg: "from-slate-600/20 to-slate-500/20",
        text: "text-slate-200",
        border: "border-slate-600/30",
      },
      elevated: {
        bg: "from-slate-600/20 to-slate-500/20",
        text: "text-slate-200",
        border: "border-slate-600/30",
      },
      dimensional: {
        bg: "from-violet-600/20 to-violet-500/20",
        text: "text-violet-200",
        border: "border-violet-600/30",
      },
      espiritual: {
        bg: "from-amber-600/20 to-amber-500/20",
        text: "text-amber-200",
        border: "border-amber-600/30",
      },
      spiritual: {
        bg: "from-amber-600/20 to-amber-500/20",
        text: "text-amber-200",
        border: "border-amber-600/30",
      },
      cosmico: {
        bg: "from-indigo-600/20 to-indigo-500/20",
        text: "text-indigo-200",
        border: "border-indigo-600/30",
      },
      cosmic: {
        bg: "from-indigo-600/20 to-indigo-500/20",
        text: "text-indigo-200",
        border: "border-indigo-600/30",
      },
    };

    return (
      colorMap[normalizedDomain] || {
        bg: "from-purple-600/20 to-purple-500/20",
        text: "text-purple-200",
        border: "border-purple-600/30",
      }
    );
  };

  // Helper to translate fixed values
  const translateValue = (
    field: string,
    value: string,
    entityType?: string
  ) => {
    if (!value) return value;

    const normalizeKey = (str: string) =>
      str
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/-/g, "_")
        .replace(/[áàâã]/g, "a")
        .replace(/[éèê]/g, "e")
        .replace(/[íì]/g, "i")
        .replace(/[óòôõ]/g, "o")
        .replace(/[úù]/g, "u")
        .replace(/ç/g, "c");

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
      return t(`create-character:physical_type.${typeKey}`, {
        defaultValue: value,
      });
    }
    if (field === "archetype") {
      const archetypeKey = normalizeKey(value);
      return t(`create-character:archetype.${archetypeKey}`, {
        defaultValue: value,
      });
    }
    if (field === "alignment") {
      const alignmentKey = normalizeKey(value);
      return t(`create-character:alignment.${alignmentKey}`, {
        defaultValue: value,
      });
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
      return t(`create-faction:faction_type.${typeKey}`, {
        defaultValue: value,
      });
    }
    if (field === "influence") {
      const influenceKey = normalizeKey(value);
      return t(`create-faction:influence.${influenceKey}`, {
        defaultValue: value,
      });
    }
    if (field === "publicReputation") {
      const reputationKey = normalizeKey(value);
      return t(`create-faction:reputation.${reputationKey}`, {
        defaultValue: value,
      });
    }
    if (field === "factionAlignment") {
      const alignmentKey = normalizeKey(value);
      return t(`create-faction:alignment.${alignmentKey}`, {
        defaultValue: value,
      });
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
      return t(`races:communications.${commKey}.label`, {
        defaultValue: value,
      });
    }
    if (field === "moralTendency") {
      const tendencyKey = normalizeKey(value);
      return t(`races:moral_tendencies.${tendencyKey}.label`, {
        defaultValue: value,
      });
    }
    if (field === "reproductiveCycle") {
      const cycleKey = normalizeKey(value);
      return t(`races:reproductive_cycles.${cycleKey}.label`, {
        defaultValue: value,
      });
    }
    if (field === "habits") {
      const habitKey = normalizeKey(value);
      return t(`races:habits.${habitKey}.label`, { defaultValue: value });
    }
    if (field === "physicalCapacity") {
      const capacityKey = normalizeKey(value);
      return t(`races:physical_capacities.${capacityKey}.label`, {
        defaultValue: value,
      });
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

  // Early return AFTER all hooks to avoid hook rule violations
  if (!entity) return null;

  const renderBasicInfo = () => {
    if (type === "character") {
      const char = entity as any;
      return (
        <>
          {char.age && (
            <InfoRow
              label={t("character-detail:fields.age")}
              value={char.age}
              compact
            />
          )}
          {char.role && (
            <InfoRow
              label={t("character-detail:fields.role")}
              value={translateValue("role", char.role)}
              compact
            />
          )}
          {char.status && (
            <InfoRow
              label={t("character-detail:fields.status")}
              value={translateValue("characterStatus", char.status)}
              compact
            />
          )}
          {char.gender && (
            <InfoRow
              label={t("character-detail:fields.gender")}
              value={translateValue("gender", char.gender)}
              compact
            />
          )}
        </>
      );
    }

    if (type === "region") {
      const region = entity as any;
      return (
        <>
          {region.scale && (
            <div className="text-xs">
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {t("region-detail:fields.scale")}:{" "}
              </span>
              <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                {translateValue("scale", region.scale)}
              </span>
            </div>
          )}
          {region.climate && (
            <InfoRow
              label={t("region-detail:fields.climate")}
              value={region.climate}
              compact
            />
          )}
          {region.currentSeason && (
            <div className="text-xs">
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {t("region-detail:fields.current_season")}:{" "}
              </span>
              <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                {translateValue("currentSeason", region.currentSeason)}
              </span>
            </div>
          )}
        </>
      );
    }

    if (type === "faction") {
      const faction = entity as any;
      return (
        <>
          {faction.factionType && (
            <div className="text-xs">
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {t("faction-detail:fields.faction_type")}:{" "}
              </span>
              <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                {translateValue("factionType", faction.factionType)}
              </span>
            </div>
          )}
          {faction.status && (
            <div className="text-xs">
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {t("faction-detail:fields.status")}:{" "}
              </span>
              <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                {translateValue("factionStatus", faction.status)}
              </span>
            </div>
          )}
        </>
      );
    }

    if (type === "item") {
      const item = entity as any;
      return (
        <>
          {item.category && (
            <div className="text-xs">
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {t("item-detail:fields.category")}:{" "}
              </span>
              <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                {translateValue("itemCategory", item.category)}
              </span>
            </div>
          )}
          {item.status && (
            <div className="text-xs">
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {t("item-detail:fields.status")}:{" "}
              </span>
              <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                {translateValue("itemStatus", item.status)}
              </span>
            </div>
          )}
        </>
      );
    }

    if (type === "race") {
      const race = entity as any;
      return (
        <>
          {race.domain && race.domain.length > 0 && (
            <div className="text-xs">
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {t("race-detail:fields.domain")}:{" "}
              </span>
              {race.domain.map((d: string, index: number) => {
                const colors = getDomainColor(d);
                return (
                  <span key={d}>
                    <span
                      className={`inline-block px-2.5 py-1 bg-gradient-to-r ${colors.bg} ${colors.text} rounded-md text-xs font-medium border ${colors.border}`}
                    >
                      {translateValue("domain", d)}
                    </span>
                    {index < race.domain.length - 1 && " "}
                  </span>
                );
              })}
            </div>
          )}
        </>
      );
    }

    return null;
  };

  const toggleField = (key: string) => {
    setExpandedFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if entity has any advanced info
  const hasAdvancedInfo = () => {
    const e = entity as any;

    if (type === "character") {
      return !!(
        e.height ||
        e.weight ||
        e.hair ||
        e.eyes ||
        e.skinTone ||
        e.physicalType ||
        e.face ||
        e.distinguishingFeatures ||
        (e.speciesAndRace && e.speciesAndRace.length > 0) ||
        e.personality ||
        e.archetype ||
        e.alignment ||
        e.hobbies ||
        e.dreamsAndGoals ||
        e.fearsAndTraumas ||
        e.favoriteFood ||
        e.favoriteMusic ||
        e.past ||
        (e.birthPlace && e.birthPlace.length > 0) ||
        (e.nicknames && e.nicknames.length > 0) ||
        e.affiliatedPlace ||
        e.organization
      );
    }

    if (type === "region") {
      return !!(
        e.customSeasonName ||
        e.generalDescription ||
        (e.regionAnomalies &&
          JSON.parse(e.regionAnomalies || "[]").length > 0) ||
        e.narrativePurpose ||
        e.uniqueCharacteristics ||
        e.politicalImportance ||
        e.religiousImportance ||
        e.worldPerception ||
        (e.regionMysteries &&
          JSON.parse(e.regionMysteries || "[]").length > 0) ||
        (e.inspirations && JSON.parse(e.inspirations || "[]").length > 0)
      );
    }

    if (type === "faction") {
      return !!(
        e.governmentForm ||
        e.economy ||
        e.symbolsAndSecrets ||
        e.factionMotto ||
        e.uniformAndAesthetics ||
        e.alignment ||
        e.influence ||
        e.publicReputation ||
        (e.rulesAndLaws && e.rulesAndLaws.length > 0) ||
        e.foundationDate ||
        e.foundationHistorySummary ||
        (e.mainResources && e.mainResources.length > 0) ||
        (e.currencies && e.currencies.length > 0) ||
        (e.dominatedAreas && e.dominatedAreas.length > 0) ||
        (e.mainBase && e.mainBase.length > 0) ||
        (e.areasOfInterest && e.areasOfInterest.length > 0) ||
        (e.traditionsAndRituals && e.traditionsAndRituals.length > 0) ||
        (e.beliefsAndValues && e.beliefsAndValues.length > 0) ||
        (e.languagesUsed && e.languagesUsed.length > 0) ||
        e.militaryPower !== undefined ||
        e.politicalPower !== undefined ||
        e.culturalPower !== undefined ||
        e.economicPower !== undefined ||
        e.organizationObjectives ||
        e.narrativeImportance ||
        e.inspirations
      );
    }

    if (type === "item") {
      return !!(
        e.appearance ||
        e.origin ||
        (e.alternativeNames && e.alternativeNames.length > 0) ||
        e.storyRarity ||
        e.itemUsage ||
        e.usageRequirements ||
        e.usageConsequences ||
        e.narrativePurpose
      );
    }

    if (type === "race") {
      return !!(
        (e.alternativeNames && e.alternativeNames.length > 0) ||
        e.culturalNotes ||
        e.scientificName ||
        e.generalAppearance ||
        e.lifeExpectancy ||
        e.averageHeight ||
        e.averageWeight ||
        e.specialPhysicalCharacteristics ||
        e.habits ||
        e.reproductiveCycle ||
        e.otherReproductiveCycleDescription ||
        e.diet ||
        e.elementalDiet ||
        (e.communication && e.communication.length > 0) ||
        e.otherCommunication ||
        e.moralTendency ||
        e.socialOrganization ||
        (e.habitat && e.habitat.length > 0) ||
        e.physicalCapacity ||
        e.specialCharacteristics ||
        e.weaknesses ||
        e.storyMotivation ||
        e.inspirations
      );
    }

    return false;
  };

  // Helper functions to get entity names
  const getRaceName = (raceId: string) => {
    const race = races.find((r) => r.id === raceId);
    return race?.name || raceId;
  };

  const getRegionName = (regionId: string) => {
    const region = regions.find((r) => r.id === regionId);
    return region?.name || regionId;
  };

  const renderAdvancedInfo = () => {
    if (type === "character") {
      const char = entity as any;

      return (
        <div className="space-y-4">
          {/* Appearance */}
          {(char.height ||
            char.weight ||
            char.skinTone ||
            char.physicalType ||
            char.hair ||
            char.eyes ||
            char.face ||
            char.distinguishingFeatures ||
            (char.speciesAndRace && char.speciesAndRace.length > 0)) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("character-detail:sections.appearance")}
              </p>
              <div className="space-y-1.5">
                {char.height && (
                  <InfoRow
                    label={t("character-detail:fields.height")}
                    value={char.height}
                    compact
                  />
                )}
                {char.weight && (
                  <InfoRow
                    label={t("character-detail:fields.weight")}
                    value={char.weight}
                    compact
                  />
                )}
                {char.skinTone && (
                  <InfoRow
                    label={t("character-detail:fields.skin_tone")}
                    value={char.skinTone}
                    compact
                  />
                )}

                {/* Physical Type (grid -> badge) */}
                {char.physicalType && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("character-detail:fields.physical_type")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue("physicalType", char.physicalType)}
                    </span>
                  </div>
                )}

                {char.hair && (
                  <InfoRow
                    label={t("character-detail:fields.hair")}
                    value={char.hair}
                    compact
                  />
                )}
                {char.eyes && (
                  <InfoRow
                    label={t("character-detail:fields.eyes")}
                    value={char.eyes}
                    compact
                  />
                )}
                {char.face && (
                  <ExpandableField
                    label={t("character-detail:fields.face")}
                    value={char.face}
                    fieldKey="face"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {char.distinguishingFeatures && (
                  <ExpandableField
                    label={t("character-detail:fields.distinguishing_features")}
                    value={char.distinguishingFeatures}
                    fieldKey="distinguishingFeatures"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}

                {/* Species and Race (raças) */}
                {char.speciesAndRace && char.speciesAndRace.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("character-detail:fields.race")}:{" "}
                    </span>
                    {char.speciesAndRace.map(
                      (raceId: string, index: number) => (
                        <span key={raceId}>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-600/5 text-purple-400 border border-purple-500/50 rounded-md text-xs font-medium">
                            {getRaceName(raceId)}
                          </span>
                          {index < char.speciesAndRace.length - 1 && " "}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Behavior */}
          {(char.archetype ||
            char.alignment ||
            char.favoriteFood ||
            char.favoriteMusic ||
            char.personality ||
            char.hobbies ||
            char.dreamsAndGoals ||
            char.fearsAndTraumas) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("character-detail:sections.behavior")}
              </p>
              <div className="space-y-1.5">
                {/* Archetype (grid -> badge) */}
                {char.archetype && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("character-detail:fields.archetype")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue("archetype", char.archetype)}
                    </span>
                  </div>
                )}

                {/* Alignment (grid -> badge) */}
                {char.alignment && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("character-detail:fields.alignment")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue("alignment", char.alignment)}
                    </span>
                  </div>
                )}

                {char.favoriteFood && (
                  <InfoRow
                    label={t("character-detail:fields.favorite_food")}
                    value={char.favoriteFood}
                    compact
                  />
                )}
                {char.favoriteMusic && (
                  <InfoRow
                    label={t("character-detail:fields.favorite_music")}
                    value={char.favoriteMusic}
                    compact
                  />
                )}
                {char.personality && (
                  <ExpandableField
                    label={t("character-detail:fields.personality")}
                    value={char.personality}
                    fieldKey="personality"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {char.hobbies && (
                  <ExpandableField
                    label={t("character-detail:fields.hobbies")}
                    value={char.hobbies}
                    fieldKey="hobbies"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {char.dreamsAndGoals && (
                  <ExpandableField
                    label={t("character-detail:fields.dreams_and_goals")}
                    value={char.dreamsAndGoals}
                    fieldKey="dreamsAndGoals"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {char.fearsAndTraumas && (
                  <ExpandableField
                    label={t("character-detail:fields.fears_and_traumas")}
                    value={char.fearsAndTraumas}
                    fieldKey="fearsAndTraumas"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
              </div>
            </div>
          )}

          {/* Locations & Organizations */}
          {((char.birthPlace && char.birthPlace.length > 0) ||
            (char.nicknames && char.nicknames.length > 0) ||
            char.past ||
            char.affiliatedPlace ||
            char.organization) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("character-detail:sections.locations_orgs")}
              </p>
              <div className="space-y-1.5">
                {/* Birth Place (buscar nome da região) */}
                {char.birthPlace && char.birthPlace.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("character-detail:fields.birth_place")}:{" "}
                    </span>
                    {char.birthPlace.map((regionId: string, index: number) => (
                      <span key={regionId}>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-600/5 text-purple-400 border border-purple-500/50 rounded-md text-xs font-medium">
                          {getRegionName(regionId)}
                        </span>
                        {index < char.birthPlace.length - 1 && " "}
                      </span>
                    ))}
                  </div>
                )}

                {/* Nicknames (lista simples sem badges) */}
                {char.nicknames && char.nicknames.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("character-detail:fields.nicknames")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {char.nicknames.map((nick: string, i: number) => (
                        <li key={i}>{nick}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {char.past && (
                  <ExpandableField
                    label={t("character-detail:fields.past")}
                    value={char.past}
                    fieldKey="past"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {char.affiliatedPlace && (
                  <InfoRow
                    label={t("character-detail:fields.affiliated_place")}
                    value={char.affiliatedPlace}
                    compact
                  />
                )}
                {char.organization && (
                  <InfoRow
                    label={t("character-detail:fields.organization")}
                    value={char.organization}
                    compact
                  />
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (type === "region") {
      const region = entity as any;
      return (
        <div className="space-y-4">
          {/* Environment */}
          {(region.customSeasonName ||
            region.generalDescription ||
            region.regionAnomalies) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("region-detail:sections.environment")}
              </p>
              <div className="space-y-1.5">
                {region.customSeasonName && (
                  <InfoRow
                    label={t("region-detail:fields.custom_season_name")}
                    value={region.customSeasonName}
                    compact
                  />
                )}
                {region.generalDescription && (
                  <ExpandableField
                    label={t("region-detail:fields.general_description")}
                    value={region.generalDescription}
                    fieldKey="generalDescription"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {region.regionAnomalies &&
                  JSON.parse(region.regionAnomalies).length > 0 && (
                    <div className="text-xs">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        {t("region-detail:fields.region_anomalies")}:
                      </span>
                      <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                        {JSON.parse(region.regionAnomalies).map(
                          (anomaly: string, i: number) => (
                            <li key={i}>{anomaly}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Narrative */}
          {(region.narrativePurpose ||
            region.uniqueCharacteristics ||
            region.politicalImportance ||
            region.religiousImportance ||
            region.worldPerception ||
            region.regionMysteries ||
            region.inspirations) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("region-detail:sections.narrative")}
              </p>
              <div className="space-y-1.5">
                {region.narrativePurpose && (
                  <ExpandableField
                    label={t("region-detail:fields.narrative_purpose")}
                    value={region.narrativePurpose}
                    fieldKey="narrativePurpose"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {region.uniqueCharacteristics && (
                  <ExpandableField
                    label={t("region-detail:fields.unique_characteristics")}
                    value={region.uniqueCharacteristics}
                    fieldKey="uniqueCharacteristics"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {region.politicalImportance && (
                  <ExpandableField
                    label={t("region-detail:fields.political_importance")}
                    value={region.politicalImportance}
                    fieldKey="politicalImportance"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {region.religiousImportance && (
                  <ExpandableField
                    label={t("region-detail:fields.religious_importance")}
                    value={region.religiousImportance}
                    fieldKey="religiousImportance"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {region.worldPerception && (
                  <ExpandableField
                    label={t("region-detail:fields.world_perception")}
                    value={region.worldPerception}
                    fieldKey="worldPerception"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {region.regionMysteries &&
                  JSON.parse(region.regionMysteries).length > 0 && (
                    <div className="text-xs">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        {t("region-detail:fields.region_mysteries")}:
                      </span>
                      <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                        {JSON.parse(region.regionMysteries).map(
                          (mystery: string, i: number) => (
                            <li key={i}>{mystery}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {region.inspirations &&
                  JSON.parse(region.inspirations).length > 0 && (
                    <div className="text-xs">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        {t("region-detail:fields.inspirations")}:
                      </span>
                      <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                        {JSON.parse(region.inspirations).map(
                          (inspiration: string, i: number) => (
                            <li key={i}>{inspiration}</li>
                          )
                        )}
                      </ul>
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
        <div className="space-y-4">
          {/* Organization */}
          {(faction.governmentForm ||
            faction.economy ||
            faction.symbolsAndSecrets ||
            faction.factionMotto ||
            faction.uniformAndAesthetics ||
            faction.alignment ||
            faction.influence ||
            faction.publicReputation ||
            faction.rulesAndLaws) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("faction-detail:sections.organization")}
              </p>
              <div className="space-y-1.5">
                {faction.governmentForm && (
                  <InfoRow
                    label={t("faction-detail:fields.government_form")}
                    value={faction.governmentForm}
                    compact
                  />
                )}
                {faction.influence && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.influence")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue("influence", faction.influence)}
                    </span>
                  </div>
                )}
                {faction.publicReputation && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.public_reputation")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue(
                        "publicReputation",
                        faction.publicReputation
                      )}
                    </span>
                  </div>
                )}
                {faction.economy && (
                  <ExpandableField
                    label={t("faction-detail:fields.economy")}
                    value={faction.economy}
                    fieldKey="economy"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {faction.symbolsAndSecrets && (
                  <ExpandableField
                    label={t("faction-detail:fields.symbols_and_secrets")}
                    value={faction.symbolsAndSecrets}
                    fieldKey="symbolsAndSecrets"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {faction.factionMotto && (
                  <InfoRow
                    label={t("faction-detail:fields.faction_motto")}
                    value={faction.factionMotto}
                    compact
                  />
                )}
                {faction.uniformAndAesthetics && (
                  <ExpandableField
                    label={t("faction-detail:fields.uniform_and_aesthetics")}
                    value={faction.uniformAndAesthetics}
                    fieldKey="uniformAndAesthetics"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {faction.alignment && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.alignment")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue("factionAlignment", faction.alignment)}
                    </span>
                  </div>
                )}
                {faction.rulesAndLaws && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.rules_and_laws")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {faction.rulesAndLaws.map((rule: string, i: number) => (
                        <li key={i}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History */}
          {(faction.foundationDate || faction.foundationHistorySummary) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("faction-detail:sections.history")}
              </p>
              <div className="space-y-1.5">
                {faction.foundationDate && (
                  <InfoRow
                    label={t("faction-detail:fields.foundation_date")}
                    value={faction.foundationDate}
                    compact
                  />
                )}
                {faction.foundationHistorySummary && (
                  <ExpandableField
                    label={t(
                      "faction-detail:fields.foundation_history_summary"
                    )}
                    value={faction.foundationHistorySummary}
                    fieldKey="foundationHistorySummary"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
              </div>
            </div>
          )}

          {/* Resources & Territory */}
          {(faction.mainResources ||
            faction.currencies ||
            faction.dominatedAreas ||
            faction.mainBase ||
            faction.areasOfInterest) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("faction-detail:sections.resources")}
              </p>
              <div className="space-y-1.5">
                {faction.mainResources && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.main_resources")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {faction.mainResources.map(
                        (resource: string, i: number) => (
                          <li key={i}>{resource}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {faction.currencies && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.currencies")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {faction.currencies.map((currency: string, i: number) => (
                        <li key={i}>{currency}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {faction.dominatedAreas && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.dominated_areas")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {faction.dominatedAreas.map((area: string, i: number) => (
                        <li key={i}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {faction.mainBase && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.main_base")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {faction.mainBase.map((base: string, i: number) => (
                        <li key={i}>{base}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {faction.areasOfInterest && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.areas_of_interest")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {faction.areasOfInterest.map(
                        (area: string, i: number) => (
                          <li key={i}>{area}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Culture */}
          {(faction.traditionsAndRituals ||
            faction.beliefsAndValues ||
            faction.languagesUsed) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("faction-detail:sections.culture")}
              </p>
              <div className="space-y-1.5">
                {faction.traditionsAndRituals && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.traditions_and_rituals")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {faction.traditionsAndRituals.map(
                        (tradition: string, i: number) => (
                          <li key={i}>{tradition}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {faction.beliefsAndValues && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.beliefs_and_values")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {faction.beliefsAndValues.map(
                        (belief: string, i: number) => (
                          <li key={i}>{belief}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {faction.languagesUsed && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("faction-detail:fields.languages_used")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {faction.languagesUsed.map(
                        (language: string, i: number) => (
                          <li key={i}>{language}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Power & Influence */}
          {(faction.militaryPower !== undefined ||
            faction.politicalPower !== undefined ||
            faction.culturalPower !== undefined ||
            faction.economicPower !== undefined) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("faction-detail:sections.power")}
              </p>
              <div className="space-y-1.5">
                {faction.militaryPower !== undefined && (
                  <InfoRow
                    label={t("faction-detail:fields.military_power")}
                    value={`${faction.militaryPower}/10`}
                    compact
                  />
                )}
                {faction.politicalPower !== undefined && (
                  <InfoRow
                    label={t("faction-detail:fields.political_power")}
                    value={`${faction.politicalPower}/10`}
                    compact
                  />
                )}
                {faction.culturalPower !== undefined && (
                  <InfoRow
                    label={t("faction-detail:fields.cultural_power")}
                    value={`${faction.culturalPower}/10`}
                    compact
                  />
                )}
                {faction.economicPower !== undefined && (
                  <InfoRow
                    label={t("faction-detail:fields.economic_power")}
                    value={`${faction.economicPower}/10`}
                    compact
                  />
                )}
              </div>
            </div>
          )}

          {/* Narrative */}
          {(faction.organizationObjectives ||
            faction.narrativeImportance ||
            faction.inspirations) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("faction-detail:sections.narrative")}
              </p>
              <div className="space-y-1.5">
                {faction.organizationObjectives && (
                  <ExpandableField
                    label={t("faction-detail:fields.organization_objectives")}
                    value={faction.organizationObjectives}
                    fieldKey="organizationObjectives"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {faction.narrativeImportance && (
                  <ExpandableField
                    label={t("faction-detail:fields.narrative_importance")}
                    value={faction.narrativeImportance}
                    fieldKey="narrativeImportance"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {faction.inspirations && (
                  <InfoRow
                    label={t("faction-detail:fields.inspirations")}
                    value={faction.inspirations}
                    compact
                  />
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (type === "item") {
      const item = entity as any;
      return (
        <div className="space-y-4">
          {/* Details */}
          {(item.appearance ||
            item.origin ||
            (item.alternativeNames && item.alternativeNames.length > 0) ||
            item.storyRarity) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("item-detail:sections.details")}
              </p>
              <div className="space-y-1.5">
                {item.appearance && (
                  <ExpandableField
                    label={t("item-detail:fields.appearance")}
                    value={item.appearance}
                    fieldKey="appearance"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {item.origin && (
                  <ExpandableField
                    label={t("item-detail:fields.origin")}
                    value={item.origin}
                    fieldKey="origin"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}

                {/* Alternative Names (lista simples sem badges) */}
                {item.alternativeNames && item.alternativeNames.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("item-detail:fields.alternative_names")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {item.alternativeNames.map((name: string, i: number) => (
                        <li key={i}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Story Rarity (grid badge) */}
                {item.storyRarity && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("item-detail:fields.story_rarity")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue("storyRarity", item.storyRarity)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Usage */}
          {(item.itemUsage ||
            item.usageRequirements ||
            item.usageConsequences) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("item-detail:sections.usage")}
              </p>
              <div className="space-y-1.5">
                {item.itemUsage && (
                  <ExpandableField
                    label={t("item-detail:fields.item_usage")}
                    value={item.itemUsage}
                    fieldKey="itemUsage"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {item.usageRequirements && (
                  <ExpandableField
                    label={t("item-detail:fields.usage_requirements")}
                    value={item.usageRequirements}
                    fieldKey="usageRequirements"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {item.usageConsequences && (
                  <ExpandableField
                    label={t("item-detail:fields.usage_consequences")}
                    value={item.usageConsequences}
                    fieldKey="usageConsequences"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
              </div>
            </div>
          )}

          {/* Narrative */}
          {item.narrativePurpose && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("item-detail:sections.narrative")}
              </p>
              <div className="space-y-1.5">
                {item.narrativePurpose && (
                  <ExpandableField
                    label={t("item-detail:fields.narrative_purpose")}
                    value={item.narrativePurpose}
                    fieldKey="narrativePurpose"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (type === "race") {
      const race = entity as any;
      return (
        <div className="space-y-4">
          {/* Culture */}
          {(race.scientificName ||
            (race.alternativeNames && race.alternativeNames.length > 0) ||
            race.culturalNotes) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("race-detail:sections.culture")}
              </p>
              <div className="space-y-1.5">
                {race.scientificName && (
                  <InfoRow
                    label={t("race-detail:fields.scientific_name")}
                    value={race.scientificName}
                    compact
                  />
                )}

                {/* Alternative Names (lista simples sem badges) */}
                {race.alternativeNames && race.alternativeNames.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("race-detail:fields.alternative_names")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {race.alternativeNames.map((name: string, i: number) => (
                        <li key={i}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {race.culturalNotes && (
                  <ExpandableField
                    label={t("race-detail:fields.cultural_notes")}
                    value={race.culturalNotes}
                    fieldKey="culturalNotes"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
              </div>
            </div>
          )}

          {/* Appearance */}
          {(race.generalAppearance ||
            race.lifeExpectancy ||
            race.averageHeight ||
            race.averageWeight ||
            race.specialPhysicalCharacteristics) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("race-detail:sections.appearance")}
              </p>
              <div className="space-y-1.5">
                {race.generalAppearance && (
                  <ExpandableField
                    label={t("race-detail:fields.general_appearance")}
                    value={race.generalAppearance}
                    fieldKey="generalAppearance"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {race.lifeExpectancy && (
                  <InfoRow
                    label={t("race-detail:fields.life_expectancy")}
                    value={race.lifeExpectancy}
                    compact
                  />
                )}
                {race.averageHeight && (
                  <InfoRow
                    label={t("race-detail:fields.average_height")}
                    value={race.averageHeight}
                    compact
                  />
                )}
                {race.averageWeight && (
                  <InfoRow
                    label={t("race-detail:fields.average_weight")}
                    value={race.averageWeight}
                    compact
                  />
                )}
                {race.specialPhysicalCharacteristics && (
                  <ExpandableField
                    label={t(
                      "race-detail:fields.special_physical_characteristics"
                    )}
                    value={race.specialPhysicalCharacteristics}
                    fieldKey="specialPhysicalCharacteristics"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
              </div>
            </div>
          )}

          {/* Behaviors */}
          {(race.habits ||
            race.reproductiveCycle ||
            race.otherReproductiveCycleDescription ||
            race.diet ||
            race.elementalDiet ||
            (race.communication && race.communication.length > 0) ||
            race.otherCommunication ||
            race.moralTendency ||
            race.socialOrganization ||
            (race.habitat && race.habitat.length > 0)) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("race-detail:sections.behaviors")}
              </p>
              <div className="space-y-1.5">
                {/* Habits (grid badge) */}
                {race.habits && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("race-detail:fields.habits")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue("habits", race.habits)}
                    </span>
                  </div>
                )}

                {/* Reproductive Cycle (grid badge) */}
                {race.reproductiveCycle && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("race-detail:fields.reproductive_cycle")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue(
                        "reproductiveCycle",
                        race.reproductiveCycle
                      )}
                    </span>
                  </div>
                )}

                {race.otherReproductiveCycleDescription && (
                  <ExpandableField
                    label={t(
                      "race-detail:fields.other_reproductive_cycle_description"
                    )}
                    value={race.otherReproductiveCycleDescription}
                    fieldKey="otherReproductiveCycleDescription"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}

                {/* Diet (grid badge) */}
                {race.diet && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("race-detail:fields.diet")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue("diet", race.diet)}
                    </span>
                  </div>
                )}

                {race.elementalDiet && (
                  <InfoRow
                    label={t("race-detail:fields.elemental_diet")}
                    value={race.elementalDiet}
                    compact
                  />
                )}

                {/* Communication (grid badges) */}
                {race.communication && race.communication.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("race-detail:fields.communication")}:{" "}
                    </span>
                    {race.communication.map((comm: string, index: number) => (
                      <span key={comm}>
                        <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                          {translateValue("communication", comm)}
                        </span>
                        {index < race.communication.length - 1 && " "}
                      </span>
                    ))}
                  </div>
                )}

                {race.otherCommunication && (
                  <InfoRow
                    label={t("race-detail:fields.other_communication")}
                    value={race.otherCommunication}
                    compact
                  />
                )}

                {/* Moral Tendency (grid badge) */}
                {race.moralTendency && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("race-detail:fields.moral_tendency")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue("moralTendency", race.moralTendency)}
                    </span>
                  </div>
                )}

                {race.socialOrganization && (
                  <ExpandableField
                    label={t("race-detail:fields.social_organization")}
                    value={race.socialOrganization}
                    fieldKey="socialOrganization"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}

                {/* Habitat (lista simples) */}
                {race.habitat && race.habitat.length > 0 && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("race-detail:fields.habitat")}:
                    </span>
                    <ul className="list-disc list-inside mt-0.5 text-foreground space-y-0.5">
                      {race.habitat.map((habitat: string, i: number) => (
                        <li key={i}>{habitat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Power */}
          {(race.physicalCapacity ||
            race.specialCharacteristics ||
            race.weaknesses) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("race-detail:sections.power")}
              </p>
              <div className="space-y-1.5">
                {/* Physical Capacity (grid badge) */}
                {race.physicalCapacity && (
                  <div className="text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {t("race-detail:fields.physical_capacity")}:{" "}
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-200 rounded-md text-xs font-medium border border-purple-600/30">
                      {translateValue(
                        "physicalCapacity",
                        race.physicalCapacity
                      )}
                    </span>
                  </div>
                )}
                {race.specialCharacteristics && (
                  <ExpandableField
                    label={t("race-detail:fields.special_characteristics")}
                    value={race.specialCharacteristics}
                    fieldKey="specialCharacteristics"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {race.weaknesses && (
                  <ExpandableField
                    label={t("race-detail:fields.weaknesses")}
                    value={race.weaknesses}
                    fieldKey="weaknesses"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
              </div>
            </div>
          )}

          {/* Narrative */}
          {(race.storyMotivation || race.inspirations) && (
            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-2">
                {t("race-detail:sections.narrative")}
              </p>
              <div className="space-y-1.5">
                {race.storyMotivation && (
                  <ExpandableField
                    label={t("race-detail:fields.story_motivation")}
                    value={race.storyMotivation}
                    fieldKey="storyMotivation"
                    expandedFields={expandedFields}
                    onToggle={toggleField}
                  />
                )}
                {race.inspirations && (
                  <InfoRow
                    label={t("race-detail:fields.inspirations")}
                    value={race.inspirations}
                    compact
                  />
                )}
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
          <h4 className="font-semibold text-sm truncate">
            {(entity as any).name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {t(`entity_types.${type}`)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={onUnpin}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Parent Region Badge (only for regions) */}
      {type === "region" && (entity as any).parentId && (
        <div className="px-3 py-2 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">
              {t("region-detail:fields.parent_of")}:
            </span>
            <span className="text-foreground font-medium truncate">
              {getRegionName((entity as any).parentId)}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="pt-3 px-3">
          {/* Description/Summary */}
          {((entity as any).description ||
            (entity as any).summary ||
            (entity as any).basicDescription) && (
            <div className="text-xs space-y-1 mb-3">
              <p
                ref={descriptionRef}
                className={`text-foreground ${isDescriptionExpanded ? "" : "line-clamp-3"}`}
              >
                {(entity as any).description ||
                  (entity as any).summary ||
                  (entity as any).basicDescription}
              </p>
              {showReadMore && (
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  onPointerDown={(e) => e.stopPropagation()}
                  className="text-primary hover:underline text-xs font-medium"
                >
                  {isDescriptionExpanded
                    ? t("actions.read_less")
                    : t("actions.read_more")}
                </button>
              )}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-1 text-xs mb-3">{renderBasicInfo()}</div>

          {/* Advanced Info Collapsible */}
          {hasAdvancedInfo() && (
            <div className="-mx-3">
              <Separator />
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors"
              >
                <span className="text-xs font-medium text-foreground">
                  {isExpanded
                    ? t("actions.hide_advanced")
                    : t("actions.show_advanced")}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="px-3 pt-2 pb-3">{renderAdvancedInfo()}</div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// Helper component for info rows
function InfoRow({
  label,
  value,
  compact,
}: {
  label: string;
  value: string | number;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "text-xs" : "text-sm"}>
      <span className="text-purple-600 dark:text-purple-400 font-medium">
        {label}:{" "}
      </span>
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
  onToggle,
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
      <span className="text-purple-600 dark:text-purple-400 font-medium">
        {label}:{needsExpand ? "" : " "}
      </span>
      <p
        ref={ref}
        className={`text-foreground ${needsExpand ? "mt-0.5" : "inline"} ${isExpanded ? "" : "line-clamp-2"}`}
      >
        {value}
      </p>
      {needsExpand && (
        <button
          onClick={() => onToggle(fieldKey)}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-primary hover:underline text-xs font-medium mt-0.5"
        >
          {isExpanded ? t("actions.read_less") : t("actions.read_more")}
        </button>
      )}
    </div>
  );
}
