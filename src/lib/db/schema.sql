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
  last_opened_at INTEGER
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

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_characters_book_id ON characters(book_id);
CREATE INDEX IF NOT EXISTS idx_character_versions_character_id ON character_versions(character_id);
CREATE INDEX IF NOT EXISTS idx_relationships_character ON relationships(character_id);
CREATE INDEX IF NOT EXISTS idx_relationships_related ON relationships(related_character_id);
CREATE INDEX IF NOT EXISTS idx_family_character ON family_relations(character_id);
CREATE INDEX IF NOT EXISTS idx_family_related ON family_relations(related_character_id);
CREATE INDEX IF NOT EXISTS idx_books_last_opened ON books(last_opened_at DESC);
CREATE INDEX IF NOT EXISTS idx_regions_book_id ON regions(book_id);
CREATE INDEX IF NOT EXISTS idx_regions_parent_id ON regions(parent_id);
CREATE INDEX IF NOT EXISTS idx_region_versions_region_id ON region_versions(region_id);

-- ANOTAÇÕES (GLOBAIS - NÃO VINCULADAS A LIVROS)
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT, -- JSON do TipTap
  paper_mode TEXT DEFAULT 'light', -- 'light' ou 'dark'
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- LINKS DE ANOTAÇÕES COM ENTIDADES
CREATE TABLE IF NOT EXISTS note_links (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'character', 'region', 'faction', 'race', 'item'
  book_id TEXT NOT NULL, -- Para saber de qual livro a entidade pertence
  created_at INTEGER NOT NULL,
  UNIQUE(note_id, entity_id, entity_type)
);

-- ÍNDICES PARA ANOTAÇÕES
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_note_links_note_id ON note_links(note_id);
CREATE INDEX IF NOT EXISTS idx_note_links_entity ON note_links(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_note_links_entity_type ON note_links(entity_type);
