import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const password_hash = createHash('sha256').update(password).digest('hex')

  const { data, error } = await supabase
    .from('clientes')
    .select('id, nombre, email, telefono')
    .eq('email', email)
    .eq('password_hash', password_hash)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
  }

  return NextResponse.json({ ok: true, cliente: data })
}
