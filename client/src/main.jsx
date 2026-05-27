import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid #27272a',
          borderRadius: '0.75rem',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#a855f7', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
        },
      }}
    />
    <App />
  </StrictMode>,
)
