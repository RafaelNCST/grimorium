use std::fs;
use tauri::Manager;

#[tauri::command]
async fn reset_database(app: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    let db_path = app_data_dir.join("grimorium.db");

    if db_path.exists() {
        fs::remove_file(&db_path)
            .map_err(|e| format!("Failed to delete database file: {}", e))?;
        Ok(format!("Database reset successfully. File was at: {:?}", db_path))
    } else {
        Ok(format!("Database file not found at: {:?}", db_path))
    }
}

#[tauri::command]
async fn get_database_path(app: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    let db_path = app_data_dir.join("grimorium.db");
    Ok(format!("{:?}", db_path))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::default().build())
    .invoke_handler(tauri::generate_handler![reset_database, get_database_path])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
