"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/utils/supabase-browser"
import { storeAuth } from "@/utils/jwt-auth"
import GameHeader from '@/components/GameHeader'

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
    const extractAllParams = (): Record<string, string> => {
      const allParams: Record<string, string> = {}

      // Query params
      if (window.location.search) {
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.forEach((value, key) => {
          allParams[key] = value
        })
      }

      return allParams
    }

    const handlePasswordRecovery = async (): Promise<void> => {
      try {
        const allParams = extractAllParams()
        setDebugInfo({
          url: window.location.href,
          search: window.location.search,
          hash: window.location.hash,
          allParams
        })

        const supabase = getSupabaseClient()
        await supabase.auth.signOut()

        let success = false
        let lastError = null

        // ✅ Solo token simple
        if (allParams.token && allParams.type === "recovery") {
          try {
            const { data, error } = await supabase.auth.verifyOtp({
              email: allParams.email,
              token: allParams.token,
              type: "recovery"
            })

            if (error) throw error

            if (data?.session) {
              storeAuth(data.session)
              setMessage("✅ Verificación exitosa. Ahora puedes cambiar tu contraseña.")
              success = true
            } else if (data?.user) {
              setMessage("✅ Verificación exitosa. Ahora puedes cambiar tu contraseña.")
              success = true
            }
          } catch (error) {
            lastError = error
          }
        }

        if (!success) {
          console.error("❌ Verificación fallida:", lastError)
          if (lastError instanceof Error) {
            if (lastError.message.includes("expired")) {
              setMessage("❌ El enlace ha expirado. Solicita uno nuevo.")
            } else if (lastError.message.includes("invalid")) {
              setMessage("❌ El enlace es inválido.")
            } else {
              setMessage("❌ Error: " + lastError.message)
            }
          } else {
            setMessage("❌ No se pudo verificar el enlace.")
          }
        }
      } catch (error) {
        console.error("Error general:", error)
        const msg = error instanceof Error ? error.message : "Error desconocido"
        setMessage("❌ Error inesperado: " + msg)
      }

      setLoading(false)
    }

    handlePasswordRecovery()
  }, [])

  const handlePasswordReset = async (): Promise<void> => {
    if (!password) return setMessage("Por favor ingresa una nueva contraseña")
    if (password.length < 6) return setMessage("La contraseña debe tener al menos 6 caracteres")

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        console.error("Error al actualizar contraseña:", error)
        return setMessage("❌ Error al actualizar contraseña: " + error.message)
      }

      setMessage("✅ Contraseña actualizada. Redirigiendo...")
      setTimeout(() => router.push("/auth"), 2000)
    } catch (error) {
      console.error("Error inesperado:", error)
      const msg = error instanceof Error ? error.message : "Error desconocido"
      setMessage("❌ Error inesperado: " + msg)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const canResetPassword = message.includes("✅")

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <p>🔍 Verificando enlace de recuperación...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GameHeader />
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

    </div>
    </div>
  )
}
