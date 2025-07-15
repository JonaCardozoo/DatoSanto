import { AlertCircle, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface GuestWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
}

export default function GuestWarningModal({ isOpen, onClose, onLogin }: GuestWarningModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            Jugando sin sesión
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-gray-300 mb-6">
          <p className="mb-2">Estás jugando sin iniciar sesión, esto puede afectar tus puntos del día de hoy.</p>
          <p className="text-sm text-gray-400">
            Inicia sesión o regístrate para poder ganar puntos hoy.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onLogin}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <User className="w-4 h-4 mr-2" />
            Iniciar Sesión
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Continuar sin sesión
          </button>
        </div>
      </div>
    </div>
  )

  // Usar portal para renderizar el modal fuera del componente padre
  return createPortal(modalContent, document.body)
}