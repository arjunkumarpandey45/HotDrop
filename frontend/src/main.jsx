import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

if (import.meta.env.MODE === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.warn = () => {};
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster></Toaster>
    
  </StrictMode>,
)
