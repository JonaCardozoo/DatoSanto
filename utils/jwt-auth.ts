// Utilidades para manejo manual de JWT
interface JWTPayload {
  sub: string // user ID
  email: string
  exp: number // expiration timestamp
  iat: number // issued at timestamp
  [key: string]: any
}

interface StoredAuth {
  accessToken: string
  refreshToken: string
  user: any
  expiresAt: number
  storedAt: number
}

const AUTH_STORAGE_KEY = "futfactos-jwt-auth"
const REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutos antes de expirar

// Decodificar JWT sin verificar (solo para leer payload)
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(decoded)
  } catch (error) {
    console.error("❌ Error decodificando JWT:", error)
    return null
  }
}

// Verificar si el token está expirado
function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token)
  if (!payload) return true

  const now = Math.floor(Date.now() / 1000)
  return payload.exp <= now
}

// Verificar si el token necesita refresh
function needsRefresh(token: string): boolean {
  const payload = decodeJWT(token)
  if (!payload) return true

  const now = Date.now()
  const expiresAt = payload.exp * 1000
  return expiresAt - now <= REFRESH_THRESHOLD
}

// Guardar autenticación en localStorage
export function storeAuth(session: any): void {
  if (!session?.access_token || !session?.user) {
    console.error("❌ Sesión inválida para guardar")
    return
  }

  const payload = decodeJWT(session.access_token)
  if (!payload) {
    console.error("❌ Token JWT inválido")
    return
  }

  const authData: StoredAuth = {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    user: session.user,
    expiresAt: payload.exp * 1000,
    storedAt: Date.now(),
  }

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))

  } catch (error) {
    console.error("❌ Error guardando auth:", error)
  }
}

// Recuperar autenticación de localStorage
export function getStoredAuth(): StoredAuth | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) {
      
      return null
    }

    const authData: StoredAuth = JSON.parse(stored)

    // Verificar si el token está expirado
    if (isTokenExpired(authData.accessToken)) {
      
      clearStoredAuth()
      return null
    }



    return authData
  } catch (error) {
    console.error("❌ Error recuperando auth:", error)
    clearStoredAuth()
    return null
  }
}

// Limpiar autenticación guardada
export function clearStoredAuth(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    
  } catch (error) {
    console.error("❌ Error limpiando auth:", error)
  }
}

// Verificar si necesita refresh
export function shouldRefreshToken(): boolean {
  const stored = getStoredAuth()
  if (!stored) return false

  return needsRefresh(stored.accessToken)
}

// Obtener token actual válido
export function getCurrentToken(): string | null {
  const stored = getStoredAuth()
  if (!stored) return null

  if (isTokenExpired(stored.accessToken)) {
    clearStoredAuth()
    return null
  }

  return stored.accessToken
}

// Obtener usuario actual
export function getCurrentUser(): any | null {
  const stored = getStoredAuth()
  return stored?.user || null
}

// Debug info
export function getAuthDebugInfo() {
  const stored = getStoredAuth()
  if (!stored) return { hasAuth: false }

  const payload = decodeJWT(stored.accessToken)
  const now = Date.now()

  return {
    hasAuth: true,
    user: {
      id: stored.user.id,
      email: stored.user.email,
    },
    token: {
      isExpired: isTokenExpired(stored.accessToken),
      needsRefresh: needsRefresh(stored.accessToken),
      expiresAt: new Date(stored.expiresAt).toLocaleString(),
      timeUntilExpiry: Math.max(0, stored.expiresAt - now),
    },
    storage: {
      storedAt: new Date(stored.storedAt).toLocaleString(),
      ageInMinutes: Math.floor((now - stored.storedAt) / (1000 * 60)),
    },
  }
}
