"use client"

import { Trophy, Target, Star, User, Play } from "lucide-react"
import Link from "next/link"

interface VideoCompletedMessageProps {
  isCorrect: boolean
  correctAnswer: string
  selectedAnswer: string
  pointsAwarded?: boolean
  userLoggedIn?: boolean
}

export default function VideoCompletedMessage({
  isCorrect,
  correctAnswer,
  selectedAnswer,
  pointsAwarded = false,
  userLoggedIn = false,
}: VideoCompletedMessageProps) {
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

        <h3 className="text-2xl md:text-3xl font-bold">{isCorrect ? "¡Excelente!" : "¡Casi!"}</h3>

        <div className="space-y-2">
          {isCorrect ? (
            <p className="text-lg">
              ¡Respuesta correcta! Elegiste: <strong>{selectedAnswer}</strong>
            </p>
          ) : (
            <div className="space-y-1">
              <p className="text-lg">
                Tu respuesta: <strong className="text-red-300">{selectedAnswer}</strong>
              </p>
              <p className="text-lg">
                Respuesta correcta: <strong className="text-green-300">{correctAnswer}</strong>
              </p>
            </div>
          )}
        </div>

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

        {/* Mensaje para usuarios no logueados */}
        {isCorrect && !userLoggedIn && (
          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-center space-x-2">
              <User className="w-6 h-6 text-blue-400" />
              <span className="text-blue-300 font-bold text-lg">¡Respuesta correcta!</span>
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
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Play className="w-5 h-5 text-gray-400" />
            <p className="text-gray-300 text-base">¡Volvé mañana para un nuevo video!</p>
          </div>
          <p className="text-gray-400 text-sm">Próximo video disponible a las 00:00</p>
        </div>
      </div>
    </div>
  )
}
