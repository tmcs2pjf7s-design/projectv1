import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth'
import { pool } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }
    const { rows } = await pool.query(
      'SELECT id, nombre, email, telefono, password_hash, salt FROM usuarios WHERE email=$1 AND rol=$2',
      [email, 'cliente']
    )
    const usuario = rows[0]
    if (!usuario || !verifyPassword(password, usuario.password_hash, usuario.salt)) {
      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
    }
    return NextResponse.json({
      ok: true,
      cliente: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, telefono: usuario.telefono },
    })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
