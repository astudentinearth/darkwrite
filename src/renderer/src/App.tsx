import {Layout} from "@renderer/features/layout"
import { useSettingsStore } from "./context/settings-store"
import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./features/home";
import { EditorRoot } from "./features/editor";
import { SettingsPage } from "./features/settings";

function App() {
  const store = useSettingsStore();
  useEffect(()=>{
    window.api.settings.load().then((prefs)=>{
      if(prefs == null) throw new Error("Could not load user settings");
      else store.overwrite(prefs);
      console.log(JSON.stringify(prefs));
    })
  }, [store]);

  return (
    <div className='w-full h-full'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<HomePage/>}></Route>
            <Route path="page" element={<EditorRoot/>}></Route>
            <Route path="settings" element={<SettingsPage/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
