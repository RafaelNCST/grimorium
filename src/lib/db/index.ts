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
      status TEXT,

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

      -- História
      birth_place TEXT,
      affiliated_place TEXT,
      organization TEXT,
      nicknames TEXT,
      past TEXT,

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

    -- GRUPOS DE RAÇAS
    CREATE TABLE IF NOT EXISTS race_groups (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- RAÇAS
    CREATE TABLE IF NOT EXISTS races (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      group_id TEXT REFERENCES race_groups(id) ON DELETE SET NULL,

      -- Basic required fields
      name TEXT NOT NULL,
      domain TEXT NOT NULL,
      summary TEXT NOT NULL,

      -- Optional basic fields
      image TEXT,
      scientific_name TEXT,

      -- Culture and Myths
      alternative_names TEXT,
      cultural_notes TEXT,

      -- Appearance and Characteristics
      general_appearance TEXT,
      life_expectancy TEXT,
      average_height TEXT,
      average_weight TEXT,
      special_physical_characteristics TEXT,

      -- Behaviors
      habits TEXT,
      reproductive_cycle TEXT,
      other_reproductive_cycle_description TEXT,
      diet TEXT,
      elemental_diet TEXT,
      communication TEXT,
      other_communication TEXT,
      moral_tendency TEXT,
      social_organization TEXT,
      habitat TEXT,

      -- Power
      physical_capacity TEXT,
      special_characteristics TEXT,
      weaknesses TEXT,

      -- Narrative
      story_motivation TEXT,
      inspirations TEXT,

      -- Metadata
      field_visibility TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- VERSÕES DE RAÇAS
    CREATE TABLE IF NOT EXISTS race_versions (
      id TEXT PRIMARY KEY,
      race_id TEXT NOT NULL REFERENCES races(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      is_main INTEGER DEFAULT 0,
      race_data TEXT,
      created_at INTEGER NOT NULL
    );

    -- RELACIONAMENTOS ENTRE RAÇAS
    CREATE TABLE IF NOT EXISTS race_relationships (
      id TEXT PRIMARY KEY,
      race_id TEXT NOT NULL REFERENCES races(id) ON DELETE CASCADE,
      related_race_id TEXT NOT NULL REFERENCES races(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE(race_id, related_race_id, type)
    );

    -- FACÇÕES/ORGANIZAÇÕES
    CREATE TABLE IF NOT EXISTS factions (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      summary TEXT NOT NULL,
      status TEXT NOT NULL,
      faction_type TEXT NOT NULL,
      image TEXT,

      -- Advanced fields - Alignment
      alignment TEXT,

      -- Advanced fields - Relationships
      influence TEXT,
      public_reputation TEXT,

      -- Advanced fields - Territory
      dominated_areas TEXT,
      main_base TEXT,
      areas_of_interest TEXT,

      -- Advanced fields - Internal Structure
      government_form TEXT,
      rules_and_laws TEXT,
      important_symbols TEXT,
      main_resources TEXT,
      economy TEXT,
      treasures_and_secrets TEXT,
      currencies TEXT,

      -- Advanced fields - Power (1-10 scale)
      military_power INTEGER,
      political_power INTEGER,
      cultural_power INTEGER,
      economic_power INTEGER,

      -- Advanced fields - Culture
      faction_motto TEXT,
      traditions_and_rituals TEXT,
      beliefs_and_values TEXT,
      languages_used TEXT,
      uniform_and_aesthetics TEXT,
      races TEXT,

      -- Advanced fields - History
      foundation_date TEXT,
      foundation_history_summary TEXT,
      founders TEXT,
      chronology TEXT,

      -- Advanced fields - Narrative
      organization_objectives TEXT,
      narrative_importance TEXT,
      inspirations TEXT,

      -- Metadata
      created_at INTEGER NOT NULL
    );

    -- VERSÕES DE FACÇÕES
    CREATE TABLE IF NOT EXISTS faction_versions (
      id TEXT PRIMARY KEY,
      faction_id TEXT NOT NULL REFERENCES factions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      is_main INTEGER DEFAULT 0,
      faction_data TEXT,
      created_at INTEGER NOT NULL
    );

    -- ARCOS NARRATIVOS
    CREATE TABLE IF NOT EXISTS plot_arcs (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      size TEXT NOT NULL,
      focus TEXT NOT NULL,
      description TEXT NOT NULL,
      progress REAL DEFAULT 0,
      status TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      important_characters TEXT,
      important_factions TEXT,
      important_items TEXT,
      important_regions TEXT,
      arc_message TEXT,
      world_impact TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- EVENTOS DO ARCO
    CREATE TABLE IF NOT EXISTS plot_events (
      id TEXT PRIMARY KEY,
      arc_id TEXT NOT NULL REFERENCES plot_arcs(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    -- SISTEMAS DE PODER
    CREATE TABLE IF NOT EXISTS power_systems (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- GRUPOS DE PÁGINAS DE PODER
    CREATE TABLE IF NOT EXISTS power_groups (
      id TEXT PRIMARY KEY,
      system_id TEXT NOT NULL REFERENCES power_systems(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    -- PÁGINAS DE PODER
    CREATE TABLE IF NOT EXISTS power_pages (
      id TEXT PRIMARY KEY,
      system_id TEXT NOT NULL REFERENCES power_systems(id) ON DELETE CASCADE,
      group_id TEXT REFERENCES power_groups(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- SEÇÕES DE PÁGINAS DE PODER
    CREATE TABLE IF NOT EXISTS power_sections (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL REFERENCES power_pages(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      collapsed INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- BLOCOS DE CONTEÚDO DE PODER
    CREATE TABLE IF NOT EXISTS power_blocks (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL REFERENCES power_sections(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      content_json TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- LINKS DE PODER PARA PERSONAGENS
    CREATE TABLE IF NOT EXISTS power_character_links (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      page_id TEXT REFERENCES power_pages(id) ON DELETE CASCADE,
      section_id TEXT REFERENCES power_sections(id) ON DELETE CASCADE,
      custom_label TEXT,
      created_at INTEGER NOT NULL,
      CHECK ((page_id IS NOT NULL AND section_id IS NULL) OR (page_id IS NULL AND section_id IS NOT NULL)),
      UNIQUE(character_id, page_id),
      UNIQUE(character_id, section_id)
    );

    -- REGIÕES (MUNDO)
    CREATE TABLE IF NOT EXISTS regions (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL,
      name TEXT NOT NULL,
      parent_id TEXT,
      scale TEXT NOT NULL,
      summary TEXT,
      image TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES regions(id) ON DELETE SET NULL
    );

    -- VERSÕES DE REGIÕES
    CREATE TABLE IF NOT EXISTS region_versions (
      id TEXT PRIMARY KEY,
      region_id TEXT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      is_main INTEGER DEFAULT 0,
      region_data TEXT,
      created_at TEXT NOT NULL
    );

    -- LINHA DO TEMPO DE REGIÕES - ERAS
    CREATE TABLE IF NOT EXISTS region_timeline_eras (
      id TEXT PRIMARY KEY,
      region_id TEXT NOT NULL REFERENCES region_versions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL
    );

    -- LINHA DO TEMPO DE REGIÕES - EVENTOS
    CREATE TABLE IF NOT EXISTS region_timeline_events (
      id TEXT PRIMARY KEY,
      era_id TEXT NOT NULL REFERENCES region_timeline_eras(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      short_description TEXT,
      reason TEXT,
      outcome TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      characters_involved TEXT,
      factions_involved TEXT,
      races_involved TEXT,
      items_involved TEXT
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
    CREATE INDEX IF NOT EXISTS idx_race_groups_book_id ON race_groups(book_id);
    CREATE INDEX IF NOT EXISTS idx_race_groups_order ON race_groups(book_id, order_index);
    CREATE INDEX IF NOT EXISTS idx_races_book_id ON races(book_id);
    CREATE INDEX IF NOT EXISTS idx_races_group_id ON races(group_id);
    CREATE INDEX IF NOT EXISTS idx_race_versions_race_id ON race_versions(race_id);
    CREATE INDEX IF NOT EXISTS idx_race_relationships_race ON race_relationships(race_id);
    CREATE INDEX IF NOT EXISTS idx_race_relationships_related ON race_relationships(related_race_id);
    CREATE INDEX IF NOT EXISTS idx_factions_book_id ON factions(book_id);
    CREATE INDEX IF NOT EXISTS idx_faction_versions_faction_id ON faction_versions(faction_id);
    CREATE INDEX IF NOT EXISTS idx_plot_arcs_book_id ON plot_arcs(book_id);
    CREATE INDEX IF NOT EXISTS idx_plot_arcs_order ON plot_arcs(book_id, order_index);
    CREATE INDEX IF NOT EXISTS idx_plot_events_arc_id ON plot_events(arc_id);
    CREATE INDEX IF NOT EXISTS idx_plot_events_order ON plot_events(arc_id, order_index);
    CREATE INDEX IF NOT EXISTS idx_power_systems_book_id ON power_systems(book_id);
    CREATE INDEX IF NOT EXISTS idx_power_groups_system_id ON power_groups(system_id);
    CREATE INDEX IF NOT EXISTS idx_power_groups_order ON power_groups(system_id, order_index);
    CREATE INDEX IF NOT EXISTS idx_power_pages_system_id ON power_pages(system_id);
    CREATE INDEX IF NOT EXISTS idx_power_pages_group_id ON power_pages(group_id);
    CREATE INDEX IF NOT EXISTS idx_power_pages_order ON power_pages(system_id, order_index);
    CREATE INDEX IF NOT EXISTS idx_power_sections_page_id ON power_sections(page_id);
    CREATE INDEX IF NOT EXISTS idx_power_sections_order ON power_sections(page_id, order_index);
    CREATE INDEX IF NOT EXISTS idx_power_blocks_section_id ON power_blocks(section_id);
    CREATE INDEX IF NOT EXISTS idx_power_blocks_order ON power_blocks(section_id, order_index);
    CREATE INDEX IF NOT EXISTS idx_power_links_character ON power_character_links(character_id);
    CREATE INDEX IF NOT EXISTS idx_power_links_page ON power_character_links(page_id);
    CREATE INDEX IF NOT EXISTS idx_power_links_section ON power_character_links(section_id);
    CREATE INDEX IF NOT EXISTS idx_regions_book_id ON regions(book_id);
    CREATE INDEX IF NOT EXISTS idx_regions_parent_id ON regions(parent_id);
    CREATE INDEX IF NOT EXISTS idx_region_versions_region_id ON region_versions(region_id);
    CREATE INDEX IF NOT EXISTS idx_region_timeline_eras_region_id ON region_timeline_eras(region_id);
    CREATE INDEX IF NOT EXISTS idx_region_timeline_events_era_id ON region_timeline_events(era_id);

    -- MAPAS DE REGIÕES
    CREATE TABLE IF NOT EXISTS region_maps (
      id TEXT PRIMARY KEY,
      region_id TEXT NOT NULL,
      version_id TEXT,
      image_path TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE,
      FOREIGN KEY (version_id) REFERENCES region_versions(id) ON DELETE CASCADE,
      UNIQUE(region_id, version_id)
    );

    -- MARCADORES DE MAPAS DE REGIÕES
    CREATE TABLE IF NOT EXISTS region_map_markers (
      id TEXT PRIMARY KEY,
      map_id TEXT NOT NULL,
      parent_region_id TEXT NOT NULL,
      child_region_id TEXT NOT NULL,
      position_x INTEGER NOT NULL,
      position_y INTEGER NOT NULL,
      color TEXT DEFAULT '#8b5cf6',
      show_label INTEGER DEFAULT 1,
      scale REAL DEFAULT 1.0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (map_id) REFERENCES region_maps(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_region_id) REFERENCES regions(id) ON DELETE CASCADE,
      FOREIGN KEY (child_region_id) REFERENCES regions(id) ON DELETE CASCADE,
      UNIQUE(map_id, child_region_id)
    );

    -- ÍNDICES PARA MAPAS
    CREATE INDEX IF NOT EXISTS idx_region_maps_region_id ON region_maps(region_id);
    CREATE INDEX IF NOT EXISTS idx_region_map_markers_map ON region_map_markers(map_id);
    CREATE INDEX IF NOT EXISTS idx_region_map_markers_parent ON region_map_markers(parent_region_id);
    CREATE INDEX IF NOT EXISTS idx_region_map_markers_child ON region_map_markers(child_region_id);

    -- NOTAS/ANOTAÇÕES
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      content TEXT,
      paper_mode TEXT DEFAULT 'light',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- LINKS DE NOTAS PARA ENTIDADES
    CREATE TABLE IF NOT EXISTS note_links (
      id TEXT PRIMARY KEY,
      note_id TEXT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
      entity_id TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_name TEXT,
      book_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE(note_id, entity_id, entity_type)
    );

    -- ÍNDICES PARA NOTAS
    CREATE INDEX IF NOT EXISTS idx_note_links_note ON note_links(note_id);
    CREATE INDEX IF NOT EXISTS idx_note_links_entity ON note_links(entity_id, entity_type);
  `;

    await database.execute(schema);
    console.log("[db] Schema migrations executed successfully");

    // Add important_items column to plot_arcs if it doesn't exist
    try {
      await database.execute(
        "ALTER TABLE plot_arcs ADD COLUMN important_items TEXT"
      );
      console.log("[db] Added important_items column to plot_arcs table");
    } catch (error) {
      // Column already exists or other error - safe to ignore
      console.log(
        "[db] important_items column already exists or error:",
        error
      );
    }

    // Add important_regions column to plot_arcs if it doesn't exist
    try {
      await database.execute(
        "ALTER TABLE plot_arcs ADD COLUMN important_regions TEXT"
      );
      console.log("[db] Added important_regions column to plot_arcs table");
    } catch (error) {
      // Column already exists or other error - safe to ignore
      console.log(
        "[db] important_regions column already exists or error:",
        error
      );
    }

    // Add icon_image column to power_systems if it doesn't exist
    try {
      await database.execute(
        "ALTER TABLE power_systems ADD COLUMN icon_image TEXT"
      );
      console.log("[db] Added icon_image column to power_systems table");
    } catch (error) {
      // Column already exists or other error - safe to ignore
      console.log("[db] icon_image column already exists or error:", error);
    }

    // Add color column to region_map_markers if it doesn't exist
    try {
      await database.execute(
        "ALTER TABLE region_map_markers ADD COLUMN color TEXT DEFAULT '#8b5cf6'"
      );
      console.log("[db] Added color column to region_map_markers table");
    } catch (error) {
      // Column already exists or other error - safe to ignore
      console.log("[db] color column already exists or error:", error);
    }

    // Add show_label column to region_map_markers if it doesn't exist
    try {
      await database.execute(
        "ALTER TABLE region_map_markers ADD COLUMN show_label INTEGER DEFAULT 1"
      );
      console.log("[db] Added show_label column to region_map_markers table");
    } catch (error) {
      // Column already exists or other error - safe to ignore
      console.log("[db] show_label column already exists or error:", error);
    }

    // Add order_index column to regions if it doesn't exist
    try {
      await database.execute(
        "ALTER TABLE regions ADD COLUMN order_index INTEGER NOT NULL DEFAULT 0"
      );
      console.log("[db] Added order_index column to regions table");
    } catch (error) {
      // Column already exists or other error - safe to ignore
      console.log("[db] order_index column already exists or error:", error);
    }

    // Add version_id column to region_maps if it doesn't exist
    try {
      await database.execute(
        "ALTER TABLE region_maps ADD COLUMN version_id TEXT"
      );
      console.log("[db] Added version_id column to region_maps table");
    } catch (error) {
      // Column already exists or other error - safe to ignore
      console.log("[db] version_id column already exists or error:", error);
    }

    // Migrate region_maps table to support version_id with correct constraints
    try {
      // Check if we need to migrate by checking if the old constraint exists
      const tableInfo = await database.select<Array<{ sql: string }>>(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name='region_maps'"
      );

      if (
        tableInfo.length > 0 &&
        tableInfo[0].sql.includes("region_id TEXT NOT NULL UNIQUE")
      ) {
        console.log(
          "[db] Migrating region_maps table to support version_id..."
        );

        // Create new table with correct schema
        await database.execute(`
          CREATE TABLE region_maps_new (
            id TEXT PRIMARY KEY,
            region_id TEXT NOT NULL,
            version_id TEXT,
            image_path TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE,
            FOREIGN KEY (version_id) REFERENCES region_versions(id) ON DELETE CASCADE,
            UNIQUE(region_id, version_id)
          )
        `);

        // Copy existing data (set version_id to NULL for existing maps)
        await database.execute(`
          INSERT INTO region_maps_new (id, region_id, version_id, image_path, created_at, updated_at)
          SELECT id, region_id, NULL, image_path, created_at, updated_at
          FROM region_maps
        `);

        // Drop old table
        await database.execute("DROP TABLE region_maps");

        // Rename new table
        await database.execute(
          "ALTER TABLE region_maps_new RENAME TO region_maps"
        );

        // Recreate index
        await database.execute(
          "CREATE INDEX IF NOT EXISTS idx_region_maps_region_id ON region_maps(region_id)"
        );

        console.log("[db] Successfully migrated region_maps table");
      } else {
        console.log("[db] region_maps table already has correct schema");
      }
    } catch (error) {
      console.log("[db] Migration error or already migrated:", error);
    }

    // Migrate region_map_markers to link to specific maps (version-specific)
    try {
      const markersTableInfo = await database.select<Array<{ sql: string }>>(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name='region_map_markers'"
      );

      if (
        markersTableInfo.length > 0 &&
        !markersTableInfo[0].sql.includes("map_id")
      ) {
        console.log(
          "[db] Migrating region_map_markers to link to specific maps..."
        );

        // Create new table with map_id
        await database.execute(`
          CREATE TABLE region_map_markers_new (
            id TEXT PRIMARY KEY,
            map_id TEXT NOT NULL,
            parent_region_id TEXT NOT NULL,
            child_region_id TEXT NOT NULL,
            position_x INTEGER NOT NULL,
            position_y INTEGER NOT NULL,
            color TEXT DEFAULT '#8b5cf6',
            show_label INTEGER DEFAULT 1,
            scale REAL DEFAULT 1.0,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            FOREIGN KEY (map_id) REFERENCES region_maps(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_region_id) REFERENCES regions(id) ON DELETE CASCADE,
            FOREIGN KEY (child_region_id) REFERENCES regions(id) ON DELETE CASCADE,
            UNIQUE(map_id, child_region_id)
          )
        `);

        // Copy existing markers, linking them to main version maps (version_id = NULL)
        await database.execute(`
          INSERT INTO region_map_markers_new (id, map_id, parent_region_id, child_region_id, position_x, position_y, color, show_label, scale, created_at, updated_at)
          SELECT m.id, rm.id, m.parent_region_id, m.child_region_id, m.position_x, m.position_y, m.color, m.show_label, 1.0, m.created_at, m.updated_at
          FROM region_map_markers m
          JOIN region_maps rm ON rm.region_id = m.parent_region_id AND rm.version_id IS NULL
        `);

        // Drop old table
        await database.execute("DROP TABLE region_map_markers");

        // Rename new table
        await database.execute(
          "ALTER TABLE region_map_markers_new RENAME TO region_map_markers"
        );

        // Recreate indexes
        await database.execute(
          "CREATE INDEX IF NOT EXISTS idx_region_map_markers_map ON region_map_markers(map_id)"
        );
        await database.execute(
          "CREATE INDEX IF NOT EXISTS idx_region_map_markers_parent ON region_map_markers(parent_region_id)"
        );
        await database.execute(
          "CREATE INDEX IF NOT EXISTS idx_region_map_markers_child ON region_map_markers(child_region_id)"
        );

        console.log("[db] Successfully migrated region_map_markers table");
      } else {
        console.log("[db] region_map_markers table already has correct schema");
      }
    } catch (error) {
      console.log("[db] Markers migration error or already migrated:", error);
    }

    // Add scale column to region_map_markers table
    try {
      await database.execute(
        "ALTER TABLE region_map_markers ADD COLUMN scale REAL DEFAULT 1.0"
      );
      console.log("[db] Added scale column to region_map_markers table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add status column to characters table
    try {
      await database.execute(
        "ALTER TABLE characters ADD COLUMN status TEXT"
      );
      console.log("[db] Added status column to characters table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add nicknames column to characters table
    try {
      await database.execute(
        "ALTER TABLE characters ADD COLUMN nicknames TEXT"
      );
      console.log("[db] Added nicknames column to characters table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add past column to characters table
    try {
      await database.execute(
        "ALTER TABLE characters ADD COLUMN past TEXT"
      );
      console.log("[db] Added past column to characters table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add other_reproductive_cycle_description column to races table
    try {
      await database.execute(
        "ALTER TABLE races ADD COLUMN other_reproductive_cycle_description TEXT"
      );
      console.log("[db] Added other_reproductive_cycle_description column to races table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add other_communication column to races table
    try {
      await database.execute(
        "ALTER TABLE races ADD COLUMN other_communication TEXT"
      );
      console.log("[db] Added other_communication column to races table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add item_usage column to items table
    try {
      await database.execute(
        "ALTER TABLE items ADD COLUMN item_usage TEXT"
      );
      console.log("[db] Added item_usage column to items table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add advanced fields to regions table
    // Environment fields
    const environmentFields = [
      "climate TEXT",
      "current_season TEXT",
      "custom_season_name TEXT",
      "general_description TEXT",
      "region_anomalies TEXT",
    ];

    for (const field of environmentFields) {
      try {
        const [columnName] = field.split(" ");
        await database.execute(`ALTER TABLE regions ADD COLUMN ${field}`);
        console.log(`[db] Added ${columnName} column to regions table`);
      } catch (error) {
        // Column already exists - safe to ignore
      }
    }

    // Information fields
    const informationFields = [
      "resident_factions TEXT",
      "dominant_factions TEXT",
      "important_characters TEXT",
      "races_found TEXT",
      "items_found TEXT",
    ];

    for (const field of informationFields) {
      try {
        const [columnName] = field.split(" ");
        await database.execute(`ALTER TABLE regions ADD COLUMN ${field}`);
        console.log(`[db] Added ${columnName} column to regions table`);
      } catch (error) {
        // Column already exists - safe to ignore
      }
    }

    // Narrative fields
    const narrativeFields = [
      "narrative_purpose TEXT",
      "unique_characteristics TEXT",
      "political_importance TEXT",
      "religious_importance TEXT",
      "world_perception TEXT",
      "region_mysteries TEXT",
      "inspirations TEXT",
    ];

    for (const field of narrativeFields) {
      try {
        const [columnName] = field.split(" ");
        await database.execute(`ALTER TABLE regions ADD COLUMN ${field}`);
        console.log(`[db] Added ${columnName} column to regions table`);
      } catch (error) {
        // Column already exists - safe to ignore
      }
    }

    // Add visibility configuration fields to regions table
    try {
      await database.execute(
        "ALTER TABLE regions ADD COLUMN field_visibility TEXT"
      );
      console.log("[db] Added field_visibility column to regions table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    try {
      await database.execute(
        "ALTER TABLE regions ADD COLUMN section_visibility TEXT"
      );
      console.log("[db] Added section_visibility column to regions table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Migrate region_timeline_eras to reference region_versions instead of regions
    try {
      const timelineTableInfo = await database.select<Array<{ sql: string }>>(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name='region_timeline_eras'"
      );

      if (
        timelineTableInfo.length > 0 &&
        timelineTableInfo[0].sql.includes("REFERENCES regions(id)")
      ) {
        console.log(
          "[db] Migrating region_timeline_eras to reference region_versions..."
        );

        // Create new table with correct foreign key
        await database.execute(`
          CREATE TABLE region_timeline_eras_new (
            id TEXT PRIMARY KEY,
            region_id TEXT NOT NULL REFERENCES region_versions(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL
          )
        `);

        // Copy existing eras data - link to main version of each region
        // We need to find the main version for each region_id in the old table
        await database.execute(`
          INSERT INTO region_timeline_eras_new (id, region_id, name, description, start_date, end_date)
          SELECT e.id, v.id, e.name, e.description, e.start_date, e.end_date
          FROM region_timeline_eras e
          JOIN region_versions v ON v.region_id = e.region_id AND v.is_main = 1
        `);

        // Drop old table (events will be cascade deleted, so we need to handle them separately)
        // First, backup events data
        await database.execute(`
          CREATE TABLE region_timeline_events_backup AS
          SELECT * FROM region_timeline_events
        `);

        await database.execute("DROP TABLE region_timeline_eras");

        // Rename new table
        await database.execute(
          "ALTER TABLE region_timeline_eras_new RENAME TO region_timeline_eras"
        );

        // Recreate events table (it was cascade deleted)
        await database.execute(`
          CREATE TABLE region_timeline_events (
            id TEXT PRIMARY KEY,
            era_id TEXT NOT NULL REFERENCES region_timeline_eras(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT,
            short_description TEXT,
            reason TEXT,
            outcome TEXT,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            characters_involved TEXT,
            factions_involved TEXT,
            races_involved TEXT,
            items_involved TEXT
          )
        `);

        // Restore events data
        await database.execute(`
          INSERT INTO region_timeline_events
          SELECT * FROM region_timeline_events_backup
        `);

        // Drop backup table
        await database.execute("DROP TABLE region_timeline_events_backup");

        // Recreate indexes
        await database.execute(
          "CREATE INDEX IF NOT EXISTS idx_region_timeline_eras_region_id ON region_timeline_eras(region_id)"
        );
        await database.execute(
          "CREATE INDEX IF NOT EXISTS idx_region_timeline_events_era_id ON region_timeline_events(era_id)"
        );

        console.log("[db] Successfully migrated region_timeline_eras table");
      } else {
        console.log(
          "[db] region_timeline_eras table already has correct schema"
        );
      }
    } catch (error) {
      console.log("[db] Timeline migration error or already migrated:", error);
    }

    // Add description column to race_relationships table
    try {
      await database.execute(
        "ALTER TABLE race_relationships ADD COLUMN description TEXT"
      );
      console.log("[db] Added description column to race_relationships table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Remove race_views column from races table (no longer needed)
    try {
      // Check if column exists before trying to remove it
      const tableInfo = await database.select<Array<{ name: string }>>(
        "PRAGMA table_info(races)"
      );
      const hasRaceViews = tableInfo.some((col) => col.name === "race_views");

      if (hasRaceViews) {
        // SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
        // Create a backup
        await database.execute(`
          CREATE TABLE races_backup AS SELECT * FROM races
        `);

        // Drop the old table
        await database.execute("DROP TABLE races");

        // Recreate without race_views column
        await database.execute(`
          CREATE TABLE races (
            id TEXT PRIMARY KEY,
            book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
            group_id TEXT REFERENCES race_groups(id) ON DELETE SET NULL,
            name TEXT NOT NULL,
            domain TEXT NOT NULL,
            summary TEXT NOT NULL,
            image TEXT,
            scientific_name TEXT,
            alternative_names TEXT,
            cultural_notes TEXT,
            general_appearance TEXT,
            life_expectancy TEXT,
            average_height TEXT,
            average_weight TEXT,
            special_physical_characteristics TEXT,
            habits TEXT,
            reproductive_cycle TEXT,
            other_reproductive_cycle_description TEXT,
            diet TEXT,
            elemental_diet TEXT,
            communication TEXT,
            other_communication TEXT,
            moral_tendency TEXT,
            social_organization TEXT,
            habitat TEXT,
            physical_capacity TEXT,
            special_characteristics TEXT,
            weaknesses TEXT,
            story_motivation TEXT,
            inspirations TEXT,
            field_visibility TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
          )
        `);

        // Copy data back (excluding race_views)
        await database.execute(`
          INSERT INTO races SELECT
            id, book_id, group_id, name, domain, summary, image, scientific_name,
            alternative_names, cultural_notes, general_appearance, life_expectancy,
            average_height, average_weight, special_physical_characteristics,
            habits, reproductive_cycle, other_reproductive_cycle_description,
            diet, elemental_diet, communication, other_communication,
            moral_tendency, social_organization, habitat, physical_capacity,
            special_characteristics, weaknesses, story_motivation, inspirations,
            field_visibility, created_at, updated_at
          FROM races_backup
        `);

        // Drop backup
        await database.execute("DROP TABLE races_backup");

        // Recreate indexes
        await database.execute("CREATE INDEX IF NOT EXISTS idx_races_book_id ON races(book_id)");
        await database.execute("CREATE INDEX IF NOT EXISTS idx_races_group_id ON races(group_id)");

        console.log("[db] Removed race_views column from races table");
      } else {
        console.log("[db] race_views column already removed or never existed");
      }
    } catch (error) {
      console.log("[db] Error removing race_views column:", error);
    }

    // Add symbols_and_secrets column to factions table (replacing important_symbols and treasures_and_secrets)
    try {
      await database.execute(
        "ALTER TABLE factions ADD COLUMN symbols_and_secrets TEXT"
      );
      console.log("[db] Added symbols_and_secrets column to factions table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add timeline column to factions table (JSON array of IFactionTimelineEra)
    try {
      await database.execute(
        "ALTER TABLE factions ADD COLUMN timeline TEXT"
      );
      console.log("[db] Added timeline column to factions table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add diplomatic_relations column to factions table (JSON array of IDiplomaticRelation)
    try {
      await database.execute(
        "ALTER TABLE factions ADD COLUMN diplomatic_relations TEXT"
      );
      console.log("[db] Added diplomatic_relations column to factions table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add hierarchy column to factions table (JSON array of IHierarchyTitle)
    try {
      await database.execute(
        "ALTER TABLE factions ADD COLUMN hierarchy TEXT"
      );
      console.log("[db] Added hierarchy column to factions table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add ui_state column to factions table (JSON object for UI state persistence)
    try {
      await database.execute(
        "ALTER TABLE factions ADD COLUMN ui_state TEXT"
      );
      console.log("[db] Added ui_state column to factions table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Add territory columns to factions table
    try {
      await database.execute(
        "ALTER TABLE factions ADD COLUMN dominated_areas TEXT"
      );
      console.log("[db] Added dominated_areas column to factions table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    try {
      await database.execute(
        "ALTER TABLE factions ADD COLUMN main_base TEXT"
      );
      console.log("[db] Added main_base column to factions table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    try {
      await database.execute(
        "ALTER TABLE factions ADD COLUMN areas_of_interest TEXT"
      );
      console.log("[db] Added areas_of_interest column to factions table");
    } catch (error) {
      // Column already exists - safe to ignore
    }

    // Verify books table exists and log count
    const result = await database.select<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM books"
    );
    console.log(
      "[db] Books table verified. Current row count:",
      result[0]?.count || 0
    );

    // Migrate book genres to new format (english lowercase)
    await migrateBookGenres(database);
  } catch (error) {
    console.error("[db] Error during migrations:", error);
    throw error;
  }
}

// Migration: Convert old genre formats to new standardized format (english, lowercase)
async function migrateBookGenres(database: Database): Promise<void> {
  // Mapping of old genre values to new standardized IDs
  const genreMapping: Record<string, string> = {
    // Portuguese translations
    "urbano": "urban",
    "fantasia": "fantasy",
    "futurístico": "futuristic",
    "futuristico": "futuristic",
    "cyberpunk": "cyberpunk",
    "alta fantasia": "high_fantasy",
    "romance": "romance",
    "mistério": "mystery",
    "misterio": "mystery",
    "terror": "horror",
    "suspense": "suspense",
    "drama": "drama",
    "ficção científica": "sci_fi",
    "ficcao cientifica": "sci_fi",
    "ficção cientifica": "sci_fi",
    "histórico": "historical",
    "historico": "historical",
    "ação": "action",
    "acao": "action",
    "aventura": "adventure",
    "litrpg": "litrpg",
    // English translations (various capitalizations)
    "urban": "urban",
    "fantasy": "fantasy",
    "futuristic": "futuristic",
    "high fantasy": "high_fantasy",
    "high_fantasy": "high_fantasy",
    "mystery": "mystery",
    "horror": "horror",
    "sci-fi": "sci_fi",
    "sci_fi": "sci_fi",
    "scifi": "sci_fi",
    "historical": "historical",
    "action": "action",
    "adventure": "adventure",
  };

  try {
    // Get all books with their genres
    const books = await database.select<Array<{ id: string; genre: string }>>(
      "SELECT id, genre FROM books WHERE genre IS NOT NULL"
    );

    let migratedCount = 0;

    for (const book of books) {
      if (!book.genre) continue;

      try {
        const genres: string[] = JSON.parse(book.genre);
        let needsMigration = false;
        const newGenres: string[] = [];

        for (const genre of genres) {
          const normalizedGenre = genre.toLowerCase().trim();
          const mappedGenre = genreMapping[normalizedGenre];

          if (mappedGenre) {
            // Genre needs migration
            if (mappedGenre !== genre) {
              needsMigration = true;
            }
            newGenres.push(mappedGenre);
          } else {
            // Unknown genre, keep as-is but lowercase
            const lowercaseGenre = normalizedGenre.replace(/\s+/g, "_");
            if (lowercaseGenre !== genre) {
              needsMigration = true;
            }
            newGenres.push(lowercaseGenre);
          }
        }

        if (needsMigration) {
          await database.execute(
            "UPDATE books SET genre = $1 WHERE id = $2",
            [JSON.stringify(newGenres), book.id]
          );
          migratedCount++;
          console.log(`[db] Migrated genres for book ${book.id}: ${genres.join(", ")} -> ${newGenres.join(", ")}`);
        }
      } catch (parseError) {
        console.warn(`[db] Could not parse genres for book ${book.id}:`, parseError);
      }
    }

    if (migratedCount > 0) {
      console.log(`[db] Genre migration completed. Migrated ${migratedCount} books.`);
    } else {
      console.log("[db] No books needed genre migration.");
    }
  } catch (error) {
    console.error("[db] Error during genre migration:", error);
    // Don't throw - this is a non-critical migration
  }
}

export async function closeDB(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
