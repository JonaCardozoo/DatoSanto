import { createClient } from "@supabase/supabase-js"
import { storeAuth, getStoredAuth, clearStoredAuth, shouldRefreshToken } from "./jwt-auth"

let supabaseInstance: any = null

export function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("🔧 Verificando variables de entorno de Supabase:")
  console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Configurada" : "❌ Faltante")
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Configurada" : "❌ Faltante")

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase no configurado - variables de entorno faltantes")
    return null
  }

  try {
    // Cliente Supabase con persistencia JWT manual
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Desactivar persistencia automática - la manejamos manualmente
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: true,

        // Storage personalizado que usa nuestro sistema JWT
        storage: {
          getItem: (key: string) => {
            if (key.includes("auth-token")) {
              const stored = getStoredAuth()
              if (stored) {
                // Devolver en formato que Supabase espera
                return JSON.stringify({
                  access_token: stored.accessToken,
                  refresh_token: stored.refreshToken,
                  user: stored.user,
                  expires_at: Math.floor(stored.expiresAt / 1000),
                })
              }
            }
            return null
          },
          setItem: (key: string, value: string) => {
            if (key.includes("auth-token")) {
              try {
                const session = JSON.parse(value)
                storeAuth(session)
              } catch (error) {
                console.error("❌ Error storing auth:", error)
              }
            }
          },
          removeItem: (key: string) => {
            if (key.includes("auth-token")) {
              clearStoredAuth()
            }
          },
        },

        flowType: "pkce",
      },

      global: {
        headers: {
          "X-Client-Info": "futfactos-jwt-auth@1.0.0",
        },
      },

      db: {
        schema: "public",
      },
    })

    console.log("✅ Cliente Supabase creado con persistencia JWT manual")
    return supabaseInstance
  } catch (error) {
    console.error("❌ Error creando cliente de Supabase:", error)
    return null
  }
}

// Función para restaurar sesión desde JWT guardado
export async function restoreSessionFromJWT() {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const stored = getStoredAuth()
  if (!stored) {
    console.log("📭 No hay sesión JWT para restaurar")
    return null
  }

  try {
    console.log("🔄 Restaurando sesión desde JWT...")

    // Verificar si necesita refresh
    if (shouldRefreshToken()) {
      console.log("🔄 Token necesita refresh...")
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: stored.refreshToken,
      })

      if (error) {
        console.error("❌ Error refrescando token:", error)
        clearStoredAuth()
        return null
      }

      if (data.session) {
        console.log("✅ Token refrescado exitosamente")
        storeAuth(data.session)
        return data.session
      }
    }

    // Establecer sesión en Supabase
    const { data, error } = await supabase.auth.setSession({
      access_token: stored.accessToken,
      refresh_token: stored.refreshToken,
    })

    if (error) {
      console.error("❌ Error estableciendo sesión:", error)
      clearStoredAuth()
      return null
    }

    console.log("✅ Sesión JWT restaurada:", {
      userId: data.session?.user?.id,
      email: data.session?.user?.email,
    })

    return data.session
  } catch (error) {
    console.error("💥 Error restaurando sesión JWT:", error)
    clearStoredAuth()
    return null
  }
}

// Función para login con persistencia JWT
export async function signInWithJWT(email: string, password: string) {
  const supabase = getSupabaseClient()
  if (!supabase) return { data: null, error: { message: "Supabase no configurado" } }

  try {
    console.log("🔐 Iniciando sesión con JWT...")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("❌ Error en login:", error)
      return { data: null, error }
    }

    if (data.session) {
      console.log("✅ Login exitoso, guardando JWT...")
      storeAuth(data.session)
    }

    return { data, error: null }
  } catch (error) {
    console.error("💥 Error en signInWithJWT:", error)
    return { data: null, error: { message: "Error inesperado" } }
  }
}

// Función para signup con persistencia JWT
export async function signUpWithJWT(email: string, password: string, username: string) {
  const supabase = getSupabaseClient()
  if (!supabase) return { data: null, error: { message: "Supabase no configurado" } }

  try {
    console.log("📝 Registrando usuario con JWT...")

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    })

    if (error) {
      console.error("❌ Error en registro:", error)
      return { data: null, error }
    }

    if (data.session) {
      console.log("✅ Registro exitoso, guardando JWT...")
      storeAuth(data.session)
    }

    return { data, error: null }
  } catch (error) {
    console.error("💥 Error en signUpWithJWT:", error)
    return { data: null, error: { message: "Error inesperado" } }
  }
}

// Función para logout con limpieza JWT
export async function signOutWithJWT() {
  const supabase = getSupabaseClient()

  try {
    console.log("🚪 Cerrando sesión y limpiando JWT...")

    // Limpiar JWT primero
    clearStoredAuth()

    // Cerrar sesión en Supabase
    if (supabase) {
      await supabase.auth.signOut()
    }

    // Limpiar todo el localStorage
    localStorage.clear()

    console.log("✅ Sesión cerrada completamente")
    return { error: null }
  } catch (error) {
    console.error("💥 Error en logout:", error)
    // Aún así limpiar storage
    clearStoredAuth()
    localStorage.clear()
    return { error }
  }
}
