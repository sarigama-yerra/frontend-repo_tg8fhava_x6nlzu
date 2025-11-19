import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const defaultDuelSeconds = 86400 // one day in seconds

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState([])
  const [newTeacher, setNewTeacher] = useState('')
  const [tournaments, setTournaments] = useState([])
  const [name, setName] = useState('LehrerWM')
  const [duelSeconds, setDuelSeconds] = useState(defaultDuelSeconds)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    const [t1, t2] = await Promise.all([
      supabase.from('teachers').select('*').order('name'),
      supabase.from('tournaments').select('*').order('start_date', { ascending: false }),
    ])
    if (!t1.error && t1.data) setTeachers(t1.data)
    if (!t2.error && t2.data) setTournaments(t2.data)
  }

  async function addTeacher(e) {
    e.preventDefault()
    if (!newTeacher.trim()) return
    setLoading(true)
    setMessage('')
    const { error } = await supabase.from('teachers').insert({ name: newTeacher.trim() })
    setLoading(false)
    if (error) return setMessage(error.message)
    setNewTeacher('')
    refresh()
  }

  async function createTournament(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { data, error } = await supabase.rpc('create_tournament', {
      p_name: name,
      p_duel_seconds: Number(duelSeconds) || defaultDuelSeconds,
    })
    setLoading(false)
    if (error) return setMessage(error.message)
    setMessage('Turnier erstellt')
    await refresh()
  }

  async function buildBracket(tournamentId) {
    setLoading(true)
    setMessage('')
    const { error } = await supabase.rpc('build_bracket', { p_tournament_id: tournamentId })
    setLoading(false)
    if (error) return setMessage(error.message)
    setMessage('Bracket erstellt')
  }

  return (
    <div className="grid gap-6">
      <section className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Lehrer verwalten</h2>
        <form onSubmit={addTeacher} className="flex gap-3">
          <input value={newTeacher} onChange={e=>setNewTeacher(e.target.value)} placeholder="Lehrername" className="input flex-1" />
          <button className="button" disabled={loading}>Hinzufügen</button>
        </form>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
          {teachers.map(t => (
            <li key={t.id} className="flex items-center justify-between rounded bg-white/5 px-3 py-2">
              <span>{t.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Turnier erstellen</h2>
        <form onSubmit={createTournament} className="grid gap-3 sm:grid-cols-3">
          <input value={name} onChange={e=>setName(e.target.value)} className="input" placeholder="Turniername" />
          <input type="number" value={duelSeconds} onChange={e=>setDuelSeconds(e.target.value)} className="input" placeholder="Sekunden pro Duell" />
          <button className="button" disabled={loading}>Anlegen</button>
        </form>
        <p className="mt-2 text-xs text-gray-400">Standarddauer: 1 Tag = 86400 Sekunden</p>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Bracket</h2>
        <div className="space-y-2">
          {tournaments.map(t => (
            <div key={t.id} className="flex items-center justify-between rounded bg-white/5 p-3">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-gray-400">Start: {t.start_date ? new Date(t.start_date).toLocaleString() : '—'} • Status: {t.status}</div>
              </div>
              <div className="flex gap-2">
                <button className="button" onClick={()=>buildBracket(t.id)} disabled={loading}>Bracket bauen</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {message && <div className="text-sm text-emerald-400">{message}</div>}
    </div>
  )
}
