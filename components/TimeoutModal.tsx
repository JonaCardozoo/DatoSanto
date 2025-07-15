import { AlertCircle, RefreshCw, X } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface TimeoutModalProps {
  isOpen: boolean
  onClose: () => void
  onReload: () => void
}

export default function TimeoutModal({ isOpen, onClose, onReload }: TimeoutModalProps) {
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
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              Error de conexión
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-gray-300 mb-6">
            <p className="mb-2">No se pudo cargar el usuario después de 5 segundos.</p>
            <p className="text-sm text-gray-400">
              Esto puede deberse a problemas de conexión o servidor.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onReload}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar página
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )

  // Usar portal para renderizar el modal fuera del componente padre
  return createPortal(modalContent, document.body)
}