import { getCookie, setCookie, deleteCookie } from 'cookies-next'

const BASE_URL = 'https://local.bidder.ng'

async function refreshToken(): Promise<string | null> {
  const token = getCookie('auth-token') as string | undefined
  if (!token) return null

  try {
    const res = await fetch(`${BASE_URL}/api/auth/tenants/refresh`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const json = await res.json()
    const newToken = json?.data?.token
    if (newToken) {
      setCookie('auth-token', newToken, { maxAge: 60 * 60 * 24 * 7 })
      return newToken
    }
  } catch {}
  return null
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<Response> {
  const token = getCookie('auth-token') as string | undefined

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401 && retry) {
    const newToken = await refreshToken()
    if (newToken) return apiFetch(path, options, false)
    if (typeof window !== 'undefined') {
      deleteCookie('auth-token')
      window.location.href = '/auth/login'
    }
  }

  return res
}

export async function logout() {
  try {
    const token = getCookie('auth-token') as string | undefined
    if (token) {
      await fetch(`${BASE_URL}/api/auth/tenants/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
    }
  } catch {}
  deleteCookie('auth-token')
}
