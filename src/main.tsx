import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Assets/Index.css'
import { Provider } from 'react-redux'
import App from './App.tsx'
import store from './State.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
)
