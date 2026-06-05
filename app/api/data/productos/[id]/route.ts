import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await pool.query('DELETE FROM productos WHERE id=$1', [params.id])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
