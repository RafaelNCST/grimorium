export type EntityType = "character" | "region" | "faction" | "item" | "race";

export interface PinnedEntity {
  type: EntityType;
  id: string;
}

export interface EntityReferencePanelProps {
  chapterId: string;
  bookId: string;
  isListVisible: boolean;
  onToggleList: () => void;
  onClose: () => void;
}

export interface EntityListItemProps {
  type: EntityType;
  id: string;
  name: string;
  image?: string;
  isPinned: boolean;
  onPin: () => void;
  onUnpin: () => void;
  onClick?: () => void;
}

export interface PinnedEntityCardProps {
  type: EntityType;
  id: string;
  bookId: string;
  onUnpin: () => void;
}
