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
  const [isClient, setIsClient] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const establishSession = async () => {
      if (!isClient) return

      const token = searchParams.get('token')
      const type = searchParams.get('type')

      console.log('🔍 Parámetros obtenidos:', { token: !!token, type })

      if (!token || type !== 'recovery') {
        console.error('❌ Token o tipo faltante en la URL')
        setMessage('Enlace inválido o incompleto.')
        return
      }

      try {
        const supabase = getSupabaseClient()
        
        // Verificar el token de recuperación
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'recovery'
        })

        if (error || !data.session) {
          console.error('❌ Error verificando token:', error)
          setMessage('Token inválido o expirado. Solicita un nuevo enlace de recuperación.')
        } else {
          console.log('✅ Token verificado correctamente')
          setSessionReady(true)
        }
      } catch (err) {
        console.error('❌ Error inesperado:', err)
        setMessage('Error inesperado. Intenta de nuevo.')
      }
    }

    establishSession()
  }, [isClient, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    const supabase = getSupabaseClient()
    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        console.error('❌ Error actualizando contraseña:', error)
        setMessage(error.message)
      } else {
        console.log('✅ Contraseña actualizada correctamente')
        setMessage('Contraseña actualizada exitosamente. Redirigiendo...')
        setTimeout(() => router.push('/login'), 2500)
      }
    } catch (err) {
      console.error('❌ Error inesperado:', err)
      setMessage('Error inesperado. Intenta de nuevo.')
    }

    setLoading(false)
  }

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <GameHeader />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
            <div className="text-center">Cargando...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GameHeader />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-700">Restablecer contraseña</h2>
          
          {!sessionReady ? (
            <div className="text-center">
              <p className="text-gray-600">Verificando enlace...</p>
              {message && (
                <p className="text-red-600 mt-2">{message}</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Nueva contraseña"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="submit"
                className="w-full bg-red-700 text-white p-3 rounded-lg hover:bg-red-800 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            </form>
          )}
          
          {message && sessionReady && (
            <p className={`text-center text-sm mt-4 ${
              message.includes('exitosamente') ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}