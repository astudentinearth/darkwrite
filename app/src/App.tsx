import { Layout } from "@/features/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { EditorViewRouteHandler } from "./features/editor/editor-view";
import HomePage from "./features/home/home-page";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <div className="w-full h-full overflow-hidden">
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />}></Route>
              <Route
                path="/page/:pageId"
                loader={() => null}
                element={<EditorViewRouteHandler/>}
              ></Route>
              <Route path="settings" element={<></>}></Route>
            </Route>
          </Routes>
        </HashRouter>
        <Toaster duration={5000} />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </div>
  );
}

export default App;
