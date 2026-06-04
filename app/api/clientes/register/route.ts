import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, password, telefono } = await req.json()

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
    }

    const { hash, salt } = hashPassword(password)

    const { data, error } = await supabase
      .from('usuarios')
      .insert({ nombre, email, telefono: telefono ?? null, password_hash: hash, salt, rol: 'cliente' })
      .select('id, nombre, email, telefono')
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Error al crear la cuenta' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, cliente: data })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
