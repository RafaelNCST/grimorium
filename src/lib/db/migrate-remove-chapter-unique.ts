/**
 * Migration: Remove UNIQUE constraint from chapters table
 *
 * Removes the UNIQUE(book_id, chapter_number) constraint to allow
 * duplicate chapter numbers within the same book.
 */

import { safeDBOperation } from "./safe-db-operation";

import { getDB } from "./index";

/**
 * Check if the migration is needed
 * We check if the old constraint still exists by trying to insert a duplicate
 */
export async function needsChapterUniqueConstraintRemoval(): Promise<boolean> {
  return safeDBOperation(async () => {
    const db = await getDB();

    // Check if we have the unique constraint by querying sqlite_master
    const result = await db.select<Array<{ sql: string }>>(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name='chapters'`,
      []
    );

    if (result.length === 0) return false;

    const tableSql = result[0].sql;
    // Check if the UNIQUE constraint exists in the CREATE TABLE statement
    return tableSql.includes("UNIQUE(book_id, chapter_number)");
  }, "needsChapterUniqueConstraintRemoval");
}

/**
 * Remove the UNIQUE constraint from chapters table
 * SQLite doesn't support ALTER TABLE DROP CONSTRAINT, so we need to recreate the table
 */
export async function removeChapterUniqueConstraint(): Promise<void> {
  return safeDBOperation(async () => {
    const db = await getDB();

    console.log("[Migration] Starting chapters UNIQUE constraint removal...");

    // Step 0: Drop chapters_new if it exists (from failed previous migration)
    await db.execute(`DROP TABLE IF EXISTS chapters_new`, []);

    console.log("[Migration] Cleaned up any previous migration attempts");

    // Step 1: Create new table without UNIQUE constraint
    await db.execute(
      `
      CREATE TABLE chapters_new (
        id TEXT PRIMARY KEY,
        book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        chapter_number TEXT NOT NULL,
        title TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        plot_arc_id TEXT,
        summary TEXT,
        content TEXT,
        word_count INTEGER DEFAULT 0,
        character_count INTEGER DEFAULT 0,
        character_count_with_spaces INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        last_edited INTEGER NOT NULL
      )
    `,
      []
    );

    console.log(
      "[Migration] Created new chapters table without UNIQUE constraint"
    );

    // Step 2: Copy all data from old table to new table
    // Explicitly specify columns to handle cases where old table has extra columns
    await db.execute(
      `
      INSERT INTO chapters_new (
        id, book_id, chapter_number, title, status, plot_arc_id, summary, content,
        word_count, character_count, character_count_with_spaces,
        created_at, updated_at, last_edited
      )
      SELECT
        id, book_id, chapter_number, title, status, plot_arc_id, summary, content,
        word_count, character_count, character_count_with_spaces,
        created_at, updated_at, last_edited
      FROM chapters
    `,
      []
    );

    console.log("[Migration] Copied all data to new table");

    // Step 3: Drop old table
    await db.execute(`DROP TABLE chapters`, []);

    console.log("[Migration] Dropped old chapters table");

    // Step 4: Rename new table to chapters
    await db.execute(`ALTER TABLE chapters_new RENAME TO chapters`, []);

    console.log("[Migration] Renamed new table to chapters");

    // Step 5: Recreate indexes
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id)`,
      []
    );
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_chapters_status ON chapters(status)`,
      []
    );
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_chapters_chapter_number ON chapters(chapter_number)`,
      []
    );
    await db.execute(
      `CREATE INDEX IF NOT EXISTS idx_chapters_last_edited ON chapters(last_edited DESC)`,
      []
    );

    console.log("[Migration] Recreated indexes");
    console.log("[Migration] Migration complete! UNIQUE constraint removed.");
  }, "removeChapterUniqueConstraint");
}
