'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { mockMesas } from '@/lib/mockData'
import { Mesa } from '@/lib/types'
import { QRCodeSVG } from 'qrcode.react'

export default function AdminMesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>(mockMesas)
  const [baseUrl, setBaseUrl] = useState('')
  const [mesaQR, setMesaQR] = useState<Mesa | null>(null)

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  const toggleEstado = (id: string) => {
    setMesas(prev => prev.map(m =>
      m.id === id
        ? { ...m, estado: m.estado === 'libre' ? 'ocupada' : 'libre' }
        : m
    ))
  }

  const descargarQR = (mesa: Mesa) => {
    const svg = document.getElementById(`qr-${mesa.id}`)
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mesa-${mesa.numero}-qr.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const estadoColor = {
    libre: 'bg-green-50 text-green-700 border-green-200',
    ocupada: 'bg-accent/10 text-accent border-accent/30',
    reservada: 'bg-blue-50 text-blue-700 border-blue-200',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 text-sm font-medium">← Admin</Link>
            <span className="font-black text-lg">Gestión de Mesas</span>
          </div>
          <div className="flex gap-3 text-xs text-gray-500 font-medium">
            <span>🟢 {mesas.filter(m => m.estado === 'libre').length} libres</span>
            <span>🟠 {mesas.filter(m => m.estado === 'ocupada').length} ocupadas</span>
            <span>🔵 {mesas.filter(m => m.estado === 'reservada').length} reservadas</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mesas.map(mesa => {
            const qrUrl = `${baseUrl}/mesa/${mesa.id}`
            return (
              <div key={mesa.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black">Mesa {mesa.numero}</h3>
                    <p className="text-sm text-gray-500">{mesa.capacidad} personas</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${estadoColor[mesa.estado]}`}>
                    {mesa.estado}
                  </span>
                </div>

                {/* QR */}
                {baseUrl && (
                  <div className="flex flex-col items-center bg-gray-50 rounded-xl p-4 mb-4">
                    <QRCodeSVG
                      id={`qr-${mesa.id}`}
                      value={qrUrl}
                      size={140}
                      bgColor="#f9fafb"
                      fgColor="#111827"
                      level="M"
                    />
                    <p className="text-xs text-gray-400 mt-2 text-center break-all max-w-full">{qrUrl}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => descargarQR(mesa)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    ↓ QR
                  </button>
                  <button
                    onClick={() => setMesaQR(mesa)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    🔍 Ver QR
                  </button>
                  <button
                    onClick={() => toggleEstado(mesa.id)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      mesa.estado === 'libre'
                        ? 'bg-accent text-white hover:bg-accent-dark'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {mesa.estado === 'libre' ? 'Ocupar' : 'Liberar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Modal QR grande */}
      {mesaQR && baseUrl && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
          onClick={() => setMesaQR(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-black mb-1">Mesa {mesaQR.numero}</h2>
            <p className="text-gray-500 text-sm mb-6">Escanea para pedir</p>
            <div className="flex justify-center mb-4">
              <QRCodeSVG
                value={`${baseUrl}/mesa/${mesaQR.id}`}
                size={220}
                bgColor="#ffffff"
                fgColor="#111827"
                level="M"
              />
            </div>
            <p className="text-xs text-gray-400 mb-6">{baseUrl}/mesa/{mesaQR.id}</p>
            <div className="flex gap-3">
              <button
                onClick={() => descargarQR(mesaQR)}
                className="flex-1 bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent-dark transition-colors"
              >
                Descargar QR
              </button>
              <button
                onClick={() => setMesaQR(null)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
