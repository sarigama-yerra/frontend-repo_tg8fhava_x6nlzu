import React from 'react'
import { BrowserRouter, Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-blue-600" />
            <span className="font-semibold">LehrerWM</span>
          </div>
          <nav className="flex items-center gap-4 text-sm text-gray-300">
            <a className="hover:text-white" href="#">Bracket</a>
            <a className="hover:text-white" href="#">Vote</a>
            <a className="hover:text-white" href="#">Admin</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-6">
          <section className="card p-6">
            <h1 className="text-2xl font-bold mb-2">LehrerWM – Supabase Variante</h1>
            <p className="text-gray-300">Dieses Frontend enthält die Supabase-Integration (Client, Realtime, Auth) und die Routenstruktur für Bracket, Voting und Admin. Als Nächstes richte ich die Supabase-Skripte, Policies und RPCs ein und ergänze die Seiten.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-gray-400">HTL Mössingerstraße • LehrerWM</footer>
    </div>
  )
}
