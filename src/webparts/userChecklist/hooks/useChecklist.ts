import * as React from 'react';
import { IChecklistItem } from '../interfaces/IChecklistItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IChecklistUserItem } from '../interfaces/IChecklistUserItem';
import { AppContext } from '../context/AppContextProvider';

interface IUseChecklistReturn {
    loadChecklist: () => Promise<void>;
    getResponses: () => Promise<void>;
    addResponse: (itemId: number, completed: boolean, taskId: number) => Promise<void>;
}

const useChecklist: () => IUseChecklistReturn = () => {
    const appContext = React.useContext(AppContext);
    const siteUrl: string = appContext?.state.context.pageContext.web.absoluteUrl ?? '';

    const loadChecklist = async (): Promise<void> => {
        try {
            if (appContext?.state.context && appContext?.state.src) {
                const url: string = `${siteUrl}/_api/web/lists/getbyid('${appContext.state.src}')/items?$select=Id,Title,Content`;
                const res: SPHttpClientResponse = await appContext.state.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
                const data: { value: IChecklistItem[] } = await res.json();

                appContext.updateState({ list: data.value });
            } else {
                throw Error('Context not set');
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    const getResponses = async (): Promise<void> => {
        try {
            if (appContext?.state.context && appContext?.state.tgt && appContext?.state.userId) {
                let url: string = `${siteUrl}/_api/web/lists/getbyid('${appContext.state.tgt}')/items?`;
                url += '$select=Id,EmployeeId,Task/Id,Task/Title,Complete,Completed&';
                url += '$expand=Task&';
                url += `$filter=EmployeeId eq '${appContext.state.userId}'`;

                const res: SPHttpClientResponse = await appContext.state.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
                const data: { value: IChecklistUserItem[] } = await res.json();

                appContext.updateState({ responses: data.value });
            } else {
                throw Error('Context not set');
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    const addResponse = async (itemId: number, completed: boolean, taskId?: number): Promise<void> => {
        try {
            if (appContext?.state.context && appContext?.state.tgt) {
                let url: string = `${siteUrl}/_api/web/lists/getById('${appContext.state.tgt}')/items`;
                let method: string = 'POST';

                if (completed === false && taskId !== 0) {
                    url += `(${taskId})`;
                    method = 'DELETE';
                }

                const res: SPHttpClientResponse = await appContext.state.context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
                    body: JSON.stringify({
                        TaskId: itemId,
                        Complete: completed,
                        Completed: new Date().toISOString(),
                        EmployeeId: appContext.state.userId
                    }),
                    headers: {
                        'IF-MATCH': '*',
                        'X-HTTP-Method': method
                    }
                });

                if (res.status === 200 || res.status === 201 || res.status === 204) {
                    await getResponses();
                } else {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    return { loadChecklist, getResponses, addResponse }
}

export default useChecklist;
