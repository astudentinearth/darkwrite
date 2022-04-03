const fs = require("fs");
const { fileURLToPath } = require("url");
const dataDir = process.env.HOME + "/.local/share/darkmatter-notes";
let CurrentColorScheme;
let CurrentColorSchemeString;
let LightThemeColors = JSON.parse(fs.readFileSync("colors_light.json"));
let DarkThemeColors = JSON.parse(fs.readFileSync("colors_dark.json"));
let Settings;
let SearchBox=document.getElementById("searchBox");
(fs.access(dataDir,fs.constants.F_OK,(err)=>{
    if(err){
        console.log("Data directory doesn't exist. Creating one.");
        fs.mkdir(dataDir,(err)=>{});
    }
}));

/*
note json format
{
    "notes": [
        {
            "background": "#ffffff",
            "foreground": "#000000",
            "text": "lorem ipsum"
        }
    ]
}


*/ 
(fs.access(dataDir+"/notes.json",fs.constants.F_OK,(err)=>{
    if(err){
        console.log("Data file doesn't exist. Creating one.");
        fs.writeFileSync(dataDir+"/notes.json",'{"version":"0.0.1a","notes":[]}',(err)=>{});
    }
}));
(fs.access(dataDir+"/settings.json",fs.constants.F_OK,(err)=>{
    if(err){
        console.log("Data file doesn't exist. Creating one.");
        fs.writeFileSync(dataDir+"/settings.json",'{"theme":"light","corner_radius":"10px"}',(err)=>{});
    }
}));
Settings=JSON.parse(fs.readFileSync(dataDir+"/settings.json"));
if(Settings.theme=="light"){
    CurrentColorScheme=LightThemeColors;
    CurrentColorSchemeString="light";
    document.getElementById("menuImg").src="light_theme.svg";
}
if(Settings.theme=="dark"){
    CurrentColorScheme=DarkThemeColors;
    CurrentColorSchemeString="dark";
    document.getElementById("menuImg").src="dark_theme.svg";
}
ApplyTheme();

function ApplyTheme(){
    document.documentElement.style.setProperty("--background",CurrentColorScheme.background);
    document.documentElement.style.setProperty("--foreground",CurrentColorScheme.foreground);
    document.documentElement.style.setProperty("--shadow",CurrentColorScheme.shadow);
    document.documentElement.style.setProperty("--radius",Settings.corner_radius);
    if(CurrentColorSchemeString=="light") {
        document.getElementById("addImg").style.filter="invert(100%)";
        //document.getElementById("menuImg").style.filter="invert(100%)";
    }
    else{
        document.getElementById("addImg").style.filter="";
    }
document.querySelectorAll(".toolbarButton").forEach((element)=>{
    element.style.background=CurrentColorScheme.background;
    element.style.color=CurrentColorScheme.foreground;
});
}
console.log(dataDir);
let NotesContainer=document.getElementById("notesDiv");
let NotesJSON;
var EditedNote;

ReloadNotes();

SearchBox.addEventListener("input",()=>{
    NotesContainer.childNodes.forEach((element)=>{
        if(SearchBox.value==""){
            element.style.display="inline-block";
        }
        else{
            if(String.prototype.includes.call(String.prototype.toLowerCase.call(element.firstChild.innerText),String.prototype.toLowerCase.call(SearchBox.value))
            || String.prototype.includes.call(String.prototype.toLowerCase.call(element.lastChild.innerText),String.prototype.toLowerCase.call(SearchBox.value))){
                element.style.display="inline-block";
            }
            else{
                element.style.display="none";
            }
        }
    });
});

function NewNoteClickHandler(){
    var n= NewNote();
    EditDialogPop(n,true);
}

function ReloadNotes(){
    console.log("Reloading notes...");
    NotesJSON=JSON.parse(fs.readFileSync(dataDir+"/notes.json",(err)=>{
        console.error("ERR_CANT_READ_FILE | Error reading file");
    }));
    
    NotesContainer.innerHTML="";
    NotesJSON.notes.forEach(element => {
        var n=NewNote();
        var txt=n.querySelector("p");
        
        txt.innerText=element.text;
        if(element.bg) n.style.background=element.bg;
        if(element.fg) n.style.color=element.fg;
        var t = n.querySelector("h6");
        t.innerText=element.title;
        
    });
    console.log("Reloaded "+NotesJSON.notes.length.toString()+" notes.");
}

function NewNote(){
    var root = document.createElement("div");
    root.className="note";
    root.style.background="#393939";
    root.style.width="200px";
    root.onclick=()=>{
        EditDialogPop(root);
    };
    var title = document.createElement("h6");
    title.innerText="New note"

    var txt = document.createElement("p");
    
    txt.innerText="Write your notes!";
    root.appendChild(title);
    root.appendChild(txt);
    NotesContainer.appendChild(root);
    
    return root;
}

function EditDialogPop(note,isNewNote){
    EditedNote=note;
    var dim = document.createElement("div");
    dim.style.background="rgba(0,0,0,0.5)";
    dim.style["top"]="0";
    dim.style["left"]="0";
    dim.style["right"]="0";
    dim.style["bottom"]="0";
    dim.style.zIndex="100";
    dim.style.position="absolute";
    dim.style.display="flex";
    dim.style.alignItems="center";
    dim.style.textAlign="center";
    dim.style.justifyContent="center";
    document.body.appendChild(dim);

    var DialogBox = document.createElement("div");
    DialogBox.className="dialogBox";
    DialogBox.style["background"]=CurrentColorScheme.background;
    DialogBox.style["color"]=CurrentColorScheme.foreground;
    DialogBox.style.boxShadow="0px 0px 30px black";

    var write = document.createElement("span");
    write.innerText="Edit Note";
    var index=Array.prototype.indexOf.call(NotesContainer.children,note);
    var editTitle = document.createElement("textarea");
    
    editTitle.value=note.querySelector("h6").innerText;
    editTitle.style.background=note.style.background;
    editTitle.style.color=note.style.color;
    editTitle.style.height="40px";
    editTitle.style.resize="none";
    editTitle.style.display="block";
    
    
    var edit = document.createElement("textArea");
    edit.value=note.querySelector("p").innerText;
    edit.style.background=note.style.background;
    edit.style.color=note.style.color;
    edit.style.display="block";
    DialogBox.appendChild(write);
    DialogBox.appendChild(editTitle);
    DialogBox.appendChild(edit);

    var bgPick = document.createElement("input");
    bgPick.type="color";
    bgPick.innerText="Background";
    
    bgPick.addEventListener("input",()=>{edit.style.background=bgPick.value;editTitle.style.background=bgPick.value;},false);
    if(!isNewNote){
        bgPick.value=NotesJSON.notes[index].bg;
    }
    else{
        bgPick.value="#393939";
    }
    var fgPick = document.createElement("input");
    fgPick.type="color";
    fgPick.innerText="Text";
    fgPick.addEventListener("input",()=>{edit.style.color=fgPick.value;editTitle.style.color=fgPick.value;},false);
    if(!isNewNote){
        fgPick.value=NotesJSON.notes[index].fg;
    }
    else{
        fgPick.value="#ffffff";
    }
    
    var btnOK = document.createElement("button");
    btnOK.innerText="OK";
    btnOK.style.color=CurrentColorScheme.foreground;
    btnOK.onclick=()=>{
        EditedNote.querySelector("p").innerText=edit.value;
        EditedNote.querySelector("h6").innerText=editTitle.value;
        
        if(!isNewNote){
            var index=Array.prototype.indexOf.call(NotesContainer.children,note);
            NotesJSON.notes.splice(index,1);
        }
        var toJSON = {"text":EditedNote.querySelector("p").innerText,"bg":bgPick.value,"fg":fgPick.value,"title":editTitle.value};
        NotesJSON.notes.unshift(toJSON);
        SaveNotes();
        DialogBox.classList.add("collapsebox");
        DialogBox.addEventListener("animationend",()=>{
            document.body.removeChild(dim);
            delete(dim);
            delete(write);
            delete(edit);
            delete(btnOK);
        });
    };
    var btnDELETE=document.createElement("button");
    btnDELETE.innerText="DELETE";
    btnDELETE.style.color=CurrentColorScheme.foreground;
    btnDELETE.onclick=()=>{

        
        if(isNewNote==true){
            NotesContainer.removeChild(EditedNote);
            
        }
        else{
            
            NotesJSON.notes.splice(index,1);

            SaveNotes();
        }
            DialogBox.classList.add("collapsebox");
            DialogBox.addEventListener("animationend",()=>{
                document.body.removeChild(dim);
                delete(dim);
                delete(write);
                delete(edit);
                delete(btnOK);
            });
            
    };
    DialogBox.appendChild(bgPick);
    DialogBox.appendChild(fgPick);
    DialogBox.appendChild(btnOK);
    DialogBox.appendChild(btnDELETE);
    
    dim.appendChild(DialogBox);

    
}

function SaveNotes(){

var j = JSON.stringify(NotesJSON);
fs.writeFileSync(dataDir+"/notes.json",j,(err)=>{
    if(err){
        window.alert("Couldn't save notes to file.");
        console.error("Couldn't save notes to file.");
    }
});
ReloadNotes();
}

function changeTheme(){
    if(CurrentColorSchemeString=="light"){
        CurrentColorSchemeString="dark";
        CurrentColorScheme=DarkThemeColors;
        document.getElementById("menuImg").src="dark_theme.svg";
        Settings.theme="dark";
        fs.writeFileSync(dataDir+"/settings.json",JSON.stringify(Settings),(err)=>{});
    }
    else{
        CurrentColorSchemeString="light";
        CurrentColorScheme=LightThemeColors;
        document.getElementById("menuImg").src="light_theme.svg";
        Settings.theme="light";
        fs.writeFileSync(dataDir+"/settings.json",JSON.stringify(Settings),(err)=>{});
    }
    ApplyTheme();
}