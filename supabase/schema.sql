-- Restaurante: Schema Supabase
-- Ejecutar en el SQL Editor de tu proyecto Supabase

create table categorias (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  orden integer default 0,
  icono text default '🍽️',
  created_at timestamptz default now()
);

create table productos (
  id uuid default gen_random_uuid() primary key,
  categoria_id uuid references categorias(id) on delete set null,
  nombre text not null,
  descripcion text,
  precio decimal(10,2) not null,
  imagen text,
  disponible boolean default true,
  tiempo_prep integer default 10,
  created_at timestamptz default now()
);

create table mesas (
  id uuid default gen_random_uuid() primary key,
  numero integer not null unique,
  capacidad integer default 4,
  estado text default 'libre' check (estado in ('libre', 'ocupada', 'reservada')),
  created_at timestamptz default now()
);

create table pedidos (
  id uuid default gen_random_uuid() primary key,
  tipo text not null check (tipo in ('mesa', 'llevar')),
  mesa_id uuid references mesas(id) on delete set null,
  estado text default 'pendiente' check (
    estado in ('pendiente','confirmado','en_preparacion','listo','entregado','cancelado')
  ),
  total decimal(10,2) default 0,
  cliente_nombre text,
  cliente_telefono text,
  notas text,
  numero_orden serial,
  created_at timestamptz default now()
);

create table pedido_items (
  id uuid default gen_random_uuid() primary key,
  pedido_id uuid references pedidos(id) on delete cascade,
  producto_id uuid references productos(id) on delete set null,
  cantidad integer not null default 1,
  precio decimal(10,2) not null,
  notas text,
  created_at timestamptz default now()
);

-- Habilitar Realtime para pedidos (para cocina y comandero)
alter publication supabase_realtime add table pedidos;
alter publication supabase_realtime add table pedido_items;

-- Seed: categorías
insert into categorias (nombre, orden, icono) values
  ('Entrantes', 1, '🥗'),
  ('Principales', 2, '🍽️'),
  ('Postres', 3, '🍮'),
  ('Bebidas', 4, '🥤');

-- Seed: mesas
insert into mesas (numero, capacidad) values
  (1,2),(2,2),(3,4),(4,4),(5,4),(6,4),(7,4),(8,4),(9,6),(10,6),(11,6),(12,6);
