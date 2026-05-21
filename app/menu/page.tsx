'use client'
import { useState } from 'react'
import Link from 'next/link'
import { mockCategorias, mockProductos } from '@/lib/mockData'

export default function MenuPage() {
  const [cat, setCat] = useState(mockCategorias[0].id)
  const productos = mockProductos.filter(p => p.disponible && p.categoria_id === cat)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-14 flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-gray-900 font-medium text-sm">← Inicio</Link>
            <span className="text-lg font-black">Menú</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
            {mockCategorias.map(c => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  cat === c.id ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.icono} {c.nombre}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {productos.map(p => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex">
              {p.imagen && (
                <img src={p.imagen} alt={p.nombre} className="w-28 h-full object-cover flex-shrink-0" />
              )}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{p.nombre}</h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{p.descripcion}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-accent font-bold">{p.precio.toFixed(2)}€</span>
                  <span className="text-xs text-gray-400">~{p.tiempo_prep} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
