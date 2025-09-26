import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom'
import ReduxProvider from './store/Reducer.tsx'
import { SWRDevTools } from "swr-devtools"
import { SWRConfig } from "swr"
 
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ReduxProvider>
                <SWRDevTools>
                    <SWRConfig value={{
                    dedupingInterval: 300000, // 5 minutes
                    revalidateOnFocus: false,
                    revalidateIfStale: false,
                    }}>
                        <App />
                    </SWRConfig>
                </SWRDevTools>
            </ReduxProvider>
        </BrowserRouter>
    </StrictMode>,
)