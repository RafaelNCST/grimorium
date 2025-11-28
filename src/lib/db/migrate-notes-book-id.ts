/**
 * Migration script to add book_id column to notes table
 *
 * This migration:
 * 1. Adds book_id column to notes table
 * 2. Assigns all existing notes to the first available book
 * 3. If no books exist, deletes existing notes
 */

import { Database } from "@tauri-apps/plugin-sql";

export async function migrateNotesBookId() {
  try {
    const db = await Database.load("sqlite:grimorium.db");

    console.log("[Migration] Starting notes book_id migration...");

    // Check if column already exists
    const tableInfo = await db.select<{ name: string }[]>(
      "PRAGMA table_info(notes)"
    );

    const hasBookId = tableInfo.some((col) => col.name === "book_id");

    if (hasBookId) {
      console.log("[Migration] Column book_id already exists, skipping...");
      return {
        success: true,
        message: "Column already exists",
      };
    }

    // Get all books
    const books = await db.select<{ id: string }[]>("SELECT id FROM books");

    if (books.length === 0) {
      console.log("[Migration] No books found. Deleting all existing notes...");
      await db.execute("DELETE FROM notes");
      console.log("[Migration] All notes deleted");
    }

    // Add book_id column (allowing NULL temporarily)
    await db.execute("ALTER TABLE notes ADD COLUMN book_id TEXT");
    console.log("[Migration] Added book_id column");

    if (books.length > 0) {
      // Assign all existing notes to the first book
      const firstBookId = books[0].id;
      await db.execute("UPDATE notes SET book_id = ? WHERE book_id IS NULL", [
        firstBookId,
      ]);
      console.log(
        `[Migration] Assigned all existing notes to book: ${firstBookId}`
      );
    }

    // Check if we have any notes without book_id
    const orphanNotes = await db.select<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM notes WHERE book_id IS NULL"
    );

    if (orphanNotes[0].count > 0) {
      console.log(
        `[Migration] Deleting ${orphanNotes[0].count} orphan notes...`
      );
      await db.execute("DELETE FROM notes WHERE book_id IS NULL");
    }

    console.log("[Migration] Migration completed successfully!");

    return {
      success: true,
      booksFound: books.length,
      message:
        books.length > 0
          ? `All notes assigned to book ${books[0].id}`
          : "All notes deleted (no books available)",
    };
  } catch (error) {
    console.error("[Migration] Error during migration:", error);
    throw error;
  }
}
