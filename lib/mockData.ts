import { Categoria, Producto, Mesa, Pedido } from './types'

export const mockCategorias: Categoria[] = [
  { id: 'cat-1', nombre: 'Bocadillos', orden: 1, icono: '🥖' },
  { id: 'cat-2', nombre: 'Al Plato', orden: 2, icono: '🍽️' },
]

const vienaFlauta = (v: number, f: number) => [
  { nombre: 'Viena', precio: v },
  { nombre: 'Flauta', precio: f },
]

export const mockProductos: Producto[] = [
  {
    id: 'p-1', categoria_id: 'cat-1', nombre: 'Madrileño',
    descripcion: 'Calamares a la romana, lechuga y mayonesa',
    precio: 5.45, disponible: true, tiempo_prep: 8,
    variantes: vienaFlauta(5.45, 6.55),
  },
  {
    id: 'p-2', categoria_id: 'cat-1', nombre: 'Jardinera',
    descripcion: 'Hamburguesa, lechuga, tomate y queso',
    precio: 5.55, disponible: true, tiempo_prep: 8,
    variantes: vienaFlauta(5.55, 6.55),
  },
  {
    id: 'p-3', categoria_id: 'cat-1', nombre: 'Extremeño',
    descripcion: 'Hamburguesa, jamón dulce, huevo y queso',
    precio: 5.95, disponible: true, tiempo_prep: 8,
    variantes: vienaFlauta(5.95, 6.95),
  },
  {
    id: 'p-4', categoria_id: 'cat-1', nombre: 'Gumball',
    descripcion: 'Frankfurt, beicon y queso',
    precio: 5.45, disponible: true, tiempo_prep: 8,
    variantes: vienaFlauta(5.45, 6.45),
  },
  {
    id: 'p-5', categoria_id: 'cat-1', nombre: 'Traidor',
    descripcion: 'Chistorra, panceta, huevo, queso y cebolla',
    precio: 6.90, disponible: true, tiempo_prep: 10,
    variantes: vienaFlauta(6.90, 7.90),
  },
  {
    id: 'p-6', categoria_id: 'cat-1', nombre: 'Submarino',
    descripcion: 'Escalivada, atún, anchoa y queso',
    precio: 6.65, disponible: true, tiempo_prep: 8,
    variantes: vienaFlauta(6.65, 7.75),
  },
  {
    id: 'p-7', categoria_id: 'cat-1', nombre: 'Capricho',
    descripcion: 'Lomo, beicon y queso',
    precio: 5.45, disponible: true, tiempo_prep: 8,
    variantes: vienaFlauta(5.45, 6.65),
  },
  {
    id: 'p-8', categoria_id: 'cat-1', nombre: 'Milanesa',
    descripcion: 'Pollo rebozado, lechuga, mayonesa y salsa verde',
    precio: 5.55, disponible: true, tiempo_prep: 10,
    variantes: vienaFlauta(5.55, 6.55),
  },
  {
    id: 'p-9', categoria_id: 'cat-1', nombre: 'Pepito',
    descripcion: 'Ternera, jamón salado y pimiento verde',
    precio: 6.55, disponible: true, tiempo_prep: 10,
    variantes: vienaFlauta(6.55, 7.55),
  },
  {
    id: 'p-10', categoria_id: 'cat-1', nombre: 'Bomba',
    descripcion: 'Hamburguesa picante, pikantwurst, champiñones y salsa romesco',
    precio: 6.95, disponible: true, tiempo_prep: 10,
    variantes: vienaFlauta(6.95, 7.95),
  },
  {
    id: 'p-11', categoria_id: 'cat-1', nombre: 'Pimpollo',
    descripcion: 'Pollo, lechuga, huevo y champiñones',
    precio: 6.45, disponible: true, tiempo_prep: 10,
    variantes: vienaFlauta(6.45, 7.45),
  },
  {
    id: 'p-12', categoria_id: 'cat-1', nombre: 'Cerdito',
    descripcion: 'Butifarra, cebolla, queso y allioli',
    precio: 6.85, disponible: true, tiempo_prep: 10,
    variantes: vienaFlauta(6.85, 7.85),
  },
  {
    id: 'p-13', categoria_id: 'cat-1', nombre: 'Apetitoso',
    descripcion: 'Pollo, beicon, pimiento verde y alioli',
    precio: 6.15, disponible: true, tiempo_prep: 8,
    variantes: vienaFlauta(6.15, 7.15),
  },
  {
    id: 'p-14', categoria_id: 'cat-1', nombre: 'Vegetal',
    descripcion: 'Tomate, lechuga, atún y mayonesa',
    precio: 6.80, disponible: true, tiempo_prep: 8,
    variantes: vienaFlauta(6.80, 7.65),
  },
  {
    id: 'p-15', categoria_id: 'cat-1', nombre: 'Muntañes',
    descripcion: 'Salsicha país, cebolla, champiñones y huevo',
    precio: 5.80, disponible: true, tiempo_prep: 10,
    variantes: vienaFlauta(5.80, 6.80),
  },
  {
    id: 'p-16', categoria_id: 'cat-2', nombre: 'Al Plato',
    descripcion: 'Hamburguesa o Frankfurt',
    precio: 3.15, disponible: true, tiempo_prep: 5,
  },
]

export const mockMesas: Mesa[] = Array.from({ length: 12 }, (_, i) => ({
  id: `mesa-${i + 1}`,
  numero: i + 1,
  capacidad: i < 4 ? 2 : i < 10 ? 4 : 6,
  estado: i === 2 ? 'ocupada' : i === 5 ? 'reservada' : i === 8 ? 'ocupada' : 'libre',
}))

export const mockPedidos: Pedido[] = [
  {
    id: 'ped-1',
    tipo: 'mesa',
    mesa_id: 'mesa-3',
    mesa: { id: 'mesa-3', numero: 3, capacidad: 4, estado: 'ocupada' },
    estado: 'en_preparacion',
    total: 12.40,
    numero_orden: 1,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    items: [
      { id: 'i-1', pedido_id: 'ped-1', producto_id: 'p-1', cantidad: 1, precio: 5.45, producto: mockProductos[0] },
      { id: 'i-2', pedido_id: 'ped-1', producto_id: 'p-10', cantidad: 1, precio: 6.95, producto: mockProductos[9] },
    ],
  },
  {
    id: 'ped-2',
    tipo: 'llevar',
    estado: 'pendiente',
    total: 16.35,
    numero_orden: 2,
    cliente_nombre: 'Ana García',
    cliente_telefono: '600 123 456',
    created_at: new Date(Date.now() - 2 * 60000).toISOString(),
    items: [
      { id: 'i-3', pedido_id: 'ped-2', producto_id: 'p-5', cantidad: 1, precio: 6.90, producto: mockProductos[4] },
      { id: 'i-4', pedido_id: 'ped-2', producto_id: 'p-3', cantidad: 1, precio: 6.95, producto: mockProductos[2] },
    ],
  },
]
