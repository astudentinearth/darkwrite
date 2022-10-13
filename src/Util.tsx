interface INote{
    id:string,
    title:string,
    content:string,
    bg:string,
    fg:string
}

interface ITask{
    id:string,
    content:string,
    completed:boolean
}

interface IAppData{
    notes:INote[],
    tasks:INote[]
}


function Uint8ArrayToBase64(buf:Uint8Array){
    let len=buf.byteLength;
    let bin = '';
    for(let i = 0; i<len;i++){
        bin+=String.fromCharCode(buf[i]);
    }
    return window.btoa(bin);
}
export { Uint8ArrayToBase64 };
export type { INote, ITask, IAppData };
