/**
 * Global Entity Log Types
 * Sistema global de registros com linkagem many-to-many
 */

export type EntityType = "character" | "item" | "faction" | "race" | "region";

export type MomentType = "chapter" | "prehistory";

export type ImportanceLevel = "hook" | "lore" | "foreshadowing";

/**
 * Interface principal para um log global
 * Os logs globais não pertencem a nenhuma entidade específica,
 * mas podem ser linkados a múltiplas entidades através de IEntityLogLink
 */
export interface IGlobalEntityLog {
  id: string;
  bookId: string;

  // Momento do registro
  momentType: MomentType;
  chapterNumber?: string; // Preenchido se momentType = 'chapter'
  prehistoryPeriod?: string; // Preenchido se momentType = 'prehistory'

  // Importância do evento
  importance: ImportanceLevel;

  // Descrição da mudança
  description: string;

  // Ordenação (para drag and drop na view global)
  orderIndex: number;

  // Links para entidades (populado quando fetching)
  links: IEntityLogLink[];

  // Timestamps
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * Interface para link entre um log global e uma entidade
 * Permite relacionamento many-to-many: um log pode estar linkado a múltiplas entidades
 */
export interface IEntityLogLink {
  id: string;
  logId: string;
  entityId: string;
  entityType: EntityType;
  bookId: string;
  orderIndex: number; // Ordenação específica da entidade (para drag and drop na view local)
  entityName?: string; // Populado quando fetching para display no UI
  createdAt: string; // ISO string
}

/**
 * Tipo de banco de dados para global_entity_logs (snake_case)
 */
export interface DBGlobalEntityLog {
  id: string;
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

/**
 * Tipo de banco de dados para entity_log_links (snake_case)
 */
export interface DBEntityLogLink {
  id: string;
  log_id: string;
  entity_id: string;
  entity_type: string;
  book_id: string;
  order_index: number; // Entity-specific order
  created_at: number; // Unix timestamp
}
