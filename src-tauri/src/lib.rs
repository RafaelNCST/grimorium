use std::fs;
use std::path::Path;
use tauri::Manager;

mod license;

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

// Helper function to calculate directory size recursively
fn calculate_dir_size(path: &Path) -> Result<u64, std::io::Error> {
    let mut total_size: u64 = 0;

    if path.is_dir() {
        for entry in fs::read_dir(path)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_file() {
                total_size += entry.metadata()?.len();
            } else if path.is_dir() {
                total_size += calculate_dir_size(&path)?;
            }
        }
    } else if path.is_file() {
        total_size += fs::metadata(path)?.len();
    }

    Ok(total_size)
}

#[tauri::command]
async fn get_app_data_path(app: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    Ok(app_data_dir.to_string_lossy().to_string())
}

#[tauri::command]
async fn get_app_data_size(app: tauri::AppHandle) -> Result<u64, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    if !app_data_dir.exists() {
        return Ok(0);
    }

    calculate_dir_size(&app_data_dir)
        .map_err(|e| format!("Failed to calculate directory size: {}", e))
}

#[tauri::command]
async fn open_data_folder(app: tauri::AppHandle) -> Result<(), String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    // Create directory if it doesn't exist
    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir)
            .map_err(|e| format!("Failed to create app data directory: {}", e))?;
    }

    // Open in file explorer (Windows)
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(app_data_dir.to_string_lossy().to_string())
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }

    // Open in file explorer (macOS)
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(app_data_dir.to_string_lossy().to_string())
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }

    // Open in file explorer (Linux)
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(app_data_dir.to_string_lossy().to_string())
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }

    Ok(())
}

#[tauri::command]
async fn check_license_status(app: tauri::AppHandle) -> Result<license::LicenseStatus, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    license::get_license_status(&app_data_dir)
}

#[tauri::command]
async fn activate_license_key(
    app: tauri::AppHandle,
    email: String,
    license_key: String,
) -> Result<license::LicenseStatus, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    license::activate_license(&app_data_dir, &email, &license_key)
}

#[cfg(debug_assertions)]
#[tauri::command]
async fn reset_license(app: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    license::deactivate_license(&app_data_dir)?;
    Ok("License reset successfully".to_string())
}

#[cfg(debug_assertions)]
#[tauri::command]
async fn activate_dev_license(app: tauri::AppHandle) -> Result<license::LicenseStatus, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    // Ativar licença com email e chave de desenvolvedor
    let dev_email = "dev@grimorium.com";
    let dev_key = license::generate_license_key(dev_email);

    license::activate_license(&app_data_dir, dev_email, &dev_key)
}

#[cfg(debug_assertions)]
#[tauri::command]
async fn reset_trial(app: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    license::reset_trial(&app_data_dir)?;
    Ok("Trial reset successfully".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let mut builder = tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::default().build())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init());

  // Register handlers with conditional compilation
  #[cfg(debug_assertions)]
  {
    builder = builder.invoke_handler(tauri::generate_handler![
      reset_database,
      get_database_path,
      get_app_data_path,
      get_app_data_size,
      open_data_folder,
      check_license_status,
      activate_license_key,
      reset_license,
      activate_dev_license,
      reset_trial
    ]);
  }

  #[cfg(not(debug_assertions))]
  {
    builder = builder.invoke_handler(tauri::generate_handler![
      reset_database,
      get_database_path,
      get_app_data_path,
      get_app_data_size,
      open_data_folder,
      check_license_status,
      activate_license_key
    ]);
  }

  builder
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
