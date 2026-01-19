-- Migration: Remove deprecated and unused database fields
-- Date: 2026-01-18
-- Purpose: Clean up database schema by removing fields that are no longer used

-- ============================================
-- BOOKS TABLE
-- ============================================
-- Remove unused fields that were never read by the application
-- Fields: subtitle, description, word_count_goal, current_word_count

-- SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
-- Step 1: Create new books table without deprecated fields
CREATE TABLE books_new (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  cover_image_path TEXT,
  genre TEXT,
  visual_style TEXT,
  status TEXT DEFAULT 'draft',
  synopsis TEXT,
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
  sections_config TEXT,

  -- Dashboard Tabs Configuration (JSON)
  tabs_config TEXT
);

-- Step 2: Copy data from old table to new table
INSERT INTO books_new
SELECT
  id, title, cover_image_path, genre, visual_style, status, synopsis, author_summary, story_summary,
  current_arc, chapters, created_at, updated_at, last_opened_at,
  words_per_day, chapters_per_week, estimated_arcs, estimated_chapters,
  completed_arcs, current_arc_progress, sticky_notes, checklist_items, sections_config, tabs_config
FROM books;

-- Step 3: Drop old table
DROP TABLE books;

-- Step 4: Rename new table to books
ALTER TABLE books_new RENAME TO books;

-- Step 5: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_books_last_opened ON books(last_opened_at DESC);


-- ============================================
-- ITEMS TABLE
-- ============================================
-- Remove deprecated section_visibility field (migrated to ui_state)

CREATE TABLE items_new (
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
  item_usage TEXT,

  -- UI State
  ui_state TEXT,

  -- Metadata
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

INSERT INTO items_new
SELECT
  id, book_id, name, status, category, custom_category, basic_description, image,
  appearance, origin, alternative_names, story_rarity, narrative_purpose,
  usage_requirements, usage_consequences, item_usage, ui_state, created_at, updated_at
FROM items;

DROP TABLE items;
ALTER TABLE items_new RENAME TO items;

CREATE INDEX IF NOT EXISTS idx_items_book_id ON items(book_id);


-- ============================================
-- RACES TABLE
-- ============================================
-- Remove deprecated field_visibility and section_visibility fields (migrated to ui_state)

CREATE TABLE races_new (
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

  -- UI State
  ui_state TEXT,

  -- Metadata
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

INSERT INTO races_new
SELECT
  id, book_id, group_id, name, domain, summary, image, scientific_name,
  alternative_names, cultural_notes, general_appearance, life_expectancy,
  average_height, average_weight, special_physical_characteristics, habits,
  reproductive_cycle, other_reproductive_cycle_description, diet, elemental_diet,
  communication, other_communication, moral_tendency, social_organization, habitat,
  physical_capacity, special_characteristics, weaknesses, story_motivation,
  inspirations, ui_state, created_at, updated_at
FROM races;

DROP TABLE races;
ALTER TABLE races_new RENAME TO races;

CREATE INDEX IF NOT EXISTS idx_races_book_id ON races(book_id);
CREATE INDEX IF NOT EXISTS idx_races_group_id ON races(group_id);


-- ============================================
-- PLOT_ARCS TABLE
-- ============================================
-- Remove deprecated field_visibility field (migrated to ui_state)

CREATE TABLE plot_arcs_new (
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

  -- UI State
  ui_state TEXT,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

INSERT INTO plot_arcs_new
SELECT
  id, book_id, name, size, focus, description, progress, status, order_index,
  important_characters, important_factions, important_items, important_regions,
  arc_message, world_impact, ui_state, created_at, updated_at
FROM plot_arcs;

DROP TABLE plot_arcs;
ALTER TABLE plot_arcs_new RENAME TO plot_arcs;

CREATE INDEX IF NOT EXISTS idx_plot_arcs_book_id ON plot_arcs(book_id);
CREATE INDEX IF NOT EXISTS idx_plot_arcs_order ON plot_arcs(book_id, order_index);


-- ============================================
-- REGIONS TABLE
-- ============================================
-- Remove deprecated section_visibility field (migrated to ui_state)
-- Note: timeline field is kept as it's actively used by the region timeline UI

CREATE TABLE regions_new (
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

  -- Environment fields
  climate TEXT,
  current_season TEXT,
  custom_season_name TEXT,
  general_description TEXT,
  region_anomalies TEXT,

  -- Information fields
  resident_factions TEXT,
  dominant_factions TEXT,
  important_characters TEXT,
  races_found TEXT,
  items_found TEXT,

  -- Narrative fields
  narrative_purpose TEXT,
  unique_characteristics TEXT,
  political_importance TEXT,
  religious_importance TEXT,
  world_perception TEXT,
  region_mysteries TEXT,
  inspirations TEXT,

  -- UI State
  ui_state TEXT,

  -- Timeline data (actively used by UI)
  timeline TEXT,

  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES regions(id) ON DELETE SET NULL
);

INSERT INTO regions_new
SELECT
  id, book_id, name, parent_id, scale, summary, image, order_index, created_at, updated_at,
  climate, current_season, custom_season_name, general_description, region_anomalies,
  resident_factions, dominant_factions, important_characters, races_found, items_found,
  narrative_purpose, unique_characteristics, political_importance, religious_importance,
  world_perception, region_mysteries, inspirations, ui_state, timeline
FROM regions;

DROP TABLE regions;
ALTER TABLE regions_new RENAME TO regions;

CREATE INDEX IF NOT EXISTS idx_regions_book_id ON regions(book_id);
CREATE INDEX IF NOT EXISTS idx_regions_parent_id ON regions(parent_id);


-- ============================================
-- GALLERY_ITEMS TABLE
-- ============================================
-- Remove deprecated thumbnail_base64 field (migrated to thumbnail_path)

CREATE TABLE gallery_items_new (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,

  -- Thumbnail (file path only)
  thumbnail_path TEXT,

  -- Original image
  original_path TEXT NOT NULL,

  -- Metadados da imagem
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  mime_type TEXT NOT NULL,

  -- Ordenação e organização
  order_index INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

INSERT INTO gallery_items_new
SELECT
  id, book_id, title, description, thumbnail_path, original_path,
  original_filename, file_size, width, height, mime_type, order_index,
  created_at, updated_at
FROM gallery_items;

DROP TABLE gallery_items;
ALTER TABLE gallery_items_new RENAME TO gallery_items;

CREATE INDEX IF NOT EXISTS idx_gallery_items_book_id ON gallery_items(book_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_updated_at ON gallery_items(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_order ON gallery_items(book_id, order_index);


-- ============================================
-- CHARACTERS TABLE
-- ============================================
-- Remove deprecated section_visibility field (was never actually added to schema)
-- Characters table already uses ui_state correctly, no migration needed


-- ============================================
-- Migration Complete
-- ============================================
-- Summary of removed fields:
-- - books: subtitle, description, word_count_goal, current_word_count
-- - items: section_visibility
-- - races: field_visibility, section_visibility
-- - plot_arcs: field_visibility
-- - regions: section_visibility
-- - gallery_items: thumbnail_base64
