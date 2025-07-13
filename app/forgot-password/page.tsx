'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/utils/supabase-browser'
import GameHeader from '@/components/GameHeader'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const supabase = getSupabaseClient()
    if (!supabase) {
      setMessage('Error interno: Supabase no disponible.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://datosanto.vercel.app/reset-password', // tu URL válida
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('📬 Te enviamos un correo con instrucciones para cambiar tu contraseña.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GameHeader />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-700">¿Olvidaste tu contraseña?</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="w-full p-3 border rounded-lg text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-red-700 text-white p-3 rounded-lg hover:bg-red-800 transition"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar link de recuperación'}
            </button>
          </form>
          {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}
          
        </div>
      </div>
    </div>
  )
}