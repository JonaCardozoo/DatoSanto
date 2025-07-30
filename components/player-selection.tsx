"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import type { Player } from "@/lib/data/players"

interface PlayerSelectionProps {
  players: Player[]
  searchedName: string
  onPlayerSelect: (player: Player) => void
  onCancel: () => void
}

export default function PlayerSelection({ players, searchedName, onPlayerSelect, onCancel }: PlayerSelectionProps) {

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Selecciona el jugador</h3>
          <button onClick={onCancel} className="text-white hover:text-gray-200 transition-colors" aria-label="Cerrar">
            <X className="w-6 h-6" />
          </button>
        </div>
      
        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-700 text-center mb-4">
            Se encontraron <span className="font-bold">{players.length}</span> jugadores con el nombre "
            <span className="font-bold text-blue-600">{searchedName}</span>":
          </p>

          {/* Debug info */}
          {players.length === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">Debug: No hay jugadores en el array</p>
            </div>
          )}

          {/* Lista de jugadores */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {players.map((player, index) => (
              <button
                key={`${player.name}-${player.position}-${index}`}
                onClick={() => {
                  onPlayerSelect(player)
                }}
                className="w-full p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-4">
                  {/* Imagen del jugador */}
                  <div className="flex-shrink-0">
                    <Image
                      src={player.image || "/placeholder.svg?height=50&width=50&text=Player"}
                      alt={player.name}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                  </div>

                  {/* Información del jugador */}
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-700">{player.name}</h4>
                    <p className="text-sm text-gray-600 group-hover:text-blue-600">
                      Posición: <span className="font-medium">{player.position}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Clubes: {player.clubs.slice(0, 3).join(", ")}
                      {player.clubs.length > 3 && "..."}
                    </p>
                  </div>

                  {/* Badge de posición */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{player.position}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Botón cancelar */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Cancelar selección
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
