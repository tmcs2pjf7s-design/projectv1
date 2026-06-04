import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'ruslanurbano@outlook.es'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '.12//Musica'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    // Buscar admin en la BD
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id, password_hash, salt')
      .eq('email', ADMIN_EMAIL)
      .eq('rol', 'admin')
      .maybeSingle()

    if (usuario) {
      // Verificar contra la BD
      if (!verifyPassword(password, usuario.password_hash, usuario.salt)) {
        return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
      }
    } else {
      // Primera vez: verificar contra credenciales hardcoded y crear en BD
      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
      }
      const { hash, salt } = hashPassword(password)
      await supabase.from('usuarios').insert({
        nombre: 'Admin',
        email: ADMIN_EMAIL,
        password_hash: hash,
        salt,
        rol: 'admin',
      })
    }

    return NextResponse.json({ ok: true, email })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
