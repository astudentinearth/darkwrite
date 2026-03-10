import { Layout } from "@/features/layout";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";
import { EditorViewRouteHandler } from "./features/editor/editor-view";
import HomePage from "./features/home/home-page";
import { AppStore } from "./features/store/redux";
import UpdateChecker from "./features/update/update-checker";
import { noteLoader } from "./lib/note-loader";

function App({ store }: { store: AppStore }) {
  return (
    <div className="w-full h-full overflow-hidden app-fade-in">
      <Provider store={store}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />}></Route>
              <Route
                path="/page/:pageId"
                loader={({ params }) => noteLoader({ params, store })}
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
