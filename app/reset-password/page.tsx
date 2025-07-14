"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/utils/supabase-browser"
import { storeAuth } from "@/utils/jwt-auth"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const extractTokensFromURL = () => {
      let access_token = null
      let refresh_token = null

      // Primero intento obtener del hash (#access_token=...)
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        access_token = hashParams.get("access_token")
        refresh_token = hashParams.get("refresh_token")
        
        console.log("Hash params:", {
          hash: window.location.hash,
          access_token: access_token ? "presente" : "ausente",
          refresh_token: refresh_token ? "presente" : "ausente"
        })
      }

      // Si no está en hash, pruebo en query params (?access_token=...)
      if (!access_token && window.location.search) {
        const searchParams = new URLSearchParams(window.location.search)
        access_token = searchParams.get("access_token")
        refresh_token = searchParams.get("refresh_token")
        
        console.log("Search params:", {
          search: window.location.search,
          access_token: access_token ? "presente" : "ausente",
          refresh_token: refresh_token ? "presente" : "ausente"
        })
      }

      return { access_token, refresh_token }
    }

    const restoreSession = async () => {
      try {
        const { access_token, refresh_token } = extractTokensFromURL()

        if (!access_token || !refresh_token) {
          setMessage("No se encontró token de acceso en la URL. URL actual: " + window.location.href)
          setLoading(false)
          return
        }

        const supabase = getSupabaseClient()
        
        const response = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        const { data, error } = response

        if (error) {
          console.error("Error al establecer sesión:", error)
          setMessage("Error al establecer sesión: " + error.message)
        } else if (data?.session) {
          console.log("Sesión establecida correctamente")
          storeAuth(data.session)
          setMessage("Sesión establecida correctamente. Ahora puedes cambiar tu contraseña.")
        } else {
          setMessage("No se pudo establecer la sesión")
        }
      } catch (error) {
        console.error("Error en restoreSession:", error)
        setMessage("Error inesperado: " + error.message)
      }
      
      setLoading(false)
    }

    restoreSession()
  }, [])

  const handlePasswordReset = async () => {
    if (!password) {
      setMessage("Por favor ingresa una nueva contraseña")
      return
    }

    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres")
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        console.error("Error al actualizar contraseña:", error)
        setMessage("Error al actualizar contraseña: " + error.message)
      } else {
        setMessage("✅ Contraseña actualizada exitosamente. Redirigiendo...")
        setTimeout(() => router.push("/auth"), 2000)
      }
    } catch (error) {
      console.error("Error inesperado:", error)
      setMessage("Error inesperado: " + error.message)
    }
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 flex flex-col gap-4">
        <div className="text-center">
          <p>Verificando tokens de acceso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Restablecer contraseña</h1>

      <input
        type="password"
        placeholder="Nueva contraseña (mínimo 6 caracteres)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
        disabled={message.includes("No se encontró token")}
      />

      <button
        onClick={handlePasswordReset}
        disabled={message.includes("No se encontró token") || !password}
        className="bg-green-600 text-white p-2 rounded disabled:bg-gray-400"
      >
        Cambiar contraseña
      </button>

      {message && (
        <p className={`text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
      
      {/* Para debugging - quitar en producción */}
      <details className="text-xs text-gray-500">
        <summary>Debug info</summary>
        <p>URL actual: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
        <p>Hash: {typeof window !== 'undefined' ? window.location.hash : 'N/A'}</p>
        <p>Search: {typeof window !== 'undefined' ? window.location.search : 'N/A'}</p>
      </details>
    </div>
  )
}