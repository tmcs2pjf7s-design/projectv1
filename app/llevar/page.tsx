'use client'
import { useState } from 'react'
import Link from 'next/link'
import { mockCategorias, mockProductos } from '@/lib/mockData'
import MenuCard from '@/components/MenuCard'
import { useCart } from '@/context/CartContext'

export default function LlevarPage() {
  const [cat, setCat] = useState(mockCategorias[0].id)
  const [step, setStep] = useState<'menu' | 'datos' | 'confirmado'>('menu')
  const [loading, setLoading] = useState(false)
  const [numPedido] = useState(() => Math.floor(Math.random() * 900) + 100)
  const [form, setForm] = useState({ nombre: '', telefono: '', notas: '' })
  const { clearCart, total, count, items } = useCart()

  const productos = mockProductos.filter(p => p.disponible && p.categoria_id === cat)

  const handleDatos = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    clearCart()
    setLoading(false)
    setStep('confirmado')
  }

  if (step === 'confirmado') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">🛵</div>
        <h1 className="text-2xl font-black mb-1">¡Pedido recibido!</h1>
        <p className="text-gray-500 mb-4">Para llevar · {form.nombre}</p>
        <div className="bg-accent/10 rounded-2xl px-10 py-5 mb-6">
          <p className="text-sm text-gray-500 mb-1">Número de pedido</p>
          <p className="text-5xl font-black text-accent">#{numPedido}</p>
        </div>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
          Te avisaremos al teléfono <strong>{form.telefono}</strong> cuando esté listo para recoger.
        </p>
        <Link href="/" className="mt-8 text-accent font-semibold text-sm">
          ← Volver al inicio
        </Link>
      </div>
    )
  }

  if (step === 'datos') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
            <button onClick={() => setStep('menu')} className="text-gray-400 hover:text-gray-900 text-sm font-medium">
              ← Volver
            </button>
            <span className="font-black text-lg">Datos del pedido</span>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6">
          {/* Resumen */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
            <h2 className="font-bold mb-3 text-sm text-gray-500 uppercase tracking-wider">Resumen</h2>
            <ul className="space-y-2 mb-3">
              {items.map(item => (
                <li key={item.producto.id} className="flex justify-between text-sm">
                  <span><span className="font-bold">{item.cantidad}×</span> {item.producto.nombre}</span>
                  <span className="text-gray-400">{(item.producto.precio * item.cantidad).toFixed(2)}€</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold pt-3 border-t">
              <span>Total</span>
              <span className="text-accent">{total.toFixed(2)}€</span>
            </div>
          </div>

          <form onSubmit={handleDatos} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Nombre *</label>
              <input
                type="text"
                required
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Teléfono *</label>
              <input
                type="tel"
                required
                placeholder="600 000 000"
                value={form.telefono}
                onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Notas (opcional)</label>
              <textarea
                placeholder="Alergias, peticiones especiales..."
                value={form.notas}
                onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent-dark transition-colors disabled:opacity-50 shadow-lg shadow-orange-200"
            >
              {loading ? 'Enviando...' : `Confirmar pedido · ${total.toFixed(2)}€`}
            </button>
          </form>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-14 flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-900 text-sm font-medium">← Inicio</Link>
            <span className="font-black text-lg">Pedir para llevar</span>
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

      <main className="max-w-2xl mx-auto px-4 py-4 pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {productos.map(p => <MenuCard key={p.id} producto={p} />)}
        </div>
      </main>

      {count > 0 && (
        <button
          onClick={() => setStep('datos')}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-accent text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-semibold hover:bg-accent-dark transition-colors"
        >
          <span className="bg-white text-accent text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
          Continuar
          <span className="font-bold">{total.toFixed(2)}€</span>
        </button>
      )}
    </div>
  )
}
