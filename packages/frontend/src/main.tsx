import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SWRConfig } from 'swr'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}>
      <App />
    </SWRConfig>
  </React.StrictMode>,
)
