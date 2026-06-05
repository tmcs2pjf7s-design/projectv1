import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { pool } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, password, telefono } = await req.json()
    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
    }
    const { hash, salt } = hashPassword(password)
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, email, telefono, password_hash, salt, rol)
       VALUES ($1,$2,$3,$4,$5,'cliente') RETURNING id, nombre, email, telefono`,
      [nombre, email, telefono ?? null, hash, salt]
    )
    return NextResponse.json({ ok: true, cliente: rows[0] })
  } catch (e: any) {
    if (e?.code === '23505') {
      return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
