import React, { useEffect } from 'react';
import './index.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import { Theme,Themes,SetupThemes, ApplyTheme } from './Theme';
import MainToolbar from './UI/MainToolbar';
import {LoadTasks, Tasks} from './UI/Tasks';
import {homeDir,appDir} from "../node_modules/@tauri-apps/api/path"
import Settings from './UI/Settings'
import {LoadSettings,GlobalSettings} from "./GlobalSettings"
import NotesPanel from "./UI/NotesPanel"
function App() {
  useEffect(()=>{
    console.log("Application started. Initializing");
    Init();
  },[]);
  return (
    <div className="App background-default">
      <div className='app_root select-none absolute text-default transition-all w-full h-full'>
        <Tasks></Tasks>
        <MainToolbar></MainToolbar>
        <Settings></Settings>
        <NotesPanel></NotesPanel>
      </div>
    </div>
  );
}

// Run startup hooks
async function Init(){
  await LoadSettings();
  document.body.classList.add("background-default");
  await SetupThemes();
  await LoadTasks();
}
export default App;