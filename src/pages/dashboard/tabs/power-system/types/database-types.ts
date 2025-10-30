// Database types for Power System
// These types match the SQL schema that will be added to the database

/**
 * Power Maps (Canvas/Mapa)
 * Representa um canvas completo com elementos e conexões
 */
export interface DBPowerMap {
  id: string;
  book_id: string;
  name: string;
  size: string; // 'small' | 'medium' | 'large'

  // Configurações
  grid_enabled: number; // 0 or 1 (SQLite boolean)
  grid_size: number;

  // Navegação em profundidade
  parent_map_id?: string;

  // Metadata
  created_at: number;
  updated_at: number;
}

/**
 * Power Elements (Elementos do Canvas)
 * Armazena todos os tipos de elementos (basic, detailed, visual, text)
 */
export interface DBPowerElement {
  id: string;
  map_id: string; // Referência ao mapa

  // Base fields
  type: string; // 'basic-section' | 'detailed-section' | 'visual-section' | 'text'
  x: number;
  y: number;
  width: number;
  height: number;

  // Navegação
  can_navigate: number; // 0 or 1 (SQLite boolean)
  submap_id?: string;

  // Fields para basic-section e detailed-section
  title?: string;
  subtitle?: string; // Apenas detailed-section
  description?: string;
  background_color?: string;
  text_color?: string;

  // Fields para detailed-section e visual-section
  image_url?: string;

  // Fields para visual-section
  shape?: string; // 'circle' | 'square' | 'rounded-square' | 'triangle'
  show_hover_card?: number; // 0 or 1 (SQLite boolean)
  hover_title?: string;
  hover_subtitle?: string;
  hover_description?: string;

  // Fields para text
  content?: string; // Usado para text element
  font_size?: number;
  font_weight?: string; // 'normal' | 'bold'
  text_align?: string; // 'left' | 'center' | 'right'

  // Metadata
  created_at: number;
  updated_at: number;
}

/**
 * Power Connections (Conexões entre elementos)
 * Suporta setas livres e linhas conectadas
 */
export interface DBPowerConnection {
  id: string;
  map_id: string; // Referência ao mapa

  type: string; // 'arrow' | 'line'

  // Origem (sempre presente)
  from_element_id: string;

  // Destino (pode ser elemento ou coordenadas)
  to_element_id?: string; // Se presente, é uma linha conectando dois elementos
  to_x?: number; // Se to_element_id for null, usa coordenadas
  to_y?: number;

  // Aparência
  color: string;
  stroke_width: number;
  label?: string; // Texto opcional na conexão

  // Metadata
  created_at: number;
}

/**
 * Power Templates (Templates pré-definidos)
 * Permite salvar configurações comuns de mapas
 */
export interface DBPowerTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  size: string; // 'small' | 'medium' | 'large'

  // Dados do template (JSON)
  elements_data: string; // JSON string de IPowerElement[]
  connections_data: string; // JSON string de IConnection[]

  // Metadata
  created_at: number;
}

/**
 * SQL Schema para adicionar ao database
 */
export const POWER_SYSTEM_SCHEMA = `
  -- POWER MAPS (CANVAS)
  CREATE TABLE IF NOT EXISTS power_maps (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    size TEXT NOT NULL DEFAULT 'medium',

    -- Configurações
    grid_enabled INTEGER DEFAULT 1,
    grid_size INTEGER DEFAULT 20,

    -- Navegação em profundidade
    parent_map_id TEXT REFERENCES power_maps(id) ON DELETE CASCADE,

    -- Metadata
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  -- POWER ELEMENTS (ELEMENTOS DO CANVAS)
  CREATE TABLE IF NOT EXISTS power_elements (
    id TEXT PRIMARY KEY,
    map_id TEXT NOT NULL REFERENCES power_maps(id) ON DELETE CASCADE,

    -- Base fields
    type TEXT NOT NULL,
    x REAL NOT NULL,
    y REAL NOT NULL,
    width REAL NOT NULL,
    height REAL NOT NULL,

    -- Navegação
    can_navigate INTEGER DEFAULT 0,
    submap_id TEXT REFERENCES power_maps(id) ON DELETE SET NULL,

    -- Fields comuns
    title TEXT,
    subtitle TEXT,
    description TEXT,
    background_color TEXT,
    text_color TEXT,

    -- Image
    image_url TEXT,

    -- Visual section specific
    shape TEXT,
    show_hover_card INTEGER DEFAULT 0,
    hover_title TEXT,
    hover_subtitle TEXT,
    hover_description TEXT,

    -- Text element specific
    content TEXT,
    font_size INTEGER,
    font_weight TEXT,
    text_align TEXT,

    -- Metadata
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  -- POWER CONNECTIONS (CONEXÕES)
  CREATE TABLE IF NOT EXISTS power_connections (
    id TEXT PRIMARY KEY,
    map_id TEXT NOT NULL REFERENCES power_maps(id) ON DELETE CASCADE,

    type TEXT NOT NULL,

    -- Origem e destino
    from_element_id TEXT NOT NULL REFERENCES power_elements(id) ON DELETE CASCADE,
    to_element_id TEXT REFERENCES power_elements(id) ON DELETE CASCADE,
    to_x REAL,
    to_y REAL,

    -- Aparência
    color TEXT NOT NULL,
    stroke_width REAL DEFAULT 2,
    label TEXT,

    -- Metadata
    created_at INTEGER NOT NULL
  );

  -- POWER TEMPLATES (TEMPLATES PRÉ-DEFINIDOS)
  CREATE TABLE IF NOT EXISTS power_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT,
    size TEXT NOT NULL DEFAULT 'medium',

    -- Template data (JSON)
    elements_data TEXT NOT NULL,
    connections_data TEXT NOT NULL,

    -- Metadata
    created_at INTEGER NOT NULL
  );

  -- ÍNDICES para melhor performance
  CREATE INDEX IF NOT EXISTS idx_power_maps_book_id ON power_maps(book_id);
  CREATE INDEX IF NOT EXISTS idx_power_maps_parent ON power_maps(parent_map_id);
  CREATE INDEX IF NOT EXISTS idx_power_elements_map_id ON power_elements(map_id);
  CREATE INDEX IF NOT EXISTS idx_power_elements_submap ON power_elements(submap_id);
  CREATE INDEX IF NOT EXISTS idx_power_connections_map_id ON power_connections(map_id);
  CREATE INDEX IF NOT EXISTS idx_power_connections_from ON power_connections(from_element_id);
  CREATE INDEX IF NOT EXISTS idx_power_connections_to ON power_connections(to_element_id);
`;

/**
 * Migration query para adicionar as tabelas ao database existente
 */
export const POWER_SYSTEM_MIGRATION = `
  -- Verifica se as tabelas já existem antes de criar
  ${POWER_SYSTEM_SCHEMA}
`;
