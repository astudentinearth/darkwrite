import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DemoApp from './demo'
import "./app.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoApp/>
  </StrictMode>,
)
