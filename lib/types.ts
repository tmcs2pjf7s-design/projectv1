export interface Categoria {
  id: string
  nombre: string
  orden: number
  icono: string
}

export interface Producto {
  id: string
  categoria_id: string
  nombre: string
  descripcion: string
  precio: number
  imagen?: string
  disponible: boolean
  tiempo_prep: number
}

export interface Mesa {
  id: string
  numero: number
  capacidad: number
  estado: 'libre' | 'ocupada' | 'reservada'
}

export type TipoPedido = 'mesa' | 'llevar'
export type EstadoPedido =
  | 'pendiente'
  | 'confirmado'
  | 'en_preparacion'
  | 'listo'
  | 'entregado'
  | 'cancelado'

export interface PedidoItem {
  id: string
  pedido_id: string
  producto_id: string
  producto?: Producto
  cantidad: number
  precio: number
  notas?: string
}

export interface Pedido {
  id: string
  tipo: TipoPedido
  mesa_id?: string
  mesa?: Mesa
  estado: EstadoPedido
  total: number
  cliente_nombre?: string
  cliente_telefono?: string
  notas?: string
  numero_orden: number
  items?: PedidoItem[]
  created_at: string
}

export interface CartItem {
  producto: Producto
  cantidad: number
  notas?: string
}
