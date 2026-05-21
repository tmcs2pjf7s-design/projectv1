'use client'
import { useState, useEffect } from 'react'
import { mockPedidos } from '@/lib/mockData'
import { Pedido, EstadoPedido } from '@/lib/types'
import PedidoCard from '@/components/PedidoCard'

const COLUMNAS: { estado: EstadoPedido; label: string; color: string }[] = [
  { estado: 'pendiente',      label: 'Nuevos',       color: 'border-yellow-400' },
  { estado: 'en_preparacion', label: 'En cocina',    color: 'border-orange-400' },
  { estado: 'listo',          label: 'Listos',       color: 'border-green-400' },
]

export default function CocinaPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos)
  const [hora, setHora] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const cambiarEstado = (id: string, estado: EstadoPedido) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
  }

  const counts = {
    pendiente: pedidos.filter(p => p.estado === 'pendiente').length,
    en_preparacion: pedidos.filter(p => p.estado === 'en_preparacion').length,
    listo: pedidos.filter(p => p.estado === 'listo').length,
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black">👨‍🍳 Cocina</span>
          <div className="flex gap-2">
            {counts.pendiente > 0 && (
              <span className="bg-yellow-400/20 text-yellow-300 text-xs font-bold px-2.5 py-1 rounded-full">
                {counts.pendiente} nuevos
              </span>
            )}
            {counts.en_preparacion > 0 && (
              <span className="bg-orange-400/20 text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full">
                {counts.en_preparacion} en curso
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black tabular-nums">
            {hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-gray-400 text-xs">
            {hora.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      {/* Columns */}
      <div className="flex-1 grid grid-cols-3 gap-0 divide-x divide-white/10">
        {COLUMNAS.map(col => {
          const items = pedidos.filter(p => p.estado === col.estado)
          return (
            <div key={col.estado} className="flex flex-col">
              <div className={`px-5 py-3 border-b-2 ${col.color} bg-white/5`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-base">{col.label}</h2>
                  <span className="bg-white/10 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-8">Sin pedidos</p>
                ) : (
                  items.map(p => (
                    <PedidoCard key={p.id} pedido={p} onEstado={cambiarEstado} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
