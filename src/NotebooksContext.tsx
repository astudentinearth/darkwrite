import React, { Dispatch, SetStateAction } from 'react';
import { NotebookInfo } from './Util';


export interface NotebooksContextType{
    notebooks: NotebookInfo[],
    setNotebooks: Dispatch<SetStateAction<NotebookInfo[]>>
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NotebooksContext = React.createContext<NotebooksContextType>({ notebooks: [] as NotebookInfo[], setNotebooks: () => { return; } });
