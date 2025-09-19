use serde::{Deserialize, Serialize};
use sqlx::{
    Sqlite,
    migrate::Migrator,
    sqlite::{SqliteConnectOptions, SqlitePool},
    types::chrono::{Local, NaiveTime},
};
use std::fs;
use tauri::{AppHandle, Manager, async_runtime::Mutex};
use tauri_plugin_notification::NotificationExt;
use tokio::time::sleep;

pub struct AppState {
    pub db: Mutex<SqlitePool>,
}

// Create a Rust command that will be exposed to the frontend
#[tauri::command]
fn show_notification(app: AppHandle) {
    println!("masuk");
    app.notification()
        .builder()
        .title("Tauri")
        .body("Tauri is awesome")
        .show()
        .unwrap();
}

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

#[derive(Serialize, Deserialize, sqlx::FromRow)]
struct Todo {
    id: i32,
    title: String,
    completed: bool,
    reminder: Option<String>,
}

#[tauri::command]
async fn add_todo(
    app_handle: tauri::AppHandle,
    app_state: tauri::State<'_, AppState>,
    title: String,
    completed: u16,
    reminder: Option<String>,
) -> Result<(), String> {
    let pool = app_state.db.lock().await;
    let _row: (i32,) = sqlx::query_as::<Sqlite, _>(
        r#"INSERT INTO todos (title, completed,reminder) VALUES ($1, $2, $3) RETURNING id"#,
    )
    .bind(&title)
    .bind(completed)
    .bind(&reminder)
    .fetch_one(&*pool)
    .await
    .expect("error add todo");
    match reminder {
        Some(reminder) => {
            let now = Local::now();
            let now_date = now.date_naive();
            let target_time = match NaiveTime::parse_from_str(&reminder, "%H:%M") {
                Ok(t) => t,
                Err(e) => {
                    eprintln!("Failed to parse time string '{}': {}", &reminder, e);
                    return Ok(());
                }
            };

            let target_datetime = now_date
                .and_time(target_time)
                .and_local_timezone(Local)
                .unwrap();

            // If the target time is in the past for today, schedule it for tomorrow.
            // if target_datetime < now {
            //     target_datetime += Duration::days(1);
            // }

            let duration_until_target =
                target_datetime.signed_duration_since(now).to_std().unwrap();

            tokio::spawn(async move {
                println!(
                    "Task scheduled to run at: {}",
                    target_datetime.format("%Y-%m-%d %H:%M:%S")
                );
                sleep(duration_until_target).await;
                println!(
                    "push notification todo {} with scheduled {}",
                    &title,
                    target_datetime.format("%Y-%m-%d %H:%M:%S")
                );
                app_handle
                    .notification()
                    .builder()
                    .title(format!("Elu ingetin gw ngelakuin {}", &title))
                    .body(format!("jam {}", &reminder))
                    .show()
                    .unwrap();
            });
        }
        None => {
            println!("not reminder")
        }
    }
    Ok(())
}

#[tauri::command]
async fn get_all_todos(app_state: tauri::State<'_, AppState>) -> Result<Vec<Todo>, String> {
    let local_time = Local::now();
    println!("Local time: {}", local_time);
    let pool = app_state.db.lock().await;
    let todos = sqlx::query_as::<_, Todo>(r#"SELECT id, title, completed, reminder FROM todos"#)
        .fetch_all(&*pool)
        .await
        .expect("error get todos");

    Ok(todos)
}

#[tauri::command]
async fn delete_todo_by_id(app_state: tauri::State<'_, AppState>, id: i32) -> Result<(), String> {
    let pool = app_state.db.lock().await;
    sqlx::query(r#"DELETE FROM todos WHERE id = $1"#)
        .bind(&id)
        .execute(&*pool)
        .await
        .expect("error delete todo");

    Ok(())
}

#[tauri::command]
async fn update_state_todo_by_id(
    app_state: tauri::State<'_, AppState>,
    completed: u16,
    id: i32,
) -> Result<(), String> {
    let pool = app_state.db.lock().await;
    sqlx::query(r#"UPDATE todos SET completed = $1 WHERE id = $2"#)
        .bind(completed)
        .bind(id)
        .execute(&*pool)
        .await
        .expect("error update todo");

    Ok(())
}

static MIGRATOR: Migrator = sqlx::migrate!("./migrations");

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init()) // Add this line
        .setup(|app| {
            let app_handle = app.handle().clone();
            tauri::async_runtime::block_on(async move {
                let _ = fs::create_dir_all(app.path().app_data_dir().unwrap());
                let db_path = app.path().app_data_dir().unwrap().join("test.db");

                let options = SqliteConnectOptions::new()
                    .filename(db_path)
                    .create_if_missing(true);
                let pool = SqlitePool::connect_with(options)
                    .await
                    .expect("error init pool db");
                // Run migrations if you have any
                // let migrations = Migrator::new(std::path::Path::new("./migrations"))
                //     .await
                //     .expect("error migrations");
                // migrations.run(&pool).await.expect("error run migrations ");
                MIGRATOR.run(&pool).await.expect("error run migrations");

                app_handle.manage(AppState {
                    db: Mutex::new(pool),
                });
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            show_notification,
            greet,
            open_new_window,
            open_external_window,
            open_custom_window,
            get_all_todos,
            add_todo,
            delete_todo_by_id,
            update_state_todo_by_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
