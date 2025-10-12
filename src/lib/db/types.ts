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

// Helper types for queries
export interface CharacterWithRelationships extends DBCharacter {
  relationships?: DBRelationship[];
  family_relations?: DBFamilyRelation[];
}
