"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import GameHeader from "@/components/GameHeader"
import TriviaCard from "@/components/TriviaCard"
import GameCompletedMessage from "@/components/GameCompletedMessage"
import AlreadyPlayedMessage from "@/components/AlreadyPlayedMessage"
import { getTodayAsString, hasPlayedToday, clearPreviousDayData } from "@/utils/dateUtils"
import { getTriviaForToday } from "@/lib/data/triviasDelDia"
import { awardPoints, hasPlayedGameToday } from "@/utils/gameUtils"
import { getSupabaseClient } from "@/utils/supabase-browser"
import type { Trivia } from "@/lib/data/triviasDelDia"

export default function TriviaPage() {
  const [currentTrivia, setCurrentTrivia] = useState<Trivia | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [pointsAwarded, setPointsAwarded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const supabase = getSupabaseClient()

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = async () => {
    clearPreviousDayData()

    // Verificar si hay usuario logueado
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        console.log("👤 Usuario logueado:", user.email)
        // Si hay usuario, verificar en la base de datos
        const playedToday = await hasPlayedGameToday("trivia")
        setHasPlayed(playedToday)
      } else {
        console.log("❌ No hay usuario logueado")
        // Si no hay usuario, usar localStorage
        const playedToday = hasPlayedToday("trivia")
        setHasPlayed(playedToday)
      }
    } else {
      console.log("⚠️ Supabase no configurado")
      // Sin Supabase, usar localStorage
      const playedToday = hasPlayedToday("trivia")
      setHasPlayed(playedToday)
    }

    const todayTrivia = getTriviaForToday()
    setCurrentTrivia(todayTrivia)

    // Recuperar estado guardado si ya jugó
    const savedState = localStorage.getItem("futfactos-trivia-game-state")
    if (savedState) {
      const gameState = JSON.parse(savedState)
      const today = getTodayAsString()

      if (gameState.date === today) {
        setGameCompleted(true)
        setSelectedAnswer(gameState.selectedAnswer)
        setIsCorrect(gameState.isCorrect)
        setPointsAwarded(gameState.pointsAwarded || false)
      }
    }

    setLoading(false)
  }

  const handleAnswerSelect = useCallback(
    async (answerIndex: number) => {
      if (hasPlayed || gameCompleted) return

      const correct = answerIndex === currentTrivia?.respuestaCorrecta
      setSelectedAnswer(answerIndex)
      setIsCorrect(correct)
      setGameCompleted(true)
      setHasPlayed(true)

      console.log(`🎯 Respuesta ${correct ? "correcta" : "incorrecta"} seleccionada`)

      // Otorgar puntos si ganó y está logueado
      let awarded = false
      if (correct && user) {
        console.log("🏆 Intentando otorgar puntos...")
        awarded = await awardPoints("trivia")
        setPointsAwarded(awarded)

        if (awarded) {
          console.log("✅ ¡Puntos otorgados exitosamente!")
        } else {
          console.log("❌ No se pudieron otorgar puntos")
        }
      } else if (correct && !user) {
        console.log("⚠️ Respuesta correcta pero no hay usuario logueado")
      }

      // Guardar en localStorage
      const today = getTodayAsString()
      localStorage.setItem("futfactos-trivia-last-played", today)
      localStorage.setItem(
        "futfactos-trivia-game-state",
        JSON.stringify({
          selectedAnswer: answerIndex,
          isCorrect: correct,
          pointsAwarded: awarded,
          date: today,
        }),
      )

      console.log("💾 Estado del juego guardado en localStorage")
    },
    [hasPlayed, gameCompleted, currentTrivia, user],
  )

  const handlePlayAgain = useCallback(() => {
    localStorage.removeItem("futfactos-trivia-game-state")
    localStorage.removeItem("futfactos-trivia-last-played")
    setHasPlayed(false)
    setGameCompleted(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setPointsAwarded(false)
    const newTrivia = getTriviaForToday()
    setCurrentTrivia(newTrivia)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <GameHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al menú
          </Link>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">Trivia del Día</h2>
            <p className="text-gray-300 text-lg">Ponete a prueba con el fútbol argentino</p>
            {!user && (
              <p className="text-yellow-400 text-sm mt-2">
                💡{" "}
                <Link href="/auth" className="underline">
                  Iniciá sesión
                </Link>{" "}
                para ganar puntos y aparecer en el ranking
              </p>
            )}
          </div>

          {hasPlayed && !gameCompleted ? (
            <AlreadyPlayedMessage onPlayAgain={handlePlayAgain} gameType="trivia" />
          ) : gameCompleted ? (
            <div className="space-y-6">
              <TriviaCard
                trivia={currentTrivia!}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswer={selectedAnswer}
                showResults={true}
                disabled={true}
              />
              <GameCompletedMessage
                isCorrect={isCorrect!}
                correctAnswer={currentTrivia!.opciones[currentTrivia!.respuestaCorrecta]}
                pointsAwarded={pointsAwarded}
                userLoggedIn={!!user}
              />
            </div>
          ) : currentTrivia ? (
            <TriviaCard
              trivia={currentTrivia}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={selectedAnswer}
              showResults={false}
              disabled={false}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No hay trivia disponible para hoy</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
