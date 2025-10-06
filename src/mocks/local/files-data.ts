export interface NoteFile {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  content: string;
  parentId: string | null;
}

export const mockFiles: NoteFile[] = [];
