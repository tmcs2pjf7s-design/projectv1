'use client'
import { useState } from 'react'
import Link from 'next/link'
import { mockMesas, mockPedidos, mockCategorias, mockProductos } from '@/lib/mockData'
import { Mesa, Pedido, EstadoPedido, Producto } from '@/lib/types'
import PedidoCard from '@/components/PedidoCard'
import EstadoBadge from '@/components/EstadoBadge'

type Vista = 'mesas' | 'pedidos' | 'nueva-comanda'

export default function ComanderoPage() {
  const [vista, setVista] = useState<Vista>('mesas')
  const [mesaSel, setMesaSel] = useState<Mesa | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos)
  const [cat, setCat] = useState(mockCategorias[0].id)
  const [carrito, setCarrito] = useState<{ producto: Producto; qty: number }[]>([])

  const cambiarEstado = (id: string, estado: EstadoPedido) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
  }

  const pedidosMesa = mesaSel
    ? pedidos.filter(p => p.mesa_id === mesaSel.id && p.estado !== 'entregado')
    : []

  const agregarCarrito = (p: Producto) => {
    setCarrito(prev => {
      const found = prev.find(i => i.producto.id === p.id)
      return found
        ? prev.map(i => i.producto.id === p.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { producto: p, qty: 1 }]
    })
  }

  const enviarComanda = () => {
    if (!mesaSel || carrito.length === 0) return
    const nuevo: Pedido = {
      id: `ped-${Date.now()}`,
      tipo: 'mesa',
      mesa_id: mesaSel.id,
      mesa: mesaSel,
      estado: 'pendiente',
      total: carrito.reduce((s, i) => s + i.producto.precio * i.qty, 0),
      numero_orden: pedidos.length + 1,
      created_at: new Date().toISOString(),
      items: carrito.map((i, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        pedido_id: '',
        producto_id: i.producto.id,
        producto: i.producto,
        cantidad: i.qty,
        precio: i.producto.precio,
      })),
    }
    setPedidos(prev => [...prev, nuevo])
    setCarrito([])
    setVista('pedidos')
  }

  const productosFiltrados = mockProductos.filter(p => p.disponible && p.categoria_id === cat)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 text-sm">← Inicio</Link>
            <span className="font-black text-lg">🧑‍💼 Comandero</span>
          </div>
          <div className="flex gap-1">
            {(['mesas', 'pedidos'] as Vista[]).map(v => (
              <button
                key={v}
                onClick={() => setVista(v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize ${
                  vista === v ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">

        {/* VISTA MESAS */}
        {vista === 'mesas' && (
          <div>
            <p className="text-sm text-gray-500 mb-4 font-medium">
              Toca una mesa para ver sus pedidos o abrir comanda
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {mockMesas.map(mesa => {
                const activos = pedidos.filter(
                  p => p.mesa_id === mesa.id && !['entregado', 'cancelado'].includes(p.estado)
                ).length
                return (
                  <button
                    key={mesa.id}
                    onClick={() => { setMesaSel(mesa); setVista('pedidos') }}
                    className={`rounded-2xl p-4 flex flex-col items-center gap-1 border-2 transition-all ${
                      activos > 0
                        ? 'bg-accent/5 border-accent text-accent'
                        : mesa.estado === 'reservada'
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl font-black">{mesa.numero}</span>
                    <span className="text-xs font-medium">{mesa.capacidad} pax</span>
                    {activos > 0 && (
                      <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full font-bold">
                        {activos} pedido{activos > 1 ? 's' : ''}
                      </span>
                    )}
                    {mesa.estado === 'reservada' && activos === 0 && (
                      <span className="text-xs">Reservada</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* VISTA PEDIDOS */}
        {vista === 'pedidos' && (
          <div>
            {mesaSel ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-black text-lg">Mesa {mesaSel.numero}</h2>
                    <p className="text-sm text-gray-500">{pedidosMesa.length} pedido(s) activo(s)</p>
                  </div>
                  <button
                    onClick={() => { setVista('nueva-comanda') }}
                    className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors"
                  >
                    + Nueva comanda
                  </button>
                </div>
                {pedidosMesa.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Sin pedidos activos</p>
                    <button
                      onClick={() => setVista('nueva-comanda')}
                      className="bg-accent text-white px-6 py-3 rounded-2xl font-semibold"
                    >
                      Crear primera comanda
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidosMesa.map(p => (
                      <PedidoCard key={p.id} pedido={p} onEstado={cambiarEstado} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div>
                <h2 className="font-black text-lg mb-4">Todos los pedidos activos</h2>
                <div className="space-y-4">
                  {pedidos
                    .filter(p => !['entregado', 'cancelado'].includes(p.estado))
                    .map(p => <PedidoCard key={p.id} pedido={p} onEstado={cambiarEstado} />)
                  }
                </div>
              </div>
            )}
          </div>
        )}

        {/* VISTA NUEVA COMANDA */}
        {vista === 'nueva-comanda' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setVista('pedidos')} className="text-gray-400 text-sm font-medium">← Volver</button>
              <h2 className="font-black text-lg">
                Nueva comanda {mesaSel ? `· Mesa ${mesaSel.numero}` : ''}
              </h2>
            </div>

            {/* Categorías */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
              {mockCategorias.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                    cat === c.id ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {c.icono} {c.nombre}
                </button>
              ))}
            </div>

            {/* Productos */}
            <div className="space-y-2 mb-6">
              {productosFiltrados.map(p => {
                const qty = carrito.find(i => i.producto.id === p.id)?.qty ?? 0
                return (
                  <div key={p.id} className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{p.nombre}</p>
                      <p className="text-accent text-sm font-semibold">{p.precio.toFixed(2)}€</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {qty > 0 && (
                        <>
                          <button
                            onClick={() => setCarrito(prev =>
                              prev.map(i => i.producto.id === p.id ? { ...i, qty: i.qty - 1 } : i)
                                .filter(i => i.qty > 0)
                            )}
                            className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center font-bold"
                          >−</button>
                          <span className="w-5 text-center font-bold text-sm">{qty}</span>
                        </>
                      )}
                      <button
                        onClick={() => agregarCarrito(p)}
                        className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center font-bold"
                      >+</button>
                    </div>
                  </div>
                )
              })}
            </div>

            {carrito.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
                <button
                  onClick={enviarComanda}
                  className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-base shadow-xl hover:bg-accent-dark transition-colors flex items-center justify-between px-6"
                >
                  <span>Enviar comanda ({carrito.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span>{carrito.reduce((s, i) => s + i.producto.precio * i.qty, 0).toFixed(2)}€</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
