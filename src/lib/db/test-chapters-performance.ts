/**
 * Script de teste de performance para capítulos
 * Use este arquivo para testar o sistema com grandes quantidades de capítulos
 */

import type { ChapterStatus } from "@/stores/chapters-store";

import { createChapter, getChapterMetadataByBookId } from "./chapters.service";

/**
 * Cria capítulos de teste em massa
 * @param bookId ID do livro
 * @param count Número de capítulos a criar
 */
export async function createTestChapters(
  bookId: string,
  count: number
): Promise<void> {
  console.log(`[Performance Test] Criando ${count} capítulos de teste...`);
  const startTime = performance.now();

  const statuses: ChapterStatus[] = [
    "draft",
    "in-progress",
    "review",
    "finished",
    "published",
  ];

  for (let i = 1; i <= count; i++) {
    const chapterId = `test-chapter-${Date.now()}-${i}`;
    const status = statuses[i % statuses.length];

    // Simular conteúdo realista
    const paragraphs = Math.floor(Math.random() * 20) + 10; // 10-30 parágrafos
    const wordsPerParagraph = Math.floor(Math.random() * 50) + 30; // 30-80 palavras

    let content = "";
    for (let p = 0; p < paragraphs; p++) {
      const words = [];
      for (let w = 0; w < wordsPerParagraph; w++) {
        words.push(
          `palavra${Math.floor(Math.random() * 1000)}`
        );
      }
      content += words.join(" ") + "\n\n";
    }

    const wordCount = content.trim().split(/\s+/).length;
    const characterCount = content.replace(/\s+/g, "").length;

    await createChapter(bookId, {
      id: chapterId,
      chapterNumber: String(i),
      title: `Capítulo de Teste ${i}`,
      status,
      summary: `Este é um capítulo de teste número ${i} para avaliar performance`,
      content,
      wordCount,
      characterCount,
      characterCountWithSpaces: content.length,
      lastEdited: new Date().toISOString(),
      mentionedCharacters: [],
      mentionedRegions: [],
      mentionedItems: [],
      mentionedFactions: [],
      mentionedRaces: [],
      annotations: [],
    });

    // Log progresso a cada 100 capítulos
    if (i % 100 === 0) {
      console.log(`[Performance Test] ${i}/${count} capítulos criados...`);
    }
  }

  const endTime = performance.now();
  const duration = (endTime - startTime) / 1000;

  console.log(`[Performance Test] ✓ ${count} capítulos criados em ${duration.toFixed(2)}s`);
  console.log(`[Performance Test] Média: ${(duration / count).toFixed(4)}s por capítulo`);
}

/**
 * Testa o carregamento de metadados
 * @param bookId ID do livro
 */
export async function testMetadataLoading(bookId: string): Promise<void> {
  console.log("[Performance Test] Testando carregamento de metadados...");

  const startTime = performance.now();
  const metadata = await getChapterMetadataByBookId(bookId);
  const endTime = performance.now();

  const duration = endTime - startTime;

  console.log(`[Performance Test] ✓ ${metadata.length} capítulos carregados`);
  console.log(`[Performance Test] Tempo: ${duration.toFixed(2)}ms`);
  console.log(`[Performance Test] Média: ${(duration / metadata.length).toFixed(4)}ms por capítulo`);

  // Análise de uso de memória (aproximado)
  const avgMetadataSize = JSON.stringify(metadata[0] || {}).length;
  const totalSize = avgMetadataSize * metadata.length;
  console.log(`[Performance Test] Tamanho estimado em memória: ${(totalSize / 1024).toFixed(2)}KB`);
}

/**
 * Executa todos os testes de performance
 * @param bookId ID do livro
 * @param chapterCount Número de capítulos a criar
 */
export async function runPerformanceTests(
  bookId: string,
  chapterCount: number = 1000
): Promise<void> {
  console.log("=== INÍCIO DOS TESTES DE PERFORMANCE ===");

  try {
    // Criar capítulos de teste
    await createTestChapters(bookId, chapterCount);

    // Testar carregamento de metadados
    await testMetadataLoading(bookId);

    console.log("=== TESTES DE PERFORMANCE CONCLUÍDOS ===");
  } catch (error) {
    console.error("[Performance Test] Erro durante os testes:", error);
  }
}

// Para usar no console do navegador:
// import { runPerformanceTests } from '@/lib/db/test-chapters-performance';
// runPerformanceTests('seu-book-id', 1000);
