const BASE_URL = 'https://local.bidder.ng'

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : undefined
}

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/`
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; max-age=0; path=/`
}

async function refreshToken(): Promise<string | null> {
  const token = getCookie('auth-token')
  if (!token) return null

  try {
    const res = await fetch(`${BASE_URL}/api/auth/tenants/refresh`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const json = await res.json()
    const newToken = json?.data?.token
    if (newToken) {
      setCookie('auth-token', newToken, 60 * 60 * 24 * 7)
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
  const token = getCookie('auth-token')

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
    const token = getCookie('auth-token')
    if (token) {
      await fetch(`${BASE_URL}/api/auth/tenants/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
    }
  } catch {}
  deleteCookie('auth-token')
}
