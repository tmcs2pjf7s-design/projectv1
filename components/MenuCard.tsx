'use client'
import { useState } from 'react'
import { Producto, Variante } from '@/lib/types'
import { useCart } from '@/context/CartContext'

export default function MenuCard({ producto }: { producto: Producto }) {
  const { addItem, items, updateQty, removeItem } = useCart()
  const [showVariantes, setShowVariantes] = useState(false)

  const tieneVariantes = producto.variantes && producto.variantes.length > 0

  const precioBase = tieneVariantes ? producto.variantes![0].precio : producto.precio

  const cartItems = items.filter(i => i.producto.id === producto.id)
  const totalQty = cartItems.reduce((s, i) => s + i.cantidad, 0)

  const handleAnadir = () => {
    if (tieneVariantes) {
      setShowVariantes(true)
    } else {
      addItem(producto)
    }
  }

  const handleVariante = (v: Variante) => {
    addItem(producto, v)
    setShowVariantes(false)
  }

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
        {producto.imagen && (
          <img src={producto.imagen} alt={producto.nombre} className="w-full h-36 object-cover" />
        )}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug">{producto.nombre}</h3>
            {producto.descripcion && (
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">{producto.descripcion}</p>
            )}
            {tieneVariantes && (
              <div className="flex gap-2 mt-2">
                {producto.variantes!.map(v => (
                  <span key={v.nombre} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-lg">
                    {v.nombre} {v.precio.toFixed(2)}€
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-accent font-bold text-base">
              {tieneVariantes ? `desde ${precioBase.toFixed(2)}€` : `${precioBase.toFixed(2)}€`}
            </span>

            {totalQty === 0 ? (
              <button
                onClick={handleAnadir}
                className="bg-accent text-white px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors"
              >
                + Añadir
              </button>
            ) : (
              <div className="flex flex-col items-end gap-1">
                {cartItems.map(item => (
                  <div key={item.variante?.nombre ?? 'base'} className="flex items-center gap-1.5">
                    {item.variante && (
                      <span className="text-xs text-gray-500 font-medium">{item.variante.nombre}</span>
                    )}
                    <button
                      onClick={() => updateQty(producto.id, item.cantidad - 1, item.variante)}
                      className="w-6 h-6 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm"
                    >−</button>
                    <span className="w-4 text-center font-semibold text-sm">{item.cantidad}</span>
                    <button
                      onClick={() => tieneVariantes ? setShowVariantes(true) : addItem(producto)}
                      className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm"
                    >+</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal selector variante */}
      {showVariantes && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowVariantes(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-black text-lg mb-1">{producto.nombre}</h3>
            <p className="text-gray-400 text-sm mb-5">{producto.descripcion}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Elige el tamaño</p>
            <div className="space-y-3">
              {producto.variantes!.map(v => (
                <button
                  key={v.nombre}
                  onClick={() => handleVariante(v)}
                  className="w-full flex items-center justify-between bg-gray-50 hover:bg-accent/5 border-2 border-transparent hover:border-accent rounded-2xl px-5 py-4 transition-all group"
                >
                  <div className="text-left">
                    <p className="font-bold text-gray-900 group-hover:text-accent">{v.nombre}</p>
                    <p className="text-xs text-gray-400">
                      {v.nombre === 'Viena' ? 'Bocadillo pequeño' : 'Bocadillo grande'}
                    </p>
                  </div>
                  <span className="text-xl font-black text-accent">{v.precio.toFixed(2)}€</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowVariantes(false)}
              className="w-full mt-4 py-3 text-gray-400 text-sm font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
