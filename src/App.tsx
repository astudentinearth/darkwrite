import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './index.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import { SetupThemes, ApplyWallpaper } from './Theme';
import {LoadTasks} from './UI/Tasks';
import {LoadSettings} from "./GlobalSettings"
import MainToolbar from './UI/MainToolbar';
import Sidebar from './UI/Sidebar';
import { Settings } from './UI/Settings';
import "./fonts/roboto/roboto.css"
import "./fonts/roboto-mono/roboto-mono.css"
import "./fonts/roboto-slab/roboto-slab.css"
import "./fonts/yellowtail/yellowtail.css"
import {NoteEditor, NotesPanel} from './UI/NotesPanel';
import { GetNotebooks, INotebook } from './Util';
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';

export const NotebooksContext:any = React.createContext({notebooks: [] as INotebook[],setNotebooks:()=>{}})

function App() {
  const [notebooks,setNotebooks] = useState([] as INotebook[]);
  const notebooksValue = {notebooks,setNotebooks};
  const isFirstRender=useRef(true);
  
  useEffect(()=>{
    console.log("Application started. Initializing");
    Init().then(async ()=>{
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
  return (
    <div className="App background-default">
      <div className='app_root overflow-y-scroll bg-center bg-cover bg-no-repeat select-none absolute text-default transition-all w-full h-full duration-200'>
        <NotebooksContext.Provider value={notebooksValue}>
          <MainToolbar></MainToolbar>
          <Sidebar></Sidebar>
          <Settings></Settings>
          <NotesPanel></NotesPanel>
          <NoteEditor></NoteEditor>
        </NotebooksContext.Provider>
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
