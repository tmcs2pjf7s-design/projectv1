import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'ruslanurbano@outlook.es'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '.12//Musica'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({ ok: true, email })
    }
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 })
  }
}
