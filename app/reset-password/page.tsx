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
    if (!isClient) return

    const handleAuthCallback = async () => {
      try {
        const supabase = getSupabaseClient()
        
        // Primero verificar si ya hay una sesión activa
        const { data: existingSession, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ Error obteniendo sesión:', sessionError)
          setMessage('Error de autenticación. Solicita un nuevo enlace.')
          return
        }

        if (existingSession.session) {
          console.log('✅ Sesión existente encontrada')
          setSessionReady(true)
          return
        }

        // Si no hay sesión, procesar parámetros de URL
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token')
        const tokenHash = urlParams.get('token_hash') || urlParams.get('token')
        const type = urlParams.get('type')

        console.log('🔍 Parámetros URL:', {
          accessToken: accessToken ? '***' : null,
          refreshToken: refreshToken ? '***' : null,
          tokenHash: tokenHash ? '***' : null,
          type
        })

        // Método 1: Tokens directos en URL
        if (accessToken && refreshToken) {
          console.log('🔁 Estableciendo sesión con tokens de URL')
          const { data: sessionData, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (setSessionError || !sessionData.session) {
            console.error('❌ Error estableciendo sesión:', setSessionError)
            setMessage('Error estableciendo sesión. Solicita un nuevo enlace.')
          } else {
            console.log('✅ Sesión establecida con tokens de URL')
            setSessionReady(true)
          }
          return
        }

        // Método 2: Token hash para verificación OTP
        if (tokenHash && type === 'recovery') {
          console.log('🔁 Verificando OTP con token hash')
          const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery'
          })

          if (otpError || !otpData.session) {
            console.error('❌ Error verificando OTP:', otpError)
            setMessage('Token inválido o expirado. Solicita un nuevo enlace.')
          } else {
            console.log('✅ OTP verificado correctamente')
            setSessionReady(true)
          }
          return
        }

        // Método 3: Token simple (algunas versiones de Supabase)
        if (tokenHash) {
          console.log('🔁 Intentando con token simple')
          const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery'
          })

          if (otpError || !otpData.session) {
            console.error('❌ Error con token simple:', otpError)
            setMessage('Token inválido o expirado. Solicita un nuevo enlace.')
          } else {
            console.log('✅ Token simple verificado')
            setSessionReady(true)
          }
          return
        }

        // Si llegamos aquí, no hay parámetros válidos
        console.log('⚠️ No se encontraron parámetros válidos')
        setMessage('Enlace inválido o incompleto. Solicita un nuevo enlace.')

      } catch (err) {
        console.error('❌ Error inesperado:', err)
        setMessage('Error inesperado. Intenta de nuevo.')
      }
    }

    // Añadir un pequeño delay para asegurar que la URL esté lista
    const timeoutId = setTimeout(() => {
      handleAuthCallback()
    }, 100)

    return () => clearTimeout(timeoutId)
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
      
      console.log('🔍 Verificando sesión antes de actualizar...')
      const { data: currentSession, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('❌ Error obteniendo sesión:', sessionError)
        setMessage('Error de sesión. Solicita un nuevo enlace.')
        setLoading(false)
        return
      }

      if (!currentSession.session) {
        console.error('❌ No hay sesión activa')
        setMessage('No hay sesión activa. Solicita un nuevo enlace.')
        setLoading(false)
        return
      }

      console.log('✅ Sesión válida. Usuario:', currentSession.session.user.id)
      console.log('🔄 Intentando actualizar contraseña...')

      const { data: updateData, error: updateError } = await supabase.auth.updateUser({ 
        password: password 
      })

      console.log('📤 Resultado de updateUser:', { updateData, updateError })

      if (updateError) {
        console.error('❌ Error actualizando contraseña:', updateError)
        setMessage(`Error: ${updateError.message}`)
        setLoading(false)
        return
      }

      if (!updateData.user) {
        console.error('❌ No se recibió información del usuario actualizado')
        setMessage('Error al actualizar. Intenta de nuevo.')
        setLoading(false)
        return
      }

      console.log('✅ Contraseña actualizada correctamente')
      setMessage('¡Contraseña actualizada exitosamente! Redirigiendo...')

      // Cerrar sesión después de actualizar
      console.log('🚪 Cerrando sesión...')
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        console.error('⚠️ Error al cerrar sesión:', signOutError)
        // Continuar de todos modos
      }

      setTimeout(() => {
        console.log('🔄 Redirigiendo a login...')
        router.push('/login')
      }, 2500)

    } catch (err) {
      console.error('❌ Error inesperado en handleSubmit:', err)
      setMessage('Error inesperado. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Añadir timeout para evitar que se quede colgado indefinidamente
  useEffect(() => {
    if (!sessionReady && isClient) {
      const timeoutId = setTimeout(() => {
        if (!sessionReady) {
          setMessage('Tiempo de espera agotado. Solicita un nuevo enlace.')
        }
      }, 10000) // 10 segundos timeout

      return () => clearTimeout(timeoutId)
    }
  }, [sessionReady, isClient])

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-700">Restablecer contraseña</h2>

      {!sessionReady ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando enlace...</p>
          {message && (
            <div className="mt-4">
              <p className="text-red-600 text-sm">{message}</p>
              <button
                onClick={() => router.push('/login')}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Volver al login
              </button>
            </div>
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