'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/utils/supabase-browser'
import GameHeader from '@/components/GameHeader'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [sessionReady, setSessionReady] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  const access_token = searchParams.get('access_token')
  const refresh_token = searchParams.get('refresh_token')

  useEffect(() => {
    const establishSession = async () => {
      if (!access_token || !refresh_token) {
        setMessage('Enlace inválido o incompleto.')
        return
      }

      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })

      if (error || !data.session) {
        console.error('❌ Error estableciendo sesión:', error)
        setMessage('No se pudo autenticar el enlace. Volvé a solicitar la recuperación.')
      } else {
        setSessionReady(true)
      }
    }

    establishSession()
  }, [access_token, refresh_token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    const supabase = getSupabaseClient()
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Contraseña actualizada. Redirigiendo...')
      setTimeout(() => router.push('/login'), 2500)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GameHeader />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-700">Restablecer contraseña</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full p-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full p-3 border rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-red-700 text-white p-3 rounded-lg hover:bg-red-800 transition"
              disabled={loading || !sessionReady}
            >
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
          {message && (
            <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
