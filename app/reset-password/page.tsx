'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/utils/supabase-browser'
import GameHeader from '@/components/GameHeader'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [sessionReady, setSessionReady] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!isClient) return

      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('❌ Error obteniendo sesión:', error)
          setMessage('Error de autenticación. Solicita un nuevo enlace.')
          return
        }

        if (data.session) {
          console.log('✅ Sesión encontrada')
          setSessionReady(true)
        } else {
          const urlParams = new URLSearchParams(window.location.search)
          const accessToken = urlParams.get('access_token')
          const refreshToken = urlParams.get('refresh_token')
          const tokenHash = urlParams.get('token')
          const type = urlParams.get('type')

          console.log('🔍 Parámetros URL:', {
            accessToken,
            refreshToken,
            tokenHash,
            type
          })

          if (accessToken && refreshToken) {
            console.log('🔁 Usando setSession con tokens')
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })

            if (sessionError || !sessionData.session) {
              console.error('❌ Error estableciendo sesión:', sessionError)
              setMessage('Error estableciendo sesión. Solicita un nuevo enlace.')
            } else {
              console.log('✅ Sesión establecida con tokens')
              setSessionReady(true)
            }
          } else if (tokenHash && type === 'recovery') {
            console.log('🔁 Verificando OTP...')
            const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'recovery'
            })

            console.log('📩 Resultado OTP:', { otpData, otpError })

            if (otpError || !otpData.session) {
              console.error('❌ Error verificando OTP:', otpError)
              setMessage('Token inválido o expirado. Solicita un nuevo enlace.')
            } else {
              const session = otpData.session

              if (!session?.access_token || !session?.refresh_token) {
                console.error('⚠️ Faltan tokens en la sesión OTP')
                setMessage('No se pudieron obtener los tokens. Intenta de nuevo.')
                return
              }

              console.log('📤 Estableciendo sesión con:', {
                accessToken: session.access_token,
                refreshToken: session.refresh_token,
              })

              const { error: setSessionError } = await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
              })

              console.log('🧾 Resultado setSession:', { setSessionError })

              if (setSessionError) {
                console.error('❌ Error al establecer sesión:', setSessionError)
                setMessage('Error al establecer sesión. Solicita un nuevo enlace.')
              } else {
                console.log('🟢 Sesión establecida correctamente después de OTP')
                setSessionReady(true)
              }
            }
          } else {
            setMessage('Enlace inválido o incompleto.')
          }
        }
      } catch (err) {
        console.error('❌ Error inesperado:', err)
        setMessage('Error inesperado. Intenta de nuevo.')
      }
    }

    handleAuthCallback()
  }, [isClient])

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

    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { data: currentSession } = await supabase.auth.getSession()

      if (!currentSession.session) {
        setMessage('No hay sesión activa. Solicita un nuevo enlace.')
        setLoading(false)
        return
      }

      console.log('🔍 Usuario actual:', currentSession.session.user.id)

      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        console.error('❌ Error actualizando contraseña:', error)
        setMessage(`Error: ${error.message}`)
      } else {
        console.log('✅ Contraseña actualizada correctamente')
        setMessage('¡Contraseña actualizada exitosamente! Redirigiendo...')

        await supabase.auth.signOut()
        setTimeout(() => {
          router.push('/login')
        }, 2500)
      }
    } catch (err) {
      console.error('❌ Error inesperado:', err)
      setMessage('Error inesperado. Intenta de nuevo.')
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-700">Restablecer contraseña</h2>

      {!sessionReady ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando enlace...</p>
          {message && (
            <p className="text-red-600 mt-2 text-sm">{message}</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
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
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GameHeader />
      <div className="flex-1 flex items-center justify-center px-4">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
