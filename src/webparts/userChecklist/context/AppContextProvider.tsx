import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { IChecklistItem } from '../interfaces/IChecklistItem';
import { IChecklistUserItem } from '../interfaces/IChecklistUserItem';

interface IAppContext {
    context: WebPartContext;
    src: string;
    tgt: string;
    userId: number;
    list: IChecklistItem[];
    responses: IChecklistUserItem[];
}

interface IAppContextProviderProps {
    context: WebPartContext;
    src: string;
    tgt: string;
    userId: number;
    children: React.ReactNode;
}

export const AppContext = React.createContext<{ state: IAppContext, updateState: (newState: Partial<IAppContext>) => void } | undefined>(undefined);

const AppContextProvider: React.FC<IAppContextProviderProps> = ({ context, src, tgt, userId, children }) => {
    const [state, setState] = React.useState<IAppContext>({
        list: [],
        responses: [],
        context: context,
        src: src,
        tgt: tgt,
        userId: userId
    });

    const updateState: (newState: IAppContext) => void = newState => {
        setState((s: IAppContext) => ({ ...s, ...newState }));
    }
    
    return (
        <AppContext.Provider value={{ state, updateState }}>
            {children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;

