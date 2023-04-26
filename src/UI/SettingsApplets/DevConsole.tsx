/* eslint-disable no-case-declarations */
import { KeyboardEvent, useEffect, useRef } from "react";
import { getFonts } from "../../API";
import { GetAllNoteHeaders, GetNoteHeaders } from "../../backend/Note";
import { CreateNotebook, DeleteNotebook, GetNotebookHeaders, RenameNotebook } from "../../backend/Notebook";
import { TestSearch } from "../../backend/Search.test";
import helptxt from "./DevConsoleHelp.txt?raw";

/** A component with one input field and a span element to show output. Used for testing backend methods. Not every function might be available. */
export function DevConsole(){
    const inpRef = useRef<HTMLInputElement>(null);
    const output = useRef<HTMLSpanElement>(null);
    function runConsoleCommand(event: KeyboardEvent<HTMLInputElement>){
        if(event.key!="Enter") return;
        if (inpRef.current == null) return;
        const cmd = inpRef.current.value;
        if(cmd=="" || cmd.trim() == "" || cmd == null) return;
        if(output.current==null) { exec(cmd); return}
        exec(cmd).then((ret)=>{
            if(output.current==null) return;
            output.current.innerText=ret;
        });
    }
    useEffect(()=>{
        if (output.current==null) return;
        output.current.innerText=helptxt;
    })
    return <div className="left-4 mx-auto right-4 top-4 bottom-4 absolute my-auto overflow-y-scroll bg-secondary drop-shadow-md p-4 rounded-xl">
        <div className="overflow-x-scroll flex justify-between items-stretch flex-col gap-2 ">
            <input id="devConsole" className="w-full flex bg-primary drop-shadow-md p-2 rounded-md outline-none" style={{fontFamily:"Roboto Mono"}} placeholder=" $ ~ Use %20 for spaces in parameters!" ref={inpRef} onKeyDown={runConsoleCommand}></input>
            <span className="select-text flex p-2 bg-primary whitespace-nowrap w-full drop-shadow-md max-h-[600px] overflow-y-scroll rounded-md overflow-x-scroll" style={{fontFamily:"Roboto Mono"}} ref={output}></span>
        </div>
    </div>
}

async function exec (cmd: string){
    const tokens: string[] = cmd.trim().split(' ');
    if(tokens.length==0) return "";
    let outstr = "";
    switch(tokens[0]){
        case "ListNotebooks":
            const notebooks = await GetNotebookHeaders();
            for (const n of notebooks){
                outstr+="ID: "+n.id+" | Name: "+n.name+"\n";
            }
            return outstr;

        case "ListAllNotes":
            const notes = await GetAllNoteHeaders();
            for (const n of notes){
                outstr+="ID: "+n.id+" | Title: "+n.title+"\n";
            }
            return outstr;

        case "help":
            return helptxt;

        case "Search":
            const q = cmd.trim().substring(7);
            return TestSearch(q);

        case "ListFonts":
            const fonts:string[] = await getFonts();
            for (const f of fonts){
                outstr+=f+"\n";
            }
            return outstr;
    }
    if(tokens.length<2) return "Unknown command.";
    switch(tokens[0]){
        case "CreateNotebook":
            if(tokens[1]==null) return "Missing notebook name.";
            await CreateNotebook(tokens[1].replace("%20"," "));
            return "Notebook created. Check '{APPDIR}/notes/' to verify.";

        case "DeleteNotebook":
            if(tokens[1]==null) return "Missing notebook id.";
            await DeleteNotebook(tokens[1]);
            return "If such notebook existed, its now gone forever.";

        case "ListNoteHeaders":
            if(tokens[1]==null) return "Missing notebook id.";
            const headers = await GetNoteHeaders(tokens[1]);
            for(const n of headers){
                outstr+="ID: "+n.id+" | Title: "+n.title+"\n";
            }
            return outstr;
    }
    if(tokens.length<3) return "Unknown command.";
    switch(tokens[0]){
        case "RenameNotebook":
            if(tokens[1]==null || tokens[2]==null) return "Usage: RenameNotebook <id> <newName>";
            const result = await RenameNotebook(tokens[1],tokens[2].replace('%20',' '));
            switch(result){
                case 0:
                    return "Renamed notebook.";

                case 1:
                    return "Notebook doesn't exist."

                case 2:
                    return "_notebookinf.json not found."

                case 99:
                    return "Unknown error occured. Check DevTools to identify the issue."
            }
    }
    return "Unknown command.";
}