import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { CERT } from './data'

export const LAB_SITE_URL = 'https://labcidades.com.br/'

function resolveFormUrl() {
  const fromEnv = import.meta.env.VITE_CERT_FORM_URL?.trim()
  if (fromEnv) return fromEnv
  if (typeof window === 'undefined') return CERT.formPath
  return `${window.location.origin}${window.location.pathname}${CERT.formPath}`
}

function useQrDataUrl(target: string) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(target, {
      margin: 1,
      width: 512,
      color: { dark: '#3e0565', light: '#ffffff' },
    })
      .then((dataUrl) => {
        if (!cancelled) setSrc(dataUrl)
      })
      .catch(() => {
        if (!cancelled) setSrc('')
      })
    return () => {
      cancelled = true
    }
  }, [target])

  return src
}

export function CertQr({ className = '' }: { className?: string }) {
  const [url, setUrl] = useState(CERT.formPath)
  const src = useQrDataUrl(url)

  useEffect(() => {
    setUrl(resolveFormUrl())
  }, [])

  if (!src) {
    return (
      <div className={`csc-qr csc-qr--fallback ${className}`.trim()} aria-hidden="true">
        QR
      </div>
    )
  }

  return (
    <img
      className={`csc-qr ${className}`.trim()}
      src={src}
      alt={`QR Code para ${CERT.formTitle}. Abra ${url}`}
      draggable={false}
    />
  )
}

export function SiteQr({
  url = LAB_SITE_URL,
  className = '',
  label = 'LabCidades',
  caption = 'labcidades.com.br',
}: {
  url?: string
  className?: string
  label?: string
  caption?: string
}) {
  const src = useQrDataUrl(url)

  if (!src) {
    return (
      <div className={`csc-qr csc-qr--site csc-qr--fallback ${className}`.trim()} aria-hidden="true">
        QR
      </div>
    )
  }

  return (
    <a
      className={`csc-qr-link ${className}`.trim()}
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Abrir ${label} em ${url}`}
    >
      <img className="csc-qr csc-qr--site" src={src} alt={`QR Code para ${label}`} draggable={false} />
      <span className="csc-qr-caption">{caption}</span>
    </a>
  )
}
