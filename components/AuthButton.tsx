"use client"

import { useState, useEffect } from "react"
import { User, LogOut, AlertCircle, RefreshCw, Info } from "lucide-react"
import Link from "next/link"
import { getSupabaseClient, restoreSessionFromJWT, signOutWithJWT } from "@/utils/supabase-browser"
import { getCurrentUser, getAuthDebugInfo, shouldRefreshToken } from "@/utils/jwt-auth"

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)

  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let mounted = true

    const initializeAuth = async () => {
      try {

        // Paso 1: Verificar JWT guardado
        const storedUser = getCurrentUser()
        if (storedUser) {
          setUser(storedUser)

          // Restaurar sesión en Supabase
          const session = await restoreSessionFromJWT()
          if (session && mounted) {
            await loadUserProfile(session.user)
          } else if (mounted) {
            // Si no se pudo restaurar, usar datos del JWT
            await loadUserProfile(storedUser)
          }
        } else {
          if (mounted) {
            setLoading(false)
          }
        }

        // Paso 2: Configurar listener de Supabase
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {

          if (!mounted) return

          switch (event) {
            case "SIGNED_IN":
              if (session?.user) {
                setUser(session.user)
                setError(null)
                await loadUserProfile(session.user)
              }
              break

            case "SIGNED_OUT":
              setUser(null)
              setProfile(null)
              setError(null)
              setLoading(false)
              break

            case "TOKEN_REFRESHED":
              if (session?.user) {
                setUser(session.user)
              }
              break
          }
        })

      } catch (error) {
        console.error("💥 Error inicializando auth JWT:", error)
        if (mounted) {
          setError("Error de inicialización")
          setLoading(false)
        }
      }
    }

    const loadUserProfile = async (currentUser: any) => {
      try {

        const { data, error } = await supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle()

        if (!mounted) return

        if (error) {
          console.error("❌ Error cargando perfil:", error)
          createFallbackProfile(currentUser)
          return
        }

        if (data) {
          setProfile(data)
          setError(null)
        } else {
          await createNewProfile(currentUser)
        }
      } catch (error) {
        console.error("💥 Error en loadUserProfile:", error)
        createFallbackProfile(currentUser)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    const createNewProfile = async (currentUser: any) => {
      try {
        const username =
          currentUser.user_metadata?.username ||
          currentUser.user_metadata?.name ||
          currentUser.email?.split("@")[0] ||
          `Usuario${currentUser.id.slice(0, 8)}`

        const { data, error } = await supabase
          .from("profiles")
          .insert([
            {
              id: currentUser.id,
              username: username,
              email: currentUser.email,
              points: 0,
              games_won: 0,
            },
          ])
          .select("*")
          .single()

        if (error) {
          console.error("❌ Error creando perfil:", error)
          createFallbackProfile(currentUser)
          return
        }

        setProfile(data)
        setError(null)
      } catch (error) {
        console.error("💥 Error en createNewProfile:", error)
        createFallbackProfile(currentUser)
      }
    }

    const createFallbackProfile = (currentUser: any) => {
      const fallback = {
        id: currentUser.id,
        username:
          currentUser.user_metadata?.username ||
          currentUser.user_metadata?.name ||
          currentUser.email?.split("@")[0] ||
          `Usuario${currentUser.id.slice(0, 8)}`,
        email: currentUser.email,
        points: 0,
        games_won: 0,
      }

      setProfile(fallback)
      setError("Modo offline")
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [supabase])

  const handleLogout = async () => {
    try {
      setLoading(true)

      await signOutWithJWT()

      setUser(null)
      setProfile(null)
      setError(null)

      // Recargar página
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error("💥 Error en logout:", error)
      window.location.reload()
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const session = await restoreSessionFromJWT()
      if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user)
      }
    } catch (error) {
      console.error("❌ Error refrescando:", error)
      setError("Error refrescando")
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async (currentUser: any) => {
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle()
      if (data) {
        setProfile(data)
        setError(null)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  // Debug info
  const debugInfo = getAuthDebugInfo()
  const needsRefresh = shouldRefreshToken()

  // Estados de renderizado
  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
        <span className="text-xs text-gray-400 hidden md:inline">Cargando usuario...</span>
      </div>
    )
  }

  if (!supabase) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-600 rounded-lg opacity-60">
        <User className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-400">Sin auth</span>
      </div>
    )
  }

  if (user && profile) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-white font-semibold flex items-center space-x-1">
            <span>{profile.username}</span>
            {error && <AlertCircle className="w-4 h-4 text-yellow-400" title={error} />}
            {needsRefresh && <RefreshCw className="w-4 h-4 text-orange-400" title="Token necesita refresh" />}
          </div>
          <div className="text-red-400 text-sm">{profile.points || 0} puntos</div>
        </div>


        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-2 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          disabled={loading}
        >
          <LogOut className="w-5 h-5 text-white" />
          <span className="hidden md:inline text-white">Salir</span>
        </button>

        {/* Debug panel */}
        {showDebug && (
          <div className="fixed top-20 right-4 bg-black border border-gray-600 rounded-lg p-4 text-xs max-w-sm z-50">
            <h3 className="text-white font-bold mb-2">🔍 Debug JWT</h3>
            <pre className="text-gray-300 whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href="/auth"
      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
    >
      <User className="w-5 h-5" />
      <span>Iniciar Sesión</span>
    </Link>
  )
}
