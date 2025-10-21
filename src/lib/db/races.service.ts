import { IRace } from "@/pages/dashboard/tabs/species/types/species-types";

import { DBRace, DBRaceVersion } from "./types";

import { getDB } from "./index";

// Convert IRace to DBRace
function raceToDBRace(bookId: string, race: IRace): DBRace {
  return {
    id: race.id,
    book_id: bookId,
    name: race.name,
    domain: JSON.stringify(race.domain),
    summary: race.summary,
    image: race.image,
    scientific_name: race.scientificName,
    alternative_names: race.alternativeNames
      ? JSON.stringify(race.alternativeNames)
      : undefined,
    race_views: race.raceViews ? JSON.stringify(race.raceViews) : undefined,
    cultural_notes: race.culturalNotes,
    general_appearance: race.generalAppearance,
    life_expectancy: race.lifeExpectancy,
    average_height: race.averageHeight,
    average_weight: race.averageWeight,
    special_physical_characteristics: race.specialPhysicalCharacteristics,
    habits: race.habits,
    reproductive_cycle: race.reproductiveCycle,
    diet: race.diet,
    elemental_diet: race.elementalDiet,
    communication: race.communication
      ? JSON.stringify(race.communication)
      : undefined,
    moral_tendency: race.moralTendency,
    social_organization: race.socialOrganization,
    habitat: race.habitat ? JSON.stringify(race.habitat) : undefined,
    physical_capacity: race.physicalCapacity,
    special_characteristics: race.specialCharacteristics,
    weaknesses: race.weaknesses,
    story_motivation: race.storyMotivation,
    inspirations: race.inspirations,
    field_visibility: undefined, // Will be added in future
    created_at: Date.now(),
    updated_at: Date.now(),
  };
}

// Convert DBRace to IRace
function dbRaceToRace(dbRace: DBRace): IRace {
  return {
    id: dbRace.id,
    name: dbRace.name,
    domain: JSON.parse(dbRace.domain),
    summary: dbRace.summary,
    image: dbRace.image,
    scientificName: dbRace.scientific_name,
    alternativeNames: dbRace.alternative_names
      ? JSON.parse(dbRace.alternative_names)
      : undefined,
    raceViews: dbRace.race_views ? JSON.parse(dbRace.race_views) : undefined,
    culturalNotes: dbRace.cultural_notes,
    generalAppearance: dbRace.general_appearance,
    lifeExpectancy: dbRace.life_expectancy,
    averageHeight: dbRace.average_height,
    averageWeight: dbRace.average_weight,
    specialPhysicalCharacteristics: dbRace.special_physical_characteristics,
    habits: dbRace.habits,
    reproductiveCycle: dbRace.reproductive_cycle,
    diet: dbRace.diet,
    elementalDiet: dbRace.elemental_diet,
    communication: dbRace.communication
      ? JSON.parse(dbRace.communication)
      : undefined,
    moralTendency: dbRace.moral_tendency,
    socialOrganization: dbRace.social_organization,
    habitat: dbRace.habitat ? JSON.parse(dbRace.habitat) : undefined,
    physicalCapacity: dbRace.physical_capacity,
    specialCharacteristics: dbRace.special_characteristics,
    weaknesses: dbRace.weaknesses,
    storyMotivation: dbRace.story_motivation,
    inspirations: dbRace.inspirations,
    speciesId: "", // Legacy field, kept for backwards compatibility
  };
}

export async function getRacesByBookId(bookId: string): Promise<IRace[]> {
  const db = await getDB();
  const result = await db.select<DBRace[]>(
    "SELECT * FROM races WHERE book_id = $1 ORDER BY created_at DESC",
    [bookId]
  );
  return result.map(dbRaceToRace);
}

export async function getRaceById(id: string): Promise<IRace | null> {
  const db = await getDB();
  const result = await db.select<DBRace[]>(
    "SELECT * FROM races WHERE id = $1",
    [id]
  );
  return result.length > 0 ? dbRaceToRace(result[0]) : null;
}

export async function createRace(bookId: string, race: IRace): Promise<void> {
  const db = await getDB();
  const dbRace = raceToDBRace(bookId, race);

  await db.execute(
    `INSERT INTO races (
      id, book_id, name, domain, summary, image, scientific_name,
      alternative_names, race_views, cultural_notes,
      general_appearance, life_expectancy, average_height, average_weight,
      special_physical_characteristics,
      habits, reproductive_cycle, diet, elemental_diet, communication,
      moral_tendency, social_organization, habitat,
      physical_capacity, special_characteristics, weaknesses,
      story_motivation, inspirations,
      field_visibility, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
      $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
      $29, $30, $31
    )`,
    [
      dbRace.id,
      dbRace.book_id,
      dbRace.name,
      dbRace.domain,
      dbRace.summary,
      dbRace.image,
      dbRace.scientific_name,
      dbRace.alternative_names,
      dbRace.race_views,
      dbRace.cultural_notes,
      dbRace.general_appearance,
      dbRace.life_expectancy,
      dbRace.average_height,
      dbRace.average_weight,
      dbRace.special_physical_characteristics,
      dbRace.habits,
      dbRace.reproductive_cycle,
      dbRace.diet,
      dbRace.elemental_diet,
      dbRace.communication,
      dbRace.moral_tendency,
      dbRace.social_organization,
      dbRace.habitat,
      dbRace.physical_capacity,
      dbRace.special_characteristics,
      dbRace.weaknesses,
      dbRace.story_motivation,
      dbRace.inspirations,
      dbRace.field_visibility,
      dbRace.created_at,
      dbRace.updated_at,
    ]
  );
}

export async function updateRace(
  id: string,
  updates: Partial<IRace>
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  // Get current race to preserve book_id
  const current = await db.select<DBRace[]>(
    "SELECT book_id FROM races WHERE id = $1",
    [id]
  );

  if (current.length === 0) {
    throw new Error("Race not found");
  }

  // Build a full race object from updates
  const fullRace: IRace = {
    id,
    name: updates.name || "",
    domain: updates.domain || [],
    summary: updates.summary || "",
    speciesId: "",
    ...updates,
  };

  const dbRace = raceToDBRace(current[0].book_id, fullRace);
  dbRace.updated_at = now;

  await db.execute(
    `UPDATE races SET
      name = $1, domain = $2, summary = $3, image = $4, scientific_name = $5,
      alternative_names = $6, race_views = $7, cultural_notes = $8,
      general_appearance = $9, life_expectancy = $10, average_height = $11,
      average_weight = $12, special_physical_characteristics = $13,
      habits = $14, reproductive_cycle = $15, diet = $16, elemental_diet = $17,
      communication = $18, moral_tendency = $19, social_organization = $20,
      habitat = $21, physical_capacity = $22, special_characteristics = $23,
      weaknesses = $24, story_motivation = $25, inspirations = $26,
      field_visibility = $27, updated_at = $28
    WHERE id = $29`,
    [
      dbRace.name,
      dbRace.domain,
      dbRace.summary,
      dbRace.image,
      dbRace.scientific_name,
      dbRace.alternative_names,
      dbRace.race_views,
      dbRace.cultural_notes,
      dbRace.general_appearance,
      dbRace.life_expectancy,
      dbRace.average_height,
      dbRace.average_weight,
      dbRace.special_physical_characteristics,
      dbRace.habits,
      dbRace.reproductive_cycle,
      dbRace.diet,
      dbRace.elemental_diet,
      dbRace.communication,
      dbRace.moral_tendency,
      dbRace.social_organization,
      dbRace.habitat,
      dbRace.physical_capacity,
      dbRace.special_characteristics,
      dbRace.weaknesses,
      dbRace.story_motivation,
      dbRace.inspirations,
      dbRace.field_visibility,
      dbRace.updated_at,
      id,
    ]
  );
}

export async function deleteRace(id: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM races WHERE id = $1", [id]);
}
