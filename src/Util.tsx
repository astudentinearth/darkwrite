/**
 * Type of font to be used in a note.
 */
enum FontStyle{
    Sans=0,
    Serif=1,
    Monospace=2,
    Handwriting=3,
    Custom=4
}

/**
 * Data structure for a note.
 */
interface INote{
    id:string,
    title:string,
    content:string,
    background:string,
    foreground:string,
    font:FontStyle,
    customFontFamily?:string
}

/**
 * Data structure for a task.
 */
interface ITask{
    id:string,
    content:string,
    completed:boolean
}

/**
 * User data interface to be loaded. Contains notes and tasks.
 */
interface IAppData{
    notes:INote[],
    tasks:INote[]
}


/**
 * Get a font style from string
 * @param str 
 * @returns Relevant FontStyle
 */
function FontStyleFromString(str:string){
    switch(str){
        case "sans":
            return FontStyle.Sans;

        case "serif":
            return FontStyle.Serif;

        case "handwriting":
            return FontStyle.Handwriting;

        case "mono":
            return FontStyle.Monospace;

        default:
            return FontStyle.Custom;
    }
}

/**
 * Converts a byte array to base64
 * @param buf Target byte array (Uint8Array)
 * @returns Base64 encoded string
 */
function Uint8ArrayToBase64(buf:Uint8Array){
    let len=buf.byteLength;
    let bin = '';
    for(let i = 0; i<len;i++){
        bin+=String.fromCharCode(buf[i]);
    }
    return window.btoa(bin);
}

/**
 * Converts a JSON object to INote
 * @param json target json object
 * @returns INote based on the JSON object with missing params completed
 */
function ConvertJSONToINote(json:any){
    let ret:INote[]=[];
    json.forEach((element:any) => {
        let n: INote={id:element.id ?? GenerateID(), // if there is not an id, give it an id
            title:element.title ?? "",
            content:element.content ?? "",
            background:element.background ?? "#FFFFFF",
            foreground:element.foreground ?? "#000000",
            font:FontStyleFromString(element.font) ?? FontStyle.Sans,
            customFontFamily:element.customFontFamily ?? ""};
        ret.push(n);
        if(n.id.trim()===""){ // check if its just an empty/space string
            n.id=GenerateID();
        }
    });
    return ret;
}
/**
 * Generates a unique identifier to be attached to notes.
 * @returns Unique ID using the current timestamp combined with a 8 digit random number
 */
function GenerateID(){
    // time.getTime + 8 digit random number
    let t = new Date();
    let n = Math.floor(Math.random()*(10**8));
    let id:string = t.getTime().toString() + n.toString();
    return id;
}


function JSONToITaskArray(json:any){
    let tasks = [] as ITask[];
    for(let t of json.tasks){
        tasks.push(
            {
                content: t.content ?? "Task",
                id: t.id ?? GenerateID(),
                completed: t.completed ?? false
            } as ITask
        );
    }
    return tasks;
}
export { Uint8ArrayToBase64, GenerateID, ConvertJSONToINote, FontStyle,JSONToITaskArray };
export type {INote, ITask, IAppData };
