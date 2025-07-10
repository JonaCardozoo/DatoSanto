"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import GameHeader from "@/components/GameHeader"
import WordleGrid from "@/components/WordleGrid"
import WordleKeyboard from "@/components/WordleKeyboard"
import WordleCompletedMessage from "@/components/WordleCompletedMessage"
import AlreadyPlayedMessage from "@/components/AlreadyPlayedMessage"
import { getTodayAsString, hasPlayedToday, clearPreviousDayData } from "@/utils/dateUtils"
import { getPlayerForToday } from "@/lib/data/jugadoresDelDia"
import { awardPoints, hasPlayedGameToday } from "@/utils/gameUtils"
import { getSupabaseClient } from "@/utils/supabase-browser"
import type { Player } from "@/lib/data/jugadoresDelDia"

export default function JugadorPage() {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [currentGuess, setCurrentGuess] = useState("")
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentRow, setCurrentRow] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [pointsAwarded, setPointsAwarded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const MAX_GUESSES = 5
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
        const playedToday = await hasPlayedGameToday("jugador")
        setHasPlayed(playedToday)
      } else {
        console.log("❌ No hay usuario logueado")
        // Si no hay usuario, usar localStorage
        const playedToday = hasPlayedToday("jugador")
        setHasPlayed(playedToday)
      }
    } else {
      console.log("⚠️ Supabase no configurado")
      // Sin Supabase, usar localStorage
      const playedToday = hasPlayedToday("jugador")
      setHasPlayed(playedToday)
    }

    const todayPlayer = getPlayerForToday()
    setCurrentPlayer(todayPlayer)

    // Recuperar estado guardado si ya jugó
    const savedState = localStorage.getItem("futfactos-jugador-game-state")
    if (savedState) {
      const gameState = JSON.parse(savedState)
      const today = getTodayAsString()

      if (gameState.date === today) {
        setGameCompleted(true)
        setGuesses(gameState.guesses)
        setCurrentRow(gameState.currentRow)
        setGameWon(gameState.gameWon)
        setPointsAwarded(gameState.pointsAwarded || false)
      }
    }

    setLoading(false)
  }

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameCompleted || hasPlayed) return

      if (key === "ENTER") {
        if (currentGuess.length === currentPlayer?.apellido.length) {
          submitGuess()
        }
      } else if (key === "DEL" || key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1))
      } else if (key.length === 1 && currentGuess.length < (currentPlayer?.apellido.length || 0)) {
        const validKey = key.toUpperCase()
        if (/^[A-ZÑ]$/.test(validKey)) {
          setCurrentGuess((prev) => prev + validKey)
        }
      }
    },
    [gameCompleted, hasPlayed, currentGuess, currentPlayer],
  )

  const submitGuess = useCallback(async () => {
    if (!currentPlayer) return

    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)
    setCurrentRow((prev) => prev + 1)

    const won = currentGuess.toUpperCase() === currentPlayer.apellido.toUpperCase()
    const lost = newGuesses.length >= MAX_GUESSES && !won

    console.log(`🎯 Intento ${newGuesses.length}: ${currentGuess} - ${won ? "¡CORRECTO!" : "Incorrecto"}`)

    if (won || lost) {
      setGameCompleted(true)
      setGameWon(won)
      setHasPlayed(true)

      // Otorgar puntos si ganó y está logueado
      let awarded = false
      if (won && user) {
        console.log("🏆 ¡Ganaste! Intentando otorgar puntos...")
        awarded = await awardPoints("jugador")
        setPointsAwarded(awarded)

        if (awarded) {
          console.log("✅ ¡Puntos otorgados exitosamente!")
        } else {
          console.log("❌ No se pudieron otorgar puntos")
        }
      } else if (won && !user) {
        console.log("⚠️ Ganaste pero no hay usuario logueado")
      }

      // Guardar en localStorage
      const today = getTodayAsString()
      localStorage.setItem("futfactos-jugador-last-played", today)
      localStorage.setItem(
        "futfactos-jugador-game-state",
        JSON.stringify({
          guesses: newGuesses,
          currentRow: newGuesses.length,
          gameWon: won,
          pointsAwarded: awarded,
          date: today,
        }),
      )

      console.log("💾 Estado del juego guardado en localStorage")
    }

    setCurrentGuess("")
  }, [currentPlayer, guesses, currentGuess, user])

  // Event listener para el teclado físico
  useEffect(() => {
    const handlePhysicalKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Backspace") {
        event.preventDefault()
      }

      const key = event.key.toUpperCase()

      if (key === "ENTER") {
        handleKeyPress("ENTER")
      } else if (key === "BACKSPACE") {
        handleKeyPress("DEL")
      } else if (/^[A-ZÑ]$/.test(key)) {
        handleKeyPress(key)
      }
    }

    if (!gameCompleted && !hasPlayed && !loading) {
      window.addEventListener("keydown", handlePhysicalKeyPress)
    }

    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyPress)
    }
  }, [gameCompleted, hasPlayed, loading, handleKeyPress])

  const handlePlayAgain = useCallback(() => {
    localStorage.removeItem("futfactos-jugador-game-state")
    localStorage.removeItem("futfactos-jugador-last-played")
    setHasPlayed(false)
    setGameCompleted(false)
    setCurrentGuess("")
    setGuesses([])
    setCurrentRow(0)
    setGameWon(false)
    setPointsAwarded(false)
    const newPlayer = getPlayerForToday()
    setCurrentPlayer(newPlayer)
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
            <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">JUGADOR DEL DÍA</h2>
            <p className="text-gray-300 text-lg">Adiviná el apellido del jugador en 5 intentos</p>
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

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h3 className="font-bold text-white mb-2">¿Cómo jugar?</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>
                • <span className="bg-green-600 text-white px-1 rounded">🟩</span> Letra correcta en posición correcta
              </li>
              <li>
                • <span className="bg-yellow-600 text-white px-1 rounded">🟨</span> Letra correcta en posición
                incorrecta
              </li>
              <li>
                • <span className="bg-gray-600 text-white px-1 rounded">⬜</span> Letra no está en la palabra
              </li>
              <li className="pt-2 border-t border-gray-700 mt-2">
                💡 <strong>Podés usar tu teclado:</strong> Escribí las letras y presioná Enter para enviar
              </li>
            </ul>
          </div>

          {hasPlayed && !gameCompleted ? (
            <AlreadyPlayedMessage onPlayAgain={handlePlayAgain} gameType="jugador" />
          ) : gameCompleted ? (
            <div className="space-y-6">
              <WordleGrid
                targetWord={currentPlayer?.apellido || ""}
                guesses={guesses}
                currentGuess={currentGuess}
                currentRow={currentRow}
                maxGuesses={MAX_GUESSES}
              />
              <WordleKeyboard
                onKeyPress={handleKeyPress}
                guesses={guesses}
                targetWord={currentPlayer?.apellido || ""}
                disabled={true}
              />
              <WordleCompletedMessage
                gameWon={gameWon}
                targetWord={currentPlayer?.apellido || ""}
                playerName={currentPlayer?.nombre || ""}
                attempts={guesses.length}
                maxAttempts={MAX_GUESSES}
                pointsAwarded={pointsAwarded}
                userLoggedIn={!!user}
              />
            </div>
          ) : currentPlayer ? (
            <div className="space-y-6">
              <WordleGrid
                targetWord={currentPlayer.apellido}
                guesses={guesses}
                currentGuess={currentGuess}
                currentRow={currentRow}
                maxGuesses={MAX_GUESSES}
              />
              <WordleKeyboard
                onKeyPress={handleKeyPress}
                guesses={guesses}
                targetWord={currentPlayer.apellido}
                disabled={false}
              />

              {!gameCompleted && !hasPlayed && (
                <div className="text-center">
                  <p className="text-gray-400 text-sm">💻 Usá tu teclado o hacé clic en las letras de arriba</p>
                  {currentGuess.length > 0 && currentGuess.length < currentPlayer.apellido.length && (
                    <p className="text-yellow-400 text-sm mt-1">
                      Escribí {currentPlayer.apellido.length - currentGuess.length} letra
                      {currentPlayer.apellido.length - currentGuess.length !== 1 ? "s" : ""} más
                    </p>
                  )}
                  {currentGuess.length === currentPlayer.apellido.length && (
                    <p className="text-green-400 text-sm mt-1 animate-pulse">
                      ✅ Presioná Enter para enviar tu respuesta
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No hay jugador disponible para hoy</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
