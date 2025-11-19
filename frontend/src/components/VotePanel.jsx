import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getClientUUID, getLightFingerprint } from '../utils/identity'
import { hmacSHA256Hex } from '../utils/hmac'

export default function VotePanel({ match }) {
  const [counts, setCounts] = useState({ A: 0, B: 0 })
  const [now, setNow] = useState(Date.now())
  const hmacSecret = import.meta.env.VITE_PUBLIC_HMAC_SALT || 'demo-secret'

  const start = useMemo(() => match?.start_at ? new Date(match.start_at) : null, [match])
  const end = useMemo(() => match?.end_at ? new Date(match.end_at) : null, [match])
  const remaining = useMemo(() => end ? Math.max(0, end.getTime() - now) : 0, [end, now])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!match?.id) return
    const channel = supabase
      .channel('matches-votes-' + match.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes', filter: `match_id=eq.${match.id}` }, () => {
        fetchCounts()
      })
      .subscribe()

    fetchCounts()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [match?.id])

  async function fetchCounts() {
    const { data, error } = await supabase
      .from('match_vote_counts')
      .select('*')
      .eq('match_id', match.id)
      .single()
    if (!error && data) {
      setCounts({ A: data.votes_a || 0, B: data.votes_b || 0 })
    }
  }

  async function cast(choice) {
    try {
      const uuid = getClientUUID()
      const fp = getLightFingerprint()
      const uuidHmac = await hmacSHA256Hex(uuid, hmacSecret)
      const fpHmac = fp ? await hmacSHA256Hex(fp, hmacSecret) : null

      const { error } = await supabase.rpc('cast_vote', {
        p_match_id: match.id,
        p_choice: choice,
        p_uuid_hmac: uuidHmac,
        p_fingerprint_hmac: fpHmac,
      })
      if (error) throw error
    } catch (e) {
      alert(e.message || 'Voting failed')
    }
  }

  const running = match?.status === 'running' && start && end && Date.now() >= start.getTime() && Date.now() < end.getTime()

  return (
    <div className="card p-6">
      <div className="mb-4 text-sm text-gray-400">Match #{match?.id?.slice(0,8)} • {running ? 'läuft' : match?.status}</div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => cast('A')} disabled={!running} className="button">
          Stimme für A ({counts.A})
        </button>
        <button onClick={() => cast('B')} disabled={!running} className="button">
          Stimme für B ({counts.B})
        </button>
      </div>
      {end && (
        <div className="mt-4 text-sm text-gray-400">Verbleibend: {Math.ceil(remaining / 1000)}s</div>
      )}
    </div>
  )
}
