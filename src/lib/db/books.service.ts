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
        current_arc, chapters, created_at, updated_at, last_opened_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
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
