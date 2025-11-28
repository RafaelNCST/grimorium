import { EntityType, INote, INoteLink, PaperMode } from "@/types/note-types";

import { DBNote, DBNoteLink } from "./types";

import { getDB } from "./index";

import type { JSONContent } from "@tiptap/react";

// Convert INote to DBNote
function noteToDBNote(note: INote): DBNote {
  return {
    id: note.id,
    book_id: note.bookId,
    name: note.name,
    content: note.content ? JSON.stringify(note.content) : undefined,
    paper_mode: note.paperMode,
    created_at: note.createdAt
      ? new Date(note.createdAt).getTime()
      : Date.now(),
    updated_at: note.updatedAt
      ? new Date(note.updatedAt).getTime()
      : Date.now(),
  };
}

// Convert DBNote to INote (without links - those are fetched separately)
function dbNoteToNote(dbNote: DBNote): Omit<INote, "links"> {
  return {
    id: dbNote.id,
    bookId: dbNote.book_id,
    name: dbNote.name,
    content: dbNote.content ? JSON.parse(dbNote.content) : undefined,
    paperMode: dbNote.paper_mode as PaperMode,
    createdAt: new Date(dbNote.created_at).toISOString(),
    updatedAt: new Date(dbNote.updated_at).toISOString(),
  };
}

// Convert INoteLink to DBNoteLink
function noteLinkToDBNoteLink(noteId: string, link: INoteLink): DBNoteLink {
  return {
    id: link.id,
    note_id: noteId,
    entity_id: link.entityId,
    entity_type: link.entityType,
    book_id: link.bookId,
    created_at: link.createdAt
      ? new Date(link.createdAt).getTime()
      : Date.now(),
  };
}

// Convert DBNoteLink to INoteLink
function dbNoteLinkToNoteLink(dbLink: DBNoteLink): INoteLink {
  return {
    id: dbLink.id,
    entityId: dbLink.entity_id,
    entityType: dbLink.entity_type as EntityType,
    bookId: dbLink.book_id,
    createdAt: new Date(dbLink.created_at).toISOString(),
  };
}

// Get all notes
export async function getAllNotes(): Promise<INote[]> {
  const db = await getDB();
  const notes = await db.select<DBNote[]>(
    "SELECT * FROM notes ORDER BY updated_at DESC"
  );

  const notesWithLinks: INote[] = [];

  for (const dbNote of notes) {
    const links = await getNoteLinks(dbNote.id);
    notesWithLinks.push({
      ...dbNoteToNote(dbNote),
      links,
    });
  }

  return notesWithLinks;
}

// Get notes by book ID
export async function getNotesByBookId(bookId: string): Promise<INote[]> {
  const db = await getDB();
  const notes = await db.select<DBNote[]>(
    "SELECT * FROM notes WHERE book_id = $1 ORDER BY updated_at DESC",
    [bookId]
  );

  const notesWithLinks: INote[] = [];

  for (const dbNote of notes) {
    const links = await getNoteLinks(dbNote.id);
    notesWithLinks.push({
      ...dbNoteToNote(dbNote),
      links,
    });
  }

  return notesWithLinks;
}

// Get note by ID
export async function getNoteById(id: string): Promise<INote | null> {
  const db = await getDB();
  const result = await db.select<DBNote[]>(
    "SELECT * FROM notes WHERE id = $1",
    [id]
  );

  if (result.length === 0) {
    return null;
  }

  const links = await getNoteLinks(id);

  return {
    ...dbNoteToNote(result[0]),
    links,
  };
}

// Get note links
export async function getNoteLinks(noteId: string): Promise<INoteLink[]> {
  const db = await getDB();
  const result = await db.select<DBNoteLink[]>(
    "SELECT * FROM note_links WHERE note_id = $1",
    [noteId]
  );

  return result.map(dbNoteLinkToNoteLink);
}

// Create note
export async function createNote(note: INote): Promise<void> {
  const db = await getDB();
  const dbNote = noteToDBNote(note);

  await db.execute(
    `INSERT INTO notes (id, book_id, name, content, paper_mode, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      dbNote.id,
      dbNote.book_id,
      dbNote.name,
      dbNote.content,
      dbNote.paper_mode,
      dbNote.created_at,
      dbNote.updated_at,
    ]
  );

  // Insert links
  for (const link of note.links) {
    const dbLink = noteLinkToDBNoteLink(note.id, link);
    await db.execute(
      `INSERT INTO note_links (id, note_id, entity_id, entity_type, book_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        dbLink.id,
        dbLink.note_id,
        dbLink.entity_id,
        dbLink.entity_type,
        dbLink.book_id,
        dbLink.created_at,
      ]
    );
  }
}

// Update note
export async function updateNote(
  id: string,
  updates: Partial<Omit<INote, "id" | "createdAt" | "links">>
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }

  if (updates.content !== undefined) {
    setClauses.push(`content = $${paramIndex++}`);
    values.push(JSON.stringify(updates.content));
  }

  if (updates.paperMode !== undefined) {
    setClauses.push(`paper_mode = $${paramIndex++}`);
    values.push(updates.paperMode);
  }

  setClauses.push(`updated_at = $${paramIndex++}`);
  values.push(now);

  values.push(id);

  await db.execute(
    `UPDATE notes SET ${setClauses.join(", ")} WHERE id = $${paramIndex}`,
    values
  );
}

// Update note content (optimized for auto-save)
export async function updateNoteContent(
  id: string,
  content: JSONContent
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  await db.execute(
    "UPDATE notes SET content = $1, updated_at = $2 WHERE id = $3",
    [JSON.stringify(content), now, id]
  );
}

// Update note name
export async function updateNoteName(id: string, name: string): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  await db.execute(
    "UPDATE notes SET name = $1, updated_at = $2 WHERE id = $3",
    [name, now, id]
  );
}

// Update note paper mode
export async function updateNotePaperMode(
  id: string,
  paperMode: PaperMode
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  await db.execute(
    "UPDATE notes SET paper_mode = $1, updated_at = $2 WHERE id = $3",
    [paperMode, now, id]
  );
}

// Delete note
export async function deleteNote(id: string): Promise<void> {
  const db = await getDB();
  // Links will be deleted automatically due to CASCADE
  await db.execute("DELETE FROM notes WHERE id = $1", [id]);
}

// Delete multiple notes
export async function deleteNotes(ids: string[]): Promise<void> {
  const db = await getDB();
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  await db.execute(`DELETE FROM notes WHERE id IN (${placeholders})`, ids);
}

// Add link to note
export async function addNoteLink(
  noteId: string,
  link: INoteLink
): Promise<void> {
  const db = await getDB();
  const dbLink = noteLinkToDBNoteLink(noteId, link);
  const now = Date.now();

  await db.execute(
    `INSERT INTO note_links (id, note_id, entity_id, entity_type, book_id, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      dbLink.id,
      dbLink.note_id,
      dbLink.entity_id,
      dbLink.entity_type,
      dbLink.book_id,
      dbLink.created_at,
    ]
  );

  // Update note's updated_at
  await db.execute("UPDATE notes SET updated_at = $1 WHERE id = $2", [
    now,
    noteId,
  ]);
}

// Remove link from note
export async function removeNoteLink(linkId: string): Promise<void> {
  const db = await getDB();

  // Get noteId before deleting
  const result = await db.select<DBNoteLink[]>(
    "SELECT note_id FROM note_links WHERE id = $1",
    [linkId]
  );

  await db.execute("DELETE FROM note_links WHERE id = $1", [linkId]);

  // Update note's updated_at
  if (result.length > 0) {
    await db.execute("UPDATE notes SET updated_at = $1 WHERE id = $2", [
      Date.now(),
      result[0].note_id,
    ]);
  }
}

// Update all links for a note (replace all)
export async function updateNoteLinks(
  noteId: string,
  links: INoteLink[]
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  // Delete existing links
  await db.execute("DELETE FROM note_links WHERE note_id = $1", [noteId]);

  // Insert new links
  for (const link of links) {
    const dbLink = noteLinkToDBNoteLink(noteId, link);
    await db.execute(
      `INSERT INTO note_links (id, note_id, entity_id, entity_type, book_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        dbLink.id,
        dbLink.note_id,
        dbLink.entity_id,
        dbLink.entity_type,
        dbLink.book_id,
        dbLink.created_at,
      ]
    );
  }

  // Update note's updated_at
  await db.execute("UPDATE notes SET updated_at = $1 WHERE id = $2", [
    now,
    noteId,
  ]);
}

// Get notes by entity type filter
export async function getNotesByEntityTypes(
  entityTypes: EntityType[]
): Promise<INote[]> {
  if (entityTypes.length === 0) {
    return getAllNotes();
  }

  const db = await getDB();
  const placeholders = entityTypes.map((_, i) => `$${i + 1}`).join(", ");

  const noteIds = await db.select<{ note_id: string }[]>(
    `SELECT DISTINCT note_id FROM note_links WHERE entity_type IN (${placeholders})`,
    entityTypes
  );

  if (noteIds.length === 0) {
    return [];
  }

  const notes: INote[] = [];
  for (const { note_id } of noteIds) {
    const note = await getNoteById(note_id);
    if (note) {
      notes.push(note);
    }
  }

  // Sort by updated_at DESC
  return notes.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
