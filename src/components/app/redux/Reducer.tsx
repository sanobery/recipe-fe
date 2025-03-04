import { Provider } from 'react-redux';
import {store,persistor} from './Store';
import { PersistGate } from 'redux-persist/integration/react';
import { ReactNode } from 'react';
interface ReduxProviderProps{
    children:ReactNode
}

const ReduxProvider = ( props:ReduxProviderProps ) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>{props.children}</PersistGate>
        </Provider>
    )
};

export default ReduxProvider;