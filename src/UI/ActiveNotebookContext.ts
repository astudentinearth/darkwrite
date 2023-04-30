import React, { Dispatch, SetStateAction } from "react";

export interface ActiveNotebookContextType{
    notebookID: string,
    setNotebookID: Dispatch<SetStateAction<string>>
}

export const ActiveNotebookContext = React.createContext<ActiveNotebookContextType>({notebookID: "0", setNotebookID: ()=>{return;}} as ActiveNotebookContextType)