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

export type {INote,ITask,IAppData}