import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export async function getDB(): Promise<Database> {
  if (!db) {
    console.log("[db] Initializing database connection...");
    db = await Database.load("sqlite:grimorium.db");
    console.log("[db] Database connection established!");

    console.log("[db] Running migrations...");
    await runMigrations(db);
    console.log("[db] Migrations completed!");
  }
  return db;
}

async function runMigrations(database: Database): Promise<void> {
  try {
    console.log("[db] Starting schema migrations...");

    const schema = `
    -- LIVROS (PROJETOS)
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      cover_image_path TEXT,
      genre TEXT,
      visual_style TEXT,
      status TEXT DEFAULT 'draft',
      word_count_goal INTEGER,
      current_word_count INTEGER DEFAULT 0,
      author_summary TEXT,
      story_summary TEXT,
      current_arc TEXT,
      chapters INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      last_opened_at INTEGER,

      -- Overview Goals
      words_per_day INTEGER DEFAULT 0,
      chapters_per_week INTEGER DEFAULT 0,

      -- Overview Story Progress
      estimated_arcs INTEGER DEFAULT 0,
      estimated_chapters INTEGER DEFAULT 0,
      completed_arcs INTEGER DEFAULT 0,
      current_arc_progress INTEGER DEFAULT 0,

      -- Overview Sticky Notes (JSON)
      sticky_notes TEXT,

      -- Overview Checklist (JSON)
      checklist_items TEXT,

      -- Overview Sections Configuration (JSON)
      sections_config TEXT
    );

    -- PERSONAGENS
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      age TEXT,
      gender TEXT,
      role TEXT,
      description TEXT,
      image TEXT,
      alignment TEXT,

      -- Aparência
      height TEXT,
      weight TEXT,
      skin_tone TEXT,
      skin_tone_color TEXT,
      physical_type TEXT,
      hair TEXT,
      eyes TEXT,
      face TEXT,
      distinguishing_features TEXT,
      species_and_race TEXT,

      -- Comportamento
      archetype TEXT,
      personality TEXT,
      hobbies TEXT,
      dreams_and_goals TEXT,
      fears_and_traumas TEXT,
      favorite_food TEXT,
      favorite_music TEXT,

      -- Localização
      birth_place TEXT,
      affiliated_place TEXT,
      organization TEXT,

      -- Metadata
      field_visibility TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,

      UNIQUE(book_id, name)
    );

    -- VERSÕES DE PERSONAGENS
    CREATE TABLE IF NOT EXISTS character_versions (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      is_main INTEGER DEFAULT 0,
      character_data TEXT,
      created_at INTEGER NOT NULL
    );

    -- RELACIONAMENTOS
    CREATE TABLE IF NOT EXISTS relationships (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      related_character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      intensity INTEGER DEFAULT 5,
      created_at INTEGER NOT NULL,
      UNIQUE(character_id, related_character_id, type)
    );

    -- RELAÇÕES FAMILIARES
    CREATE TABLE IF NOT EXISTS family_relations (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      related_character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      relation_type TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE(character_id, related_character_id, relation_type)
    );

    -- ITENS
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      status TEXT,
      category TEXT,
      custom_category TEXT,
      basic_description TEXT,
      image TEXT,

      -- Advanced fields
      appearance TEXT,
      origin TEXT,
      alternative_names TEXT,
      story_rarity TEXT,
      narrative_purpose TEXT,
      usage_requirements TEXT,
      usage_consequences TEXT,

      -- Metadata
      field_visibility TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- VERSÕES DE ITENS
    CREATE TABLE IF NOT EXISTS item_versions (
      id TEXT PRIMARY KEY,
      item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      is_main INTEGER DEFAULT 0,
      item_data TEXT,
      created_at INTEGER NOT NULL
    );

    -- ÍNDICES
    CREATE INDEX IF NOT EXISTS idx_characters_book_id ON characters(book_id);
    CREATE INDEX IF NOT EXISTS idx_character_versions_character_id ON character_versions(character_id);
    CREATE INDEX IF NOT EXISTS idx_relationships_character ON relationships(character_id);
    CREATE INDEX IF NOT EXISTS idx_relationships_related ON relationships(related_character_id);
    CREATE INDEX IF NOT EXISTS idx_family_character ON family_relations(character_id);
    CREATE INDEX IF NOT EXISTS idx_family_related ON family_relations(related_character_id);
    CREATE INDEX IF NOT EXISTS idx_books_last_opened ON books(last_opened_at DESC);
    CREATE INDEX IF NOT EXISTS idx_items_book_id ON items(book_id);
    CREATE INDEX IF NOT EXISTS idx_item_versions_item_id ON item_versions(item_id);
  `;

    await database.execute(schema);
    console.log("[db] Schema migrations executed successfully");

    // Verify books table exists and log count
    const result = await database.select<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM books"
    );
    console.log(
      "[db] Books table verified. Current row count:",
      result[0]?.count || 0
    );
  } catch (error) {
    console.error("[db] Error during migrations:", error);
    throw error;
  }
}

export async function closeDB(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
