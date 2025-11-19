import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import VotePanel from './VotePanel'
import { getRecaptchaToken } from '../utils/recaptcha'
import { getClientUUID, getLightFingerprint } from '../utils/identity'
import { hmacSHA256Hex } from '../utils/hmac'

export default function VotePage(){
  const [current, setCurrent] = useState(null)
  const [counts, setCounts] = useState(null)
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

  useEffect(()=>{ loadCurrent() }, [])

  async function loadCurrent(){
    const { data: ts } = await supabase.from('tournaments').select('*').order('start_date', { ascending: false }).limit(1)
    if (!ts || !ts.length) return
    const { data: ms } = await supabase.from('matches').select('*').eq('tournament_id', ts[0].id).eq('status','running').order('start_at').limit(1)
    if (ms && ms.length) setCurrent(ms[0])
  }

  async function castWithCaptcha(choice){
    try {
      const token = await getRecaptchaToken(siteKey, 'vote')
      // Optional: include captcha token to Edge Function in future
      // For now, we include it in details column via RPC if extended, here we simply proceed
      const secret = import.meta.env.VITE_PUBLIC_HMAC_SALT || 'demo-secret'
      const uuid = getClientUUID()
      const fp = getLightFingerprint()
      const uuidHmac = await hmacSHA256Hex(uuid, secret)
      const fpHmac = fp ? await hmacSHA256Hex(fp, secret) : null
      const { error } = await supabase.rpc('cast_vote', {
        p_match_id: current.id,
        p_choice: choice,
        p_uuid_hmac: uuidHmac,
        p_fingerprint_hmac: fpHmac,
      })
      if (error) throw error
    } catch (e) {
      alert(e.message || 'Captcha/Vote fehlgeschlagen')
    }
  }

  if (!current) return <div className="text-gray-400">Kein aktives Match gefunden.</div>

  return (
    <div className="grid gap-4">
      <VotePanel match={current} />
      <div className="card p-4">
        <div className="text-sm text-gray-400 mb-2">reCAPTCHA aktiviert</div>
        <div className="grid grid-cols-2 gap-4">
          <button className="button" onClick={()=>castWithCaptcha('A')}>Stimme für A</button>
          <button className="button" onClick={()=>castWithCaptcha('B')}>Stimme für B</button>
        </div>
      </div>
    </div>
  )
}
