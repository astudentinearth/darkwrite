import { EmbedAPI } from "@/api";
import { useEffect, useState } from "react"

export const useEmbedSource = (embedId: string) => {
  const [source, setSource] = useState<string>("");
  useEffect(()=>{
    if(!embedId) setSource("");
    (async ()=>{
      setSource(await EmbedAPI().resolveSourceURL(embedId));
    })();
  }, [embedId]);
  return source;
}