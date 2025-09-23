import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom'
import ReduxProvider from './store/Reducer.tsx'

// const queryClient = new QueryClient()
 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <ReduxProvider>
            <App />
        </ReduxProvider>
    </BrowserRouter>
  </StrictMode>,
)