import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { GetLocalizedResource, LocaleContext } from "../../localization/LocaleContext";
import { SearchNotes, SearchResult, SortSearchResults } from "../../backend/Search";
import { ShowNoteEditor } from "../NoteEditor";

function SearchBox(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchbox:any = useRef(null);
    const {locale} = useContext(LocaleContext);
    const [results, setResults] = useState<SearchResult[]>([])
    const [query, setQuery] = useState<string>("");
    const resultsUI = useRef<HTMLDivElement>(null);
    useEffect(()=>{
      const change = setTimeout(() => {
        const search = async()=>{
          if(query.trim()=="") {setResults([]); return}
          setResults([])
          setResults(SortSearchResults(await SearchNotes(query.trim())).slice(0,10))
        }
        search()
      }, 400);    
      return () => clearTimeout(change);
    },[query]);
    window.addEventListener("resize",(ev)=>{
      resultsUI.current?.style.setProperty("max-height", `${window.innerHeight-80}px`);
    })
    const handleSearch = (event: ChangeEvent<HTMLInputElement>)=>{
      setQuery(event.target.value)
    }
    return <div onClick={()=>{searchbox.current.focus();}} className="flex box-shadow-4-8-20 float-left items-center h-12 hover:bg-hover transition-all rounded-2xl bg-secondary">
        <svg className="absolute ml-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
        <input value={query} id="searchInput" onChange={handleSearch} type="text" ref={searchbox} placeholder={GetLocalizedResource("searchBoxPlaceholder",locale)} className="pl-2 box-border bg-transparent ml-8 inline-block hide-outline search-box h-10 w-80 text-xl"></input>
        <div ref={resultsUI} className="absolute overflow-x-hidden overflow-y-scroll bg-secondary/80 empty:p-0 backdrop-blur-md box-shadow-4-8-20 rounded-2xl w-[22rem] top-[3.75rem]">
          {results.map((x)=>
            <div onClick={()=>{ShowNoteEditor(x.note); setQuery(""); setResults([])}} className="cursor-pointer p-2 m-1 text-left rounded-xl hover:bg-hover/80" key={x.note.id}>
              {x.note.title}
            </div>
          )}
        </div>
    </div>
}

export default SearchBox;