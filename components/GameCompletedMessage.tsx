"use client"

import { Trophy, Target, Star, User } from "lucide-react"
import Link from "next/link"

interface GameCompletedMessageProps {
  isCorrect: boolean
<<<<<<< HEAD
  correctAnswer: string
  pointsAwarded?: boolean
  userLoggedIn?: boolean
=======
  correctAnswer?: string // Hacemos opcional
  pointsAwarded?: boolean
  userLoggedIn?: boolean
  timeToReset: string // Nueva prop para el tiempo de reinicio
>>>>>>> cdb9605 (juegos)
}

export default function GameCompletedMessage({
  isCorrect,
<<<<<<< HEAD
  correctAnswer,
  pointsAwarded = false,
  userLoggedIn = false,
=======
  correctAnswer = "", // Valor por defecto para evitar undefined
  pointsAwarded = false,
  userLoggedIn = false,
  timeToReset, // Recibimos el tiempo de reinicio
>>>>>>> cdb9605 (juegos)
}: GameCompletedMessageProps) {
  return (
    <div
      className={`rounded-xl p-6 md:p-8 border-2 ${
        isCorrect ? "bg-green-900/30 border-green-500 text-green-100" : "bg-red-900/30 border-red-500 text-red-100"
      }`}
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {isCorrect ? <Trophy className="w-16 h-16 text-yellow-400" /> : <Target className="w-16 h-16 text-red-400" />}
        </div>
<<<<<<< HEAD

        <h3 className="text-2xl md:text-3xl font-bold">{isCorrect ? "¡Excelente!" : "¡Casi!"}</h3>

        <p className="text-lg">
          {isCorrect ? "" : `La respuesta correcta era: ${correctAnswer}`}
        </p>

=======
        <h3 className="text-2xl md:text-3xl font-bold">{isCorrect ? "¡Excelente!" : "¡Casi!"}</h3>
        <p className="text-lg">
          {
            isCorrect
              ? "¡Has completado la formación de hoy!"
              : correctAnswer
                ? `La respuesta correcta era: ${correctAnswer}`
                : "No completaste la formación de hoy." // Mensaje ajustado para cuando no hay una respuesta única
          }
        </p>
>>>>>>> cdb9605 (juegos)
        {/* Mensaje de puntos */}
        {isCorrect && userLoggedIn && pointsAwarded && (
          <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-300 font-bold text-lg">¡Ganaste 10 puntos!</span>
            </div>
            <p className="text-yellow-200 text-sm mt-2">Tus puntos se actualizaron automáticamente</p>
          </div>
        )}
<<<<<<< HEAD

=======
>>>>>>> cdb9605 (juegos)
        {/* Mensaje para usuarios no logueados */}
        {isCorrect && !userLoggedIn && (
          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-center space-x-2">
              <User className="w-6 h-6 text-blue-400" />
<<<<<<< HEAD
              <span className="text-blue-300 font-bold text-lg">¡Respuesta correctaa!</span>
=======
              <span className="text-blue-300 font-bold text-lg">¡Respuesta correcta!</span>
>>>>>>> cdb9605 (juegos)
            </div>
            <p className="text-blue-200 text-sm mt-2">
              <Link href="/auth" className="underline hover:text-blue-100">
                Iniciá sesión
              </Link>{" "}
              para ganar puntos y aparecer en el ranking
            </p>
          </div>
        )}
<<<<<<< HEAD

        <div className="pt-4 border-t border-gray-600">
          <p className="text-gray-300 text-base">¡Volvé mañana para una nueva trivia!</p>
          <p className="text-gray-400 text-sm mt-2">Próxima trivia disponible a las 00:00</p>
=======
        <div className="pt-4 border-t border-gray-600">
          <p className="text-gray-300 text-base">¡Volvé mañana para armar un nuevo once!</p>
          <p className="text-gray-400 text-sm mt-2">Próxima trivia disponible en: {timeToReset}</p>{" "}
          {/* Usamos la prop */}
>>>>>>> cdb9605 (juegos)
        </div>
      </div>
    </div>
  )
}
