import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight">Restaurante</span>
          <div className="flex items-center gap-5">
            <Link href="/menu" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Menú</Link>
            <Link href="/llevar" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Para llevar</Link>
            <Link href="/admin" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-700 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-white to-white" />
        <div className="relative max-w-6xl mx-auto px-5 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-accent text-sm font-bold tracking-widest uppercase mb-3">
              Bienvenidos
            </p>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-[1.05]">
              El placer de<br />
              <span className="text-accent">comer bien.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-md leading-relaxed">
              Cocina de autor con productos frescos de temporada.
              Pide desde tu mesa escaneando el QR o haz tu pedido para llevar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/llevar"
                className="bg-accent text-white px-7 py-4 rounded-2xl font-bold text-base hover:bg-accent-dark transition-colors shadow-lg shadow-orange-200"
              >
                🛵 Pedir para llevar
              </Link>
              <Link
                href="/menu"
                className="bg-gray-100 text-gray-900 px-7 py-4 rounded-2xl font-bold text-base hover:bg-gray-200 transition-colors"
              >
                Ver menú
              </Link>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=300&q=80',
              'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300&q=80',
              'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=300&q=80',
              'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80',
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={`rounded-2xl object-cover w-full h-48 shadow-md ${i === 1 ? 'mt-8' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl font-black text-center mb-4">Una nueva forma de pedir</h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Sin esperas, sin confusiones. Tecnología al servicio de la buena mesa.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📱',
                title: 'Escanea el QR',
                desc: 'Escanea el QR de tu mesa, elige lo que quieres y pide directamente desde tu móvil.',
              },
              {
                icon: '⚡',
                title: 'Tiempo real',
                desc: 'La cocina recibe tu pedido al instante. Sigue su estado en vivo desde tu pantalla.',
              },
              {
                icon: '🛵',
                title: 'Para llevar',
                desc: 'Haz tu pedido online antes de llegar. Estará listo cuando aparezcas.',
              },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-5">
          <p className="text-gray-400 text-sm text-center mb-6 font-medium uppercase tracking-widest">
            Accesos del equipo
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { href: '/cocina', icon: '👨‍🍳', label: 'Pantalla cocina', sub: 'Pedidos en tiempo real' },
              { href: '/comandero', icon: '🧑‍💼', label: 'Comandero', sub: 'Gestión de mesas' },
              { href: '/admin', icon: '⚙️', label: 'Administración', sub: 'Menú, mesas y estadísticas' },
            ].map(a => (
              <Link
                key={a.href}
                href={a.href}
                className="flex flex-col items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-colors text-center"
              >
                <span className="text-3xl">{a.icon}</span>
                <span className="font-semibold text-sm">{a.label}</span>
                <span className="text-gray-400 text-xs">{a.sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        © 2026 Restaurante · Todos los derechos reservados
      </footer>
    </div>
  )
}
