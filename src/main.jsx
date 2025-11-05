import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import useLanguageStore from './store/languageStore'
import './index.css'

console.log('🚀 Aplicación iniciando...')

// Initialize language store before rendering
useLanguageStore.getState().init()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

