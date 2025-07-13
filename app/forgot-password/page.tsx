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

        // Manejar el callback de autenticación
        const { data: authData, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          console.error('❌ Error en callback de auth:', authError)
          setMessage('Error en autenticación. Solicita un nuevo enlace.')
          return
        }

        if (authData.user) {
          console.log('✅ Usuario autenticado correctamente')
          setSessionReady(true)
          return
        }

        // Si no hay usuario, intentar con parámetros URL
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        if (code) {
          console.log('🔄 Intercambiando código por sesión...')
          const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError || !exchangeData.session) {
            console.error('❌ Error intercambiando código:', exchangeError)
            setMessage('Error al procesar el enlace. Solicita un nuevo enlace.')
          } else {
            console.log('✅ Sesión establecida desde código')
            setSessionReady(true)
          }
          return
        }

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
      
      console.log('🔄 Actualizando contraseña directamente (sin verificar sesión)...')
      
      // Actualizar contraseña directamente - la sesión ya está activa después del OTP
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({ 
        password: password 
      })

      console.log('📤 Resultado de updateUser:', { updateData, updateError })

      if (updateError) {
        console.error('❌ Error actualizando contraseña:', updateError)
        setMessage(`Error: ${updateError.message}`)
        return
      }

      if (!updateData.user) {
        console.error('❌ No se recibió información del usuario actualizado')
        setMessage('Error al actualizar. Intenta de nuevo.')
        return
      }

      console.log('✅ Contraseña actualizada correctamente')
      setMessage('¡Contraseña actualizada exitosamente! Redirigiendo...')

      // Cerrar sesión después de actualizar (opcional)
      console.log('🚪 Cerrando sesión...')
      try {
        await supabase.auth.signOut()
      } catch (signOutError) {
        console.error('⚠️ Error al cerrar sesión (continuando):', signOutError)
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