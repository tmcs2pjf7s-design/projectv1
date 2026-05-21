import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'Admin no configurado' }, { status: 500 })
  }

  if (email === adminEmail && password === adminPassword) {
    return NextResponse.json({ ok: true, email })
  }

  return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
}
