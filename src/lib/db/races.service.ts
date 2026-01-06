import { IRaceRelationship } from "@/pages/dashboard/tabs/races/race-detail/types/race-detail-types";
import { IRace } from "@/pages/dashboard/tabs/races/types/race-types";

import {
  cleanCommonEntityReferences,
  removeFromJSONArray,
  removeFromNestedJSONArray,
} from "./cleanup-helpers";
import { safeDBOperation } from "./safe-db-operation";
import {
  safeParseStringArray,
  safeParseUnknownObject,
} from "./safe-json-parse";
import { DBRace, DBRaceRelationship } from "./types";

import { getDB } from "./index";

// Convert IRace to DBRace
function raceToDBRace(bookId: string, race: IRace): DBRace {
  return {
    id: race.id,
    book_id: bookId,
    group_id: undefined,
    name: race.name,
    domain: JSON.stringify(race.domain),
    summary: race.summary,
    image: race.image,
    scientific_name: race.scientificName,
    alternative_names: race.alternativeNames
      ? JSON.stringify(race.alternativeNames)
      : undefined,
    cultural_notes: race.culturalNotes,
    general_appearance: race.generalAppearance,
    life_expectancy: race.lifeExpectancy,
    average_height: race.averageHeight,
    average_weight: race.averageWeight,
    special_physical_characteristics: race.specialPhysicalCharacteristics,
    habits: race.habits,
    reproductive_cycle: race.reproductiveCycle,
    other_reproductive_cycle_description:
      race.otherReproductiveCycleDescription,
    diet: race.diet,
    elemental_diet: race.elementalDiet,
    communication: race.communication
      ? JSON.stringify(race.communication)
      : undefined,
    other_communication: race.otherCommunication,
    moral_tendency: race.moralTendency,
    social_organization: race.socialOrganization,
    habitat: race.habitat ? JSON.stringify(race.habitat) : undefined,
    physical_capacity: race.physicalCapacity,
    special_characteristics: race.specialCharacteristics,
    weaknesses: race.weaknesses,
    story_motivation: race.storyMotivation,
    inspirations: race.inspirations,
    field_visibility: race.fieldVisibility
      ? JSON.stringify(race.fieldVisibility)
      : undefined,
    section_visibility: race.sectionVisibility
      ? JSON.stringify(race.sectionVisibility)
      : undefined,
    ui_state: race.uiState ? JSON.stringify(race.uiState) : undefined,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
}

// Convert DBRace to IRace
function dbRaceToRace(dbRace: DBRace): IRace {
  return {
    id: dbRace.id,
    name: dbRace.name,
    domain: safeParseStringArray(dbRace.domain),
    summary: dbRace.summary,
    image: dbRace.image,
    scientificName: dbRace.scientific_name,
    alternativeNames: dbRace.alternative_names
      ? safeParseStringArray(dbRace.alternative_names)
      : undefined,
    culturalNotes: dbRace.cultural_notes,
    generalAppearance: dbRace.general_appearance,
    lifeExpectancy: dbRace.life_expectancy,
    averageHeight: dbRace.average_height,
    averageWeight: dbRace.average_weight,
    specialPhysicalCharacteristics: dbRace.special_physical_characteristics,
    habits: dbRace.habits,
    reproductiveCycle: dbRace.reproductive_cycle,
    otherReproductiveCycleDescription:
      dbRace.other_reproductive_cycle_description,
    diet: dbRace.diet,
    elementalDiet: dbRace.elemental_diet,
    communication: dbRace.communication
      ? safeParseStringArray(dbRace.communication)
      : undefined,
    otherCommunication: dbRace.other_communication,
    moralTendency: dbRace.moral_tendency,
    socialOrganization: dbRace.social_organization,
    habitat: dbRace.habitat ? safeParseStringArray(dbRace.habitat) : undefined,
    physicalCapacity: dbRace.physical_capacity,
    specialCharacteristics: dbRace.special_characteristics,
    weaknesses: dbRace.weaknesses,
    storyMotivation: dbRace.story_motivation,
    inspirations: dbRace.inspirations,
    fieldVisibility: dbRace.field_visibility
      ? safeParseUnknownObject(dbRace.field_visibility)
      : undefined,
    sectionVisibility: dbRace.section_visibility
      ? safeParseUnknownObject(dbRace.section_visibility)
      : undefined,
    uiState: dbRace.ui_state ? safeParseUnknownObject(dbRace.ui_state) : undefined,
    speciesId: "", // Legacy field, kept for backwards compatibility
  };
}

export async function getRacesByBookId(bookId: string): Promise<IRace[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBRace[]>(
      "SELECT * FROM races WHERE book_id = $1 ORDER BY created_at DESC",
      [bookId]
    );
    return result.map(dbRaceToRace);
  }, "getRacesByBookId");
}

export async function getRaceById(id: string): Promise<IRace | null> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBRace[]>(
      "SELECT * FROM races WHERE id = $1",
      [id]
    );
    return result.length > 0 ? dbRaceToRace(result[0]) : null;
  }, "getRaceById");
}

export async function createRace(bookId: string, race: IRace): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const dbRace = raceToDBRace(bookId, race);

    await db.execute(
      `INSERT INTO races (
        id, book_id, group_id, name, domain, summary, image, scientific_name,
        alternative_names, cultural_notes,
        general_appearance, life_expectancy, average_height, average_weight,
        special_physical_characteristics,
        habits, reproductive_cycle, other_reproductive_cycle_description, diet, elemental_diet, communication,
        other_communication, moral_tendency, social_organization, habitat,
        physical_capacity, special_characteristics, weaknesses,
        story_motivation, inspirations,
        field_visibility, section_visibility, ui_state,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
        $29, $30, $31, $32, $33, $34, $35
      )`,
      [
        dbRace.id,
        dbRace.book_id,
        dbRace.group_id,
        dbRace.name,
        dbRace.domain,
        dbRace.summary,
        dbRace.image,
        dbRace.scientific_name,
        dbRace.alternative_names,
        dbRace.cultural_notes,
        dbRace.general_appearance,
        dbRace.life_expectancy,
        dbRace.average_height,
        dbRace.average_weight,
        dbRace.special_physical_characteristics,
        dbRace.habits,
        dbRace.reproductive_cycle,
        dbRace.other_reproductive_cycle_description,
        dbRace.diet,
        dbRace.elemental_diet,
        dbRace.communication,
        dbRace.other_communication,
        dbRace.moral_tendency,
        dbRace.social_organization,
        dbRace.habitat,
        dbRace.physical_capacity,
        dbRace.special_characteristics,
        dbRace.weaknesses,
        dbRace.story_motivation,
        dbRace.inspirations,
        dbRace.field_visibility,
        dbRace.section_visibility,
        dbRace.ui_state,
        dbRace.created_at,
        dbRace.updated_at,
      ]
    );
  }, "createRace");
}

export async function updateRace(
  id: string,
  updates: Partial<IRace>
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const now = Date.now();

    // Get current race to preserve existing data
    const current = await db.select<DBRace[]>(
      "SELECT * FROM races WHERE id = $1",
      [id]
    );

    if (current.length === 0) {
      throw new Error("Race not found");
    }

    // Convert current DB race to IRace to preserve existing values
    const currentRace = dbRaceToRace(current[0]);

    // Merge updates with current race, preserving existing values
    const fullRace: IRace = {
      ...currentRace,
      ...updates,
      id, // Ensure ID is preserved
    };

    const dbRace = raceToDBRace(current[0].book_id, fullRace);
    dbRace.updated_at = now;

    await db.execute(
      `UPDATE races SET
        group_id = $1, name = $2, domain = $3, summary = $4, image = $5, scientific_name = $6,
        alternative_names = $7, cultural_notes = $8,
        general_appearance = $9, life_expectancy = $10, average_height = $11,
        average_weight = $12, special_physical_characteristics = $13,
        habits = $14, reproductive_cycle = $15, other_reproductive_cycle_description = $16, diet = $17, elemental_diet = $18,
        communication = $19, other_communication = $20, moral_tendency = $21, social_organization = $22,
        habitat = $23, physical_capacity = $24, special_characteristics = $25,
        weaknesses = $26, story_motivation = $27, inspirations = $28,
        field_visibility = $29, section_visibility = $30, ui_state = $31,
        updated_at = $32
      WHERE id = $33`,
      [
        dbRace.group_id,
        dbRace.name,
        dbRace.domain,
        dbRace.summary,
        dbRace.image,
        dbRace.scientific_name,
        dbRace.alternative_names,
        dbRace.cultural_notes,
        dbRace.general_appearance,
        dbRace.life_expectancy,
        dbRace.average_height,
        dbRace.average_weight,
        dbRace.special_physical_characteristics,
        dbRace.habits,
        dbRace.reproductive_cycle,
        dbRace.other_reproductive_cycle_description,
        dbRace.diet,
        dbRace.elemental_diet,
        dbRace.communication,
        dbRace.other_communication,
        dbRace.moral_tendency,
        dbRace.social_organization,
        dbRace.habitat,
        dbRace.physical_capacity,
        dbRace.special_characteristics,
        dbRace.weaknesses,
        dbRace.story_motivation,
        dbRace.inspirations,
        dbRace.field_visibility,
        dbRace.section_visibility,
        dbRace.ui_state,
        dbRace.updated_at,
        id,
      ]
    );
  }, "updateRace");
}

export async function deleteRace(id: string): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // 1. Clean common entity references (mentions, gallery, notes)
    await cleanCommonEntityReferences(id, "race");

    // 2. Remove from region_timeline_events.races_involved
    await removeFromJSONArray("region_timeline_events", "races_involved", id);

    // 3. Remove from characters.species_and_race
    await removeFromJSONArray("characters", "species_and_race", id);

    // 4. Remove from factions.races
    await removeFromJSONArray("factions", "races", id);

    // 5. Remove from factions.timeline[].events[].racesInvolved
    await removeFromNestedJSONArray("factions", "timeline", id, [
      "timeline",
      "*",
      "events",
      "*",
      "racesInvolved",
    ]);

    // 6. Finally, delete the race (CASCADE will handle versions, relationships)
    await db.execute("DELETE FROM races WHERE id = $1", [id]);
  }, "deleteRace");
}

// Race Relationships
export async function getRaceRelationships(
  raceId: string
): Promise<IRaceRelationship[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBRaceRelationship[]>(
      "SELECT * FROM race_relationships WHERE race_id = $1",
      [raceId]
    );

    return result.map((rel) => ({
      id: rel.id,
      raceId: rel.related_race_id,
      type: rel.type as IRaceRelationship["type"],
      description: rel.description,
    }));
  }, "getRaceRelationships");
}

export async function saveRaceRelationships(
  raceId: string,
  relationships: IRaceRelationship[]
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Delete existing relationships
    await db.execute("DELETE FROM race_relationships WHERE race_id = $1", [
      raceId,
    ]);

    // Insert new relationships
    for (const rel of relationships) {
      const relId = `${raceId}-${rel.raceId}-${rel.type}-${Date.now()}`;
      await db.execute(
        `INSERT INTO race_relationships (id, race_id, related_race_id, type, description, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          relId,
          raceId,
          rel.raceId,
          rel.type,
          rel.description || null,
          Date.now(),
        ]
      );
    }
  }, "saveRaceRelationships");
}
