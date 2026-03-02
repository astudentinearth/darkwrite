import { Layout } from "@/features/layout";
import { HashRouter, Route, Routes } from "react-router-dom";
import { EditorViewRouteHandler } from "./features/editor/editor-view";
import HomePage from "./features/home/home-page";
import UpdateChecker from "./features/update/update-checker";
import { noteLoader } from "./lib/note-loader";
import { Provider } from "react-redux";
import { store } from "./features/store/redux";

function App() {
  return (
    <div className="w-full h-full overflow-hidden app-fade-in">
      <Provider store={store}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />}></Route>
              <Route
                path="/page/:pageId"
                loader={noteLoader}
                element={<EditorViewRouteHandler />}
              ></Route>
              <Route path="settings" element={<></>}></Route>
            </Route>
          </Routes>
        </HashRouter>
        <UpdateChecker />
      </Provider>
    </div>
  );
}

export default App;
