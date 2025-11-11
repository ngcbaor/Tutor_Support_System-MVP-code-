import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setupTestLogin } from './utils/devTools'

// Setup dev tools for testing (only in development)
if (import.meta.env.DEV) {
  setupTestLogin()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
