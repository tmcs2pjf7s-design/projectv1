'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { mockCategorias, mockProductos } from '@/lib/mockData'
import MenuCard from '@/components/MenuCard'
import Carrito from '@/components/Carrito'
import { useCart } from '@/context/CartContext'

export default function MesaPage() {
  const { id } = useParams()
  const mesaNum = String(id).replace('mesa-', '')
  const [cat, setCat] = useState(mockCategorias[0].id)
  const [confirmado, setConfirmado] = useState(false)
  const [numPedido] = useState(() => Math.floor(Math.random() * 900) + 100)
  const [loading, setLoading] = useState(false)
  const { clearCart } = useCart()

  const productos = mockProductos.filter(p => p.disponible && p.categoria_id === cat)

  const handleConfirmar = async (notas: string) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    clearCart()
    setLoading(false)
    setConfirmado(true)
  }

  if (confirmado) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">✅</div>
        <h1 className="text-2xl font-black mb-1">¡Pedido enviado!</h1>
        <p className="text-gray-500 mb-4">Mesa {mesaNum}</p>
        <div className="bg-accent/10 rounded-2xl px-10 py-5 mb-6">
          <p className="text-sm text-gray-500 mb-1">Número de pedido</p>
          <p className="text-5xl font-black text-accent">#{numPedido}</p>
        </div>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
          Tu pedido está siendo preparado. El camarero te lo traerá en cuanto esté listo.
        </p>
        <button
          onClick={() => setConfirmado(false)}
          className="mt-8 text-accent font-semibold text-sm"
        >
          + Añadir más productos
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <div>
              <span className="font-black text-lg">Frankfurt Els Tr3s</span>
              <span className="ml-2 text-sm text-gray-400 font-medium">Mesa {mesaNum}</span>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
              🟢 Abierto
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
            {mockCategorias.map(c => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                  cat === c.id ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {c.icono} {c.nombre}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {productos.map(p => (
            <MenuCard key={p.id} producto={p} />
          ))}
        </div>
      </main>

      <Carrito onConfirmar={handleConfirmar} loading={loading} />
    </div>
  )
}
