// Database types matching the SQL schema

export interface DBBook {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  cover_image_path?: string;
  genre?: string; // JSON array string
  visual_style?: string;
  status: string;
  word_count_goal?: number;
  current_word_count: number;
  author_summary?: string;
  story_summary?: string;
  current_arc?: string;
  chapters: number;
  created_at: number;
  updated_at: number;
  last_opened_at?: number;

  // Overview Goals
  words_per_day?: number;
  chapters_per_week?: number;

  // Overview Story Progress
  estimated_arcs?: number;
  estimated_chapters?: number;
  completed_arcs?: number;
  current_arc_progress?: number;

  // Overview Data (JSON strings)
  sticky_notes?: string; // JSON array of IStickyNote
  checklist_items?: string; // JSON array of IChecklistItem
  sections_config?: string; // JSON array of section visibility/order
}

export interface DBCharacter {
  id: string;
  book_id: string;
  name: string;
  age?: string;
  gender?: string;
  role?: string;
  description?: string;
  image?: string;
  alignment?: string;

  // Appearance
  height?: string;
  weight?: string;
  skin_tone?: string;
  skin_tone_color?: string;
  physical_type?: string;
  hair?: string;
  eyes?: string;
  face?: string;
  distinguishing_features?: string;
  species_and_race?: string;

  // Behavior
  archetype?: string;
  personality?: string;
  hobbies?: string;
  dreams_and_goals?: string;
  fears_and_traumas?: string;
  favorite_food?: string;
  favorite_music?: string;

  // Location
  birth_place?: string;
  affiliated_place?: string;
  organization?: string;

  // Metadata
  field_visibility?: string; // JSON object string
  created_at: number;
  updated_at: number;
}

export interface DBCharacterVersion {
  id: string;
  character_id: string;
  name: string;
  description?: string;
  is_main: number; // 0 or 1 (SQLite boolean)
  character_data?: string; // JSON string
  created_at: number;
}

export interface DBRelationship {
  id: string;
  character_id: string;
  related_character_id: string;
  type: string;
  intensity: number;
  created_at: number;
}

export interface DBFamilyRelation {
  id: string;
  character_id: string;
  related_character_id: string;
  relation_type: string;
  created_at: number;
}

export interface DBItem {
  id: string;
  book_id: string;
  name: string;
  status?: string;
  category?: string;
  custom_category?: string;
  basic_description?: string;
  image?: string;

  appearance?: string;
  origin?: string;
  alternative_names?: string;
  story_rarity?: string;
  narrative_purpose?: string;
  usage_requirements?: string;
  usage_consequences?: string;

  field_visibility?: string;
  created_at: number;
  updated_at: number;
}

export interface DBItemVersion {
  id: string;
  item_id: string;
  name: string;
  description?: string;
  is_main: number;
  item_data?: string;
  created_at: number;
}

export interface DBRaceGroup {
  id: string;
  book_id: string;
  name: string;
  description: string;
  order_index: number;
  created_at: number;
  updated_at: number;
}

export interface DBRace {
  id: string;
  book_id: string;
  group_id?: string;

  // Basic required fields
  name: string;
  domain: string; // JSON array string
  summary: string;

  // Optional basic fields
  image?: string;
  scientific_name?: string;

  // Culture and Myths
  alternative_names?: string; // JSON array string
  race_views?: string; // JSON array string
  cultural_notes?: string;

  // Appearance and Characteristics
  general_appearance?: string;
  life_expectancy?: string;
  average_height?: string;
  average_weight?: string;
  special_physical_characteristics?: string;

  // Behaviors
  habits?: string;
  reproductive_cycle?: string;
  diet?: string;
  elemental_diet?: string;
  communication?: string; // JSON array string
  moral_tendency?: string;
  social_organization?: string;
  habitat?: string; // JSON array string

  // Power
  physical_capacity?: string;
  special_characteristics?: string;
  weaknesses?: string;

  // Narrative
  story_motivation?: string;
  inspirations?: string;

  // Metadata
  field_visibility?: string; // JSON object string
  created_at: number;
  updated_at: number;
}

export interface DBRaceVersion {
  id: string;
  race_id: string;
  name: string;
  description?: string;
  is_main: number; // 0 or 1 (SQLite boolean)
  race_data?: string; // JSON string
  created_at: number;
}

export interface DBRaceRelationship {
  id: string;
  race_id: string;
  related_race_id: string;
  type: string;
  created_at: number;
}

export interface DBFaction {
  id: string;
  book_id: string;
  name: string;
  summary: string;
  status: string;
  faction_type: string;
  image?: string;

  // Advanced fields - Alignment
  alignment?: string;

  // Advanced fields - Relationships
  influence?: string;
  public_reputation?: string;
  external_influence?: string;

  // Advanced fields - Internal Structure
  government_form?: string;
  rules_and_laws?: string; // JSON array string
  important_symbols?: string; // JSON array string
  main_resources?: string; // JSON array string
  economy?: string;
  treasures_and_secrets?: string; // JSON array string
  currencies?: string; // JSON array string

  // Advanced fields - Power (1-10 scale)
  military_power?: number;
  political_power?: number;
  cultural_power?: number;
  economic_power?: number;

  // Advanced fields - Culture
  faction_motto?: string;
  traditions_and_rituals?: string; // JSON array string
  beliefs_and_values?: string; // JSON array string
  languages_used?: string; // JSON array string
  uniform_and_aesthetics?: string;
  races?: string; // JSON array string

  // Advanced fields - History
  foundation_date?: string;
  foundation_history_summary?: string;
  founders?: string; // JSON array string
  chronology?: string; // JSON array of ITimelineEvent

  // Advanced fields - Narrative
  organization_objectives?: string;
  narrative_importance?: string;
  inspirations?: string;

  // Metadata
  created_at: number;
}

export interface DBFactionVersion {
  id: string;
  faction_id: string;
  name: string;
  description?: string;
  is_main: number; // 0 or 1 (SQLite boolean)
  faction_data?: string; // JSON string
  created_at: number;
}

// Helper types for queries
export interface CharacterWithRelationships extends DBCharacter {
  relationships?: DBRelationship[];
  family_relations?: DBFamilyRelation[];
}
