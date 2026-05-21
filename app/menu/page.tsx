'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategorias, getProductos } from '@/lib/data'
import { Categoria, Producto } from '@/lib/types'

export default function MenuPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cat, setCat] = useState('')

  useEffect(() => {
    Promise.all([getCategorias(), getProductos()]).then(([cats, prods]) => {
      setCategorias(cats)
      setProductos(prods)
      if (cats.length) setCat(cats[0].id)
    })
  }, [])

  const filtrados = productos.filter(p => p.disponible && p.categoria_id === cat)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-14 flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-gray-900 font-medium text-sm">← Inicio</Link>
            <span className="text-lg font-black">Menú</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
            {categorias.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${cat === c.id ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {c.icono} {c.nombre}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {filtrados.length === 0 && cat === '' && (
          <p className="text-center text-gray-400 py-12">Cargando menú...</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtrados.map(p => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex">
              {p.imagen && <img src={p.imagen} alt={p.nombre} className="w-28 h-full object-cover flex-shrink-0" />}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{p.nombre}</h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{p.descripcion}</p>
                  {p.variantes && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {p.variantes.map(v => (
                        <span key={v.nombre} className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-lg">
                          {v.nombre} {v.precio.toFixed(2)}€
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {!p.variantes && (
                  <span className="text-accent font-bold mt-2">{p.precio.toFixed(2)}€</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
