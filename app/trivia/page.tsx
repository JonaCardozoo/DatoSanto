"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import GameHeader from "@/components/GameHeader"
import TriviaCard from "@/components/TriviaCard"
import GameCompletedMessage from "@/components/GameCompletedMessage"
import AlreadyPlayedMessage from "@/components/AlreadyPlayedMessage"
import { getTodayAsString, clearPreviousDayData } from "@/utils/dateUtils"
import { getTriviaForToday } from "@/lib/data/triviasDelDia"
import { awardPoints, hasPlayedGameToday, markAsPlayedToday } from "@/utils/gameUtils"
import { getSupabaseClient } from "@/utils/supabase-browser"
import { getCurrentUser } from "@/utils/jwt-auth"
import type { Trivia } from "@/lib/data/triviasDelDia"

export default function TriviaPage() {
  const [currentTrivia, setCurrentTrivia] = useState<Trivia | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [lastGameWon, setLastGameWon] = useState<boolean | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [pointsAwarded, setPointsAwarded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const initializeGame = async () => {
      // Definición de initializeGame movida dentro de useEffect
      clearPreviousDayData()

      console.log("🚀 Inicializando juego de Trivia del Día...")
      const currentUser = getCurrentUser()
      setUser(currentUser)
      console.log("👤 Usuario logueado:", currentUser?.email || "No logueado")

      const todayTrivia = getTriviaForToday()
      setCurrentTrivia(todayTrivia)
      console.log("❓ Trivia del día:", todayTrivia?.pregunta)

      let playedTodayFromSource = false
      let wonFromSource: boolean | null = null

      if (currentUser && todayTrivia) {
        playedTodayFromSource = await hasPlayedGameToday("trivia")

        if (playedTodayFromSource && supabase) {
          const today = getTodayAsString()
          const { data, error } = await supabase
            .from("game_sessions")
            .select("won")
            .eq("user_id", currentUser.id)
            .eq("game_type", "trivia")
            .eq("date", today)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle()

          if (error) {
            console.error("❌ Error al obtener resultado de la última partida para Trivia:", error)
          } else if (data) {
            wonFromSource = data.won
            console.log("✅ Resultado de la última partida de Trivia (de BD):", wonFromSource ? "Ganada" : "Perdida")
          } else {
            console.log("⚠️ No se encontró sesión de juego para hoy en BD, a pesar de hasPlayed=true.")
          }
        }

      } else {
        playedTodayFromSource = await hasPlayedGameToday("trivia")
        console.log(`DEBUG app/trivia/page.tsx: hasPlayedGameToday("trivia") (LS) returned ${playedTodayFromSource}`)
      }

      setHasPlayed(playedTodayFromSource)
      setLastGameWon(wonFromSource)

      const savedState = localStorage.getItem("futfactos-trivia-game-state")

if (savedState) {
  const gameState = JSON.parse(savedState)
  const today = getTodayAsString()

  if (gameState.date === today) {
    if (playedTodayFromSource) {
      // Estado válido tanto en BD como en LS
      setSelectedAnswer(gameState.selectedAnswer)
      setIsCorrect(gameState.isCorrect)
      setPointsAwarded(gameState.pointsAwarded || false)
      if (gameState.gameCompleted) setGameCompleted(true)
      setHasPlayed(true)
      setLastGameWon(gameState.isCorrect)
      console.log("💾 Estado cargado desde LS")
    } else {
      // Aún no jugó según BD, pero hay estado local
      console.log("⚠️ Estado local indica juego pero BD no. Manteniendo local hasta que se confirme.")
      setSelectedAnswer(gameState.selectedAnswer)
      setIsCorrect(gameState.isCorrect)
      setPointsAwarded(gameState.pointsAwarded || false)
      if (gameState.gameCompleted) setGameCompleted(true)
      setHasPlayed(true)
      setLastGameWon(gameState.isCorrect)
    }
  } else {
    // Estado local viejo
    localStorage.removeItem("futfactos-trivia-game-state")
    setGameCompleted(false)
    console.log("🧹 Estado viejo eliminado")
  }
} else {
  // No hay estado local
  setGameCompleted(false)
}


      setLoading(false)
      console.log("🏁 Inicialización de Trivia del Día completa.")
    }

    initializeGame() // Llamar a la función interna
  }, []) // Dependencias para useEffect

  const handleAnswerSelect = useCallback(
    async (answerIndex: number) => {
      if (hasPlayed || gameCompleted) return
      if (!currentTrivia) return

      const correct = answerIndex === currentTrivia.respuestaCorrecta
      setSelectedAnswer(answerIndex)
      setIsCorrect(correct)
      setGameCompleted(true)
      setHasPlayed(true)
      setLastGameWon(correct)

      console.log(`🎯 Respuesta ${correct ? "correcta" : "incorrecta"} seleccionada`)

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
      }

      await markAsPlayedToday("trivia", correct)
      console.log("💾 Estado del juego guardado en localStorage y BD (si logueado).")

      const today = getTodayAsString()
      localStorage.setItem(
        "futfactos-trivia-game-state",
        JSON.stringify({
          selectedAnswer: answerIndex,
          isCorrect: correct,
          pointsAwarded: awarded,
          date: today,
          gameCompleted: true,
        }),
      )
      console.log("💾 Estado final del juego de trivia guardado en localStorage.")
    },
    [hasPlayed, gameCompleted, currentTrivia, user],
  )

  const handlePlayAgain = useCallback(() => {
    console.log("🔄 Reiniciando juego para nuevo desafío...")
    localStorage.removeItem("futfactos-trivia-game-state")
    window.location.reload()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
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
          {/* Lógica de renderizado condicional principal */}
          {gameCompleted ? (
            // Si el juego está completado (porque se acaba de terminar o se cargó desde un estado completado)
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
          ) : hasPlayed ? (
            // Si no está gameCompleted, pero hasPlayed es true (es decir, ya jugó hoy y volvió a la página)
            <AlreadyPlayedMessage
              onPlayAgain={handlePlayAgain}
              gameType="trivia"
              playedToday={true}
              lastGameWon={lastGameWon} // Pasar el resultado de la última partida
            />
          ) : currentTrivia ? (
            // Si el juego no está completado y no ha jugado hoy, mostrar el juego en curso
            <TriviaCard
              trivia={currentTrivia}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={selectedAnswer}
              showResults={false}
              disabled={false}
            />
          ) : (
            // Si no hay trivia disponible
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No hay trivia disponible para hoy</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
