import { BaseDirectory, createDir, exists, writeTextFile } from '@tauri-apps/api/fs';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import { LoadSettings, SaveAllSettings } from "./GlobalSettings";
import { SettingsContext } from "./SettingsContext";
import { GlobalSettings } from "./Settings";
import { ApplyWallpaper, SetupThemes } from './Theme';
import { NoteContextMenu } from './UI/Components/NoteContextMenu';
import MainToolbar from './UI/MainToolbar';
import { NoteEditor, ShowNoteEditor } from './UI/NoteEditor';
import { NotesPanel } from './UI/NotesPanel';
import { Settings } from './UI/Settings';
import Sidebar from './UI/Sidebar';
import { LoadTasks } from './UI/Tasks';
import { GetNotebookHeaders } from './backend/Notebook';
import "./fonts/roboto-mono/roboto-mono.css";
import "./fonts/roboto-slab/roboto-slab.css";
import "./fonts/roboto/roboto.css";
import "./fonts/yellowtail/yellowtail.css";
import { NotebooksContext, NotebooksContextType } from './NotebooksContext';
import { LocaleContext } from './localization/LocaleContext';
import { ActiveNotebookContext } from './UI/ActiveNotebookContext';
import { GenerateID, NotebookInfo } from './Util';
import { MoveToNewNotebookDialog } from './UI/Components/MoveToNewNotebookDialog';
import {type, OsType} from '@tauri-apps/api/os'
import { TemplateNoteInfo } from './UI/TemplateNoteInfo';

function App() {
  const [notebooks,setNotebooks] = useState<NotebookInfo[]>([] as NotebookInfo[]);
  const [settings,updateSettings]=useState(GlobalSettings.GetDefault());
  const [activeNotebook, setActiveNotebook] = useState<string>("0");
  const notebooksValue = {notebooks: notebooks, setNotebooks: setNotebooks} as NotebooksContextType;
  const isFirstRender=useRef(true);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const [locale, setLocale] = useState("en_us");
  let platform:OsType;
  useEffect(()=>{
    console.log("Application started. Initializing");
    async function Init(){
      updateSettings(await LoadSettings());
      document.body.style.setProperty("background","rgb(var(--background-default))");
      if(!await exists("notes/",{dir:BaseDirectory.App})) createDir("notes",{dir:BaseDirectory.App});
      await SetupThemes({settings,updateSettings});
      await LoadTasks();
      await ApplyWallpaper();
      setNotebooks(await GetNotebookHeaders());
      platform = await type();
    }
    Init().then(()=>{
      setLocale(settings.Locale);
      document.addEventListener("keydown", async (event: KeyboardEvent)=>{
        // Search: CTRL + K, Cmd + K, CTRL+/, Cmd+/
        if((event.ctrlKey || event.metaKey) && (event.key==="/" || event.key==="k")){
          document.getElementById("searchInput")?.focus();
          return;
        }
        // New note: CTRL+N or Cmd+N
        if((event.ctrlKey || event.metaKey) && event.key==="n"){
          ShowNoteEditor({...TemplateNoteInfo, id: GenerateID(), notebookID: activeNotebook})
          return;
        }
      })
    });
  },[]);
  useLayoutEffect(()=>{
    if(isFirstRender.current){
      isFirstRender.current=false;
      return;
    }
    writeTextFile("notebooks.json",JSON.stringify({"notebooks":notebooks}),{dir:BaseDirectory.App});
    SaveAllSettings({settings,updateSettings});
    setLocale(settings.Locale);
  },[notebooks,settings]);
  useEffect(()=>{
    if(notebooks.length!=0) setActiveNotebook(notebooks[0].id);
  },[notebooks])
  return (
    <div className="App absolute left-0 right-0 bottom-0 top-0 background-default">
     <div className='overflow-y-hidden overflow-x-hidden select-none relative p-2 right-0 bottom-0 items-stretch gap-2 flex flex-col text-default transition-all w-full h-full duration-200'>
        <SettingsContext.Provider value={{settings,updateSettings}}>
          <NotebooksContext.Provider value={notebooksValue}>
            <LocaleContext.Provider value={{locale, setLocale}}>
              <ActiveNotebookContext.Provider value={{notebookID: activeNotebook, setNotebookID: setActiveNotebook}}>
                <img id="bgImage" ref={bgImgRef} style={{filter: `blur(${settings.WallpaperBlurRadius}px) brightness(${settings.WallpaperBrightness}%) grayscale(${settings.WallpaperGrayscale}%)`}} className="absolute z-0 left-0 right-0 top-0 bottom-0 m-0 p-0 w-full h-full"></img>
                  <MainToolbar></MainToolbar>
                  <div className='flex-grow min-h-0 flex flex-row w-full h-full'>
                    <Sidebar></Sidebar>
                    <Settings></Settings>
                    <NotesPanel></NotesPanel>
                    <NoteEditor></NoteEditor>
                    <NoteContextMenu></NoteContextMenu>
                  </div>
                  <MoveToNewNotebookDialog>
                  </MoveToNewNotebookDialog>
              </ActiveNotebookContext.Provider>
            </LocaleContext.Provider>
          </NotebooksContext.Provider>
        </SettingsContext.Provider>
      </div>
    </div>
  );
}

// Run startup hooks

export default App;
