'use client'
import { Producto } from '@/lib/types'
import { useCart } from '@/context/CartContext'

export default function MenuCard({ producto }: { producto: Producto }) {
  const { addItem, items, updateQty } = useCart()
  const cartItem = items.find(i => i.producto.id === producto.id)
  const qty = cartItem?.cantidad ?? 0

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
      {producto.imagen && (
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-36 object-cover"
        />
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{producto.nombre}</h3>
          {producto.descripcion && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{producto.descripcion}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-accent font-bold text-base">{producto.precio.toFixed(2)}€</span>
          {qty === 0 ? (
            <button
              onClick={() => addItem(producto)}
              className="bg-accent text-white px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors"
            >
              + Añadir
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(producto.id, qty - 1)}
                className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center font-bold"
              >−</button>
              <span className="w-5 text-center font-semibold text-sm">{qty}</span>
              <button
                onClick={() => updateQty(producto.id, qty + 1)}
                className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center font-bold"
              >+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
