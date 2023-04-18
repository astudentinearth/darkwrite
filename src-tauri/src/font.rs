extern crate font_loader as fonts;

use fonts::system_fonts;

#[tauri::command]
pub fn get_fonts() -> Vec<String>{
    let sysfonts = system_fonts::query_all();
    sysfonts.into()
}