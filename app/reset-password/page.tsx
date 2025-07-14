"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/utils/supabase-browser"
import { storeAuth } from "@/utils/jwt-auth"

interface DebugInfo {
  url: string
  search: string
  hash: string
  hasAccessToken: boolean
  hasRefreshToken: boolean
  type: string | null
}

interface TokenData {
  access_token: string | null
  refresh_token: string | null
  type: string | null
}

export default function ResetPassword(): JSX.Element {
  const [password, setPassword] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    url: "",
    search: "",
    hash: "",
    hasAccessToken: false,
    hasRefreshToken: false,
    type: null
  })
  const router = useRouter()

  useEffect(() => {
    const extractTokensFromURL = (): TokenData => {
      let access_token: string | null = null
      let refresh_token: string | null = null
      let type: string | null = null

      // Log de la URL completa para debugging
      const fullURL = window.location.href
      console.log("URL completa:", fullURL)

      // Extraer de query params (?access_token=...)
      if (window.location.search) {
        const searchParams = new URLSearchParams(window.location.search)
        access_token = searchParams.get("access_token")
        refresh_token = searchParams.get("refresh_token")
        type = searchParams.get("type")
        
        console.log("Query params encontrados:", {
          access_token: access_token || "VACÍO",
          refresh_token: refresh_token || "VACÍO", 
          type: type || "VACÍO"
        })
      }

      // Si no está en query params, probar hash (#access_token=...)
      if (!access_token && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        access_token = hashParams.get("access_token")
        refresh_token = hashParams.get("refresh_token")
        type = hashParams.get("type")
        
        console.log("Hash params encontrados:", {
          access_token: access_token || "VACÍO",
          refresh_token: refresh_token || "VACÍO",
          type: type || "VACÍO"
        })
      }

      return { access_token, refresh_token, type }
    }

    const restoreSession = async (): Promise<void> => {
      try {
        const { access_token, refresh_token, type } = extractTokensFromURL()

        // Guardar info de debug
        setDebugInfo({
          url: window.location.href,
          search: window.location.search,
          hash: window.location.hash,
          hasAccessToken: !!access_token,
          hasRefreshToken: !!refresh_token,
          type: type
        })

        // Verificar si es una solicitud de recovery
        if (type !== "recovery") {
          setMessage("Tipo de solicitud inválido. Debe ser 'recovery'.")
          setLoading(false)
          return
        }

        if (!access_token || !refresh_token) {
          setMessage("❌ Tokens faltantes en la URL. Los tokens pueden estar vacíos o mal formateados.")
          setLoading(false)
          return
        }

        // Verificar que los tokens no estén vacíos y tengan formato válido
        if (access_token && access_token.length === 0) {
          setMessage("❌ El access_token está vacío.")
          setLoading(false)
          return
        }
        
        if (refresh_token && refresh_token.length === 0) {
          setMessage("❌ El refresh_token está vacío.")
          setLoading(false)
          return
        }

        // Validar formato básico de JWT (debe tener 3 partes separadas por puntos)
        const validateJWT = (token: string): boolean => {
          if (!token || typeof token !== 'string') return false
          const parts = token.split('.')
          const isValid = parts.length === 3 && parts.every(part => part.length > 0)
          
          if (!isValid) {
            console.log("Token inválido - partes:", parts.length, "contenido:", parts.map(p => `${p.length} chars`))
          }
          
          return isValid
        }

        if (access_token && !validateJWT(access_token)) {
          console.error("Access token inválido:", {
            length: access_token.length,
            starts: access_token.substring(0, 20),
            ends: access_token.substring(access_token.length - 20),
            parts: access_token.split('.').length
          })
          setMessage("❌ El access_token tiene formato inválido. Solicita un nuevo enlace de recuperación.")
          setLoading(false)
          return
        }

        if (refresh_token && !validateJWT(refresh_token)) {
          console.error("Refresh token inválido:", {
            length: refresh_token.length,
            starts: refresh_token.substring(0, 20),
            ends: refresh_token.substring(refresh_token.length - 20),
            parts: refresh_token.split('.').length
          })
          setMessage("❌ El refresh_token tiene formato inválido. Solicita un nuevo enlace de recuperación.")
          setLoading(false)
          return
        }

        console.log("Intentando establecer sesión con tokens válidos...")
        const supabase = getSupabaseClient()
        
        // Intentar limpiar cualquier sesión existente primero
        await supabase.auth.signOut()
        
        const response = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        const { data, error } = response

        if (error) {
          console.error("Error al establecer sesión:", error)
          setMessage("❌ Error al establecer sesión: " + error.message)
        } else if (data?.session) {
          console.log("✅ Sesión establecida correctamente")
          storeAuth(data.session)
          setMessage("✅ Sesión establecida correctamente. Ahora puedes cambiar tu contraseña.")
        } else {
          setMessage("❌ No se pudo establecer la sesión")
        }
      } catch (error) {
        console.error("Error en restoreSession:", error)
        const errorMessage = error instanceof Error ? error.message : "Error desconocido"
        setMessage("❌ Error inesperado: " + errorMessage)
      }
      
      setLoading(false)
    }

    restoreSession()
  }, [])

  const handlePasswordReset = async (): Promise<void> => {
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
        setMessage("❌ Error al actualizar contraseña: " + error.message)
      } else {
        setMessage("✅ Contraseña actualizada exitosamente. Redirigiendo...")
        setTimeout(() => router.push("/auth"), 2000)
      }
    } catch (error) {
      console.error("Error inesperado:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      setMessage("❌ Error inesperado: " + errorMessage)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value)
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 flex flex-col gap-4">
        <div className="text-center">
          <p>🔍 Verificando tokens de acceso...</p>
        </div>
      </div>
    )
  }

  const canResetPassword: boolean = message.includes("✅ Sesión establecida")

  return (
    <div className="max-w-md mx-auto mt-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Restablecer contraseña</h1>

      <input
        type="password"
        placeholder="Nueva contraseña (mínimo 6 caracteres)"
        value={password}
        onChange={handlePasswordChange}
        className="p-2 border rounded"
        disabled={!canResetPassword}
      />

      <button
        onClick={handlePasswordReset}
        disabled={!canResetPassword || !password}
        className="bg-green-600 text-white p-2 rounded disabled:bg-gray-400"
      >
        Cambiar contraseña
      </button>

      {message && (
        <p className={`text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
      
      {/* Debug info detallada */}
      <details className="text-xs text-gray-500 border p-2 rounded">
        <summary>🔧 Información de debugging</summary>
        <div className="mt-2 space-y-1">
          <p><strong>URL:</strong> <span className="break-all text-xs">{debugInfo.url}</span></p>
          <p><strong>Query params:</strong> <span className="break-all text-xs">{debugInfo.search || "Ninguno"}</span></p>
          <p><strong>Hash:</strong> <span className="break-all text-xs">{debugInfo.hash || "Ninguno"}</span></p>
          <p><strong>Tiene access_token:</strong> {debugInfo.hasAccessToken ? "✅" : "❌"}</p>
          <p><strong>Tiene refresh_token:</strong> {debugInfo.hasRefreshToken ? "✅" : "❌"}</p>
          <p><strong>Tipo:</strong> {debugInfo.type || "No especificado"}</p>
        </div>
      </details>
    </div>
  )
}