// Types for the annotation links system

export interface AnnotationLink {
  id: string;
  noteId: string;
  entityType: 'character' | 'beast' | 'world' | 'continent' | 'location' | 'item';
  entityId: string;
  createdAt: Date;
}

export interface LinkedEntity {
  id: string;
  name: string;
  type: 'character' | 'beast' | 'world' | 'continent' | 'location' | 'item';
}

// Extended NoteFile with links
export interface NoteFileWithLinks {
  id: string;
  name: string;
  content: string;
  type: 'file';
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  links: AnnotationLink[];
}