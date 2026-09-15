use keyring::Entry;

#[tauri::command]
fn store_user_token(service: &str, account: &str, token: &str) -> Result<(), String> {
    let entry = Entry::new(service, account)
        .map_err(|e| format!("Keyring init error: {e}"))?;
    
    entry.set_password(token)
        .map_err(|e| format!("Keyring save error: {e}"))?;
    
    Ok(())
}

#[tauri::command]
fn get_user_token(service: &str, account: &str) -> Result<String, String> {
    let entry = Entry::new(service, account)
        .map_err(|e| format!("Keyring init error: {e}"))?;
    
    entry.get_password()
        .map_err(|e| format!("Keyring fetch error: {e}"))
}

#[tauri::command]
fn delete_user_token(service: &str, account: &str) -> Result<(), String> {
    let entry = Entry::new(service, account)
        .map_err(|e| format!("Keyring init error: {e}"))?;

    entry.delete_credential()
        .map_err(|e| format!("Keyring delete error: {e}"))
}

#[tauri::command]
fn has_user_token(service: &str, account: &str) -> Result<bool, String> {
    let entry = Entry::new(service, account)
        .map_err(|e| format!("Keyring init error: {e}"))?;

    match entry.get_password() {
        Ok(_) => Ok(true),
        Err(keyring::Error::NoEntry) => Ok(false),
        Err(e) => Err(format!("Keyring fetch error: {e}")),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            store_user_token,
            get_user_token,
            delete_user_token,
            has_user_token
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
