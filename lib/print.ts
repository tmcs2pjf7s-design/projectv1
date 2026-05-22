import { Pedido, Impresora } from './types'

// ── Ticket HTML (for window.print fallback) ───────────────────────────────────

export function buildTicketHtml(pedido: Pedido, titulo = 'FRANKFURT ELS TR3S'): string {
  const hora = new Date(pedido.created_at || Date.now()).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit',
  })
  const tipo = pedido.tipo === 'mesa'
    ? `Mesa ${pedido.mesa?.numero ?? '—'}`
    : 'Para llevar'

  const rows = (pedido.items ?? []).map(i => {
    const nombre = i.producto?.nombre ?? '—'
    const variante = i.notas ? ` (${i.notas})` : ''
    const precio = (i.precio * i.cantidad).toFixed(2) + '€'
    return `<tr>
      <td style="padding:3px 4px;font-weight:bold;white-space:nowrap">${i.cantidad}×</td>
      <td style="padding:3px 4px;width:100%">${nombre}${variante}</td>
      <td style="padding:3px 4px;text-align:right;white-space:nowrap">${precio}</td>
    </tr>`
  }).join('')

  return `
    <div style="font-family:'Courier New',monospace;font-size:13px;width:100%;max-width:300px">
      <div style="text-align:center;font-weight:bold;font-size:15px;margin-bottom:2px">${titulo}</div>
      <div style="text-align:center;border-bottom:1px dashed #000;padding-bottom:8px;margin-bottom:8px">
        <div style="font-size:28px;font-weight:900">#${pedido.numero_orden}</div>
        <div>${tipo} · ${hora}</div>
        ${pedido.cliente_nombre ? `<div>${pedido.cliente_nombre}</div>` : ''}
      </div>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <div style="border-top:1px dashed #000;margin-top:8px;padding-top:8px;font-size:18px;font-weight:900;text-align:right">
        TOTAL: ${pedido.total.toFixed(2)}€
      </div>
      ${pedido.notas ? `<div style="margin-top:8px;font-size:11px;font-style:italic">📝 ${pedido.notas}</div>` : ''}
    </div>`
}

// ── window.print() ────────────────────────────────────────────────────────────

export function printVentana(html: string) {
  const win = window.open('', '_blank', 'width=340,height=520')
  if (!win) { alert('Activa las ventanas emergentes para imprimir'); return }
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>
      * { margin:0; padding:0; box-sizing:border-box }
      body { background:#fff; padding:6px }
      @media print {
        @page { margin:2mm; size:80mm auto }
        body { -webkit-print-color-adjust:exact; print-color-adjust:exact }
      }
    </style></head><body>${html}</body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 400)
}

// ── ESC/POS builder ───────────────────────────────────────────────────────────

function buildEscPos(pedido: Pedido, titulo: string): Uint8Array {
  const enc = new TextEncoder()
  const chunks: Uint8Array[] = []

  const add = (s: string) => chunks.push(enc.encode(s))
  const cmd = (...bytes: number[]) => chunks.push(new Uint8Array(bytes))

  const INIT        = [0x1b, 0x40]
  const ALIGN_CTR   = [0x1b, 0x61, 0x01]
  const ALIGN_LEFT  = [0x1b, 0x61, 0x00]
  const ALIGN_RIGHT = [0x1b, 0x61, 0x02]
  const BOLD_ON     = [0x1b, 0x45, 0x01]
  const BOLD_OFF    = [0x1b, 0x45, 0x00]
  const DOUBLE_ON   = [0x1d, 0x21, 0x11]
  const DOUBLE_OFF  = [0x1d, 0x21, 0x00]
  const CUT         = [0x1d, 0x56, 0x42, 0x10]
  const LF          = [0x0a]

  const hora = new Date(pedido.created_at || Date.now())
    .toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  const tipo = pedido.tipo === 'mesa' ? `Mesa ${pedido.mesa?.numero}` : 'Para llevar'

  cmd(...INIT)
  cmd(...ALIGN_CTR, ...BOLD_ON)
  add(titulo + '\n')
  cmd(...BOLD_OFF, ...ALIGN_CTR, ...DOUBLE_ON)
  add(`#${pedido.numero_orden}\n`)
  cmd(...DOUBLE_OFF)
  add(`${tipo}  ${hora}\n`)
  if (pedido.cliente_nombre) add(`${pedido.cliente_nombre}\n`)
  add('--------------------------------\n')
  cmd(...ALIGN_LEFT)

  for (const i of pedido.items ?? []) {
    const nombre = i.producto?.nombre ?? '—'
    const variante = i.notas ? ` (${i.notas})` : ''
    const precio = (i.precio * i.cantidad).toFixed(2) + 'EUR'
    add(`${i.cantidad}x ${nombre}${variante}\n`)
    cmd(...ALIGN_RIGHT)
    add(`${precio}\n`)
    cmd(...ALIGN_LEFT)
  }

  add('================================\n')
  cmd(...ALIGN_RIGHT, ...BOLD_ON, ...DOUBLE_ON)
  add(`${pedido.total.toFixed(2)}EUR\n`)
  cmd(...DOUBLE_OFF, ...BOLD_OFF, ...ALIGN_LEFT)

  if (pedido.notas) add(`Notas: ${pedido.notas}\n`)
  cmd(...LF, ...LF, ...LF, ...CUT)

  const total = chunks.reduce((s, c) => s + c.length, 0)
  const result = new Uint8Array(total)
  let offset = 0
  for (const c of chunks) { result.set(c, offset); offset += c.length }
  return result
}

function toBase64(bytes: Uint8Array): string {
  let bin = ''
  bytes.forEach(b => { bin += String.fromCharCode(b) })
  return btoa(bin)
}

// ── Bixolon BXLPrint Agent (localhost:18080) ──────────────────────────────────

async function printBixolon(imp: Impresora, escpos: Uint8Array): Promise<boolean> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 4000)
  try {
    const res = await fetch('http://localhost:18080/bxlprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        printerDeviceId: imp.nombre,
        portType: imp.ip ? '1' : '0',   // 1=LAN, 0=USB
        portName: imp.ip || 'USB',
        data: toBase64(escpos),
      }),
      signal: ctrl.signal,
    })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

// ── Epson ePOS HTTP API ───────────────────────────────────────────────────────

async function printEpson(imp: Impresora, pedido: Pedido, titulo: string): Promise<boolean> {
  const lineas = (pedido.items ?? [])
    .map(i => `${i.cantidad}x ${i.producto?.nombre ?? ''}${i.notas ? ` (${i.notas})` : ''} — ${(i.precio * i.cantidad).toFixed(2)}EUR`)
    .join('&#10;')

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
      <text smooth="true">${titulo}&#10;#${pedido.numero_orden}&#10;${lineas}&#10;TOTAL: ${pedido.total.toFixed(2)}EUR&#10;</text>
      <feed unit="mm" h="15"/>
      <cut type="feed"/>
    </epos-print>
  </s:Body>
</s:Envelope>`

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 5000)
  try {
    await fetch(`http://${imp.ip}:${imp.puerto}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=5000`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml; charset=utf-8', SOAPAction: '""' },
      body: xml,
      signal: ctrl.signal,
    })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

// ── Main print function ───────────────────────────────────────────────────────

export async function imprimirPedido(pedido: Pedido, impresoras: Impresora[]) {
  const activas = impresoras.filter(i => i.activa)
  if (activas.length === 0) {
    printVentana(buildTicketHtml(pedido))
    return
  }

  for (const imp of activas) {
    const itemsFiltrados = imp.categorias_ids.length > 0
      ? (pedido.items ?? []).filter(i => imp.categorias_ids.includes(i.producto?.categoria_id ?? ''))
      : pedido.items ?? []

    if (itemsFiltrados.length === 0 && imp.tipo !== 'ticket') continue

    const pedidoFiltrado = { ...pedido, items: itemsFiltrados }
    const titulo = imp.tipo === 'cocina' ? 'COCINA' : imp.tipo === 'barra' ? 'BARRA' : 'FRANKFURT ELS TR3S'

    if (imp.protocolo === 'ventana') {
      printVentana(buildTicketHtml(pedidoFiltrado, titulo))
      continue
    }

    if (imp.protocolo === 'bixolon') {
      const escpos = buildEscPos(pedidoFiltrado, titulo)
      const ok = await printBixolon(imp, escpos)
      if (!ok) printVentana(buildTicketHtml(pedidoFiltrado, titulo))
      continue
    }

    if (imp.protocolo === 'epson') {
      const ok = await printEpson(imp, pedidoFiltrado, titulo)
      if (!ok) printVentana(buildTicketHtml(pedidoFiltrado, titulo))
    }
  }
}

// ── Test print ────────────────────────────────────────────────────────────────

export async function testImpresora(imp: Impresora): Promise<boolean> {
  if (imp.protocolo === 'ventana') {
    printVentana(`<div style="font-family:monospace;padding:12px;text-align:center">
      <b>TEST - Frankfurt Els Tr3s</b><br><br>
      ${imp.nombre}<br>
      ${imp.tipo.toUpperCase()}<br><br>
      Si ves esto, la impresión funciona ✓
    </div>`)
    return true
  }

  if (imp.protocolo === 'bixolon') {
    const enc = new TextEncoder()
    const text = enc.encode(`TEST - Frankfurt Els Tr3s\n${imp.nombre} (${imp.tipo})\nConexion OK\n\n\n`)
    const escpos = new Uint8Array([0x1b, 0x40, ...text, 0x1d, 0x56, 0x42, 0x10])
    const ok = await printBixolon(imp, escpos)
    if (!ok) printVentana(`<div style="font-family:monospace;padding:12px;text-align:center">
      <b>⚠ BXLPrint Agent no detectado</b><br><br>
      Instala <b>BXLPrint Agent</b> de Bixolon<br>en el ordenador del local.<br><br>
      <a href="https://www.bixolon.com" style="color:blue">bixolon.com → Soporte → SDK</a>
    </div>`)
    return ok
  }

  // Epson
  const pedidoTest: Pedido = {
    id: 'test', tipo: 'llevar', estado: 'pendiente', total: 0,
    numero_orden: 0, created_at: new Date().toISOString(),
    items: [{ id: 't1', pedido_id: 'test', producto_id: 'p1', cantidad: 1, precio: 0,
      producto: { id: 'p1', categoria_id: '', nombre: 'TEST TICKET', descripcion: '', precio: 0, disponible: true, tiempo_prep: 0 }
    }]
  }
  return printEpson(imp, pedidoTest, 'TEST')
}
