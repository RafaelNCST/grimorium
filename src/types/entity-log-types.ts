// Entity Log Types
// Tipos para o sistema de registros de entidades
//
// @deprecated Este arquivo contém os tipos do sistema antigo de entity logs (local).
// O sistema foi migrado para global entity logs com linkagem many-to-many.
// Use @/types/global-entity-log-types.ts para novos desenvolvimentos.
// Este arquivo é mantido temporariamente para compatibilidade durante a migração.

export type EntityType = "character" | "item" | "faction" | "race" | "region";

export type MomentType = "chapter" | "prehistory";

export type ImportanceLevel = "hook" | "lore" | "foreshadowing";

export interface IEntityLog {
  id: string;
  entityId: string;
  entityType: EntityType;
  bookId: string;

  // Momento do registro
  momentType: MomentType;
  chapterNumber?: string; // Preenchido se momentType = 'chapter'
  prehistoryPeriod?: string; // Preenchido se momentType = 'prehistory'

  // Importância do evento
  importance: ImportanceLevel;

  // Descrição da mudança
  description: string;

  // Ordenação (para drag and drop)
  orderIndex: number;

  // Timestamps
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Database type (snake_case)
export interface DBEntityLog {
  id: string;
  entity_id: string;
  entity_type: string;
  book_id: string;

  moment_type: string;
  chapter_number: string | null;
  prehistory_period: string | null;

  importance: string;
  description: string;

  order_index: number;

  created_at: number; // Unix timestamp
  updated_at: number; // Unix timestamp
}
