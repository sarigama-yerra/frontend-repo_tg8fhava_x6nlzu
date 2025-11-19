let scriptLoaded = false
let scriptLoadingPromise = null

export function loadRecaptcha(siteKey) {
  if (typeof window === 'undefined') return Promise.reject(new Error('window unavailable'))
  if (scriptLoaded) return Promise.resolve()
  if (scriptLoadingPromise) return scriptLoadingPromise

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-recaptcha]')
    if (existing) {
      scriptLoaded = true
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    s.async = true
    s.defer = true
    s.setAttribute('data-recaptcha', 'true')
    s.onload = () => { scriptLoaded = true; resolve() }
    s.onerror = () => reject(new Error('reCAPTCHA script failed to load'))
    document.head.appendChild(s)
  })

  return scriptLoadingPromise
}

export async function getRecaptchaToken(siteKey, action = 'vote') {
  await loadRecaptcha(siteKey)
  if (!window.grecaptcha || !window.grecaptcha.execute) throw new Error('reCAPTCHA not available')
  return await window.grecaptcha.execute(siteKey, { action })
}
