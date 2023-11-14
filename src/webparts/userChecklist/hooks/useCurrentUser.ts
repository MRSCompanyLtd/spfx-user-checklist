import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { AppContext } from '../context/AppContextProvider';

const useCurrentUser: () => number = () => {
    const [userId, setUserId] = React.useState<number>(0);

    const appContext = React.useContext(AppContext);

    React.useEffect(() => {
        (async () => {
            try {
                if (appContext?.state.context) {
                    const url: string = `${appContext.state.context.pageContext.web.absoluteUrl}/_api/web/currentuser?$select=Id`;
                    const res: SPHttpClientResponse = await appContext.state.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
                    const data: { Id: number } = await res.json();

                    appContext.updateState({ userId: data.Id });
                    setUserId(data.Id);            
                } else {
                    throw Error('Context not set');
                }
            }
            catch (e) {
                console.error(e);
            }
        })()
            .catch(e => console.error(e));
    }, []);

    return userId;
}

export default useCurrentUser;
