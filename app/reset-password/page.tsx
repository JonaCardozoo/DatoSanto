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
  const [showPassword, setShowPassword] = useState<boolean>(false)
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Nueva contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={handlePasswordChange}
          className="p-2 pr-12 border rounded text-black w-full"
          disabled={!canResetPassword}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          disabled={!canResetPassword}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12l4.242-4.242M9.878 9.878L6.636 6.636m12.728 12.728L12 12m7.364 7.364L12 12m7.364 7.364l-3.536-3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

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