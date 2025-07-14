"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/utils/supabase-browser"
import { storeAuth } from "@/utils/jwt-auth"
import type { AuthTokenResponse } from "@supabase/supabase-js"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1)) // Elimina el "#"

    const access_token = params.get("access_token")
    const refresh_token = params.get("refresh_token")

    const supabase = getSupabaseClient()

    const restoreSession = async () => {
      if (access_token && refresh_token) {
        const response: AuthTokenResponse = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        const { data, error } = response

        if (error) {
          setMessage("Error al establecer sesión: " + error.message)
        } else if (data?.session) {
          storeAuth(data.session) // Guardás tu sesión JWT
        }
      } else {
        setMessage("No se encontró token de acceso en la URL")
      }
    }

    restoreSession()
  }, [])

  const handlePasswordReset = async () => {
    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage("Error al actualizar contraseña: " + error.message)
    } else {
      setMessage("Contraseña actualizada. Redirigiendo...")
      setTimeout(() => router.push("/auth"), 2000)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Restablecer contraseña</h1>

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />

      <button
        onClick={handlePasswordReset}
        className="bg-green-600 text-white p-2 rounded"
      >
        Cambiar contraseña
      </button>

      {message && <p className="text-sm text-red-600">{message}</p>}
    </div>
  )
}
