export interface NoteFile {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: Date;
  content: string;
  parentId: string | null;
}

export const mockFiles: NoteFile[] = [];
