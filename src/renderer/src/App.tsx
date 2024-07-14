import {Layout} from "@renderer/features/layout"
import { useSettingsStore } from "./context/settings-store"
import { useEffect } from "react"

function App() {
  const store = useSettingsStore();
  useEffect(()=>{
    window.api.settings.load().then((prefs)=>{
      if(prefs == null) throw new Error("Could not load user settings");
      else store.overwrite(prefs);
      console.log(JSON.stringify(prefs));
    })
  }, []);
  return (
    <div className='w-full h-full'>
      <Layout></Layout>
    </div>
  )
}

export default App
