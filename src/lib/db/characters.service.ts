import {
  ICharacter,
  ICharacterRelationship,
  ICharacterFamily,
} from "@/types/character-types";

import {
  DBCharacter,
  DBRelationship,
  DBFamilyRelation,
} from "./types";

import { getDB } from "./index";
import { safeDBOperation } from "./safe-db-operation";
import {
  cleanCommonEntityReferences,
  removeFromJSONArray,
  removeFromNestedJSONArray,
} from "./cleanup-helpers";
import {
  safeParseStringArray,
  safeParseEntityRefs,
  safeParseLocations,
  safeParseFieldVisibility,
  safeParseUnknownObject,
  safeJSONParse,
  hierarchySchema,
} from "./safe-json-parse";

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
    status: character.status,
    height: character.height,
    weight: character.weight,
    skin_tone: character.skinTone,
    skin_tone_color: character.skinToneColor,
    physical_type: character.physicalType,
    hair: character.hair,
    eyes: character.eyes,
    face: character.face,
    distinguishing_features: character.distinguishingFeatures,
    species_and_race: character.speciesAndRace
      ? JSON.stringify(character.speciesAndRace)
      : JSON.stringify([]),
    archetype: character.archetype,
    personality: character.personality,
    hobbies: character.hobbies,
    dreams_and_goals: character.dreamsAndGoals,
    fears_and_traumas: character.fearsAndTraumas,
    favorite_food: character.favoriteFood,
    favorite_music: character.favoriteMusic,
    birth_place: character.birthPlace
      ? JSON.stringify(character.birthPlace)
      : JSON.stringify([]),
    affiliated_place: character.affiliatedPlace,
    organization: character.organization,
    nicknames: character.nicknames
      ? JSON.stringify(character.nicknames)
      : JSON.stringify([]),
    past: character.past,
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
    status: dbChar.status,
    height: dbChar.height,
    weight: dbChar.weight,
    skinTone: dbChar.skin_tone,
    skinToneColor: dbChar.skin_tone_color,
    physicalType: dbChar.physical_type,
    hair: dbChar.hair,
    eyes: dbChar.eyes,
    face: dbChar.face,
    distinguishingFeatures: dbChar.distinguishing_features,
    speciesAndRace: safeParseEntityRefs(dbChar.species_and_race),
    archetype: dbChar.archetype,
    personality: dbChar.personality,
    hobbies: dbChar.hobbies,
    dreamsAndGoals: dbChar.dreams_and_goals,
    fearsAndTraumas: dbChar.fears_and_traumas,
    favoriteFood: dbChar.favorite_food,
    favoriteMusic: dbChar.favorite_music,
    birthPlace: safeParseLocations(dbChar.birth_place),
    affiliatedPlace: dbChar.affiliated_place,
    organization: dbChar.organization,
    nicknames: safeParseStringArray(dbChar.nicknames),
    past: dbChar.past,
    createdAt: new Date(dbChar.created_at).toISOString(),
    updatedAt: new Date(dbChar.updated_at).toISOString(),
  };
}

export async function getCharactersByBookId(
  bookId: string
): Promise<ICharacter[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBCharacter[]>(
      "SELECT * FROM characters WHERE book_id = $1 ORDER BY created_at DESC",
      [bookId]
    );
    return result.map(dbCharacterToCharacter);
  }, 'getCharactersByBookId');
}

export async function getCharacterById(id: string): Promise<ICharacter | null> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBCharacter[]>(
      "SELECT * FROM characters WHERE id = $1",
      [id]
    );
    return result.length > 0 ? dbCharacterToCharacter(result[0]) : null;
  }, 'getCharacterById');
}

export async function createCharacter(
  bookId: string,
  character: ICharacter
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const dbChar = characterToDBCharacter(bookId, character);

    await db.execute(
      `INSERT INTO characters (
        id, book_id, name, age, gender, role, description, image, alignment, status,
        height, weight, skin_tone, skin_tone_color, physical_type, hair, eyes, face,
        distinguishing_features, species_and_race, archetype, personality, hobbies,
        dreams_and_goals, fears_and_traumas, favorite_food, favorite_music,
        birth_place, affiliated_place, organization, nicknames, past,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34
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
        dbChar.status,
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
        dbChar.nicknames,
        dbChar.past,
        dbChar.created_at,
        dbChar.updated_at,
      ]
    );
  }, 'createCharacter');
}

export async function updateCharacter(
  id: string,
  updates: Partial<ICharacter>
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const now = Date.now();

    // Get current character data
    const currentCharacter = await getCharacterById(id);

    if (!currentCharacter) {
      throw new Error("Character not found");
    }

    // Get book_id from database
    const bookIdResult = await db.select<DBCharacter[]>(
      "SELECT book_id FROM characters WHERE id = $1",
      [id]
    );

    // Merge current data with updates (preserves existing fields)
    const fullCharacter: ICharacter = {
      ...currentCharacter,
      ...updates,
    };

    const dbChar = characterToDBCharacter(bookIdResult[0].book_id, fullCharacter);
    dbChar.updated_at = now;

    await db.execute(
      `UPDATE characters SET
        name = $1, age = $2, gender = $3, role = $4, description = $5, image = $6,
        alignment = $7, status = $8, height = $9, weight = $10, skin_tone = $11, skin_tone_color = $12,
        physical_type = $13, hair = $14, eyes = $15, face = $16,
        distinguishing_features = $17, species_and_race = $18, archetype = $19,
        personality = $20, hobbies = $21, dreams_and_goals = $22, fears_and_traumas = $23,
        favorite_food = $24, favorite_music = $25, birth_place = $26, affiliated_place = $27,
        organization = $28, nicknames = $29, past = $30, updated_at = $31
      WHERE id = $32`,
      [
        dbChar.name,
        dbChar.age,
        dbChar.gender,
        dbChar.role,
        dbChar.description,
        dbChar.image,
        dbChar.alignment,
        dbChar.status,
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
        dbChar.nicknames,
        dbChar.past,
        dbChar.updated_at,
        id,
      ]
    );
  }, 'updateCharacter');
}

export async function deleteCharacter(id: string): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // 1. Clean common entity references (mentions, gallery, notes)
    await cleanCommonEntityReferences(id, "character");

    // 2. Remove from plot_arcs.important_characters
    await removeFromJSONArray("plot_arcs", "important_characters", id);

    // 3. Remove from region_timeline_events.characters_involved
    await removeFromJSONArray(
      "region_timeline_events",
      "characters_involved",
      id
    );

    // 4. Remove from factions.founders
    await removeFromJSONArray("factions", "founders", id);

    // 5. Remove from factions.hierarchy[].characterIds
    const factions = await db.select<Array<{ id: string; hierarchy: string }>>(
      "SELECT id, hierarchy FROM factions WHERE hierarchy IS NOT NULL"
    );

    for (const faction of factions) {
      try {
        const hierarchy = safeJSONParse(faction.hierarchy, hierarchySchema, []);
        let modified = false;

        for (const title of hierarchy) {
          if (Array.isArray(title.characterIds)) {
            const before = title.characterIds.length;
            title.characterIds = title.characterIds.filter(
              (charId: string) => charId !== id
            );
            if (title.characterIds.length !== before) {
              modified = true;
            }
          }
        }

        if (modified) {
          await db.execute("UPDATE factions SET hierarchy = $1 WHERE id = $2", [
            JSON.stringify(hierarchy),
            faction.id,
          ]);
        }
      } catch (error) {
        console.warn(
          `[deleteCharacter] Failed to parse hierarchy for faction ${faction.id}:`,
          error
        );
      }
    }

    // 6. Remove from factions.timeline[].events[].charactersInvolved
    await removeFromNestedJSONArray("factions", "timeline", id, [
      "timeline",
      "*",
      "events",
      "*",
      "charactersInvolved",
    ]);

    // 7. Finally, delete the character (CASCADE will handle versions, relationships, family_relations, power_character_links)
    await db.execute("DELETE FROM characters WHERE id = $1", [id]);
  }, 'deleteCharacter');
}

// Relationships
export async function getCharacterRelationships(
  characterId: string
): Promise<ICharacterRelationship[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBRelationship[]>(
      "SELECT * FROM relationships WHERE character_id = $1",
      [characterId]
    );

    return result.map((rel) => ({
      id: rel.id,
      characterId: rel.related_character_id,
      type: rel.type as ICharacterRelationship["type"],
      intensity: rel.intensity,
    }));
  }, 'getCharacterRelationships');
}

export async function saveCharacterRelationships(
  characterId: string,
  relationships: ICharacterRelationship[]
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Delete existing relationships
    await db.execute("DELETE FROM relationships WHERE character_id = $1", [
      characterId,
    ]);

    // Insert new relationships
    for (const rel of relationships) {
      const relId = `${characterId}-${rel.characterId}-${rel.type}-${Date.now()}`;
      await db.execute(
        `INSERT INTO relationships (id, character_id, related_character_id, type, intensity, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          relId,
          characterId,
          rel.characterId,
          rel.type,
          rel.intensity,
          Date.now(),
        ]
      );
    }
  }, 'saveCharacterRelationships');
}

// Family Relations
export async function getCharacterFamily(
  characterId: string
): Promise<ICharacterFamily> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBFamilyRelation[]>(
      "SELECT * FROM family_relations WHERE character_id = $1",
      [characterId]
    );

    const family: ICharacterFamily = {
      grandparents: [],
      parents: [],
      spouses: [],
      unclesAunts: [],
      cousins: [],
      children: [],
      siblings: [],
      halfSiblings: [],
    };

    for (const rel of result) {
      const relatedId = rel.related_character_id;
      switch (rel.relation_type) {
        // Map both "father" and "mother" to parents array
        case "father":
        case "mother":
        case "parent":
          family.parents.push(relatedId);
          break;
        // Map "spouse" to spouses array
        case "spouse":
          family.spouses.push(relatedId);
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
  }, 'getCharacterFamily');
}

export async function saveCharacterFamily(
  characterId: string,
  family: ICharacterFamily
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Delete existing family relations
    await db.execute("DELETE FROM family_relations WHERE character_id = $1", [
      characterId,
    ]);

    const now = Date.now();
    const relations: Array<{ type: string; id: string }> = [];

    // Map parents array to "parent" relation type
    family.parents.forEach((id) => relations.push({ type: "parent", id }));

    // Map spouses array to "spouse" relation type
    family.spouses.forEach((id) => relations.push({ type: "spouse", id }));

    // Map other family members
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
  }, 'saveCharacterFamily');
}

