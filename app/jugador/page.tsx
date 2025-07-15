"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import GameHeader from "@/components/GameHeader"
import WordleGrid from "@/components/WordleGrid"
import WordleKeyboard from "@/components/WordleKeyboard"
import WordleCompletedMessage from "@/components/WordleCompletedMessage"
import AlreadyPlayedMessage from "@/components/AlreadyPlayedMessage"
import { getTodayAsString, clearPreviousDayData } from "@/utils/dateUtils"
import { getPlayerForToday } from "@/lib/data/jugadoresDelDia"
import { awardPoints, markAsPlayedToday } from "@/utils/gameUtils"
import { getSupabaseClient } from "@/utils/supabase-browser"
import { getCurrentUser } from "@/utils/jwt-auth"
import type { Player } from "@/lib/data/jugadoresDelDia"

export default function JugadorPage() {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [lastGameWon, setLastGameWon] = useState<boolean | null>(null)
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

  const submitGuess = useCallback(async () => {
    if (!currentPlayer || gameCompleted || hasPlayed) return

    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)
    setCurrentRow((prev) => prev + 1)

    const won = currentGuess.toUpperCase() === currentPlayer.apellido.toUpperCase()
    const lost = newGuesses.length >= MAX_GUESSES && !won

    if (won || lost) {
      setGameCompleted(true)
      setGameWon(won)
      setHasPlayed(true)
      setLastGameWon(won)

      let awarded = false
      if (won && user) {
        awarded = await awardPoints("jugador")
        setPointsAwarded(awarded)
      }

      // Guardar el estado completo del juego en localStorage y DB (si hay usuario)
      await markAsPlayedToday("jugador", won, newGuesses.length, newGuesses, awarded)
    }
    setCurrentGuess("")
  }, [currentPlayer, guesses, currentGuess, user, gameCompleted, hasPlayed, MAX_GUESSES])

  useEffect(() => {
    initializeGame()
  }, [])

  // Efecto para guardar el estado del juego en localStorage cada vez que cambie
  useEffect(() => {
    if (!currentPlayer || loading) return // Solo guardar si el juego está inicializado y no cargando

    const today = getTodayAsString()
    const gameState = {
      date: today,
      guesses,
      currentRow,
      gameWon,
      gameCompleted,
      pointsAwarded,
    }
    localStorage.setItem("futfactos-jugador-game-state", JSON.stringify(gameState))
  }, [guesses, currentRow, gameWon, gameCompleted, pointsAwarded, currentPlayer, loading])

  const initializeGame = async () => {
    clearPreviousDayData() // Asegurarse de limpiar datos antiguos de días anteriores

    const currentUser = getCurrentUser()
    setUser(currentUser)

    const todayPlayer = getPlayerForToday()
    setCurrentPlayer(todayPlayer)

    const today = getTodayAsString()
    let localGameState = null
    const savedState = localStorage.getItem("futfactos-jugador-game-state")

    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        if (parsedState.date === today) {
          localGameState = parsedState
        } else {
          // El estado guardado es de un día anterior, limpiarlo
          localStorage.removeItem("futfactos-jugador-game-state")
        }
      } catch (e) {
        console.error("Error al parsear el estado local del juego:", e)
        localStorage.removeItem("futfactos-jugador-game-state") // Limpiar estado corrupto
      }
    }

    let dbGameSession = null
    if (currentUser && todayPlayer) {
      // Verificar en la BD si hay una sesión de juego completada para hoy
      const { data, error } = await supabase
        .from("game_sessions")
        .select("won, completed, attempts")
        .eq("user_id", currentUser.id)
        .eq("game_type", "jugador")
        .eq("date", today)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error("❌ Error al obtener sesión de juego de la BD:", error)
      } else if (data && data.completed) {
        dbGameSession = data
      }
    }

    // Determinar el estado final del juego, priorizando la BD si hay una sesión completada
    let finalHasPlayed = false
    let finalLastGameWon: boolean | null = null
    let finalGuesses: string[] = []
    let finalCurrentRow = 0
    let finalGameWon = false
    let finalGameCompleted = false
    let finalPointsAwarded = false

    if (dbGameSession) {
      // El estado de la BD tiene precedencia si existe una sesión completada
      finalHasPlayed = true
      finalLastGameWon = dbGameSession.won
      finalGameCompleted = true
      finalGameWon = dbGameSession.won

      // Si la partida fue ganada y tenemos el jugador de hoy, mostramos la palabra en la cuadrícula
      if (dbGameSession.won && todayPlayer?.apellido) {
        finalGuesses = [todayPlayer.apellido.toUpperCase()]
      } else {
        // Si se perdió o no se ganó, o no hay apellido, la cuadrícula se mantiene vacía o con los intentos guardados localmente
        finalGuesses = localGameState?.guesses || []
      }

      // Asegurarse de que los intentos sean al menos 1 si se ganó, o usar los de la DB/local
      finalCurrentRow =
        dbGameSession.attempts && dbGameSession.attempts > 0 ? dbGameSession.attempts : dbGameSession.won ? 1 : 0
      finalPointsAwarded = dbGameSession.won // Asumimos que los puntos se otorgan al ganar
    } else if (localGameState) {
      // Si no hay sesión completada en la BD, pero existe un estado local para hoy
      finalGuesses = localGameState.guesses || []
      finalCurrentRow = localGameState.currentRow || 0
      finalGameWon = localGameState.gameWon || false
      finalGameCompleted = localGameState.gameCompleted || false
      finalPointsAwarded = localGameState.pointsAwarded || false

      if (finalGameCompleted) {
        finalHasPlayed = true
        finalLastGameWon = finalGameWon
      }
    }

    setGuesses(finalGuesses)
    setCurrentRow(finalCurrentRow)
    setGameWon(finalGameWon)
    setGameCompleted(finalGameCompleted)
    setPointsAwarded(finalPointsAwarded)
    setHasPlayed(finalHasPlayed)
    setLastGameWon(finalLastGameWon)

    setLoading(false)
  }

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameCompleted || hasPlayed) {
        return
      }

      if (key === "ENTER") {
        if (currentGuess.length === (currentPlayer?.apellido?.length || 0)) {
          submitGuess()
        } else {
          // Opcional: mostrar un mensaje al usuario de que la palabra es demasiado corta
        }
      } else if (key === "DEL" || key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1))
      } else if (key.length === 1 && currentGuess.length < (currentPlayer?.apellido?.length || 0)) {
        const validKey = key.toUpperCase()
        if (/^[A-ZÑ]$/.test(validKey)) {
          setCurrentGuess((prev) => prev + validKey)
        }
      }
    },
    [gameCompleted, hasPlayed, currentGuess, currentPlayer, submitGuess],
  )

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
    localStorage.removeItem("futfactos-jugador-game-state") // Limpiar estado local
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
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
          {gameCompleted ? (
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
          ) : hasPlayed ? (
            <AlreadyPlayedMessage
              onPlayAgain={handlePlayAgain}
              gameType="jugador"
              playedToday={true}
              lastGameWon={lastGameWon}
            />
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
                  {currentGuess.length > 0 && currentGuess.length < (currentPlayer.apellido?.length || 0) && (
                    <p className="text-yellow-400 text-sm mt-1">
                      Escribí {(currentPlayer.apellido?.length || 0) - currentGuess.length} letra
                      {(currentPlayer.apellido?.length || 0) - currentGuess.length !== 1 ? "s" : ""} más
                    </p>
                  )}
                  {currentGuess.length === (currentPlayer.apellido?.length || 0) && (
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
