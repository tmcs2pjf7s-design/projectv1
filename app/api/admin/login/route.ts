import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { pool } from '@/lib/db'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'ruslanurbano@outlook.es'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '.12//Musica'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    try {
      const { rows } = await pool.query(
        'SELECT password_hash, salt FROM usuarios WHERE email=$1 AND rol=$2',
        [ADMIN_EMAIL, 'admin']
      )
      if (rows.length > 0) {
        if (!verifyPassword(password, rows[0].password_hash, rows[0].salt)) {
          return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
        }
      } else {
        if (password !== ADMIN_PASSWORD) {
          return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
        }
        const { hash, salt } = hashPassword(password)
        await pool.query(
          `INSERT INTO usuarios (nombre, email, password_hash, salt, rol)
           VALUES ('Admin',$1,$2,$3,'admin')`,
          [ADMIN_EMAIL, hash, salt]
        )
      }
    } catch {
      // DB not ready yet — fall back to hardcoded check
      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
      }
    }

    return NextResponse.json({ ok: true, email })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
