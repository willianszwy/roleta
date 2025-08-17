import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@flaticon/flaticon-uicons/css/thin/rounded.css'
import App from './App.tsx'
import { RouletteProvider } from './context/RouletteProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouletteProvider>
      <App />
    </RouletteProvider>
  </StrictMode>,
)
