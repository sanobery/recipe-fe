import { Provider } from 'react-redux';
import {store,persistor} from './Store';
import { PersistGate } from 'redux-persist/integration/react';

interface ReduxProviderProps{
    children:any
}

const ReduxProvider = ( props:ReduxProviderProps ) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>{props.children}</PersistGate>
        </Provider>
    )
};

export default ReduxProvider;