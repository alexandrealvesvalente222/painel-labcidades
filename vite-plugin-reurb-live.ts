import type { Connect, Plugin } from 'vite'

const REURB_ORIGIN = 'https://labcidades.ufes.br/reurb/site'

async function handleReurbLive(
  req: Connect.IncomingMessage,
  res: Connect.ServerResponse,
  next: Connect.NextFunction,
) {
  const url = req.url ?? ''
  if (!url.startsWith('/reurb-live')) {
    next()
    return
  }

  try {
    const path = url.replace(/^\/reurb-live\/?/, '').split('?')[0] || 'index.html'
    const target = `${REURB_ORIGIN}/${path}`
    const remote = await fetch(target)
    if (!remote.ok) {
      res.statusCode = remote.status
      res.end(`Upstream error ${remote.status}`)
      return
    }

    const contentType = remote.headers.get('content-type') || 'text/html; charset=utf-8'
    let body = Buffer.from(await remote.arrayBuffer())

    if (contentType.includes('text/html')) {
      let html = body.toString('utf8')
      if (!/<base\s/i.test(html)) {
        html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${REURB_ORIGIN}/">`)
      }
      // Rolagem controlada pelo painel: sem smooth nativo (evita “travar” no meio).
      html = html.replace(
        /<head([^>]*)>/i,
        `<head$1><style data-labcidades-kiosk>html{scroll-behavior:auto!important;scrollbar-width:none}html::-webkit-scrollbar,body::-webkit-scrollbar{width:0!important;height:0!important}body.page-load{animation:none!important;opacity:1!important}</style>`,
      )
      // Evita scripts que tentem sair do iframe no totem.
      html = html.replace(/\btop\.location\b/g, 'window.location')
      body = Buffer.from(html, 'utf8')
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
    } else {
      res.setHeader('Content-Type', contentType)
    }

    res.statusCode = 200
    res.end(body)
  } catch (error) {
    console.error('[reurb-live]', error)
    res.statusCode = 502
    res.end('Falha ao carregar o site REURB')
  }
}

/** Serve o HTML da REURB na mesma origem para permitir rolagem até o rodapé. */
export function reurbLivePlugin(): Plugin {
  return {
    name: 'reurb-live',
    configureServer(server) {
      server.middlewares.use(handleReurbLive)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleReurbLive)
    },
  }
}
