import { useErrorModalStore } from "@/stores/error-modal-store";

import { parseDatabaseError, DatabaseError } from "./error-handler";

/**
 * Wrapper seguro para operações de banco de dados
 *
 * Intercepta erros do SQLite, detecta o tipo específico,
 * exibe feedback visual via modal global e re-lança o erro
 * para permitir tratamento específico quando necessário.
 *
 * @param operation - Função assíncrona com a operação de DB
 * @param operationName - Nome da operação para logging (opcional)
 * @returns Resultado da operação
 * @throws DatabaseError - Re-lança o erro após tratamento
 *
 * @example
 * ```typescript
 * export async function createBook(book: Book): Promise<void> {
 *   return safeDBOperation(async () => {
 *     const db = await getDB();
 *     await db.execute('INSERT INTO books ...');
 *   }, 'createBook');
 * }
 * ```
 */
export async function safeDBOperation<T>(
  operation: () => Promise<T>,
  operationName?: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const dbError = parseDatabaseError(error);

    // Log detalhado para debug
    console.error(`[DB Error] ${operationName || "Operation"}:`, {
      type: dbError.type,
      message: dbError.message,
      originalError: dbError.originalError,
    });

    // Mostrar feedback visual via modal global
    showErrorFeedback(dbError);

    // Re-throw para permitir tratamento específico se necessário
    throw dbError;
  }
}

/**
 * Exibe o modal de erro global via store
 */
function showErrorFeedback(error: DatabaseError): void {
  const { showError } = useErrorModalStore.getState();
  showError(error.type);
}
