/* Copyright 2021, Milkdown by Mirone. */
import '@milkdown/theme-nord/style.css'
import './style.css'
import './docsearch.css'
import './prosemirror.css'
import { Analytics } from '@vercel/analytics/react'

import { createRoot } from 'react-dom/client'

import { AppProvider } from './provider'
import { App } from './component/App'
import { reportWebVitals, sendToVercelAnalytics } from './vital'

const root = document.getElementById('app')

if (!root)
  throw new Error('Root element #app not found')

createRoot(root).render(
  <AppProvider>
    <App />
    {import.meta.env.PROD && <Analytics />}
  </AppProvider>,
)

if (import.meta.env.PROD)
  reportWebVitals(sendToVercelAnalytics)
