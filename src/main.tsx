import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import '@flaticon/flaticon-uicons/css/thin/rounded.css'
import App from './App.tsx'
import { RouletteProvider } from './context/RouletteProvider'
import { I18nProvider } from './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <I18nProvider>
        <RouletteProvider>
          <App />
        </RouletteProvider>
      </I18nProvider>
    </HelmetProvider>
  </StrictMode>,
)
