// Types for the annotation links system

export interface IAnnotationLink {
  id: string;
  noteId: string;
  entityType:
    | "character"
    | "beast"
    | "world"
    | "continent"
    | "location"
    | "item";
  entityId: string;
  createdAt: Date;
}

export interface ILinkedEntity {
  id: string;
  name: string;
  type: "character" | "beast" | "world" | "continent" | "location" | "item";
}

// Extended NoteFile with links
export interface INoteFileWithLinks {
  id: string;
  name: string;
  content: string;
  type: "file";
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  links: IAnnotationLink[];
}
