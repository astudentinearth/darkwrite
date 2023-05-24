use zip::result::ZipError;
use zip::write::FileOptions;
use std::fs::File;
use std::path::{Path, PathBuf};
use zip::ZipWriter;
use tauri::api::dialog;
use zip_extensions::write::zip_create_from_directory;

#[tauri::command]
pub fn export_data(dir:String, filename: String) {
    let p = PathBuf::from(filename);
    let file = File::create(p.clone());
    let appdir = PathBuf::from(dir);
    zip_create_from_directory(&p, &appdir);
}