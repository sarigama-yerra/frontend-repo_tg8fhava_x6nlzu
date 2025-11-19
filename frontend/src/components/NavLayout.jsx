import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function NavLayout(){
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-blue-600" />
            <span className="font-semibold">LehrerWM</span>
          </div>
          <nav className="flex items-center gap-4 text-sm text-gray-300">
            <Link className="hover:text-white" to="/">Home</Link>
            <Link className="hover:text-white" to="/bracket">Bracket</Link>
            <Link className="hover:text-white" to="/admin">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-gray-400">HTL Mössingerstraße • LehrerWM</footer>
    </div>
  )
}
