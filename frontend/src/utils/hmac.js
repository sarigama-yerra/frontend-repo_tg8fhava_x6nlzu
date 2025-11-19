export async function hmacSHA256Hex(message, secret) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  const bytes = new Uint8Array(signature)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}
