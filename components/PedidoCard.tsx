'use client'
import { Pedido, EstadoPedido } from '@/lib/types'
import EstadoBadge from './EstadoBadge'

interface Props {
  pedido: Pedido
  onEstado?: (id: string, estado: EstadoPedido) => void
}

const siguiente: Partial<Record<EstadoPedido, { estado: EstadoPedido; label: string }>> = {
  pendiente:      { estado: 'en_preparacion', label: 'Iniciar' },
  en_preparacion: { estado: 'listo',          label: 'Marcar listo' },
  listo:          { estado: 'entregado',       label: 'Entregado' },
}

function elapsed(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}min`
}

export default function PedidoCard({ pedido, onEstado }: Props) {
  const sig = siguiente[pedido.estado]
  const urgente =
    pedido.estado === 'pendiente' &&
    Date.now() - new Date(pedido.created_at).getTime() > 5 * 60000

  return (
    <div
      className={`bg-white rounded-2xl p-4 border-2 shadow-sm transition-all ${
        urgente ? 'border-red-400' : pedido.estado === 'listo' ? 'border-green-400' : 'border-gray-100'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl font-black">#{pedido.numero_orden}</span>
            {pedido.tipo === 'mesa' && pedido.mesa && (
              <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg">
                Mesa {pedido.mesa.numero}
              </span>
            )}
            {pedido.tipo === 'llevar' && (
              <span className="text-sm font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg">
                🛵 Para llevar
              </span>
            )}
          </div>
          {pedido.cliente_nombre && (
            <p className="text-sm text-gray-500 mt-0.5">{pedido.cliente_nombre}</p>
          )}
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <EstadoBadge estado={pedido.estado} />
          <span className="text-xs text-gray-400">{elapsed(pedido.created_at)}</span>
        </div>
      </div>

      <ul className="space-y-1.5 mb-3">
        {pedido.items?.map(item => (
          <li key={item.id} className="flex justify-between text-sm">
            <span>
              <span className="font-bold text-gray-900">{item.cantidad}×</span>{' '}
              <span className="text-gray-700">{item.producto?.nombre}</span>
            </span>
            <span className="text-gray-400">{(item.precio * item.cantidad).toFixed(2)}€</span>
          </li>
        ))}
      </ul>

      {pedido.notas && (
        <p className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-xl px-3 py-2 mb-3">
          📝 {pedido.notas}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="font-bold text-gray-900">{pedido.total.toFixed(2)}€</span>
        {sig && onEstado && (
          <button
            onClick={() => onEstado(pedido.id, sig.estado)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              sig.estado === 'listo'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : sig.estado === 'en_preparacion'
                ? 'bg-accent text-white hover:bg-accent-dark'
                : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}
          >
            {sig.label}
          </button>
        )}
      </div>
    </div>
  )
}
