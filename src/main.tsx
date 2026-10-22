import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import CertAdmin from './CertAdmin'
import CertForm from './CertForm'
import './index.css'

function routeFromHash() {
  const hash = window.location.hash.replace(/^#/, '')
  if (hash === '/interesse-certificacao' || hash === 'interesse-certificacao') return 'form'
  if (hash === '/admin' || hash === 'admin' || hash.startsWith('/admin/')) return 'admin'
  return 'app'
}

function Root() {
  const route = routeFromHash()
  if (route === 'form') return <CertForm />
  if (route === 'admin') return <CertAdmin />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)

window.addEventListener('hashchange', () => {
  window.location.reload()
})
