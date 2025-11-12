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
      race_views TEXT,
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
      diet TEXT,
      elemental_diet TEXT,
      communication TEXT,
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
      external_influence TEXT,

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
      region_id TEXT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
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

      if (tableInfo.length > 0 && tableInfo[0].sql.includes('region_id TEXT NOT NULL UNIQUE')) {
        console.log("[db] Migrating region_maps table to support version_id...");

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
        await database.execute("ALTER TABLE region_maps_new RENAME TO region_maps");

        // Recreate index
        await database.execute("CREATE INDEX IF NOT EXISTS idx_region_maps_region_id ON region_maps(region_id)");

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

      if (markersTableInfo.length > 0 && !markersTableInfo[0].sql.includes('map_id')) {
        console.log("[db] Migrating region_map_markers to link to specific maps...");

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
          INSERT INTO region_map_markers_new (id, map_id, parent_region_id, child_region_id, position_x, position_y, color, show_label, created_at, updated_at)
          SELECT m.id, rm.id, m.parent_region_id, m.child_region_id, m.position_x, m.position_y, m.color, m.show_label, m.created_at, m.updated_at
          FROM region_map_markers m
          JOIN region_maps rm ON rm.region_id = m.parent_region_id AND rm.version_id IS NULL
        `);

        // Drop old table
        await database.execute("DROP TABLE region_map_markers");

        // Rename new table
        await database.execute("ALTER TABLE region_map_markers_new RENAME TO region_map_markers");

        // Recreate indexes
        await database.execute("CREATE INDEX IF NOT EXISTS idx_region_map_markers_map ON region_map_markers(map_id)");
        await database.execute("CREATE INDEX IF NOT EXISTS idx_region_map_markers_parent ON region_map_markers(parent_region_id)");
        await database.execute("CREATE INDEX IF NOT EXISTS idx_region_map_markers_child ON region_map_markers(child_region_id)");

        console.log("[db] Successfully migrated region_map_markers table");
      } else {
        console.log("[db] region_map_markers table already has correct schema");
      }
    } catch (error) {
      console.log("[db] Markers migration error or already migrated:", error);
    }

    // Add advanced fields to regions table
    // Environment fields
    const environmentFields = [
      "climate TEXT",
      "current_season TEXT",
      "custom_season_name TEXT",
      "general_description TEXT",
      "region_anomalies TEXT"
    ];

    for (const field of environmentFields) {
      try {
        const [columnName] = field.split(' ');
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
      "items_found TEXT"
    ];

    for (const field of informationFields) {
      try {
        const [columnName] = field.split(' ');
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
      "inspirations TEXT"
    ];

    for (const field of narrativeFields) {
      try {
        const [columnName] = field.split(' ');
        await database.execute(`ALTER TABLE regions ADD COLUMN ${field}`);
        console.log(`[db] Added ${columnName} column to regions table`);
      } catch (error) {
        // Column already exists - safe to ignore
      }
    }

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
