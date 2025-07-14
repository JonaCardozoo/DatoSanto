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
  tokenLengths: {
    access: number
    refresh: number
  }
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
    type: null,
    tokenLengths: { access: 0, refresh: 0 }
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
          access_token: access_token ? `${access_token.substring(0, 20)}... (${access_token.length} chars)` : "VACÍO",
          refresh_token: refresh_token ? `${refresh_token.substring(0, 20)}... (${refresh_token.length} chars)` : "VACÍO", 
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
          access_token: access_token ? `${access_token.substring(0, 20)}... (${access_token.length} chars)` : "VACÍO",
          refresh_token: refresh_token ? `${refresh_token.substring(0, 20)}... (${refresh_token.length} chars)` : "VACÍO",
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
          type: type,
          tokenLengths: {
            access: access_token?.length || 0,
            refresh: refresh_token?.length || 0
          }
        })

        // Verificar si es una solicitud de recovery
        if (type !== "recovery") {
          setMessage("❌ Tipo de solicitud inválido. Debe ser 'recovery'.")
          setLoading(false)
          return
        }

        if (!access_token) {
          setMessage("❌ Access token faltante en la URL.")
          setLoading(false)
          return
        }

        // Verificar que los tokens no estén vacíos
        if (access_token.length === 0) {
          setMessage("❌ El access_token está vacío.")
          setLoading(false)
          return
        }

        // Para password recovery, podríamos no necesitar refresh_token
        // Intentemos con solo el access_token si el refresh_token no está presente
        if (!refresh_token) {
          console.log("⚠️ Refresh token no presente, intentando solo con access token...")
        }

        // Validación más flexible - verificar solo que no estén vacíos
        const validateToken = (token: string, tokenName: string): boolean => {
          if (!token || typeof token !== 'string' || token.length === 0) {
            console.log(`${tokenName} inválido: vacío o nulo`)
            return false
          }
          
          // Para tokens muy cortos, probablemente no sean JWT válidos
          if (token.length < 20) {
            console.log(`${tokenName} sospechosamente corto: ${token.length} caracteres`)
            return false
          }
          
          return true
        }

        if (!validateToken(access_token, "Access token")) {
          setMessage("❌ El access_token parece inválido. Solicita un nuevo enlace de recuperación.")
          setLoading(false)
          return
        }

        console.log("Intentando establecer sesión...")
        const supabase = getSupabaseClient()
        
        // Intentar limpiar cualquier sesión existente primero
        await supabase.auth.signOut()
        
        // Intentar diferentes métodos según lo que tengamos
        let response
        
        if (refresh_token && validateToken(refresh_token, "Refresh token")) {
          // Si tenemos ambos tokens, usar setSession
          console.log("Usando setSession con ambos tokens...")
          response = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })
        } else {
          // Si solo tenemos access_token, intentar con verifyOtp
          console.log("Intentando con verifyOtp...")
          response = await supabase.auth.verifyOtp({
            token_hash: access_token,
            type: 'recovery'
          })
        }

        const { data, error } = response

        if (error) {
          console.error("Error al establecer sesión:", error)
          
          // Mensajes más específicos según el error
          if (error.message.includes('invalid_token') || error.message.includes('expired')) {
            setMessage("❌ El enlace ha expirado o es inválido. Solicita un nuevo enlace de recuperación.")
          } else if (error.message.includes('invalid_grant')) {
            setMessage("❌ Tokens inválidos. Verifica que uses el enlace más reciente de tu email.")
          } else {
            setMessage("❌ Error al establecer sesión: " + error.message)
          }
        } else if (data?.session) {
          console.log("✅ Sesión establecida correctamente")
          storeAuth(data.session)
          setMessage("✅ Sesión establecida correctamente. Ahora puedes cambiar tu contraseña.")
        } else if (data?.user) {
          // En caso de verifyOtp exitoso sin sesión
          console.log("✅ Usuario verificado correctamente")
          setMessage("✅ Verificación exitosa. Ahora puedes cambiar tu contraseña.")
        } else {
          setMessage("❌ No se pudo establecer la sesión. Verifica el enlace de recuperación.")
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

  const canResetPassword: boolean = message.includes("✅")

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
          <p><strong>Tiene access_token:</strong> {debugInfo.hasAccessToken ? "✅" : "❌"} ({debugInfo.tokenLengths.access} chars)</p>
          <p><strong>Tiene refresh_token:</strong> {debugInfo.hasRefreshToken ? "✅" : "❌"} ({debugInfo.tokenLengths.refresh} chars)</p>
          <p><strong>Tipo:</strong> {debugInfo.type || "No especificado"}</p>
        </div>
      </details>
    </div>
  )
}