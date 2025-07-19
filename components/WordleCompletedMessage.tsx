"use client"

import { Trophy, Target, User, Star } from "lucide-react"
import Link from "next/link"

interface WordleCompletedMessageProps {
  gameWon: boolean
  targetWord: string
  playerName: string
  playerLastName: string
  attempts: number
  maxAttempts: number
  pointsAwarded?: boolean
  userLoggedIn?: boolean
  playerImageUrl?: string
}

export default function WordleCompletedMessage({
  gameWon,
  targetWord,
  playerName,
  playerLastName,
  attempts,
  maxAttempts,
  pointsAwarded = false,
  userLoggedIn = false,
  playerImageUrl,
}: WordleCompletedMessageProps) {
  return (
    <div
      className={`rounded-xl p-6 md:p-8 border-2 ${
        gameWon ? "bg-green-900/30 border-green-500 text-green-100" : "bg-red-900/30 border-red-500 text-red-100"
      }`}
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {gameWon ? <Trophy className="w-16 h-16 text-yellow-400" /> : <Target className="w-16 h-16 text-red-400" />}
        </div>

        <h3 className="text-2xl md:text-3xl font-bold">{gameWon ? "¡Excelente!" : "¡Casi!"}</h3>

        <div className="space-y-2">
          {gameWon ? (
            <p className="text-lg">
              ¡Adivinaste <strong>{targetWord}</strong> en {attempts} intento{attempts !== 1 ? "s" : ""}!
            </p>
          ) : (
            <p className="text-lg">
              La respuesta era: <strong>{targetWord}</strong>
            </p>
          )}

        </div>

        {/* Imagen del jugador cuando gana */}
        {gameWon && playerImageUrl && (
          <div className="flex justify-center mt-6">
            <div className="relative">
              <img 
                src={playerImageUrl} 
                alt={`${playerName} - ${targetWord}`}
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-yellow-400 shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                <Trophy className="w-6 h-6 text-yellow-900" />
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de puntos */}
        {gameWon && userLoggedIn && pointsAwarded && (
          <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-300 font-bold text-lg">¡Ganaste 10 puntos!</span>
            </div>
            <p className="text-yellow-200 text-sm mt-2">Tus puntos se actualizaron automáticamente</p>
          </div>
        )}

        {/* Mensaje para usuarios no logueados */}
        {gameWon && !userLoggedIn && (
          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-center space-x-2">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-blue-200 text-sm mt-2">
              <Link href="/auth" className="underline hover:text-blue-100">
                Iniciá sesión
              </Link>{" "}
              para ganar puntos y aparecer en el ranking
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-600">
          <p className="text-gray-400 text-sm mt-2">Próximo desafío disponible a las 00:00</p>
        </div>
      </div>
    </div>
  )
}