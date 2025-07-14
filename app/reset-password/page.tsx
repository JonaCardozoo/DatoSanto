"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/utils/supabase-browser"
import { storeAuth } from "@/utils/jwt-auth"

interface DebugInfo {
  url: string
  search: string
  hash: string
  allParams: Record<string, string>
}

export default function ResetPassword(): JSX.Element {
  const [password, setPassword] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    url: "",
    search: "",
    hash: "",
    allParams: {}
  })
  const router = useRouter()

  useEffect(() => {
    const extractAllParams = () => {
      const allParams: Record<string, string> = {}
      
      // Extraer todos los parámetros de query string
      if (window.location.search) {
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.forEach((value, key) => {
          allParams[key] = value
        })
      }
      
      // Extraer todos los parámetros de hash
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        hashParams.forEach((value, key) => {
          allParams[`hash_${key}`] = value
        })
      }
      
      return allParams
    }

    const handlePasswordRecovery = async (): Promise<void> => {
      try {
        const allParams = extractAllParams()
        
        console.log("Todos los parámetros encontrados:", allParams)
        
        // Guardar info de debug
        setDebugInfo({
          url: window.location.href,
          search: window.location.search,
          hash: window.location.hash,
          allParams
        })

        const supabase = getSupabaseClient()
        
        // Limpiar sesión existente
        await supabase.auth.signOut()

        // Intentar diferentes métodos según los parámetros disponibles
        let success = false
        let lastError = null

        // Método 1: Si tenemos access_token y refresh_token
        if (allParams.access_token && allParams.refresh_token) {
          console.log("🔄 Intentando con setSession (access_token + refresh_token)...")
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token: allParams.access_token,
              refresh_token: allParams.refresh_token,
            })
            
            if (error) throw error
            
            if (data?.session) {
              console.log("✅ setSession exitoso")
              storeAuth(data.session)
              setMessage("✅ Sesión establecida correctamente. Ahora puedes cambiar tu contraseña.")
              success = true
            }
          } catch (error) {
            console.log("❌ setSession falló:", error)
            lastError = error
          }
        }

        // Método 2: Si tenemos token_hash y type=recovery
        if (!success && allParams.token_hash && allParams.type === 'recovery') {
          console.log("🔄 Intentando con verifyOtp (token_hash)...")
          try {
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: allParams.token_hash,
              type: 'recovery'
            })
            
            if (error) throw error
            
            if (data?.session) {
              console.log("✅ verifyOtp exitoso con sesión")
              storeAuth(data.session)
              setMessage("✅ Verificación exitosa. Ahora puedes cambiar tu contraseña.")
              success = true
            } else if (data?.user) {
              console.log("✅ verifyOtp exitoso sin sesión")
              setMessage("✅ Verificación exitosa. Ahora puedes cambiar tu contraseña.")
              success = true
            }
          } catch (error) {
            console.log("❌ verifyOtp falló:", error)
            lastError = error
          }
        }

        // Método 3: Si tenemos solo token (cualquier parámetro llamado token)
        if (!success && allParams.token) {
          console.log("🔄 Intentando con verifyOtp (token simple)...")
          try {
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: allParams.token,
              type: 'recovery'
            })
            
            if (error) throw error
            
            if (data?.session) {
              console.log("✅ verifyOtp (token simple) exitoso con sesión")
              storeAuth(data.session)
              setMessage("✅ Verificación exitosa. Ahora puedes cambiar tu contraseña.")
              success = true
            } else if (data?.user) {
              console.log("✅ verifyOtp (token simple) exitoso sin sesión")
              setMessage("✅ Verificación exitosa. Ahora puedes cambiar tu contraseña.")
              success = true
            }
          } catch (error) {
            console.log("❌ verifyOtp (token simple) falló:", error)
            lastError = error
          }
        }

        // Método 4: Buscar en hash params
        if (!success && allParams.hash_access_token) {
          console.log("🔄 Intentando con tokens del hash...")
          try {
            const sessionData: {
              access_token: string
              refresh_token?: string
            } = {
              access_token: allParams.hash_access_token
            }
            
            if (allParams.hash_refresh_token) {
              sessionData.refresh_token = allParams.hash_refresh_token
            }
            
            const { data, error } = await supabase.auth.setSession(sessionData)
            
            if (error) throw error
            
            if (data?.session) {
              console.log("✅ Hash tokens exitoso")
              storeAuth(data.session)
              setMessage("✅ Sesión establecida correctamente. Ahora puedes cambiar tu contraseña.")
              success = true
            }
          } catch (error) {
            console.log("❌ Hash tokens falló:", error)
            lastError = error
          }
        }

        // Si nada funcionó
        if (!success) {
          console.error("❌ Todos los métodos fallaron. Último error:", lastError)
          
          if (lastError && (lastError as Error).message) {
            if ((lastError as Error).message.includes('expired')) {
              setMessage("❌ El enlace ha expirado. Solicita un nuevo enlace de recuperación.")
            } else if ((lastError as Error).message.includes('invalid')) {
              setMessage("❌ El enlace es inválido. Solicita un nuevo enlace de recuperación.")
            } else {
              setMessage("❌ Error: " + (lastError as Error).message)
            }
          } else {
            setMessage("❌ No se pudieron encontrar tokens válidos en la URL. Verifica que uses el enlace completo del email.")
          }
        }

      } catch (error) {
        console.error("Error general:", error)
        const errorMessage = error instanceof Error ? error.message : "Error desconocido"
        setMessage("❌ Error inesperado: " + errorMessage)
      }
      
      setLoading(false)
    }

    handlePasswordRecovery()
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
          <p>🔍 Verificando enlace de recuperación...</p>
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
      
      {/* Debug info completa */}
      <details className="text-xs text-gray-500 border p-2 rounded">
        <summary>🔧 Información de debugging completa</summary>
        <div className="mt-2 space-y-1">
          <p><strong>URL completa:</strong></p>
          <p className="break-all text-xs bg-gray-100 p-1 rounded">{debugInfo.url}</p>
          
          <p><strong>Query params:</strong></p>
          <p className="break-all text-xs bg-gray-100 p-1 rounded">{debugInfo.search || "Ninguno"}</p>
          
          <p><strong>Hash:</strong></p>
          <p className="break-all text-xs bg-gray-100 p-1 rounded">{debugInfo.hash || "Ninguno"}</p>
          
          <p><strong>Todos los parámetros encontrados:</strong></p>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(debugInfo.allParams, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  )
}