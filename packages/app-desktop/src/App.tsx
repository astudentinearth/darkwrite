import { Layout } from "@renderer/features/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ThemeHandler } from "./components/theme-handler";
import { initializeUserSettings } from "./context/settings-store";
import { EditorRoot } from "./features/editor";
import { HomePage } from "./features/home";
import { SettingsPage } from "./features/settings";
import { useNoteFromURL } from "./hooks/use-note-from-url";
import { SettingsAPI } from "./api";
import { Toaster } from "sonner";

const EditorRootWrapper = () => {
  const note = useNoteFromURL();
  if (!note) return "Not found";
  return <EditorRoot key={`editor-root-${note}`} />;
};

function App() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    SettingsAPI()
      .load()
      .then((prefs) => {
        if (prefs == null) throw new Error("Could not load user settings");
        else initializeUserSettings(prefs);
      });
  }, []);

  return (
    <div className="w-full h-full overflow-hidden">
      <Toaster duration={5000}/>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />}></Route>
              <Route
                path="/page/:pageId"
                loader={() => null}
                element={<EditorRootWrapper />}
              ></Route>
              <Route path="settings" element={<SettingsPage />}></Route>
            </Route>
          </Routes>
        </HashRouter>
        <ThemeHandler />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </div>
  );
}

export default App;
