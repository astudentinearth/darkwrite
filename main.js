let NotesContainer=document.getElementById("notesDiv");

var EditedNote;

function NewNoteClickHandler(){
    EditDialogPop(NewNote());
}

function NewNote(){
    var root = document.createElement("div");
    root.className="note";
    root.style.background="rgba(255,255,255,0.1)";
    root.style.width="200px";
    root.onclick=()=>{
        EditDialogPop(root);
    };

    
    root.innerText="New note";

    NotesContainer.appendChild(root);
    return root;
}

function EditDialogPop(note){
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
    

    var write = document.createElement("span");
    write.innerText="Edit note:";

    var edit = document.createElement("textArea");
    edit.value=note.innerText;
    DialogBox.appendChild(write);
    DialogBox.appendChild(edit);
   
    var btnOK = document.createElement("button");
    btnOK.innerText="OK";
    btnOK.onclick=()=>{
        EditedNote.innerText=edit.value;
        document.body.removeChild(dim);
        delete(dim);
        delete(write);
        delete(edit);
        delete(btnOK);
    };
    DialogBox.appendChild(btnOK);
    dim.appendChild(DialogBox);

    
}