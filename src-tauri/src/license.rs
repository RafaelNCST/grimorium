use chrono::{DateTime, Duration, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fs;
use std::path::PathBuf;
use obfstr::obfstr;

const TRIAL_DAYS: i64 = 30;  // 30 dias de trial
const LICENSE_FILE: &str = ".license_data";

// IMPORTANT: Change this secret key before production!
// The obfstr! macro is used inline to obfuscate the string in the compiled binary

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LicenseInfo {
    pub first_run: DateTime<Utc>,
    pub license_key: Option<String>,
    pub activated_at: Option<DateTime<Utc>>,
    pub license_email: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LicenseStatus {
    pub is_trial: bool,
    pub is_licensed: bool,
    pub days_remaining: i64,
    pub trial_expired: bool,
    pub first_run_date: DateTime<Utc>,
}

impl LicenseInfo {
    fn new() -> Self {
        Self {
            first_run: Utc::now(),
            license_key: None,
            activated_at: None,
            license_email: None,
        }
    }
}

/// Generate license key from email and secret
pub fn generate_license_key(email: &str) -> String {
    // Using obfstr! inline to obfuscate the secret key in the compiled binary
    // Convert to String immediately to avoid lifetime issues
    let secret = obfstr!("26d637f0433c352f77a29a6a3a51c3b7e286132bfcc444bd22830c457a300f0a").to_string();
    let data = format!("{}:{}", email.to_lowercase().trim(), secret);
    let mut hasher = Sha256::new();
    hasher.update(data.as_bytes());
    let hash = hex::encode(hasher.finalize());

    // Format as: XXXX-XXXX-XXXX-XXXX
    format!(
        "{}-{}-{}-{}",
        &hash[0..8],
        &hash[8..16],
        &hash[16..24],
        &hash[24..32]
    ).to_uppercase()
}

/// Verify if a license key is valid for the given email
fn verify_license_key(email: &str, key: &str) -> bool {
    let expected_key = generate_license_key(email);
    expected_key == key.to_uppercase()
}

/// Get the license file path
fn get_license_path(app_data_dir: &PathBuf) -> PathBuf {
    app_data_dir.join(LICENSE_FILE)
}

/// Load license info from file
fn load_license_info(app_data_dir: &PathBuf) -> Option<LicenseInfo> {
    let path = get_license_path(app_data_dir);

    if !path.exists() {
        return None;
    }

    match fs::read_to_string(&path) {
        Ok(content) => {
            // Decode from base64 for basic obfuscation
            let decoded = base64::Engine::decode(
                &base64::engine::general_purpose::STANDARD,
                content.trim()
            ).ok()?;

            let json_str = String::from_utf8(decoded).ok()?;
            serde_json::from_str(&json_str).ok()
        }
        Err(_) => None,
    }
}

/// Save license info to file
fn save_license_info(app_data_dir: &PathBuf, info: &LicenseInfo) -> Result<(), String> {
    let path = get_license_path(app_data_dir);

    // Create directory if it doesn't exist
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    // Serialize to JSON
    let json = serde_json::to_string(info)
        .map_err(|e| format!("Failed to serialize license info: {}", e))?;

    // Encode to base64 for basic obfuscation
    let encoded = base64::Engine::encode(
        &base64::engine::general_purpose::STANDARD,
        json.as_bytes()
    );

    // Write to file
    fs::write(&path, encoded)
        .map_err(|e| format!("Failed to write license file: {}", e))?;

    // Make file hidden on Windows
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::fs::MetadataExt;
        if let Ok(metadata) = fs::metadata(&path) {
            let attrs = metadata.file_attributes();
            // FILE_ATTRIBUTE_HIDDEN = 0x2
            let _new_attrs = attrs | 0x2;
            // Note: Setting attributes requires Windows API calls
            // For simplicity, we'll skip this for now
        }
    }

    Ok(())
}

/// Initialize or get license info
pub fn initialize_license(app_data_dir: &PathBuf) -> Result<LicenseInfo, String> {
    // Try to load existing license
    if let Some(info) = load_license_info(app_data_dir) {
        return Ok(info);
    }

    // Create new license info (first run)
    let info = LicenseInfo::new();
    save_license_info(app_data_dir, &info)?;
    Ok(info)
}

/// Get current license status
pub fn get_license_status(app_data_dir: &PathBuf) -> Result<LicenseStatus, String> {
    let info = initialize_license(app_data_dir)?;
    let now = Utc::now();

    // If licensed, always return licensed status
    if info.license_key.is_some() && info.activated_at.is_some() {
        return Ok(LicenseStatus {
            is_trial: false,
            is_licensed: true,
            days_remaining: -1, // -1 means unlimited
            trial_expired: false,
            first_run_date: info.first_run,
        });
    }

    // Calculate trial days remaining
    let trial_end = info.first_run + Duration::days(TRIAL_DAYS);
    let duration_remaining = trial_end.signed_duration_since(now);

    let days_remaining = if duration_remaining.num_seconds() > 0 {
        duration_remaining.num_days().max(1)
    } else {
        0
    };

    let trial_expired = days_remaining == 0;

    Ok(LicenseStatus {
        is_trial: true,
        is_licensed: false,
        days_remaining,
        trial_expired,
        first_run_date: info.first_run,
    })
}

/// Activate license with key
pub fn activate_license(
    app_data_dir: &PathBuf,
    email: &str,
    license_key: &str,
) -> Result<LicenseStatus, String> {
    // Verify license key
    if !verify_license_key(email, license_key) {
        return Err("Invalid license key. Please check your email and key and try again.".to_string());
    }

    // Load existing license info
    let mut info = initialize_license(app_data_dir)?;

    // Activate license
    info.license_key = Some(license_key.to_uppercase());
    info.license_email = Some(email.to_lowercase().trim().to_string());
    info.activated_at = Some(Utc::now());

    // Save updated info
    save_license_info(app_data_dir, &info)?;

    // Return new status
    get_license_status(app_data_dir)
}

/// Deactivate license (for testing purposes - remove in production)
/// Sets trial as expired
#[cfg(debug_assertions)]
pub fn deactivate_license(app_data_dir: &PathBuf) -> Result<(), String> {
    // Instead of deleting, create an expired trial
    // Set first_run to 31 days ago so trial is expired
    let expired_date = Utc::now() - Duration::days(31);
    let info = LicenseInfo {
        first_run: expired_date,
        license_key: None,
        activated_at: None,
        license_email: None,
    };

    save_license_info(app_data_dir, &info)?;
    Ok(())
}

/// Reset trial to fresh state (for testing purposes - remove in production)
/// Creates a new trial period starting now
#[cfg(debug_assertions)]
pub fn reset_trial(app_data_dir: &PathBuf) -> Result<(), String> {
    // Create a fresh trial starting now
    let info = LicenseInfo {
        first_run: Utc::now(),
        license_key: None,
        activated_at: None,
        license_email: None,
    };

    save_license_info(app_data_dir, &info)?;
    Ok(())
}
