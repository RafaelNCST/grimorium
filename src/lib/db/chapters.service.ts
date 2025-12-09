import type { EntityMention } from "@/components/modals/create-chapter-modal";
import type { EntityLink } from "@/pages/dashboard/chapters/chapter-editor/types/entity-link";
import type {
  Annotation,
  ChapterData,
  ChapterStatus,
} from "@/stores/chapters-store";

import { getDB } from "./index";

// Tipos do banco de dados
interface DBChapter {
  id: string;
  book_id: string;
  chapter_number: string;
  title: string;
  status: ChapterStatus;
  plot_arc_id?: string;
  summary?: string;
  content: string;
  word_count: number;
  character_count: number;
  character_count_with_spaces: number;
  paragraph_count: number;
  dialogue_count: number;
  created_at: number;
  updated_at: number;
  last_edited: number;
}

interface DBEntityMention {
  id: string;
  chapter_id: string;
  entity_id: string;
  entity_type: string;
  entity_name: string;
  entity_image?: string;
  created_at: number;
}

interface DBAnnotation {
  id: string;
  chapter_id: string;
  start_offset: number;
  end_offset: number;
  text: string;
  created_at: number;
}

interface DBAnnotationNote {
  id: string;
  annotation_id: string;
  text: string;
  is_important: number;
  created_at: number;
  updated_at: number;
}

interface DBEntityLink {
  id: string;
  chapter_id: string;
  entity_id: string;
  entity_type: string;
  entity_name: string;
  start_offset: number;
  end_offset: number;
  created_at: number;
}

// Tipo para metadados (listagem sem conteúdo completo)
export interface ChapterMetadata {
  id: string;
  chapterNumber: string;
  title: string;
  status: ChapterStatus;
  plotArcId?: string;
  summary?: string;
  wordCount: number;
  characterCount: number;
  characterCountWithSpaces: number;
  paragraphCount: number;
  dialogueCount: number;
  lastEdited: string;
  mentionedCharacters: EntityMention[];
  mentionedRegions: EntityMention[];
  mentionedItems: EntityMention[];
  mentionedFactions: EntityMention[];
  mentionedRaces: EntityMention[];
}

// Tipo ultra-leve para navegação (apenas o essencial)
// Usado para popular o cache de navegação sem carregar dados pesados
export interface ChapterNavigationData {
  id: string;
  chapterNumber: string;
  title: string;
}

// Funções auxiliares de conversão
function entityMentionToDBEntity(
  chapterId: string,
  entityType: string,
  mention: EntityMention
): Omit<DBEntityMention, "created_at"> {
  return {
    id: `${chapterId}-${entityType}-${mention.id}`,
    chapter_id: chapterId,
    entity_id: mention.id,
    entity_type: entityType,
    entity_name: mention.name,
    entity_image: mention.image,
  };
}

function dbEntityToEntityMention(dbEntity: DBEntityMention): EntityMention {
  return {
    id: dbEntity.entity_id,
    name: dbEntity.entity_name,
    image: dbEntity.entity_image,
  };
}

// Operações de listagem (apenas metadados)
export async function getChapterMetadataByBookId(
  bookId: string
): Promise<ChapterMetadata[]> {
  const db = await getDB();

  // Buscar capítulos
  const chapters = await db.select<DBChapter[]>(
    "SELECT id, book_id, chapter_number, title, status, plot_arc_id, summary, word_count, character_count, character_count_with_spaces, paragraph_count, dialogue_count, last_edited, created_at, updated_at FROM chapters WHERE book_id = $1 ORDER BY CAST(chapter_number AS REAL)",
    [bookId]
  );

  // Buscar todas as menções de uma vez
  const chapterIds = chapters.map((ch) => ch.id);
  if (chapterIds.length === 0) return [];

  const placeholders = chapterIds.map((_, i) => `$${i + 1}`).join(",");
  const mentions = await db.select<DBEntityMention[]>(
    `SELECT * FROM chapter_entity_mentions WHERE chapter_id IN (${placeholders})`,
    chapterIds
  );

  // Organizar menções por capítulo e tipo
  const mentionsByChapter = new Map<
    string,
    {
      characters: EntityMention[];
      regions: EntityMention[];
      items: EntityMention[];
      factions: EntityMention[];
      races: EntityMention[];
    }
  >();

  for (const mention of mentions) {
    if (!mentionsByChapter.has(mention.chapter_id)) {
      mentionsByChapter.set(mention.chapter_id, {
        characters: [],
        regions: [],
        items: [],
        factions: [],
        races: [],
      });
    }

    const chapterMentions = mentionsByChapter.get(mention.chapter_id)!;
    const entityMention = dbEntityToEntityMention(mention);

    switch (mention.entity_type) {
      case "character":
        chapterMentions.characters.push(entityMention);
        break;
      case "region":
        chapterMentions.regions.push(entityMention);
        break;
      case "item":
        chapterMentions.items.push(entityMention);
        break;
      case "faction":
        chapterMentions.factions.push(entityMention);
        break;
      case "race":
        chapterMentions.races.push(entityMention);
        break;
    }
  }

  // Converter para ChapterMetadata
  return chapters.map((ch) => {
    const chapterMentions = mentionsByChapter.get(ch.id) || {
      characters: [],
      regions: [],
      items: [],
      factions: [],
      races: [],
    };

    return {
      id: ch.id,
      chapterNumber: ch.chapter_number,
      title: ch.title,
      status: ch.status,
      plotArcId: ch.plot_arc_id,
      summary: ch.summary,
      wordCount: ch.word_count,
      characterCount: ch.character_count,
      characterCountWithSpaces: ch.character_count_with_spaces,
      paragraphCount: ch.paragraph_count || 0,
      dialogueCount: ch.dialogue_count || 0,
      lastEdited: new Date(ch.last_edited).toISOString(),
      mentionedCharacters: chapterMentions.characters,
      mentionedRegions: chapterMentions.regions,
      mentionedItems: chapterMentions.items,
      mentionedFactions: chapterMentions.factions,
      mentionedRaces: chapterMentions.races,
    };
  });
}

// Buscar dados mínimos para navegação (ultra-leve, otimizado para 1000+ capítulos)
// Retorna apenas id, chapterNumber e title - sem conteúdo, menções ou outros dados pesados
export async function getChapterNavigationDataByBookId(
  bookId: string
): Promise<ChapterNavigationData[]> {
  const db = await getDB();

  // Query extremamente leve - apenas 3 campos
  const chapters = await db.select<Pick<DBChapter, "id" | "chapter_number" | "title">[]>(
    "SELECT id, chapter_number, title FROM chapters WHERE book_id = $1 ORDER BY CAST(chapter_number AS REAL)",
    [bookId]
  );

  return chapters.map((ch) => ({
    id: ch.id,
    chapterNumber: ch.chapter_number,
    title: ch.title,
  }));
}

// Buscar capítulo completo (com conteúdo)
export async function getChapterById(
  chapterId: string
): Promise<ChapterData | null> {
  const db = await getDB();

  // Buscar capítulo
  const chapters = await db.select<DBChapter[]>(
    "SELECT * FROM chapters WHERE id = $1",
    [chapterId]
  );

  if (chapters.length === 0) return null;
  const chapter = chapters[0];

  // Buscar menções
  const mentions = await db.select<DBEntityMention[]>(
    "SELECT * FROM chapter_entity_mentions WHERE chapter_id = $1",
    [chapterId]
  );

  const mentionedCharacters: EntityMention[] = [];
  const mentionedRegions: EntityMention[] = [];
  const mentionedItems: EntityMention[] = [];
  const mentionedFactions: EntityMention[] = [];
  const mentionedRaces: EntityMention[] = [];

  for (const mention of mentions) {
    const entityMention = dbEntityToEntityMention(mention);
    switch (mention.entity_type) {
      case "character":
        mentionedCharacters.push(entityMention);
        break;
      case "region":
        mentionedRegions.push(entityMention);
        break;
      case "item":
        mentionedItems.push(entityMention);
        break;
      case "faction":
        mentionedFactions.push(entityMention);
        break;
      case "race":
        mentionedRaces.push(entityMention);
        break;
    }
  }

  // Buscar anotações
  const dbAnnotations = await db.select<DBAnnotation[]>(
    "SELECT * FROM chapter_annotations WHERE chapter_id = $1",
    [chapterId]
  );

  const annotations: Annotation[] = [];
  for (const dbAnnotation of dbAnnotations) {
    // Buscar notas da anotação
    const dbNotes = await db.select<DBAnnotationNote[]>(
      "SELECT * FROM chapter_annotation_notes WHERE annotation_id = $1",
      [dbAnnotation.id]
    );

    annotations.push({
      id: dbAnnotation.id,
      startOffset: dbAnnotation.start_offset,
      endOffset: dbAnnotation.end_offset,
      text: dbAnnotation.text,
      createdAt: new Date(dbAnnotation.created_at).toISOString(),
      notes: dbNotes.map((note) => ({
        id: note.id,
        text: note.text,
        isImportant: note.is_important === 1,
        createdAt: new Date(note.created_at).toISOString(),
        updatedAt: new Date(note.updated_at).toISOString(),
      })),
    });
  }

  // Buscar entity links
  const dbLinks = await db.select<DBEntityLink[]>(
    "SELECT * FROM chapter_entity_links WHERE chapter_id = $1",
    [chapterId]
  );

  const entityLinks: EntityLink[] = dbLinks.map((link) => ({
    id: link.id,
    entityId: link.entity_id,
    entityType: link.entity_type as EntityLink["entityType"],
    entityName: link.entity_name,
    startOffset: link.start_offset,
    endOffset: link.end_offset,
  }));

  return {
    id: chapter.id,
    chapterNumber: chapter.chapter_number,
    title: chapter.title,
    status: chapter.status,
    plotArcId: chapter.plot_arc_id,
    summary: chapter.summary || "",
    content: chapter.content,
    wordCount: chapter.word_count,
    characterCount: chapter.character_count,
    characterCountWithSpaces: chapter.character_count_with_spaces,
    lastEdited: new Date(chapter.last_edited).toISOString(),
    mentionedCharacters,
    mentionedRegions,
    mentionedItems,
    mentionedFactions,
    mentionedRaces,
    annotations,
    entityLinks,
  };
}

// Criar novo capítulo
export async function createChapter(
  bookId: string,
  chapterData: ChapterData
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  // Inserir capítulo principal
  await db.execute(
    `INSERT INTO chapters (
      id, book_id, chapter_number, title, status, plot_arc_id, summary, content,
      word_count, character_count, character_count_with_spaces, paragraph_count, dialogue_count,
      created_at, updated_at, last_edited
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
    [
      chapterData.id,
      bookId,
      chapterData.chapterNumber,
      chapterData.title,
      chapterData.status,
      chapterData.plotArcId,
      chapterData.summary,
      chapterData.content,
      chapterData.wordCount,
      chapterData.characterCount,
      chapterData.characterCountWithSpaces || chapterData.characterCount,
      chapterData.paragraphCount || 0,
      chapterData.dialogueCount || 0,
      now,
      now,
      Date.parse(chapterData.lastEdited) || now,
    ]
  );

  // Inserir menções de entidades
  const entityMentions: Array<{
    type: string;
    mentions: EntityMention[];
  }> = [
    { type: "character", mentions: chapterData.mentionedCharacters },
    { type: "region", mentions: chapterData.mentionedRegions },
    { type: "item", mentions: chapterData.mentionedItems },
    { type: "faction", mentions: chapterData.mentionedFactions },
    { type: "race", mentions: chapterData.mentionedRaces },
  ];

  for (const { type, mentions } of entityMentions) {
    for (const mention of mentions) {
      const dbEntity = entityMentionToDBEntity(chapterData.id, type, mention);
      await db.execute(
        `INSERT INTO chapter_entity_mentions (id, chapter_id, entity_id, entity_type, entity_name, entity_image, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          dbEntity.id,
          dbEntity.chapter_id,
          dbEntity.entity_id,
          dbEntity.entity_type,
          dbEntity.entity_name,
          dbEntity.entity_image,
          now,
        ]
      );
    }
  }

  // Inserir anotações
  if (chapterData.annotations) {
    for (const annotation of chapterData.annotations) {
      await db.execute(
        `INSERT INTO chapter_annotations (id, chapter_id, start_offset, end_offset, text, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          annotation.id,
          chapterData.id,
          annotation.startOffset,
          annotation.endOffset,
          annotation.text,
          Date.parse(annotation.createdAt) || now,
        ]
      );

      // Inserir notas da anotação
      for (const note of annotation.notes) {
        await db.execute(
          `INSERT INTO chapter_annotation_notes (id, annotation_id, text, is_important, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            note.id,
            annotation.id,
            note.text,
            note.isImportant ? 1 : 0,
            Date.parse(note.createdAt) || now,
            Date.parse(note.updatedAt) || now,
          ]
        );
      }
    }
  }

  // Inserir entity links
  if (chapterData.entityLinks) {
    for (const link of chapterData.entityLinks) {
      await db.execute(
        `INSERT INTO chapter_entity_links (id, chapter_id, entity_id, entity_type, entity_name, start_offset, end_offset, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          link.id,
          chapterData.id,
          link.entityId,
          link.entityType,
          link.entityName,
          link.startOffset,
          link.endOffset,
          now,
        ]
      );
    }
  }
}

// Atualizar capítulo
export async function updateChapter(
  chapterId: string,
  updates: Partial<ChapterData>
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  // Construir query dinâmica para campos do capítulo principal
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (updates.chapterNumber !== undefined) {
    fields.push(`chapter_number = $${paramIndex++}`);
    values.push(updates.chapterNumber);
  }
  if (updates.title !== undefined) {
    fields.push(`title = $${paramIndex++}`);
    values.push(updates.title);
  }
  if (updates.status !== undefined) {
    fields.push(`status = $${paramIndex++}`);
    values.push(updates.status);
  }
  if (updates.plotArcId !== undefined) {
    fields.push(`plot_arc_id = $${paramIndex++}`);
    values.push(updates.plotArcId);
  }
  if (updates.summary !== undefined) {
    fields.push(`summary = $${paramIndex++}`);
    values.push(updates.summary);
  }
  if (updates.content !== undefined) {
    fields.push(`content = $${paramIndex++}`);
    values.push(updates.content);
  }
  if (updates.wordCount !== undefined) {
    fields.push(`word_count = $${paramIndex++}`);
    values.push(updates.wordCount);
  }
  if (updates.characterCount !== undefined) {
    fields.push(`character_count = $${paramIndex++}`);
    values.push(updates.characterCount);
  }
  if (updates.characterCountWithSpaces !== undefined) {
    fields.push(`character_count_with_spaces = $${paramIndex++}`);
    values.push(updates.characterCountWithSpaces);
  }
  if (updates.paragraphCount !== undefined) {
    fields.push(`paragraph_count = $${paramIndex++}`);
    values.push(updates.paragraphCount);
  }
  if (updates.dialogueCount !== undefined) {
    fields.push(`dialogue_count = $${paramIndex++}`);
    values.push(updates.dialogueCount);
  }

  // Sempre atualizar updated_at e last_edited
  fields.push(`updated_at = $${paramIndex++}`);
  values.push(now);
  fields.push(`last_edited = $${paramIndex++}`);
  values.push(now);

  // Adicionar chapterId
  values.push(chapterId);

  if (fields.length > 0) {
    await db.execute(
      `UPDATE chapters SET ${fields.join(", ")} WHERE id = $${paramIndex}`,
      values
    );
  }

  // Atualizar menções de entidades se fornecidas
  const entityMentionUpdates: Array<{
    type: string;
    mentions?: EntityMention[];
  }> = [
    { type: "character", mentions: updates.mentionedCharacters },
    { type: "region", mentions: updates.mentionedRegions },
    { type: "item", mentions: updates.mentionedItems },
    { type: "faction", mentions: updates.mentionedFactions },
    { type: "race", mentions: updates.mentionedRaces },
  ];

  for (const { type, mentions } of entityMentionUpdates) {
    if (mentions !== undefined) {
      // Deletar menções antigas deste tipo
      await db.execute(
        "DELETE FROM chapter_entity_mentions WHERE chapter_id = $1 AND entity_type = $2",
        [chapterId, type]
      );

      // Inserir novas menções
      for (const mention of mentions) {
        const dbEntity = entityMentionToDBEntity(chapterId, type, mention);
        await db.execute(
          `INSERT INTO chapter_entity_mentions (id, chapter_id, entity_id, entity_type, entity_name, entity_image, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            dbEntity.id,
            dbEntity.chapter_id,
            dbEntity.entity_id,
            dbEntity.entity_type,
            dbEntity.entity_name,
            dbEntity.entity_image,
            now,
          ]
        );
      }
    }
  }

  // Atualizar anotações se fornecidas
  if (updates.annotations !== undefined) {
    // Deletar anotações antigas (e suas notas via CASCADE)
    await db.execute("DELETE FROM chapter_annotations WHERE chapter_id = $1", [
      chapterId,
    ]);

    // Inserir novas anotações
    for (const annotation of updates.annotations) {
      await db.execute(
        `INSERT INTO chapter_annotations (id, chapter_id, start_offset, end_offset, text, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          annotation.id,
          chapterId,
          annotation.startOffset,
          annotation.endOffset,
          annotation.text,
          Date.parse(annotation.createdAt) || now,
        ]
      );

      // Inserir notas da anotação
      for (const note of annotation.notes) {
        await db.execute(
          `INSERT INTO chapter_annotation_notes (id, annotation_id, text, is_important, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            note.id,
            annotation.id,
            note.text,
            note.isImportant ? 1 : 0,
            Date.parse(note.createdAt) || now,
            Date.parse(note.updatedAt) || now,
          ]
        );
      }
    }
  }

  // Atualizar entity links se fornecidos
  if (updates.entityLinks !== undefined) {
    // Deletar links antigos
    await db.execute("DELETE FROM chapter_entity_links WHERE chapter_id = $1", [
      chapterId,
    ]);

    // Inserir novos links
    for (const link of updates.entityLinks) {
      await db.execute(
        `INSERT INTO chapter_entity_links (id, chapter_id, entity_id, entity_type, entity_name, start_offset, end_offset, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          link.id,
          chapterId,
          link.entityId,
          link.entityType,
          link.entityName,
          link.startOffset,
          link.endOffset,
          now,
        ]
      );
    }
  }
}

// Deletar capítulo
export async function deleteChapter(chapterId: string): Promise<void> {
  const db = await getDB();
  // As tabelas relacionadas serão deletadas via CASCADE
  await db.execute("DELETE FROM chapters WHERE id = $1", [chapterId]);
}

// Buscar capítulos por status
export async function getChaptersByStatus(
  bookId: string,
  status: ChapterStatus
): Promise<ChapterMetadata[]> {
  const db = await getDB();

  const chapters = await db.select<DBChapter[]>(
    "SELECT id, book_id, chapter_number, title, status, plot_arc_id, summary, word_count, character_count, character_count_with_spaces, paragraph_count, dialogue_count, last_edited, created_at, updated_at FROM chapters WHERE book_id = $1 AND status = $2 ORDER BY CAST(chapter_number AS REAL)",
    [bookId, status]
  );

  // Buscar menções para esses capítulos
  const chapterIds = chapters.map((ch) => ch.id);
  if (chapterIds.length === 0) return [];

  const placeholders = chapterIds.map((_, i) => `$${i + 1}`).join(",");
  const mentions = await db.select<DBEntityMention[]>(
    `SELECT * FROM chapter_entity_mentions WHERE chapter_id IN (${placeholders})`,
    chapterIds
  );

  // Organizar menções por capítulo
  const mentionsByChapter = new Map<
    string,
    {
      characters: EntityMention[];
      regions: EntityMention[];
      items: EntityMention[];
      factions: EntityMention[];
      races: EntityMention[];
    }
  >();

  for (const mention of mentions) {
    if (!mentionsByChapter.has(mention.chapter_id)) {
      mentionsByChapter.set(mention.chapter_id, {
        characters: [],
        regions: [],
        items: [],
        factions: [],
        races: [],
      });
    }

    const chapterMentions = mentionsByChapter.get(mention.chapter_id)!;
    const entityMention = dbEntityToEntityMention(mention);

    switch (mention.entity_type) {
      case "character":
        chapterMentions.characters.push(entityMention);
        break;
      case "region":
        chapterMentions.regions.push(entityMention);
        break;
      case "item":
        chapterMentions.items.push(entityMention);
        break;
      case "faction":
        chapterMentions.factions.push(entityMention);
        break;
      case "race":
        chapterMentions.races.push(entityMention);
        break;
    }
  }

  return chapters.map((ch) => {
    const chapterMentions = mentionsByChapter.get(ch.id) || {
      characters: [],
      regions: [],
      items: [],
      factions: [],
      races: [],
    };

    return {
      id: ch.id,
      chapterNumber: ch.chapter_number,
      title: ch.title,
      status: ch.status,
      plotArcId: ch.plot_arc_id,
      summary: ch.summary,
      wordCount: ch.word_count,
      characterCount: ch.character_count,
      characterCountWithSpaces: ch.character_count_with_spaces,
      paragraphCount: ch.paragraph_count || 0,
      dialogueCount: ch.dialogue_count || 0,
      lastEdited: new Date(ch.last_edited).toISOString(),
      mentionedCharacters: chapterMentions.characters,
      mentionedRegions: chapterMentions.regions,
      mentionedItems: chapterMentions.items,
      mentionedFactions: chapterMentions.factions,
      mentionedRaces: chapterMentions.races,
    };
  });
}
