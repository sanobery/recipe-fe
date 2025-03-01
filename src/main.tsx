import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom'
import ReduxProvider from './components/app/redux/Reducer'
 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <ReduxProvider>
            <App />
        </ReduxProvider>
    </BrowserRouter>
  </StrictMode>,
)