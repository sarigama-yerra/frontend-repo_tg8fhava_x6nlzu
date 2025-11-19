import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Bracket() {
  const [tournament, setTournament] = useState(null)
  const [matches, setMatches] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data: ts } = await supabase.from('tournaments').select('*').order('start_date', { ascending: false }).limit(1)
    if (ts && ts.length) {
      setTournament(ts[0])
      const { data: ms } = await supabase.from('matches').select('*').eq('tournament_id', ts[0].id).order('round').order('start_at')
      setMatches(ms || [])
    }
  }

  const rounds = useMemo(() => {
    const byRound = {}
    for (const m of matches) {
      byRound[m.round] = byRound[m.round] || []
      byRound[m.round].push(m)
    }
    return Object.keys(byRound).sort((a,b)=>Number(a)-Number(b)).map(r => ({ round: Number(r), items: byRound[r] }))
  }, [matches])

  return (
    <div className="grid gap-6">
      <section className="card p-6">
        <h2 className="text-xl font-semibold">{tournament?.name || 'Kein Turnier'}</h2>
        <p className="text-sm text-gray-400">Rundenübersicht und Live-Status</p>
      </section>
      <div className="overflow-x-auto">
        <div className="min-w-[800px] grid" style={{ gridTemplateColumns: `repeat(${rounds.length || 1}, minmax(200px, 1fr))`, gap: '1rem' }}>
          {rounds.map(r => (
            <div key={r.round} className="space-y-3">
              <div className="text-sm font-semibold text-gray-300">Runde {r.round}</div>
              {r.items.map(m => (
                <div key={m.id} className="rounded bg-white/5 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Match {m.id.slice(0,8)}</span>
                    <span className="text-xs text-gray-400">{m.status}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="rounded bg-black/30 p-2">A: {m.participant_a_id || '—'}</div>
                    <div className="rounded bg-black/30 p-2">B: {m.participant_b_id || '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
