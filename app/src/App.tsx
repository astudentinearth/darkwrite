import { Layout } from "@/features/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { EditorViewRouteHandler } from "./features/editor/editor-view";
import HomePage from "./features/home/home-page";
import UpdateChecker from "./features/update/update-checker";
import { noteLoader } from "./lib/note-loader";
import { Provider } from "react-redux";
import { store } from "./features/store/redux";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <div className="w-full h-full overflow-hidden app-fade-in">
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />}></Route>
                <Route
                  path="/page/:pageId"
                  loader={noteLoader}
                  element={<></>}
                ></Route>
                <Route path="settings" element={<></>}></Route>
              </Route>
            </Routes>
          </HashRouter>
          <UpdateChecker />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </Provider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
