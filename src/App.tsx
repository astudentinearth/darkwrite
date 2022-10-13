import React, { useEffect } from 'react';
import './index.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import { Theme,Themes,SetupThemes, ApplyTheme, ApplyWallpaper } from './Theme';
// import MainToolbar from './UI/MainToolbar';
import {LoadTasks, Tasks} from './UI/Tasks';
// import {homeDir,appDir} from "../node_modules/@tauri-apps/api/path"
// import {Settings} from './UI/Settings'
import {LoadSettings,GlobalSettings} from "./GlobalSettings"
// import NotesPanel from "./UI/NotesPanel"
import bg from "./feet-on-the-dashboard.png"
import MainToolbar from './UI/MainToolbar';
import Sidebar from './UI/Sidebar';
import { Settings } from './UI/Settings';
import "./fonts/roboto/roboto.css"
import "./fonts/roboto-mono/roboto-mono.css"
import "./fonts/roboto-slab/roboto-slab.css"
import "./fonts/yellowtail/yellowtail.css"
// import Sidebar from './UI/Sidebar';
function App() {
  useEffect(()=>{
    console.log("Application started. Initializing");
    Init();
  },[]);
  return (
    <div className="App background-default">
      <div className='app_root bg-center bg-cover bg-no-repeat select-none absolute text-default transition-all w-full h-full duration-200'>
        <MainToolbar></MainToolbar>
        <Sidebar></Sidebar>
        <Settings></Settings>
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
  await ApplyWallpaper();
}
export default App;