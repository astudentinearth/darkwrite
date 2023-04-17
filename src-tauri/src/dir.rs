pub mod dir{
    use std::fs::metadata;
    #[tauri::command]
    pub fn is_directory(path: String) -> bool {
        let md = metadata(path).unwrap();
        md.is_dir().into()
    }
}

