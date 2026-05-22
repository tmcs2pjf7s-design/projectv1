import { supabase, isConfigured } from './supabase'
import { mockCategorias, mockProductos, mockPedidos, mockMesas } from './mockData'
import { Categoria, Producto, Pedido, Mesa, EstadoPedido, CartItem, Impresora } from './types'

export async function getCategorias(): Promise<Categoria[]> {
  if (!isConfigured()) return mockCategorias
  try {
    const { data, error } = await supabase.from('categorias').select('*').order('orden')
    if (error || !data?.length) return mockCategorias
    return data as Categoria[]
  } catch {
    return mockCategorias
  }
}

export async function getProductos(): Promise<Producto[]> {
  if (!isConfigured()) return mockProductos
  try {
    const { data, error } = await supabase.from('productos').select('*').order('nombre')
    if (error || !data?.length) return mockProductos
    return data as Producto[]
  } catch {
    return mockProductos
  }
}

export async function getMesas(): Promise<Mesa[]> {
  if (!isConfigured()) return mockMesas
  try {
    const { data, error } = await supabase.from('mesas').select('*').order('numero')
    if (error || !data?.length) return mockMesas
    return data as Mesa[]
  } catch {
    return mockMesas
  }
}

export async function getPedidosActivos(): Promise<Pedido[]> {
  if (!isConfigured()) return mockPedidos
  try {
    const { data } = await supabase
      .from('pedidos')
      .select('*, mesa:mesas(*), items:pedido_items(*, producto:productos(*))')
      .not('estado', 'in', '("entregado","cancelado")')
      .order('created_at', { ascending: true })
    return (data as Pedido[]) ?? []
  } catch {
    return []
  }
}

export async function createPedido(
  tipo: 'mesa' | 'llevar',
  items: CartItem[],
  opts: { mesa_id?: string; cliente_nombre?: string; cliente_telefono?: string; notas?: string }
): Promise<number> {
  if (!isConfigured()) return Math.floor(Math.random() * 900) + 100

  const total = parseFloat(
    items.reduce((s, i) => s + (i.variante?.precio ?? i.producto.precio) * i.cantidad, 0).toFixed(2)
  )

  const { data: pedido, error } = await supabase
    .from('pedidos')
    .insert({
      tipo,
      total,
      mesa_id: opts.mesa_id ?? null,
      cliente_nombre: opts.cliente_nombre ?? null,
      cliente_telefono: opts.cliente_telefono ?? null,
      notas: opts.notas ?? null,
    })
    .select()
    .single()

  if (error || !pedido) throw new Error('Error al crear el pedido')

  await supabase.from('pedido_items').insert(
    items.map(i => ({
      pedido_id: pedido.id,
      producto_id: i.producto.id,
      cantidad: i.cantidad,
      precio: i.variante?.precio ?? i.producto.precio,
      notas: i.variante?.nombre ?? null,
    }))
  )

  return pedido.numero_orden
}

export async function updateEstadoPedido(id: string, estado: EstadoPedido): Promise<void> {
  if (!isConfigured()) return
  await supabase.from('pedidos').update({ estado }).eq('id', id)
}

export async function updateMesaEstado(id: string, estado: Mesa['estado']): Promise<void> {
  if (!isConfigured()) return
  await supabase.from('mesas').update({ estado }).eq('id', id)
}

export async function upsertProducto(p: Partial<Producto> & { nombre: string; precio: number }): Promise<void> {
  if (!isConfigured()) return
  await supabase.from('productos').upsert(p)
}

export async function deleteProducto(id: string): Promise<void> {
  if (!isConfigured()) return
  await supabase.from('productos').delete().eq('id', id)
}

export async function getImpresoras(): Promise<Impresora[]> {
  if (!isConfigured()) return []
  try {
    const { data } = await supabase.from('impresoras').select('*').order('created_at')
    return (data as Impresora[]) ?? []
  } catch { return [] }
}

export async function upsertImpresora(imp: Partial<Impresora> & { nombre: string; ip: string; tipo: string }): Promise<void> {
  if (!isConfigured()) return
  await supabase.from('impresoras').upsert(imp)
}

export async function deleteImpresora(id: string): Promise<void> {
  if (!isConfigured()) return
  await supabase.from('impresoras').delete().eq('id', id)
}
