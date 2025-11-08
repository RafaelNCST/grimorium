// Block types enum
export type BlockType =
  | "heading"
  | "paragraph"
  | "unordered-list"
  | "numbered-list"
  | "tag-list"
  | "dropdown"
  | "multi-dropdown"
  | "image"
  | "icon"
  | "icon-group"
  | "informative"
  | "divider"
  | "stars"
  | "attributes"
  | "navigator";

// Content interfaces for each block type
export interface HeadingContent {
  text: string;
  level: 1 | 2 | 3 | 4 | 5;
  alignment: "left" | "center" | "right";
}

export interface ParagraphContent {
  text: string;
  locked?: boolean; // Controls auto-growth behavior
}

export interface UnorderedListContent {
  items: { id: string; text: string }[];
}

export interface NumberedListContent {
  items: { id: string; text: string }[];
}

export interface TagListContent {
  tags: string[];
}

export type DataSourceType = 'manual' | 'characters';

export interface DropdownContent {
  dataSource?: DataSourceType; // Default 'manual' para retrocompatibilidade

  // Modo manual
  options: string[];
  selectedValue?: string;

  // Modo characters
  selectedEntityId?: string;
}

export interface MultiDropdownContent {
  dataSource?: DataSourceType;

  // Modo manual
  options: string[];
  selectedValues: string[];

  // Modo characters
  selectedEntityIds?: string[];
}

export interface ImageContent {
  imageUrl?: string; // The currently displayed image (can be original or cropped)
  originalImageUrl?: string; // The original uploaded image (preserved for reverting from crop)
  croppedImageUrl?: string; // The cropped image data (preserved when switching modes)
  caption?: string;
  objectFit?: 'fill' | 'fit' | 'crop'; // default: 'fill' (equivalente a cover)
}

export interface IconContent {
  imageUrl?: string;
  title: string;
  description: string;
  alignment?: "start" | "center" | "end"; // default: "center"
}

export interface IconGroupContent {
  icons: {
    id: string;
    imageUrl?: string;
    title: string;
    description: string;
  }[];
}

export interface InformativeContent {
  icon: "alert" | "info" | "star" | "idea" | "check" | "x";
  text: string;
}

export interface DividerContent {
  // Empty - just a visual divider
}

export interface StarsContent {
  rating: number; // 0-10 (0.5 increments for half stars)
  size?: "small" | "medium" | "large"; // Star size preset
}

export interface AttributesContent {
  max: number; // 1-10
  current: number; // 0-max
  color?: string; // Color for the progress bars (default: primary)
}

export interface NavigatorContent {
  linkedPageId?: string; // ID of the linked page
  title?: string; // Optional custom title
}

export type BlockContent =
  | HeadingContent
  | ParagraphContent
  | UnorderedListContent
  | NumberedListContent
  | TagListContent
  | DropdownContent
  | MultiDropdownContent
  | ImageContent
  | IconContent
  | IconGroupContent
  | InformativeContent
  | DividerContent
  | StarsContent
  | AttributesContent
  | NavigatorContent;

// Main entities
export interface IPowerSystem {
  id: string;
  bookId: string;
  name: string;
  iconImage?: string;
  createdAt: number;
  updatedAt: number;
}

export interface IPowerGroup {
  id: string;
  systemId: string;
  name: string;
  orderIndex: number;
  createdAt: number;
}

export interface IPowerPage {
  id: string;
  systemId: string;
  groupId?: string;
  name: string;
  orderIndex: number;
  createdAt: number;
  updatedAt: number;
}

export interface IPowerSection {
  id: string;
  pageId: string;
  title: string;
  orderIndex: number;
  collapsed: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface IPowerBlock {
  id: string;
  sectionId: string;
  type: BlockType;
  orderIndex: number;
  content: BlockContent;
  createdAt: number;
  updatedAt: number;
}

export interface IPowerCharacterLink {
  id: string;
  characterId: string;
  pageId?: string;
  sectionId?: string;
  customLabel?: string;
  createdAt: string;
}
