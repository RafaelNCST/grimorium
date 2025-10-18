import {
  ICharacter,
  ICharacterRelationship,
  ICharacterFamily,
  ICharacterVersion,
} from "@/types/character-types";

import { DBCharacter, DBRelationship, DBFamilyRelation, DBCharacterVersion } from "./types";

import { getDB } from "./index";

// Convert ICharacter to DBCharacter
function characterToDBCharacter(
  bookId: string,
  character: ICharacter
): DBCharacter {
  return {
    id: character.id,
    book_id: bookId,
    name: character.name,
    age: character.age,
    gender: character.gender,
    role: character.role,
    description: character.description,
    image: character.image,
    alignment: character.alignment,
    height: character.height,
    weight: character.weight,
    skin_tone: character.skinTone,
    skin_tone_color: character.skinToneColor,
    physical_type: character.physicalType,
    hair: character.hair,
    eyes: character.eyes,
    face: character.face,
    distinguishing_features: character.distinguishingFeatures,
    species_and_race: character.speciesAndRace,
    archetype: character.archetype,
    personality: character.personality,
    hobbies: character.hobbies,
    dreams_and_goals: character.dreamsAndGoals,
    fears_and_traumas: character.fearsAndTraumas,
    favorite_food: character.favoriteFood,
    favorite_music: character.favoriteMusic,
    birth_place: character.birthPlace,
    affiliated_place: character.affiliatedPlace,
    organization: character.organization,
    field_visibility: character.fieldVisibility
      ? JSON.stringify(character.fieldVisibility)
      : undefined,
    created_at: character.createdAt
      ? new Date(character.createdAt).getTime()
      : Date.now(),
    updated_at: character.updatedAt
      ? new Date(character.updatedAt).getTime()
      : Date.now(),
  };
}

// Convert DBCharacter to ICharacter
function dbCharacterToCharacter(dbChar: DBCharacter): ICharacter {
  return {
    id: dbChar.id,
    name: dbChar.name,
    age: dbChar.age,
    gender: dbChar.gender,
    role: dbChar.role || "",
    description: dbChar.description || "",
    image: dbChar.image,
    alignment: dbChar.alignment,
    height: dbChar.height,
    weight: dbChar.weight,
    skinTone: dbChar.skin_tone,
    skinToneColor: dbChar.skin_tone_color,
    physicalType: dbChar.physical_type,
    hair: dbChar.hair,
    eyes: dbChar.eyes,
    face: dbChar.face,
    distinguishingFeatures: dbChar.distinguishing_features,
    speciesAndRace: dbChar.species_and_race,
    archetype: dbChar.archetype,
    personality: dbChar.personality,
    hobbies: dbChar.hobbies,
    dreamsAndGoals: dbChar.dreams_and_goals,
    fearsAndTraumas: dbChar.fears_and_traumas,
    favoriteFood: dbChar.favorite_food,
    favoriteMusic: dbChar.favorite_music,
    birthPlace: dbChar.birth_place,
    affiliatedPlace: dbChar.affiliated_place,
    organization: dbChar.organization,
    fieldVisibility: dbChar.field_visibility
      ? JSON.parse(dbChar.field_visibility)
      : undefined,
    createdAt: new Date(dbChar.created_at).toISOString(),
    updatedAt: new Date(dbChar.updated_at).toISOString(),
  };
}

export async function getCharactersByBookId(
  bookId: string
): Promise<ICharacter[]> {
  const db = await getDB();
  const result = await db.select<DBCharacter[]>(
    "SELECT * FROM characters WHERE book_id = $1 ORDER BY created_at DESC",
    [bookId]
  );
  return result.map(dbCharacterToCharacter);
}

export async function getCharacterById(id: string): Promise<ICharacter | null> {
  const db = await getDB();
  const result = await db.select<DBCharacter[]>(
    "SELECT * FROM characters WHERE id = $1",
    [id]
  );
  return result.length > 0 ? dbCharacterToCharacter(result[0]) : null;
}

export async function createCharacter(
  bookId: string,
  character: ICharacter
): Promise<void> {
  const db = await getDB();
  const dbChar = characterToDBCharacter(bookId, character);

  await db.execute(
    `INSERT INTO characters (
      id, book_id, name, age, gender, role, description, image, alignment,
      height, weight, skin_tone, skin_tone_color, physical_type, hair, eyes, face,
      distinguishing_features, species_and_race, archetype, personality, hobbies,
      dreams_and_goals, fears_and_traumas, favorite_food, favorite_music,
      birth_place, affiliated_place, organization, field_visibility,
      created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
      $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32
    )`,
    [
      dbChar.id,
      dbChar.book_id,
      dbChar.name,
      dbChar.age,
      dbChar.gender,
      dbChar.role,
      dbChar.description,
      dbChar.image,
      dbChar.alignment,
      dbChar.height,
      dbChar.weight,
      dbChar.skin_tone,
      dbChar.skin_tone_color,
      dbChar.physical_type,
      dbChar.hair,
      dbChar.eyes,
      dbChar.face,
      dbChar.distinguishing_features,
      dbChar.species_and_race,
      dbChar.archetype,
      dbChar.personality,
      dbChar.hobbies,
      dbChar.dreams_and_goals,
      dbChar.fears_and_traumas,
      dbChar.favorite_food,
      dbChar.favorite_music,
      dbChar.birth_place,
      dbChar.affiliated_place,
      dbChar.organization,
      dbChar.field_visibility,
      dbChar.created_at,
      dbChar.updated_at,
    ]
  );
}

export async function updateCharacter(
  id: string,
  updates: Partial<ICharacter>
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  // Get current character to preserve book_id
  const current = await db.select<DBCharacter[]>(
    "SELECT book_id FROM characters WHERE id = $1",
    [id]
  );

  if (current.length === 0) {
    throw new Error("Character not found");
  }

  // Build a full character object from updates
  const fullCharacter: ICharacter = {
    id,
    name: updates.name || "",
    role: updates.role || "",
    description: updates.description || "",
    ...updates,
  };

  const dbChar = characterToDBCharacter(current[0].book_id, fullCharacter);
  dbChar.updated_at = now;

  await db.execute(
    `UPDATE characters SET
      name = $1, age = $2, gender = $3, role = $4, description = $5, image = $6,
      alignment = $7, height = $8, weight = $9, skin_tone = $10, skin_tone_color = $11,
      physical_type = $12, hair = $13, eyes = $14, face = $15,
      distinguishing_features = $16, species_and_race = $17, archetype = $18,
      personality = $19, hobbies = $20, dreams_and_goals = $21, fears_and_traumas = $22,
      favorite_food = $23, favorite_music = $24, birth_place = $25, affiliated_place = $26,
      organization = $27, field_visibility = $28, updated_at = $29
    WHERE id = $30`,
    [
      dbChar.name,
      dbChar.age,
      dbChar.gender,
      dbChar.role,
      dbChar.description,
      dbChar.image,
      dbChar.alignment,
      dbChar.height,
      dbChar.weight,
      dbChar.skin_tone,
      dbChar.skin_tone_color,
      dbChar.physical_type,
      dbChar.hair,
      dbChar.eyes,
      dbChar.face,
      dbChar.distinguishing_features,
      dbChar.species_and_race,
      dbChar.archetype,
      dbChar.personality,
      dbChar.hobbies,
      dbChar.dreams_and_goals,
      dbChar.fears_and_traumas,
      dbChar.favorite_food,
      dbChar.favorite_music,
      dbChar.birth_place,
      dbChar.affiliated_place,
      dbChar.organization,
      dbChar.field_visibility,
      dbChar.updated_at,
      id,
    ]
  );
}

export async function deleteCharacter(id: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM characters WHERE id = $1", [id]);
}

// Relationships
export async function getCharacterRelationships(
  characterId: string
): Promise<ICharacterRelationship[]> {
  const db = await getDB();
  const result = await db.select<DBRelationship[]>(
    "SELECT * FROM relationships WHERE character_id = $1",
    [characterId]
  );

  return result.map((rel) => ({
    id: rel.related_character_id,
    characterId: rel.character_id,
    type: rel.type as ICharacterRelationship["type"],
    intensity: rel.intensity,
  }));
}

export async function saveCharacterRelationships(
  characterId: string,
  relationships: ICharacterRelationship[]
): Promise<void> {
  const db = await getDB();

  // Delete existing relationships
  await db.execute("DELETE FROM relationships WHERE character_id = $1", [
    characterId,
  ]);

  // Insert new relationships
  for (const rel of relationships) {
    const relId = `${characterId}-${rel.id}-${rel.type}-${Date.now()}`;
    await db.execute(
      `INSERT INTO relationships (id, character_id, related_character_id, type, intensity, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [relId, characterId, rel.id, rel.type, rel.intensity, Date.now()]
    );
  }
}

// Family Relations
export async function getCharacterFamily(
  characterId: string
): Promise<ICharacterFamily> {
  const db = await getDB();
  const result = await db.select<DBFamilyRelation[]>(
    "SELECT * FROM family_relations WHERE character_id = $1",
    [characterId]
  );

  const family: ICharacterFamily = {
    father: null,
    mother: null,
    spouse: null,
    children: [],
    siblings: [],
    halfSiblings: [],
    grandparents: [],
    unclesAunts: [],
    cousins: [],
  };

  for (const rel of result) {
    const relatedId = rel.related_character_id;
    switch (rel.relation_type) {
      case "father":
        family.father = relatedId;
        break;
      case "mother":
        family.mother = relatedId;
        break;
      case "spouse":
        family.spouse = relatedId;
        break;
      case "child":
        family.children.push(relatedId);
        break;
      case "sibling":
        family.siblings.push(relatedId);
        break;
      case "half_sibling":
        family.halfSiblings.push(relatedId);
        break;
      case "grandparent":
        family.grandparents.push(relatedId);
        break;
      case "uncle_aunt":
        family.unclesAunts.push(relatedId);
        break;
      case "cousin":
        family.cousins.push(relatedId);
        break;
    }
  }

  return family;
}

export async function saveCharacterFamily(
  characterId: string,
  family: ICharacterFamily
): Promise<void> {
  const db = await getDB();

  // Delete existing family relations
  await db.execute("DELETE FROM family_relations WHERE character_id = $1", [
    characterId,
  ]);

  const now = Date.now();
  const relations: Array<{ type: string; id: string }> = [];

  if (family.father) relations.push({ type: "father", id: family.father });
  if (family.mother) relations.push({ type: "mother", id: family.mother });
  if (family.spouse) relations.push({ type: "spouse", id: family.spouse });

  family.children.forEach((id) => relations.push({ type: "child", id }));
  family.siblings.forEach((id) => relations.push({ type: "sibling", id }));
  family.halfSiblings.forEach((id) =>
    relations.push({ type: "half_sibling", id })
  );
  family.grandparents.forEach((id) =>
    relations.push({ type: "grandparent", id })
  );
  family.unclesAunts.forEach((id) =>
    relations.push({ type: "uncle_aunt", id })
  );
  family.cousins.forEach((id) => relations.push({ type: "cousin", id }));

  // Insert new family relations
  for (const rel of relations) {
    const relId = `${characterId}-${rel.id}-${rel.type}-${now}`;
    await db.execute(
      `INSERT INTO family_relations (id, character_id, related_character_id, relation_type, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [relId, characterId, rel.id, rel.type, now]
    );
  }
}

// Character Versions
export async function getCharacterVersions(characterId: string): Promise<ICharacterVersion[]> {
  const db = await getDB();
  const result = await db.select<DBCharacterVersion[]>(
    "SELECT * FROM character_versions WHERE character_id = $1 ORDER BY created_at DESC",
    [characterId]
  );

  return result.map((v) => ({
    id: v.id,
    name: v.name,
    description: v.description || "",
    createdAt: new Date(v.created_at).toISOString(),
    isMain: v.is_main === 1,
    characterData: v.character_data ? JSON.parse(v.character_data) : ({} as ICharacter),
  }));
}

export async function createCharacterVersion(
  characterId: string,
  version: ICharacterVersion
): Promise<void> {
  const db = await getDB();

  await db.execute(
    `INSERT INTO character_versions (
      id, character_id, name, description, is_main, character_data, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      version.id,
      characterId,
      version.name,
      version.description,
      version.isMain ? 1 : 0,
      JSON.stringify(version.characterData),
      Date.now(),
    ]
  );
}

export async function deleteCharacterVersion(versionId: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM character_versions WHERE id = $1", [versionId]);
}

export async function updateCharacterVersion(
  versionId: string,
  name: string,
  description?: string
): Promise<void> {
  const db = await getDB();
  await db.execute(
    "UPDATE character_versions SET name = $1, description = $2 WHERE id = $3",
    [name, description, versionId]
  );
}
