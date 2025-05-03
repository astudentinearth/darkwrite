import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DarkwriteEditor from './editor'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DarkwriteEditor/>
  </StrictMode>,
)
