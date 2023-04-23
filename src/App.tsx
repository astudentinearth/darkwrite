import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './index.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import { SetupThemes, ApplyWallpaper } from './Theme';
import {LoadTasks} from './UI/Tasks';
import {GlobalSettings, LoadSettings, SaveAllSettings, SettingsContext} from "./GlobalSettings"
import MainToolbar from './UI/MainToolbar';
import Sidebar from './UI/Sidebar';
import { Settings } from './UI/Settings';
import "./fonts/roboto/roboto.css"
import "./fonts/roboto-mono/roboto-mono.css"
import "./fonts/roboto-slab/roboto-slab.css"
import "./fonts/yellowtail/yellowtail.css"
import {NotesPanel} from './UI/NotesPanel';
import { GetNotebooks, INotebook } from './Util';
import { BaseDirectory, createDir, exists, writeTextFile } from '@tauri-apps/api/fs';
import { NoteEditor } from './UI/NoteEditor';
import { GetNotebookHeaders } from './backend/Notebook';

export const NotebooksContext:any = React.createContext({notebooks: [] as INotebook[],setNotebooks:()=>{}})

function App() {
  const [notebooks,setNotebooks] = useState([] as INotebook[]);
  const [settings,updateSettings]=useState(GlobalSettings.GetDefault());
  const notebooksValue = {notebooks,setNotebooks};
  const isFirstRender=useRef(true);
  
  useEffect(()=>{
    console.log("Application started. Initializing");
    async function Init(){
      updateSettings(await LoadSettings());
      document.body.classList.add("background-default");
      if(!await exists("notes/",{dir:BaseDirectory.App})) createDir("notes",{dir:BaseDirectory.App});
      await SetupThemes({settings,updateSettings});
      await LoadTasks();
      await ApplyWallpaper();
    }
    Init().then(async ()=>{
      GetNotebookHeaders(); 
      setNotebooks(await GetNotebooks());
    });
  },[]);
  useLayoutEffect(()=>{
    if(isFirstRender.current){
      isFirstRender.current=false;
      return;
    }
    writeTextFile("notebooks.json",JSON.stringify({"notebooks":notebooks}),{dir:BaseDirectory.App});
  },[notebooks]);
  useEffect(()=>{
    SaveAllSettings({settings,updateSettings});
  },[settings]);
  return (
    <div className="App absolute left-0 right-0 bottom-0 top-0 background-default">
     <div className='overflow-y-hidden select-none relative p-2 right-0 bottom-0 items-stretch gap-2 flex flex-col text-default transition-all w-full h-full duration-200'>
      <div id="bgImage" className="absolute z-0 left-0 right-0 top-0 bottom-0 m-0 p-0 w-full h-full"></div>
     
        <SettingsContext.Provider value={{settings,updateSettings}}>
          <NotebooksContext.Provider value={notebooksValue}>
            <MainToolbar></MainToolbar>
            <div className='flex-grow flex flex-row'>
              <Sidebar></Sidebar>
              <Settings></Settings>
              <NotesPanel></NotesPanel>
              <NoteEditor></NoteEditor>
            </div>
          </NotebooksContext.Provider>
        </SettingsContext.Provider>
      </div>
    </div>
  );
}

// Run startup hooks

export default App;
