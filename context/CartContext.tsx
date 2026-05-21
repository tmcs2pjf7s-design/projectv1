'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { CartItem, Producto } from '@/lib/types'

interface CartCtx {
  items: CartItem[]
  addItem: (p: Producto) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartCtx | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (p: Producto) =>
    setItems(prev => {
      const found = prev.find(i => i.producto.id === p.id)
      return found
        ? prev.map(i => i.producto.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i)
        : [...prev, { producto: p, cantidad: 1 }]
    })

  const removeItem = (id: string) =>
    setItems(prev => prev.filter(i => i.producto.id !== id))

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeItem(id)
    setItems(prev => prev.map(i => i.producto.id === id ? { ...i, cantidad: qty } : i))
  }

  const clearCart = () => setItems([])
  const total = items.reduce((s, i) => s + i.producto.precio * i.cantidad, 0)
  const count = items.reduce((s, i) => s + i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart outside CartProvider')
  return ctx
}
