import { getDB } from "@/lib/db";

export interface EntityChapterMetrics {
  firstChapter: {
    id: string;
    chapterNumber: string;
    title: string;
  } | null;
  lastChapter: {
    id: string;
    chapterNumber: string;
    title: string;
  } | null;
  totalMentions: number;
}

export interface PlotArcChapterMetrics {
  totalChapters: number;
  totalWords: number;
  totalCharacters: number;
  totalCharactersWithSpaces: number;
  totalParagraphs: number;
  totalDialogues: number;
}

type EntityType = "character" | "region" | "item" | "faction" | "race";

/**
 * Get chapter metrics for a specific entity
 * Returns first chapter mentioned, last chapter mentioned, and total mentions
 */
export async function getEntityChapterMetrics(
  bookId: string,
  entityId: string,
  entityType: EntityType
): Promise<EntityChapterMetrics> {
  const db = await getDB();

  // Query to get all chapters that mention this entity, ordered by chapter number
  const query = `
    SELECT DISTINCT
      c.id,
      c.chapter_number,
      c.title
    FROM chapters c
    INNER JOIN chapter_entity_mentions cem
      ON c.id = cem.chapter_id
    WHERE c.book_id = $1
      AND cem.entity_id = $2
      AND cem.entity_type = $3
    ORDER BY
      CAST(c.chapter_number AS INTEGER) ASC,
      c.chapter_number ASC
  `;

  const chapters = await db.select<
    Array<{
      id: string;
      chapter_number: string;
      title: string;
    }>
  >(query, [bookId, entityId, entityType]);

  if (chapters.length === 0) {
    return {
      firstChapter: null,
      lastChapter: null,
      totalMentions: 0,
    };
  }

  return {
    firstChapter: {
      id: chapters[0].id,
      chapterNumber: chapters[0].chapter_number,
      title: chapters[0].title,
    },
    lastChapter: {
      id: chapters[chapters.length - 1].id,
      chapterNumber: chapters[chapters.length - 1].chapter_number,
      title: chapters[chapters.length - 1].title,
    },
    totalMentions: chapters.length,
  };
}

/**
 * Get chapter metrics for a plot arc
 * Returns aggregated metrics for all chapters in the plot arc
 */
export async function getPlotArcChapterMetrics(
  bookId: string,
  plotArcId: string
): Promise<PlotArcChapterMetrics> {
  const db = await getDB();

  // Query to get aggregated metrics from all chapters linked to this plot arc
  const query = `
    SELECT
      COUNT(*) as total_chapters,
      COALESCE(SUM(word_count), 0) as total_words,
      COALESCE(SUM(character_count), 0) as total_characters,
      COALESCE(SUM(character_count_with_spaces), 0) as total_characters_with_spaces,
      COALESCE(SUM(paragraph_count), 0) as total_paragraphs,
      COALESCE(SUM(dialogue_count), 0) as total_dialogues
    FROM chapters
    WHERE book_id = $1
      AND plot_arc_id = $2
  `;

  const result = await db.select<
    Array<{
      total_chapters: number;
      total_words: number;
      total_characters: number;
      total_characters_with_spaces: number;
      total_paragraphs: number;
      total_dialogues: number;
    }>
  >(query, [bookId, plotArcId]);

  const metrics = result[0];

  return {
    totalChapters: metrics.total_chapters,
    totalWords: metrics.total_words,
    totalCharacters: metrics.total_characters,
    totalCharactersWithSpaces: metrics.total_characters_with_spaces,
    totalParagraphs: metrics.total_paragraphs,
    totalDialogues: metrics.total_dialogues,
  };
}
