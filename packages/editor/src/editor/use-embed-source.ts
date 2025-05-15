import { use, useEffect, useState } from "react";
import { DarkwriteEditorContext } from "./context";


export const useEmbedSource = (embedId: string) => {
  const [source, setSource] = useState<string>("");
  const {embedSourceResolver} = use(DarkwriteEditorContext)
  useEffect(()=>{
    if(!embedId) setSource("");
    (async ()=>{
      setSource(await embedSourceResolver(embedId));
    })();
  }, [embedId, embedSourceResolver]);
  return source;
}