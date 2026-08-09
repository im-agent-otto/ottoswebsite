import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import OttoWelcome from './OttoWelcome.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <OttoWelcome />
  </StrictMode>,
)
