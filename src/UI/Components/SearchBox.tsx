import { useRef } from "react";

function SearchBox(){
    const searchbox:any = useRef(null);
    return <div onClick={()=>{searchbox.current.focus();}} className="flex backdrop-blur-md float-left items-center h-12 hover:bg-hover/25 transition-all rounded-2xl bg-secondary/25">
        <svg className="absolute ml-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
        <input type="text" ref={searchbox} placeholder="Search" className="pl-2 box-border bg-transparent ml-8 inline-block hide-outline search-box h-10 w-80 text-xl"></input>
    </div>
}

export default SearchBox;