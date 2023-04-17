#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

// use
use std::fs;
use std::path::{Path};

mod dir;
fn main() {
  
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![readfile,path_exists,createDir,listdir,openURL,dir::dir::is_directory])  
  .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn readfile(file_path: String) -> String{
  println!("Reading file {}",file_path);
  let content = fs::read_to_string(file_path).expect("Couldn't read file");
  content.into()
}

#[tauri::command]
fn path_exists(target_path: String)->bool{
  let result = Path::new(&target_path).exists();
  result.into()
}

#[tauri::command]
fn createDir(dir:String){
  println!("Creating directory {}",dir);
  fs::create_dir(dir);
}

#[tauri::command]
fn listdir(dir:String) -> Vec<String>{
  let entries = fs::read_dir(dir).unwrap();
  let mut ret = Vec::new();
  for i in entries{
    let x=i.unwrap().path().file_name().unwrap().to_string_lossy().into_owned();
    ret.push(x);
  }
  ret.into()
}

#[tauri::command]
fn openURL(url:String) {
  open::that(url).unwrap();
}
