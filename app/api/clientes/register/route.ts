import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { nombre, email, password, telefono } = await req.json()

  if (!nombre || !email || !password) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
  }

  const password_hash = createHash('sha256').update(password).digest('hex')

  const { data, error } = await supabase
    .from('clientes')
    .insert({ nombre, email, telefono: telefono ?? null, password_hash })
    .select('id, nombre, email, telefono')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error al crear la cuenta' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, cliente: data })
}
