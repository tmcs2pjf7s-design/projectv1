import { Categoria, Producto, Mesa, Pedido } from './types'

export const mockCategorias: Categoria[] = [
  { id: 'cat-1', nombre: 'Entrantes', orden: 1, icono: '🥗' },
  { id: 'cat-2', nombre: 'Principales', orden: 2, icono: '🍽️' },
  { id: 'cat-3', nombre: 'Postres', orden: 3, icono: '🍮' },
  { id: 'cat-4', nombre: 'Bebidas', orden: 4, icono: '🥤' },
]

export const mockProductos: Producto[] = [
  {
    id: 'p-1', categoria_id: 'cat-1', nombre: 'Tabla de ibéricos',
    descripcion: 'Selección de embutidos ibéricos con pan tostado y tomate',
    precio: 16, disponible: true, tiempo_prep: 5,
    imagen: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&q=80',
  },
  {
    id: 'p-2', categoria_id: 'cat-1', nombre: 'Croquetas de jamón',
    descripcion: 'Crujientes croquetas caseras de jamón ibérico (6 uds)',
    precio: 10, disponible: true, tiempo_prep: 8,
    imagen: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&q=80',
  },
  {
    id: 'p-3', categoria_id: 'cat-1', nombre: 'Gazpacho andaluz',
    descripcion: 'Gazpacho tradicional con crujiente de pan y AOVE',
    precio: 8, disponible: true, tiempo_prep: 3,
  },
  {
    id: 'p-4', categoria_id: 'cat-1', nombre: 'Burrata con tomate',
    descripcion: 'Burrata fresca con tomates cherry y albahaca',
    precio: 13, disponible: true, tiempo_prep: 5,
    imagen: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80',
  },
  {
    id: 'p-5', categoria_id: 'cat-2', nombre: 'Solomillo a la brasa',
    descripcion: 'Solomillo de ternera con patatas asadas y salsa de oporto',
    precio: 28, disponible: true, tiempo_prep: 18,
    imagen: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80',
  },
  {
    id: 'p-6', categoria_id: 'cat-2', nombre: 'Lubina al horno',
    descripcion: 'Lubina fresca al horno con verduras de temporada',
    precio: 24, disponible: true, tiempo_prep: 20,
    imagen: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80',
  },
  {
    id: 'p-7', categoria_id: 'cat-2', nombre: 'Risotto de setas y trufa',
    descripcion: 'Risotto cremoso con setas silvestres y aceite de trufa',
    precio: 20, disponible: true, tiempo_prep: 15,
    imagen: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80',
  },
  {
    id: 'p-8', categoria_id: 'cat-2', nombre: 'Hamburguesa de autor',
    descripcion: 'Ternera angus, queso cheddar, cebolla caramelizada y patatas',
    precio: 18, disponible: true, tiempo_prep: 12,
    imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  },
  {
    id: 'p-9', categoria_id: 'cat-2', nombre: 'Pasta al funghi',
    descripcion: 'Tagliatelle frescos con crema de boletus y parmesano',
    precio: 16, disponible: true, tiempo_prep: 14,
  },
  {
    id: 'p-10', categoria_id: 'cat-3', nombre: 'Coulant de chocolate',
    descripcion: 'Bizcocho de chocolate con centro fundente y helado de vainilla',
    precio: 8, disponible: true, tiempo_prep: 10,
    imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  },
  {
    id: 'p-11', categoria_id: 'cat-3', nombre: 'Crème brûlée',
    descripcion: 'Clásica crema quemada con vainilla de Madagascar',
    precio: 7, disponible: true, tiempo_prep: 5,
  },
  {
    id: 'p-12', categoria_id: 'cat-3', nombre: 'Tarta de queso',
    descripcion: 'Tarta de queso vasca al horno con coulis de frutos rojos',
    precio: 7, disponible: true, tiempo_prep: 5,
    imagen: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400&q=80',
  },
  {
    id: 'p-13', categoria_id: 'cat-4', nombre: 'Agua mineral',
    descripcion: 'Natural o con gas (50cl)',
    precio: 2.5, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-14', categoria_id: 'cat-4', nombre: 'Vino de la casa',
    descripcion: 'Copa de vino tinto, blanco o rosado',
    precio: 4, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-15', categoria_id: 'cat-4', nombre: 'Refresco',
    descripcion: 'Coca-Cola, Fanta naranja, Fanta limón o Sprite',
    precio: 3, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-16', categoria_id: 'cat-4', nombre: 'Cerveza artesanal',
    descripcion: 'Cerveza local de temporada (33cl)',
    precio: 4.5, disponible: true, tiempo_prep: 1,
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
    total: 62,
    numero_orden: 1,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    items: [
      { id: 'i-1', pedido_id: 'ped-1', producto_id: 'p-1', cantidad: 1, precio: 16, producto: mockProductos[0] },
      { id: 'i-2', pedido_id: 'ped-1', producto_id: 'p-5', cantidad: 2, precio: 28, producto: mockProductos[4] },
    ],
  },
  {
    id: 'ped-2',
    tipo: 'llevar',
    estado: 'pendiente',
    total: 41,
    numero_orden: 2,
    cliente_nombre: 'Ana García',
    cliente_telefono: '600 123 456',
    notas: 'Sin gluten en la hamburguesa',
    created_at: new Date(Date.now() - 2 * 60000).toISOString(),
    items: [
      { id: 'i-3', pedido_id: 'ped-2', producto_id: 'p-8', cantidad: 2, precio: 18, producto: mockProductos[7] },
      { id: 'i-4', pedido_id: 'ped-2', producto_id: 'p-13', cantidad: 2, precio: 2.5, producto: mockProductos[12] },
    ],
  },
  {
    id: 'ped-3',
    tipo: 'mesa',
    mesa_id: 'mesa-9',
    mesa: { id: 'mesa-9', numero: 9, capacidad: 4, estado: 'ocupada' },
    estado: 'listo',
    total: 52,
    numero_orden: 3,
    created_at: new Date(Date.now() - 28 * 60000).toISOString(),
    items: [
      { id: 'i-5', pedido_id: 'ped-3', producto_id: 'p-6', cantidad: 1, precio: 24, producto: mockProductos[5] },
      { id: 'i-6', pedido_id: 'ped-3', producto_id: 'p-2', cantidad: 1, precio: 10, producto: mockProductos[1] },
      { id: 'i-7', pedido_id: 'ped-3', producto_id: 'p-14', cantidad: 2, precio: 4, producto: mockProductos[13] },
      { id: 'i-8', pedido_id: 'ped-3', producto_id: 'p-11', cantidad: 1, precio: 7, producto: mockProductos[10] },
    ],
  },
  {
    id: 'ped-4',
    tipo: 'mesa',
    mesa_id: 'mesa-3',
    mesa: { id: 'mesa-3', numero: 3, capacidad: 4, estado: 'ocupada' },
    estado: 'pendiente',
    total: 23,
    numero_orden: 4,
    created_at: new Date(Date.now() - 1 * 60000).toISOString(),
    items: [
      { id: 'i-9', pedido_id: 'ped-4', producto_id: 'p-7', cantidad: 1, precio: 20, producto: mockProductos[6] },
      { id: 'i-10', pedido_id: 'ped-4', producto_id: 'p-15', cantidad: 1, precio: 3, producto: mockProductos[14] },
    ],
  },
]
