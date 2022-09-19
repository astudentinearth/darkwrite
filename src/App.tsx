import React, { useEffect } from 'react';
import './index.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import { Theme,Themes,SetupThemes, ApplyTheme } from './Theme';
import MainToolbar from './UI/MainToolbar';
import {Tasks} from './UI/Tasks';
import {homeDir,appDir} from "../node_modules/@tauri-apps/api/path"
import Settings from './UI/Settings'
import {LoadSettings,GlobalSettings} from "./GlobalSettings"
import NotesPanel from "./UI/NotesPanel"
let HOME:string;
function App() {
  useEffect(()=>{
    LoadSettings().then(()=>{
      document.body.classList.add("background-default")
    });
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

export default App;
