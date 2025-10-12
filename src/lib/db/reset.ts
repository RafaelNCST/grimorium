import { invoke } from "@tauri-apps/api/core";

import { closeDB, getDB } from "./index";

/**
 * Reseta o banco de dados SQLite, deletando o arquivo e recriando do zero
 * ATENÇÃO: Esta ação é irreversível e todos os dados serão perdidos!
 */
export async function resetDatabase(): Promise<string> {
  try {
    // Fecha conexão atual se existir
    await closeDB();

    // Invoca o comando Tauri para deletar o arquivo
    const result = await invoke<string>("reset_database");

    // Reconecta ao banco (ele será recriado com o schema)
    await getDB();

    return result;
  } catch (error) {
    throw new Error(`Failed to reset database: ${error}`);
  }
}

/**
 * Retorna o caminho do arquivo de banco de dados no sistema
 */
export async function getDatabasePath(): Promise<string> {
  try {
    const path = await invoke<string>("get_database_path");
    return path;
  } catch (error) {
    throw new Error(`Failed to get database path: ${error}`);
  }
}
