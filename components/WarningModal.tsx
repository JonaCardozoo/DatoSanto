import { X } from "lucide-react"
import Link from "next/link"

interface WarningModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

export default function WarningModal({ isOpen, onClose, onContinue }: WarningModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-yellow-400">⚠️ Sesión no iniciada</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-gray-300 space-y-3">
            <p className="font-semibold text-white">No tienes la sesión iniciada</p>
            <p>Si jugás ahora:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>No ganarás puntos</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>No aparecerás en el ranking</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>No podrás jugar por puntos hoy (aunque inicies sesión después)</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>El juego se guardará solo en tu navegador</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
            <p className="text-sm text-gray-300">
              💡 <strong>Recomendación:</strong> Iniciá sesión para obtener puntos y competir en el ranking
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <Link 
            href="/auth" 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center"
          >
            Iniciar sesión
          </Link>
          <button
            onClick={onContinue}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Continuar sin sesión
          </button>
        </div>
      </div>
    </div>
  )
}