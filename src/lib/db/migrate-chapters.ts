import type { ChapterData } from "@/stores/chapters-store";

import { createChapter } from "./chapters.service";

interface LocalStorageChaptersState {
  state: {
    chapters: Record<string, ChapterData>;
  };
  version: number;
}

/**
 * Migra capítulos do localStorage (Zustand persist) para o banco de dados SQL
 * @param bookId ID do livro ao qual os capítulos pertencem
 * @returns Número de capítulos migrados
 */
export async function migrateChaptersFromLocalStorage(
  bookId: string
): Promise<number> {
  try {
    // Buscar dados do localStorage
    const localStorageKey = "chapters-storage";
    const localStorageData = localStorage.getItem(localStorageKey);

    if (!localStorageData) {
      console.log("[migrate-chapters] Nenhum dado encontrado no localStorage");
      return 0;
    }

    // Parse dos dados
    const parsedData: LocalStorageChaptersState = JSON.parse(localStorageData);
    const chapters = Object.values(parsedData.state.chapters);

    if (chapters.length === 0) {
      console.log("[migrate-chapters] Nenhum capítulo para migrar");
      return 0;
    }

    console.log(
      `[migrate-chapters] Migrando ${chapters.length} capítulos para o banco...`
    );

    // Migrar cada capítulo
    let migratedCount = 0;
    for (const chapter of chapters) {
      try {
        await createChapter(bookId, chapter);
        migratedCount++;
        console.log(
          `[migrate-chapters] Capítulo "${chapter.title}" migrado com sucesso`
        );
      } catch (error) {
        console.error(
          `[migrate-chapters] Erro ao migrar capítulo "${chapter.title}":`,
          error
        );
        // Continuar migrando os outros capítulos mesmo se um falhar
      }
    }

    console.log(
      `[migrate-chapters] Migração concluída: ${migratedCount}/${chapters.length} capítulos migrados`
    );

    // Limpar localStorage após migração bem-sucedida
    if (migratedCount === chapters.length) {
      localStorage.removeItem(localStorageKey);
      console.log("[migrate-chapters] LocalStorage limpo");
    }

    return migratedCount;
  } catch (error) {
    console.error("[migrate-chapters] Erro durante migração:", error);
    throw error;
  }
}

/**
 * Verifica se há capítulos no localStorage que precisam ser migrados
 * @returns true se há dados no localStorage
 */
export function hasChaptersInLocalStorage(): boolean {
  try {
    const localStorageKey = "chapters-storage";
    const localStorageData = localStorage.getItem(localStorageKey);

    if (!localStorageData) return false;

    const parsedData: LocalStorageChaptersState = JSON.parse(localStorageData);
    const chapters = Object.values(parsedData.state.chapters);

    return chapters.length > 0;
  } catch (error) {
    console.error("[migrate-chapters] Erro ao verificar localStorage:", error);
    return false;
  }
}
