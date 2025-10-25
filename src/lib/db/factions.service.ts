import { IFaction, IFactionVersion } from "@/types/faction-types";

import { DBFaction, DBFactionVersion } from "./types";

import { getDB } from "./index";

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
    external_influence: faction.externalInfluence,

    // Advanced fields - Internal Structure
    government_form: faction.governmentForm,
    rules_and_laws: faction.rulesAndLaws
      ? JSON.stringify(faction.rulesAndLaws)
      : undefined,
    important_symbols: faction.importantSymbols
      ? JSON.stringify(faction.importantSymbols)
      : undefined,
    main_resources: faction.mainResources
      ? JSON.stringify(faction.mainResources)
      : undefined,
    economy: faction.economy,
    treasures_and_secrets: faction.treasuresAndSecrets
      ? JSON.stringify(faction.treasuresAndSecrets)
      : undefined,
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
    externalInfluence: dbFaction.external_influence,

    // Advanced fields - Internal Structure
    governmentForm: dbFaction.government_form,
    rulesAndLaws: dbFaction.rules_and_laws
      ? JSON.parse(dbFaction.rules_and_laws)
      : undefined,
    importantSymbols: dbFaction.important_symbols
      ? JSON.parse(dbFaction.important_symbols)
      : undefined,
    mainResources: dbFaction.main_resources
      ? JSON.parse(dbFaction.main_resources)
      : undefined,
    economy: dbFaction.economy,
    treasuresAndSecrets: dbFaction.treasures_and_secrets
      ? JSON.parse(dbFaction.treasures_and_secrets)
      : undefined,
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

    // Metadata
    createdAt: new Date(dbFaction.created_at).toISOString(),
  };
}

export async function getFactionsByBookId(bookId: string): Promise<IFaction[]> {
  const db = await getDB();
  const result = await db.select<DBFaction[]>(
    "SELECT * FROM factions WHERE book_id = $1 ORDER BY created_at DESC",
    [bookId]
  );
  return result.map(dbFactionToFaction);
}

export async function getFactionById(id: string): Promise<IFaction | null> {
  const db = await getDB();
  const result = await db.select<DBFaction[]>(
    "SELECT * FROM factions WHERE id = $1",
    [id]
  );
  return result.length > 0 ? dbFactionToFaction(result[0]) : null;
}

export async function createFaction(
  bookId: string,
  faction: IFaction
): Promise<void> {
  const db = await getDB();
  const dbFaction = factionToDBFaction(bookId, faction);

  await db.execute(
    `INSERT INTO factions (
      id, book_id, name, summary, status, faction_type, image,
      alignment, influence, public_reputation, external_influence,
      government_form, rules_and_laws, important_symbols, main_resources,
      economy, treasures_and_secrets, currencies,
      military_power, political_power, cultural_power, economic_power,
      faction_motto, traditions_and_rituals, beliefs_and_values,
      languages_used, uniform_and_aesthetics, races,
      foundation_date, foundation_history_summary, founders, chronology,
      organization_objectives, narrative_importance, inspirations,
      created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
      $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
      $29, $30, $31, $32, $33, $34, $35, $36
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
      dbFaction.external_influence,
      dbFaction.government_form,
      dbFaction.rules_and_laws,
      dbFaction.important_symbols,
      dbFaction.main_resources,
      dbFaction.economy,
      dbFaction.treasures_and_secrets,
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
      dbFaction.created_at,
    ]
  );
}

export async function updateFaction(
  id: string,
  updates: Partial<IFaction>
): Promise<void> {
  const db = await getDB();

  // Get current faction to preserve book_id
  const current = await db.select<DBFaction[]>(
    "SELECT book_id FROM factions WHERE id = $1",
    [id]
  );

  if (current.length === 0) {
    throw new Error("Faction not found");
  }

  // Build a full faction object from updates
  const fullFaction: IFaction = {
    id,
    bookId: current[0].book_id,
    name: updates.name || "",
    summary: updates.summary || "",
    status: updates.status || "active",
    factionType: updates.factionType || "commercial",
    createdAt: new Date().toISOString(),
    ...updates,
  };

  const dbFaction = factionToDBFaction(current[0].book_id, fullFaction);

  await db.execute(
    `UPDATE factions SET
      name = $1, summary = $2, status = $3, faction_type = $4, image = $5,
      alignment = $6, influence = $7, public_reputation = $8, external_influence = $9,
      government_form = $10, rules_and_laws = $11, important_symbols = $12, main_resources = $13,
      economy = $14, treasures_and_secrets = $15, currencies = $16,
      military_power = $17, political_power = $18, cultural_power = $19, economic_power = $20,
      faction_motto = $21, traditions_and_rituals = $22, beliefs_and_values = $23,
      languages_used = $24, uniform_and_aesthetics = $25, races = $26,
      foundation_date = $27, foundation_history_summary = $28, founders = $29, chronology = $30,
      organization_objectives = $31, narrative_importance = $32, inspirations = $33
    WHERE id = $34`,
    [
      dbFaction.name,
      dbFaction.summary,
      dbFaction.status,
      dbFaction.faction_type,
      dbFaction.image,
      dbFaction.alignment,
      dbFaction.influence,
      dbFaction.public_reputation,
      dbFaction.external_influence,
      dbFaction.government_form,
      dbFaction.rules_and_laws,
      dbFaction.important_symbols,
      dbFaction.main_resources,
      dbFaction.economy,
      dbFaction.treasures_and_secrets,
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
      id,
    ]
  );
}

export async function deleteFaction(id: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM factions WHERE id = $1", [id]);
}

// Version Management Functions
export async function getFactionVersions(
  factionId: string
): Promise<IFactionVersion[]> {
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
}

export async function createFactionVersion(
  factionId: string,
  version: IFactionVersion
): Promise<void> {
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
}

export async function deleteFactionVersion(versionId: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM faction_versions WHERE id = $1", [versionId]);
}

export async function updateFactionVersion(
  versionId: string,
  name: string,
  description?: string
): Promise<void> {
  const db = await getDB();
  await db.execute(
    "UPDATE faction_versions SET name = $1, description = $2 WHERE id = $3",
    [name, description, versionId]
  );
}
