// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn open_new_window(app_handle: tauri::AppHandle, label: String) -> Result<(), String> {
    tauri::WebviewWindowBuilder::new(
        &app_handle,
        label,                                       // Use the provided unique label
        tauri::WebviewUrl::App("index.html".into()), // Or a custom HTML file
    )
    .title("New Window")
    .inner_size(800.0, 600.0)
    .build()
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn open_external_window(app: tauri::AppHandle) -> Result<(), String> {
    tauri::WebviewWindowBuilder::new(
        &app,
        "external",                                 // Unique window label
        tauri::WebviewUrl::App("/external".into()), // Opens /external route
    )
    .title("External Page")
    .inner_size(800.0, 600.0)
    .build()
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn open_custom_window(
    app: tauri::AppHandle,
    label: String,
    path: String,
) -> Result<(), String> {
    tauri::WebviewWindowBuilder::new(
        &app,
        &label,                              // Unique window label
        tauri::WebviewUrl::App(path.into()), // Opens /external route
    )
    .title(label)
    .inner_size(800.0, 600.0)
    .build()
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            open_new_window,
            open_external_window,
            open_custom_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
