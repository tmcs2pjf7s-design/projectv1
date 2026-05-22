import { Pedido, Impresora } from './types'

// ── Format ────────────────────────────────────────────────────────────────────

function pad(str: string, len: number) {
  return str.length >= len ? str.slice(0, len) : str + ' '.repeat(len - str.length)
}

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
    return `
      <tr>
        <td style="padding:2px 4px;font-weight:bold">${i.cantidad}×</td>
        <td style="padding:2px 4px">${nombre}${variante}</td>
        <td style="padding:2px 4px;text-align:right">${precio}</td>
      </tr>`
  }).join('')

  return `
    <div style="font-family:'Courier New',monospace;font-size:13px;width:280px;padding:8px">
      <div style="text-align:center;font-weight:bold;font-size:15px;margin-bottom:4px">${titulo}</div>
      <div style="text-align:center;border-bottom:1px dashed #000;padding-bottom:6px;margin-bottom:6px">
        <span style="font-size:20px;font-weight:900">#${pedido.numero_orden}</span><br>
        <span>${tipo} · ${hora}</span>
        ${pedido.cliente_nombre ? `<br><span>${pedido.cliente_nombre}</span>` : ''}
      </div>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <div style="border-top:1px dashed #000;margin-top:6px;padding-top:6px;font-size:16px;font-weight:900;text-align:right">
        TOTAL: ${pedido.total.toFixed(2)}€
      </div>
      ${pedido.notas ? `<div style="margin-top:6px;font-style:italic;font-size:11px">📝 ${pedido.notas}</div>` : ''}
    </div>`
}

// ── Print via browser window ──────────────────────────────────────────────────

export function printVentana(html: string) {
  const win = window.open('', '_blank', 'width=320,height=500')
  if (!win) { alert('Activa las ventanas emergentes para imprimir'); return }
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>
      * { margin:0; padding:0; box-sizing:border-box }
      body { background:#fff }
      @media print {
        @page { margin:0; size: 80mm auto }
        body { -webkit-print-color-adjust:exact }
      }
    </style>
    </head><body>${html}</body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 300)
}

// ── Print via Epson ePOS-Print HTTP API ───────────────────────────────────────

function buildEposXml(pedido: Pedido): string {
  const lineas: string[] = []
  lineas.push('FRANKFURT ELS TR3S\n')
  lineas.push('================================\n')
  lineas.push(`Pedido #${pedido.numero_orden}\n`)
  lineas.push(`${pedido.tipo === 'mesa' ? `Mesa ${pedido.mesa?.numero}` : 'Para llevar'}\n`)
  if (pedido.cliente_nombre) lineas.push(`Cliente: ${pedido.cliente_nombre}\n`)
  lineas.push('--------------------------------\n')
  ;(pedido.items ?? []).forEach(i => {
    const v = i.notas ? ` (${i.notas})` : ''
    lineas.push(`${i.cantidad}x ${i.producto?.nombre ?? ''}${v}\n`)
    lineas.push(`   ${(i.precio * i.cantidad).toFixed(2)}EUR\n`)
  })
  lineas.push('================================\n')
  lineas.push(`TOTAL: ${pedido.total.toFixed(2)}EUR\n`)
  if (pedido.notas) lineas.push(`Notas: ${pedido.notas}\n`)

  const texto = lineas.join('').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
      <text smooth="true">${texto}</text>
      <feed unit="mm" h="15"/>
      <cut type="feed"/>
    </epos-print>
  </s:Body>
</s:Envelope>`
}

async function printEpson(imp: Impresora, xml: string): Promise<boolean> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 5000)
  try {
    await fetch(
      `http://${imp.ip}:${imp.puerto}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=5000`,
      { method: 'POST', headers: { 'Content-Type': 'text/xml; charset=utf-8', SOAPAction: '""' }, body: xml, signal: ctrl.signal }
    )
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
    // Filter items by category if configured
    const itemsFiltrados = imp.categorias_ids.length > 0
      ? (pedido.items ?? []).filter(i => imp.categorias_ids.includes(i.producto?.categoria_id ?? ''))
      : pedido.items ?? []

    if (itemsFiltrados.length === 0 && imp.tipo !== 'ticket') continue

    const pedidoFiltrado = { ...pedido, items: itemsFiltrados }
    const titulo = imp.tipo === 'cocina' ? '🍳 COCINA' : imp.tipo === 'barra' ? '🍺 BARRA' : 'FRANKFURT ELS TR3S'

    const xml = buildEposXml(pedidoFiltrado)
    const ok = await printEpson(imp, xml)

    if (!ok) {
      // Fallback: browser print
      printVentana(buildTicketHtml(pedidoFiltrado, titulo))
    }
  }
}

export async function testImpresora(imp: Impresora): Promise<boolean> {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
      <text>TEST - Frankfurt Els Tr3s\n${imp.nombre} (${imp.tipo})\n</text>
      <feed unit="mm" h="10"/>
      <cut type="feed"/>
    </epos-print>
  </s:Body>
</s:Envelope>`
  return printEpson(imp, xml)
}
