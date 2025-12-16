import { IFaction, IFactionVersion } from "@/types/faction-types";

import { DBFaction, DBFactionVersion } from "./types";

import { getDB } from "./index";
import { safeDBOperation } from "./safe-db-operation";
import {
  cleanCommonEntityReferences,
  removeFromJSONArray,
  removeFromNestedJSONArray,
} from "./cleanup-helpers";

// Convert IFaction to DBFaction
function factionToDBFaction(bookId: string, faction: IFaction): DBFaction {
  return {
    id: faction.id,
    book_id: bookId,
    name: faction.name,
    summary: faction.summary,
    status: faction.status,
    faction_type: faction.factionType,
    image: faction.image,

    // Advanced fields - Alignment
    alignment: faction.alignment,

    // Advanced fields - Relationships
    influence: faction.influence,
    public_reputation: faction.publicReputation,

    // Advanced fields - Territory
    dominated_areas: faction.dominatedAreas
      ? JSON.stringify(faction.dominatedAreas)
      : undefined,
    main_base: faction.mainBase ? JSON.stringify(faction.mainBase) : undefined,
    areas_of_interest: faction.areasOfInterest
      ? JSON.stringify(faction.areasOfInterest)
      : undefined,

    // Advanced fields - Internal Structure
    government_form: faction.governmentForm,
    rules_and_laws: faction.rulesAndLaws
      ? JSON.stringify(faction.rulesAndLaws)
      : undefined,
    main_resources: faction.mainResources
      ? JSON.stringify(faction.mainResources)
      : undefined,
    economy: faction.economy,
    symbols_and_secrets: faction.symbolsAndSecrets,
    currencies: faction.currencies
      ? JSON.stringify(faction.currencies)
      : undefined,

    // Advanced fields - Power
    military_power: faction.militaryPower,
    political_power: faction.politicalPower,
    cultural_power: faction.culturalPower,
    economic_power: faction.economicPower,

    // Advanced fields - Culture
    faction_motto: faction.factionMotto,
    traditions_and_rituals: faction.traditionsAndRituals
      ? JSON.stringify(faction.traditionsAndRituals)
      : undefined,
    beliefs_and_values: faction.beliefsAndValues
      ? JSON.stringify(faction.beliefsAndValues)
      : undefined,
    languages_used: faction.languagesUsed
      ? JSON.stringify(faction.languagesUsed)
      : undefined,
    uniform_and_aesthetics: faction.uniformAndAesthetics,
    races: faction.races ? JSON.stringify(faction.races) : undefined,

    // Advanced fields - History
    foundation_date: faction.foundationDate,
    foundation_history_summary: faction.foundationHistorySummary,
    founders: faction.founders ? JSON.stringify(faction.founders) : undefined,
    chronology: faction.chronology
      ? JSON.stringify(faction.chronology)
      : undefined,

    // Advanced fields - Narrative
    organization_objectives: faction.organizationObjectives,
    narrative_importance: faction.narrativeImportance,
    inspirations: faction.inspirations,

    // Special sections
    timeline: faction.timeline ? JSON.stringify(faction.timeline) : undefined,
    diplomatic_relations: faction.diplomaticRelations
      ? JSON.stringify(faction.diplomaticRelations)
      : undefined,
    hierarchy: faction.hierarchy
      ? JSON.stringify(faction.hierarchy)
      : undefined,

    // UI State
    ui_state: faction.uiState ? JSON.stringify(faction.uiState) : undefined,

    // Metadata
    created_at: faction.createdAt
      ? new Date(faction.createdAt).getTime()
      : Date.now(),
  };
}

// Convert DBFaction to IFaction
function dbFactionToFaction(dbFaction: DBFaction): IFaction {
  return {
    id: dbFaction.id,
    bookId: dbFaction.book_id,
    name: dbFaction.name,
    summary: dbFaction.summary,
    status: dbFaction.status as IFaction["status"],
    factionType: dbFaction.faction_type as IFaction["factionType"],
    image: dbFaction.image,

    // Advanced fields - Alignment
    alignment: dbFaction.alignment,

    // Advanced fields - Relationships
    influence: dbFaction.influence as IFaction["influence"],
    publicReputation:
      dbFaction.public_reputation as IFaction["publicReputation"],

    // Advanced fields - Territory
    dominatedAreas: dbFaction.dominated_areas
      ? JSON.parse(dbFaction.dominated_areas)
      : undefined,
    mainBase: dbFaction.main_base ? JSON.parse(dbFaction.main_base) : undefined,
    areasOfInterest: dbFaction.areas_of_interest
      ? JSON.parse(dbFaction.areas_of_interest)
      : undefined,

    // Advanced fields - Internal Structure
    governmentForm: dbFaction.government_form,
    rulesAndLaws: dbFaction.rules_and_laws
      ? JSON.parse(dbFaction.rules_and_laws)
      : undefined,
    mainResources: dbFaction.main_resources
      ? JSON.parse(dbFaction.main_resources)
      : undefined,
    economy: dbFaction.economy,
    symbolsAndSecrets: dbFaction.symbols_and_secrets,
    currencies: dbFaction.currencies
      ? JSON.parse(dbFaction.currencies)
      : undefined,

    // Advanced fields - Power
    militaryPower: dbFaction.military_power,
    politicalPower: dbFaction.political_power,
    culturalPower: dbFaction.cultural_power,
    economicPower: dbFaction.economic_power,

    // Advanced fields - Culture
    factionMotto: dbFaction.faction_motto,
    traditionsAndRituals: dbFaction.traditions_and_rituals
      ? JSON.parse(dbFaction.traditions_and_rituals)
      : undefined,
    beliefsAndValues: dbFaction.beliefs_and_values
      ? JSON.parse(dbFaction.beliefs_and_values)
      : undefined,
    languagesUsed: dbFaction.languages_used
      ? JSON.parse(dbFaction.languages_used)
      : undefined,
    uniformAndAesthetics: dbFaction.uniform_and_aesthetics,
    races: dbFaction.races ? JSON.parse(dbFaction.races) : undefined,

    // Advanced fields - History
    foundationDate: dbFaction.foundation_date,
    foundationHistorySummary: dbFaction.foundation_history_summary,
    founders: dbFaction.founders ? JSON.parse(dbFaction.founders) : undefined,
    chronology: dbFaction.chronology
      ? JSON.parse(dbFaction.chronology)
      : undefined,

    // Advanced fields - Narrative
    organizationObjectives: dbFaction.organization_objectives,
    narrativeImportance: dbFaction.narrative_importance,
    inspirations: dbFaction.inspirations,

    // Special sections
    timeline: dbFaction.timeline ? JSON.parse(dbFaction.timeline) : undefined,
    diplomaticRelations: dbFaction.diplomatic_relations
      ? JSON.parse(dbFaction.diplomatic_relations)
      : undefined,
    hierarchy: dbFaction.hierarchy
      ? JSON.parse(dbFaction.hierarchy)
      : undefined,

    // UI State
    uiState: dbFaction.ui_state ? JSON.parse(dbFaction.ui_state) : undefined,

    // Metadata
    createdAt: new Date(dbFaction.created_at).toISOString(),
  };
}

export async function getFactionsByBookId(bookId: string): Promise<IFaction[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBFaction[]>(
      "SELECT * FROM factions WHERE book_id = $1 ORDER BY created_at DESC",
      [bookId]
    );
    return result.map(dbFactionToFaction);
  }, 'getFactionsByBookId');
}

export async function getFactionById(id: string): Promise<IFaction | null> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBFaction[]>(
      "SELECT * FROM factions WHERE id = $1",
      [id]
    );
    return result.length > 0 ? dbFactionToFaction(result[0]) : null;
  }, 'getFactionById');
}

export async function createFaction(
  bookId: string,
  faction: IFaction
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const dbFaction = factionToDBFaction(bookId, faction);

  await db.execute(
    `INSERT INTO factions (
      id, book_id, name, summary, status, faction_type, image,
      alignment, influence, public_reputation,
      dominated_areas, main_base, areas_of_interest,
      government_form, rules_and_laws, main_resources,
      economy, symbols_and_secrets, currencies,
      military_power, political_power, cultural_power, economic_power,
      faction_motto, traditions_and_rituals, beliefs_and_values,
      languages_used, uniform_and_aesthetics, races,
      foundation_date, foundation_history_summary, founders, chronology,
      organization_objectives, narrative_importance, inspirations,
      timeline, diplomatic_relations, hierarchy, ui_state,
      created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,
      $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41
    )`,
    [
      dbFaction.id,
      dbFaction.book_id,
      dbFaction.name,
      dbFaction.summary,
      dbFaction.status,
      dbFaction.faction_type,
      dbFaction.image,
      dbFaction.alignment,
      dbFaction.influence,
      dbFaction.public_reputation,
      dbFaction.dominated_areas,
      dbFaction.main_base,
      dbFaction.areas_of_interest,
      dbFaction.government_form,
      dbFaction.rules_and_laws,
      dbFaction.main_resources,
      dbFaction.economy,
      dbFaction.symbols_and_secrets,
      dbFaction.currencies,
      dbFaction.military_power,
      dbFaction.political_power,
      dbFaction.cultural_power,
      dbFaction.economic_power,
      dbFaction.faction_motto,
      dbFaction.traditions_and_rituals,
      dbFaction.beliefs_and_values,
      dbFaction.languages_used,
      dbFaction.uniform_and_aesthetics,
      dbFaction.races,
      dbFaction.foundation_date,
      dbFaction.foundation_history_summary,
      dbFaction.founders,
      dbFaction.chronology,
      dbFaction.organization_objectives,
      dbFaction.narrative_importance,
      dbFaction.inspirations,
      dbFaction.timeline,
      dbFaction.diplomatic_relations,
      dbFaction.hierarchy,
      dbFaction.ui_state,
      dbFaction.created_at,
    ]
  );
  }, 'createFaction');
}

export async function updateFaction(
  id: string,
  updates: Partial<IFaction>
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Get current faction to preserve existing data
    const current = await db.select<DBFaction[]>(
      "SELECT * FROM factions WHERE id = $1",
      [id]
    );

    if (current.length === 0) {
      throw new Error("Faction not found");
    }

    // Convert current DB faction to IFaction to preserve existing values
    const currentFaction = dbFactionToFaction(current[0]);

    // Merge updates with current faction, preserving existing values
    const fullFaction: IFaction = {
      ...currentFaction,
      ...updates,
      id, // Ensure ID is preserved
      bookId: current[0].book_id, // Ensure bookId is preserved
    };

    const dbFaction = factionToDBFaction(current[0].book_id, fullFaction);

  await db.execute(
    `UPDATE factions SET
      name = $1, summary = $2, status = $3, faction_type = $4, image = $5,
      alignment = $6, influence = $7, public_reputation = $8,
      dominated_areas = $9, main_base = $10, areas_of_interest = $11,
      government_form = $12, rules_and_laws = $13, main_resources = $14,
      economy = $15, symbols_and_secrets = $16, currencies = $17,
      military_power = $18, political_power = $19, cultural_power = $20, economic_power = $21,
      faction_motto = $22, traditions_and_rituals = $23, beliefs_and_values = $24,
      languages_used = $25, uniform_and_aesthetics = $26, races = $27,
      foundation_date = $28, foundation_history_summary = $29, founders = $30, chronology = $31,
      organization_objectives = $32, narrative_importance = $33, inspirations = $34,
      timeline = $35, diplomatic_relations = $36, hierarchy = $37, ui_state = $38
    WHERE id = $39`,
    [
      dbFaction.name,
      dbFaction.summary,
      dbFaction.status,
      dbFaction.faction_type,
      dbFaction.image,
      dbFaction.alignment,
      dbFaction.influence,
      dbFaction.public_reputation,
      dbFaction.dominated_areas,
      dbFaction.main_base,
      dbFaction.areas_of_interest,
      dbFaction.government_form,
      dbFaction.rules_and_laws,
      dbFaction.main_resources,
      dbFaction.economy,
      dbFaction.symbols_and_secrets,
      dbFaction.currencies,
      dbFaction.military_power,
      dbFaction.political_power,
      dbFaction.cultural_power,
      dbFaction.economic_power,
      dbFaction.faction_motto,
      dbFaction.traditions_and_rituals,
      dbFaction.beliefs_and_values,
      dbFaction.languages_used,
      dbFaction.uniform_and_aesthetics,
      dbFaction.races,
      dbFaction.foundation_date,
      dbFaction.foundation_history_summary,
      dbFaction.founders,
      dbFaction.chronology,
      dbFaction.organization_objectives,
      dbFaction.narrative_importance,
      dbFaction.inspirations,
      dbFaction.timeline,
      dbFaction.diplomatic_relations,
      dbFaction.hierarchy,
      dbFaction.ui_state,
      id,
    ]
  );
  }, 'updateFaction');
}

export async function deleteFaction(id: string): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // 1. Clean common entity references (mentions, gallery, notes)
    await cleanCommonEntityReferences(id, "faction");

    // 2. Remove from plot_arcs.important_factions
    await removeFromJSONArray("plot_arcs", "important_factions", id);

    // 3. Remove from region_timeline_events.factions_involved
    await removeFromJSONArray(
      "region_timeline_events",
      "factions_involved",
      id
    );

    // 4. Remove from factions.diplomatic_relations (in ALL factions, not just the deleted one)
    const allFactions = await db.select<
      Array<{ id: string; diplomatic_relations: string }>
    >("SELECT id, diplomatic_relations FROM factions WHERE diplomatic_relations IS NOT NULL");

    for (const faction of allFactions) {
      try {
        const relations = JSON.parse(faction.diplomatic_relations);
        const filteredRelations = relations.filter(
          (rel: any) => rel.targetFactionId !== id
        );

        if (filteredRelations.length !== relations.length) {
          await db.execute(
            "UPDATE factions SET diplomatic_relations = $1 WHERE id = $2",
            [JSON.stringify(filteredRelations), faction.id]
          );
        }
      } catch (error) {
        console.warn(
          `[deleteFaction] Failed to parse diplomatic_relations for faction ${faction.id}:`,
          error
        );
      }
    }

    // 5. Remove from factions.timeline[].events[].factionsInvolved
    await removeFromNestedJSONArray("factions", "timeline", id, [
      "timeline",
      "*",
      "events",
      "*",
      "factionsInvolved",
    ]);

    // 6. Finally, delete the faction (CASCADE will handle versions)
    await db.execute("DELETE FROM factions WHERE id = $1", [id]);
  }, 'deleteFaction');
}

// Version Management Functions
export async function getFactionVersions(
  factionId: string
): Promise<IFactionVersion[]> {
  return safeDBOperation(async () => {
    const db = await getDB();
    const result = await db.select<DBFactionVersion[]>(
      "SELECT * FROM faction_versions WHERE faction_id = $1 ORDER BY created_at DESC",
      [factionId]
    );

    return result.map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description || "",
      createdAt: new Date(v.created_at).toISOString(),
      isMain: v.is_main === 1,
      factionData: v.faction_data ? JSON.parse(v.faction_data) : ({} as IFaction),
    }));
  }, 'getFactionVersions');
}

export async function createFactionVersion(
  factionId: string,
  version: IFactionVersion
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    await db.execute(
      `INSERT INTO faction_versions (
        id, faction_id, name, description, is_main, faction_data, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        version.id,
        factionId,
        version.name,
        version.description,
        version.isMain ? 1 : 0,
        JSON.stringify(version.factionData),
        Date.now(),
      ]
    );
  }, 'createFactionVersion');
}

export async function deleteFactionVersion(versionId: string): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    await db.execute("DELETE FROM faction_versions WHERE id = $1", [versionId]);
  }, 'deleteFactionVersion');
}

export async function updateFactionVersion(
  versionId: string,
  name: string,
  description?: string
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    await db.execute(
      "UPDATE faction_versions SET name = $1, description = $2 WHERE id = $3",
      [name, description, versionId]
    );
  }, 'updateFactionVersion');
}

export async function updateFactionVersionData(
  versionId: string,
  factionData: IFaction
): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();
    await db.execute(
      "UPDATE faction_versions SET faction_data = $1 WHERE id = $2",
      [JSON.stringify(factionData), versionId]
    );
  }, 'updateFactionVersionData');
}
