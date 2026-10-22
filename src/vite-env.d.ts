/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CERT_FORM_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
