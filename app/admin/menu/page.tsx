'use client'
import { useState } from 'react'
import Link from 'next/link'
import { mockProductos, mockCategorias } from '@/lib/mockData'
import { Producto } from '@/lib/types'

const emptyProducto = (): Omit<Producto, 'id'> => ({
  categoria_id: mockCategorias[0].id,
  nombre: '',
  descripcion: '',
  precio: 0,
  imagen: '',
  disponible: true,
  tiempo_prep: 10,
})

export default function AdminMenuPage() {
  const [productos, setProductos] = useState<Producto[]>(mockProductos)
  const [editando, setEditando] = useState<Producto | null>(null)
  const [nuevo, setNuevo] = useState(false)
  const [form, setForm] = useState(emptyProducto())
  const [catFiltro, setCatFiltro] = useState('todos')

  const filtrados = catFiltro === 'todos'
    ? productos
    : productos.filter(p => p.categoria_id === catFiltro)

  const guardar = () => {
    if (!form.nombre || form.precio <= 0) return
    if (editando) {
      setProductos(prev => prev.map(p => p.id === editando.id ? { ...editando, ...form } : p))
    } else {
      setProductos(prev => [...prev, { ...form, id: `p-${Date.now()}` }])
    }
    setEditando(null)
    setNuevo(false)
    setForm(emptyProducto())
  }

  const toggleDisponible = (id: string) => {
    setProductos(prev => prev.map(p => p.id === id ? { ...p, disponible: !p.disponible } : p))
  }

  const eliminar = (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      setProductos(prev => prev.filter(p => p.id !== id))
    }
  }

  const abrirEditar = (p: Producto) => {
    setEditando(p)
    setForm({ ...p })
    setNuevo(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 text-sm font-medium">← Admin</Link>
            <span className="font-black text-lg">Gestión de Menú</span>
          </div>
          <button
            onClick={() => { setNuevo(true); setEditando(null); setForm(emptyProducto()) }}
            className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors"
          >
            + Nuevo producto
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6">
        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5">
          <button
            onClick={() => setCatFiltro('todos')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              catFiltro === 'todos' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Todos ({productos.length})
          </button>
          {mockCategorias.map(c => (
            <button
              key={c.id}
              onClick={() => setCatFiltro(c.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                catFiltro === c.id ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {c.icono} {c.nombre}
            </button>
          ))}
        </div>

        {/* Form */}
        {(nuevo || editando) && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <h3 className="font-bold mb-4">{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">Nombre *</label>
                <input
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                  placeholder="Nombre del plato"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">Categoría</label>
                <select
                  value={form.categoria_id}
                  onChange={e => setForm(f => ({ ...f, categoria_id: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                >
                  {mockCategorias.map(c => (
                    <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">Precio (€) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.precio}
                  onChange={e => setForm(f => ({ ...f, precio: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">Tiempo prep. (min)</label>
                <input
                  type="number"
                  min="1"
                  value={form.tiempo_prep}
                  onChange={e => setForm(f => ({ ...f, tiempo_prep: parseInt(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1 text-gray-500">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent resize-none"
                  placeholder="Ingredientes, alérgenos..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1 text-gray-500">URL de imagen</label>
                <input
                  value={form.imagen ?? ''}
                  onChange={e => setForm(f => ({ ...f, imagen: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={guardar}
                className="bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors"
              >
                {editando ? 'Guardar cambios' : 'Crear producto'}
              </button>
              <button
                onClick={() => { setEditando(null); setNuevo(false) }}
                className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Product list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Producto</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 hidden sm:table-cell">Categoría</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500">Precio</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-500">Estado</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(p => {
                const cat = mockCategorias.find(c => c.id === p.categoria_id)
                return (
                  <tr key={p.id} className={`border-b border-gray-50 ${!p.disponible ? 'opacity-50' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.imagen && (
                          <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold">{p.nombre}</p>
                          <p className="text-gray-400 text-xs line-clamp-1">{p.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">
                      {cat?.icono} {cat?.nombre}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-accent">{p.precio.toFixed(2)}€</td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => toggleDisponible(p.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${
                          p.disponible
                            ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
                            : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'
                        }`}
                      >
                        {p.disponible ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirEditar(p)}
                          className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(p.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
