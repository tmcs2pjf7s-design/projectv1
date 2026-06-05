import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { estado } = await req.json()
    await pool.query('UPDATE mesas SET estado=$1 WHERE id=$2', [estado, params.id])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
