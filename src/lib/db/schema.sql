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

-- ANOTAÇÕES (VINCULADAS A LIVROS)
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_notes_book_id ON notes(book_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_note_links_note_id ON note_links(note_id);
CREATE INDEX IF NOT EXISTS idx_note_links_entity ON note_links(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_note_links_entity_type ON note_links(entity_type);

-- CAPÍTULOS
CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_number TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'in-progress', 'review', 'finished', 'published'
  plot_arc_id TEXT,
  summary TEXT,
  content TEXT, -- Conteúdo completo do capítulo
  word_count INTEGER DEFAULT 0,
  character_count INTEGER DEFAULT 0,
  character_count_with_spaces INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_edited INTEGER NOT NULL,
  UNIQUE(book_id, chapter_number)
);

-- MENÇÕES DE ENTIDADES EM CAPÍTULOS
CREATE TABLE IF NOT EXISTS chapter_entity_mentions (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'character', 'region', 'item', 'faction', 'race'
  entity_name TEXT NOT NULL,
  entity_image TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE(chapter_id, entity_id, entity_type)
);

-- ANOTAÇÕES DE CAPÍTULOS
CREATE TABLE IF NOT EXISTS chapter_annotations (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  start_offset INTEGER NOT NULL,
  end_offset INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- NOTAS DE ANOTAÇÕES
CREATE TABLE IF NOT EXISTS chapter_annotation_notes (
  id TEXT PRIMARY KEY,
  annotation_id TEXT NOT NULL REFERENCES chapter_annotations(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_important INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- ÍNDICES PARA CAPÍTULOS
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_status ON chapters(status);
CREATE INDEX IF NOT EXISTS idx_chapters_chapter_number ON chapters(chapter_number);
CREATE INDEX IF NOT EXISTS idx_chapters_last_edited ON chapters(last_edited DESC);
CREATE INDEX IF NOT EXISTS idx_chapter_entity_mentions_chapter ON chapter_entity_mentions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapter_entity_mentions_entity ON chapter_entity_mentions(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_chapter_annotations_chapter ON chapter_annotations(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapter_annotation_notes_annotation ON chapter_annotation_notes(annotation_id);
CREATE INDEX IF NOT EXISTS idx_chapter_annotations_range ON chapter_annotations(chapter_id, start_offset, end_offset);

-- GALERIA (IMAGENS)
CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,

  -- Armazenamento Híbrido
  thumbnail_base64 TEXT,           -- Thumbnail para visualização rápida no grid (DEPRECATED - migrar para thumbnail_path)
  thumbnail_path TEXT,             -- Path para thumbnail no filesystem (gallery/thumbnails/thumb_{id}.jpg)
  original_path TEXT NOT NULL,     -- Caminho relativo no AppData (gallery/image_{id}_{uuid}.{ext})

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

CREATE TABLE IF NOT EXISTS gallery_links (
  id TEXT PRIMARY KEY,
  gallery_item_id TEXT NOT NULL REFERENCES gallery_items(id) ON DELETE CASCADE,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'character', 'region', 'faction', 'race', 'item', 'arc'
  book_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(gallery_item_id, entity_id, entity_type)
);

-- ÍNDICES PARA GALERIA
CREATE INDEX IF NOT EXISTS idx_gallery_items_book_id ON gallery_items(book_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_updated_at ON gallery_items(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_order ON gallery_items(book_id, order_index);
CREATE INDEX IF NOT EXISTS idx_gallery_links_item_id ON gallery_links(gallery_item_id);
CREATE INDEX IF NOT EXISTS idx_gallery_links_entity ON gallery_links(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_gallery_links_entity_type ON gallery_links(entity_type);
