import { Book } from "@/stores/book-store";

import { DBBook } from "./types";

import { getDB } from "./index";

// Convert Book store type to DBBook
function bookToDBBook(book: Book): DBBook {
  return {
    id: book.id,
    title: book.title,
    subtitle: undefined,
    description: undefined,
    cover_image_path: book.coverImage,
    genre: JSON.stringify(book.genre),
    visual_style: book.visualStyle,
    status: book.status,
    word_count_goal: undefined,
    current_word_count: 0,
    author_summary: book.authorSummary,
    story_summary: book.storySummary,
    current_arc: book.currentArc,
    chapters: book.chapters,
    created_at: book.createdAt,
    updated_at: book.lastModified,
    last_opened_at: book.lastModified,

    // Overview fields - will be set through updateBook
    words_per_day: undefined,
    chapters_per_week: undefined,
    estimated_arcs: undefined,
    estimated_chapters: undefined,
    completed_arcs: undefined,
    current_arc_progress: undefined,
    sticky_notes: undefined,
    checklist_items: undefined,
    sections_config: undefined,
  };
}

// Convert DBBook to Book store type
function dbBookToBook(dbBook: DBBook): Book {
  return {
    id: dbBook.id,
    title: dbBook.title,
    genre: dbBook.genre ? JSON.parse(dbBook.genre) : [],
    visualStyle: dbBook.visual_style || "",
    coverImage: dbBook.cover_image_path || "/placeholder.svg",
    chapters: dbBook.chapters,
    lastModified: dbBook.updated_at,
    createdAt: dbBook.created_at,
    status: dbBook.status as Book["status"],
    currentArc: dbBook.current_arc,
    authorSummary: dbBook.author_summary,
    storySummary: dbBook.story_summary,
  };
}

export async function getAllBooks(): Promise<Book[]> {
  console.log("[books.service] getAllBooks called");

  try {
    const db = await getDB();
    console.log("[books.service] Database connection obtained");

    const result = await db.select<DBBook[]>(
      "SELECT * FROM books ORDER BY last_opened_at DESC NULLS LAST, updated_at DESC"
    );

    console.log("[books.service] Query executed successfully:", {
      rowCount: result.length,
      books: result,
    });

    const books = result.map(dbBookToBook);
    console.log("[books.service] Books converted to store format:", {
      count: books.length,
      books,
    });

    return books;
  } catch (error) {
    console.error("[books.service] Error in getAllBooks:", error);
    console.error("[books.service] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

export async function getBookById(id: string): Promise<Book | null> {
  const db = await getDB();
  const result = await db.select<DBBook[]>(
    "SELECT * FROM books WHERE id = $1",
    [id]
  );
  return result.length > 0 ? dbBookToBook(result[0]) : null;
}

export async function createBook(book: Book): Promise<void> {
  console.log("[books.service] createBook called with:", book);

  try {
    const db = await getDB();
    console.log("[books.service] Database connection obtained");

    const dbBook = bookToDBBook(book);
    console.log("[books.service] Converted to DBBook:", dbBook);

    await db.execute(
      `INSERT INTO books (
        id, title, subtitle, description, cover_image_path, genre, visual_style,
        status, word_count_goal, current_word_count, author_summary, story_summary,
        current_arc, chapters, created_at, updated_at, last_opened_at,
        words_per_day, chapters_per_week, estimated_arcs, estimated_chapters,
        completed_arcs, current_arc_progress, sticky_notes, checklist_items, sections_config
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24, $25, $26
      )`,
      [
        dbBook.id,
        dbBook.title,
        dbBook.subtitle,
        dbBook.description,
        dbBook.cover_image_path,
        dbBook.genre,
        dbBook.visual_style,
        dbBook.status,
        dbBook.word_count_goal,
        dbBook.current_word_count,
        dbBook.author_summary,
        dbBook.story_summary,
        dbBook.current_arc,
        dbBook.chapters,
        dbBook.created_at,
        dbBook.updated_at,
        dbBook.last_opened_at,
        dbBook.words_per_day,
        dbBook.chapters_per_week,
        dbBook.estimated_arcs,
        dbBook.estimated_chapters,
        dbBook.completed_arcs,
        dbBook.current_arc_progress,
        dbBook.sticky_notes,
        dbBook.checklist_items,
        dbBook.sections_config,
      ]
    );

    console.log("[books.service] Book inserted successfully!");
  } catch (error) {
    console.error("[books.service] Error creating book:", error);
    throw error;
  }
}

export async function updateBook(
  id: string,
  updates: Partial<Book>
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  // Build dynamic update query
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (updates.title !== undefined) {
    fields.push(`title = $${paramIndex++}`);
    values.push(updates.title);
  }
  if (updates.genre !== undefined) {
    fields.push(`genre = $${paramIndex++}`);
    values.push(JSON.stringify(updates.genre));
  }
  if (updates.visualStyle !== undefined) {
    fields.push(`visual_style = $${paramIndex++}`);
    values.push(updates.visualStyle);
  }
  if (updates.coverImage !== undefined) {
    fields.push(`cover_image_path = $${paramIndex++}`);
    values.push(updates.coverImage);
  }
  if (updates.status !== undefined) {
    fields.push(`status = $${paramIndex++}`);
    values.push(updates.status);
  }
  if (updates.chapters !== undefined) {
    fields.push(`chapters = $${paramIndex++}`);
    values.push(updates.chapters);
  }
  if (updates.currentArc !== undefined) {
    fields.push(`current_arc = $${paramIndex++}`);
    values.push(updates.currentArc);
  }
  if (updates.authorSummary !== undefined) {
    fields.push(`author_summary = $${paramIndex++}`);
    values.push(updates.authorSummary);
  }
  if (updates.storySummary !== undefined) {
    fields.push(`story_summary = $${paramIndex++}`);
    values.push(updates.storySummary);
  }

  // Always update updated_at
  fields.push(`updated_at = $${paramIndex++}`);
  values.push(now);

  // Add id to values
  values.push(id);

  if (fields.length > 0) {
    await db.execute(
      `UPDATE books SET ${fields.join(", ")} WHERE id = $${paramIndex}`,
      values
    );
  }
}

export async function deleteBook(id: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM books WHERE id = $1", [id]);
}

export async function updateLastOpened(id: string): Promise<void> {
  const db = await getDB();
  const now = Date.now();
  await db.execute(
    "UPDATE books SET last_opened_at = $1, updated_at = $2 WHERE id = $3",
    [now, now, id]
  );
}

// Overview-specific update functions
export interface OverviewData {
  goals?: {
    wordsPerDay: number;
    chaptersPerWeek: number;
  };
  storyProgress?: {
    estimatedArcs: number;
    estimatedChapters: number;
    completedArcs: number;
    currentArcProgress: number;
  };
  stickyNotes?: Array<{
    id: string;
    content: string;
    color: string;
    x: number;
    y: number;
    zIndex: number;
  }>;
  checklistItems?: Array<{
    id: string;
    text: string;
    checked: boolean;
  }>;
  sectionsConfig?: Array<{
    id: string;
    type: string;
    title: string;
    visible: boolean;
  }>;
}

export async function updateOverviewData(
  bookId: string,
  overviewData: OverviewData
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  // Goals
  if (overviewData.goals) {
    fields.push(`words_per_day = $${paramIndex++}`);
    values.push(overviewData.goals.wordsPerDay);
    fields.push(`chapters_per_week = $${paramIndex++}`);
    values.push(overviewData.goals.chaptersPerWeek);
  }

  // Story Progress
  if (overviewData.storyProgress) {
    fields.push(`estimated_arcs = $${paramIndex++}`);
    values.push(overviewData.storyProgress.estimatedArcs);
    fields.push(`estimated_chapters = $${paramIndex++}`);
    values.push(overviewData.storyProgress.estimatedChapters);
    fields.push(`completed_arcs = $${paramIndex++}`);
    values.push(overviewData.storyProgress.completedArcs);
    fields.push(`current_arc_progress = $${paramIndex++}`);
    values.push(overviewData.storyProgress.currentArcProgress);
  }

  // Sticky Notes
  if (overviewData.stickyNotes) {
    fields.push(`sticky_notes = $${paramIndex++}`);
    values.push(JSON.stringify(overviewData.stickyNotes));
  }

  // Checklist Items
  if (overviewData.checklistItems) {
    fields.push(`checklist_items = $${paramIndex++}`);
    values.push(JSON.stringify(overviewData.checklistItems));
  }

  // Sections Config
  if (overviewData.sectionsConfig) {
    fields.push(`sections_config = $${paramIndex++}`);
    values.push(JSON.stringify(overviewData.sectionsConfig));
  }

  // Always update updated_at
  fields.push(`updated_at = $${paramIndex++}`);
  values.push(now);

  // Add bookId to values
  values.push(bookId);

  if (fields.length > 1) {
    // More than just updated_at
    await db.execute(
      `UPDATE books SET ${fields.join(", ")} WHERE id = $${paramIndex}`,
      values
    );
  }
}

export async function getOverviewData(bookId: string): Promise<OverviewData> {
  const db = await getDB();
  const result = await db.select<DBBook[]>(
    `SELECT words_per_day, chapters_per_week, estimated_arcs, estimated_chapters,
     completed_arcs, current_arc_progress, sticky_notes, checklist_items, sections_config
     FROM books WHERE id = $1`,
    [bookId]
  );

  if (result.length === 0) {
    return {};
  }

  const row = result[0];
  const overviewData: OverviewData = {};

  // Parse goals
  if (row.words_per_day !== undefined || row.chapters_per_week !== undefined) {
    overviewData.goals = {
      wordsPerDay: row.words_per_day || 0,
      chaptersPerWeek: row.chapters_per_week || 0,
    };
  }

  // Parse story progress
  if (
    row.estimated_arcs !== undefined ||
    row.estimated_chapters !== undefined ||
    row.completed_arcs !== undefined ||
    row.current_arc_progress !== undefined
  ) {
    overviewData.storyProgress = {
      estimatedArcs: row.estimated_arcs || 0,
      estimatedChapters: row.estimated_chapters || 0,
      completedArcs: row.completed_arcs || 0,
      currentArcProgress: row.current_arc_progress || 0,
    };
  }

  // Parse sticky notes
  if (row.sticky_notes) {
    try {
      overviewData.stickyNotes = JSON.parse(row.sticky_notes);
    } catch (e) {
      console.error("Error parsing sticky notes:", e);
      overviewData.stickyNotes = [];
    }
  }

  // Parse checklist items
  if (row.checklist_items) {
    try {
      overviewData.checklistItems = JSON.parse(row.checklist_items);
    } catch (e) {
      console.error("Error parsing checklist items:", e);
      overviewData.checklistItems = [];
    }
  }

  // Parse sections config
  if (row.sections_config) {
    try {
      overviewData.sectionsConfig = JSON.parse(row.sections_config);
    } catch (e) {
      console.error("Error parsing sections config:", e);
      overviewData.sectionsConfig = [];
    }
  }

  return overviewData;
}
