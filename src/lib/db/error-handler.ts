/**
 * Sistema de detecção e tratamento de erros do banco de dados SQLite
 *
 * Este módulo detecta erros específicos do SQLite como:
 * - DISK_FULL: Espaço em disco insuficiente
 * - DATABASE_CORRUPT: Banco de dados corrompido
 * - DATABASE_LOCKED: Banco bloqueado por outro processo
 * - GENERIC: Outros erros não categorizados
 */

export enum SQLiteErrorType {
  DISK_FULL = "SQLITE_FULL",
  DATABASE_CORRUPT = "SQLITE_CORRUPT",
  DATABASE_LOCKED = "SQLITE_BUSY",
  GENERIC = "GENERIC_ERROR",
}

export class DatabaseError extends Error {
  constructor(
    public type: SQLiteErrorType,
    public originalError: unknown,
    message: string
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

/**
 * Analisa um erro e retorna um DatabaseError tipado
 *
 * @param error - Erro original capturado
 * @returns DatabaseError com tipo específico detectado
 */
export function parseDatabaseError(error: unknown): DatabaseError {
  const errorMsg = error instanceof Error ? error.message : String(error);
  const errorMsgLower = errorMsg.toLowerCase();

  // Detectar corrupção do banco
  if (
    errorMsgLower.includes("database disk image is malformed") ||
    errorMsgLower.includes("sqlite_corrupt") ||
    errorMsgLower.includes("database corruption") ||
    errorMsgLower.includes("file is not a database") ||
    errorMsgLower.includes("database or disk is full")
  ) {
    return new DatabaseError(
      SQLiteErrorType.DATABASE_CORRUPT,
      error,
      "O banco de dados está corrompido"
    );
  }

  // Detectar disco cheio
  if (
    errorMsgLower.includes("disk i/o error") ||
    errorMsgLower.includes("sqlite_full") ||
    errorMsgLower.includes("database or disk is full") ||
    errorMsgLower.includes("no space left on device") ||
    errorMsgLower.includes("disk full")
  ) {
    return new DatabaseError(
      SQLiteErrorType.DISK_FULL,
      error,
      "Sem espaço em disco"
    );
  }

  // Detectar banco bloqueado
  if (
    errorMsgLower.includes("sqlite_busy") ||
    errorMsgLower.includes("database is locked") ||
    errorMsgLower.includes("database locked")
  ) {
    return new DatabaseError(
      SQLiteErrorType.DATABASE_LOCKED,
      error,
      "Banco de dados bloqueado"
    );
  }

  // Erro genérico
  return new DatabaseError(
    SQLiteErrorType.GENERIC,
    error,
    errorMsg || "Erro desconhecido no banco de dados"
  );
}
