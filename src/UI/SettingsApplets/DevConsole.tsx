import { CreateNotebook, DeleteNotebook, GetNotebookHeaders, RenameNotebook } from "../../backend/Notebook";
import AppletBase from "../Components/SettingsApplet";
import { KeyboardEvent, useRef } from "react";

/** A component with one input field and a span element to show output. Used for testing backend methods. Not every function might be available. */
export function DevConsole(){
    let inpRef = useRef<HTMLInputElement>(null);
    let output = useRef<HTMLSpanElement>(null);
    function runConsoleCommand(event: KeyboardEvent<HTMLInputElement>){
        if(event.key!="Enter") return;
        if (inpRef.current == null) return;
        let cmd = inpRef.current.value;
        if(cmd=="" || cmd.trim() == "" || cmd == null) return;
        if(output.current==null) { exec(cmd); return};
        exec(cmd).then((ret)=>{
            if(output.current==null) return;
            output.current.innerText=ret;
        });
    }
    return <AppletBase>
        <input id="devConsole" className="w-96 block bg-secondary" placeholder="Enter a command here and check devtools for output. Use %20 for spaces in parameters!" ref={inpRef} onKeyDown={runConsoleCommand}></input>
        <span className="select-text" ref={output}></span>
    </AppletBase>
}

async function exec (cmd: string){
    let tokens: string[] = cmd.split(' ');
    if(tokens.length==0) return "";
    switch(tokens[0]){
        case "ListNotebooks":
            let notebooks = await GetNotebookHeaders();
            let outstr = "";
            for (let n of notebooks){
                outstr+="ID: "+n.id+" | Name: "+n.name+"\n";
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
    }
    if(tokens.length<3) return "Unknown command.";
    switch(tokens[0]){
        case "RenameNotebook":
            if(tokens[1]==null || tokens[2]==null) return "Usage: RenameNotebook <id> <newName>";
            let result = await RenameNotebook(tokens[1],tokens[2].replace('%20',' '));
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