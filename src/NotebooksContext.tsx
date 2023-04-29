import React from 'react';
import { INotebook } from './Util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NotebooksContext: any = React.createContext({ notebooks: [] as INotebook[], setNotebooks: () => { return; } });
