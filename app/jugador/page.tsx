"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import GameHeader from "@/components/GameHeader"
import WordleGrid from "@/components/WordleGrid"
import WordleKeyboard from "@/components/WordleKeyboard"
import WordleCompletedMessage from "@/components/WordleCompletedMessage"
import AlreadyPlayedMessage from "@/components/AlreadyPlayedMessage"
import { getTodayAsString, clearPreviousDayData } from "@/utils/dateUtils" // No usar hasPlayedToday aquí, usar gameUtils
import { getPlayerForToday } from "@/lib/data/jugadoresDelDia"
import { awardPoints, hasPlayedGameToday, markAsPlayedToday } from "@/utils/gameUtils" // Usar hasPlayedGameToday y markAsPlayedToday de gameUtils
import { getSupabaseClient } from "@/utils/supabase-browser"
import { getCurrentUser } from "@/utils/jwt-auth" // Importar getCurrentUser de jwt-auth
import type { Player } from "@/lib/data/jugadoresDelDia"

export default function JugadorPage() {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false) // Indica si el usuario ya completó el juego HOY
  const [lastGameWon, setLastGameWon] = useState<boolean | null>(null) // Resultado de la última partida de hoy
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
    if (!currentPlayer || gameCompleted || hasPlayed) return // Evitar múltiples envíos

    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)
    setCurrentRow((prev) => prev + 1)

    const won = currentGuess.toUpperCase() === currentPlayer.apellido.toUpperCase()
    const lost = newGuesses.length >= MAX_GUESSES && !won

    if (won || lost) {
      setGameCompleted(true)
      setGameWon(won)
      setHasPlayed(true) // Marcar como jugado para la sesión actual
      setLastGameWon(won) // Establecer el resultado de esta partida

      let awarded = false
      if (won && user) {
        awarded = await awardPoints("jugador") // Usar awardPoints de gameUtils
        setPointsAwarded(awarded)
      }

      // SIEMPRE marcar como jugado en la BD y localStorage al finalizar la partida
      await markAsPlayedToday("jugador", won, newGuesses.length) // Pasar 'won' y 'attempts'
    }
    setCurrentGuess("")
  }, [currentPlayer, guesses, currentGuess, user, gameCompleted, hasPlayed, MAX_GUESSES])

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = async () => {
    clearPreviousDayData() // Asegurarse de limpiar datos antiguos

    const currentUser = getCurrentUser() // Obtener usuario de jwt-auth
    setUser(currentUser)

    const todayPlayer = getPlayerForToday()
    setCurrentPlayer(todayPlayer)

    let playedTodayFromSource = false
    let wonFromSource: boolean | null = null

    // Verificar si ya jugó hoy y obtener el resultado de la última partida
    if (currentUser && todayPlayer) {
      // Si hay usuario logueado, la fuente principal es la DB
      playedTodayFromSource = await hasPlayedGameToday("jugador") // Esta función ya prioriza la DB para logueados

      if (playedTodayFromSource && supabase) {
        const today = getTodayAsString()
        const { data, error } = await supabase
          .from("game_sessions")
          .select("won")
          .eq("user_id", currentUser.id)
          .eq("game_type", "jugador")
          .eq("date", today)
          .order("created_at", { ascending: false }) // Obtener la última sesión
          .limit(1)
          .maybeSingle()

        if (error) {
          console.error("❌ Error al obtener resultado de la última partida para Jugador:", error)
        } else if (data) {
          wonFromSource = data.won
        }
      }

      // **NUEVA LÓGICA:** Si el usuario está logueado pero la BD dice que NO ha jugado,
      // entonces cualquier estado de juego guardado LOCALMENTE (de una sesión no logueada previa) debe ser ignorado/limpiado.
      if (!playedTodayFromSource) {
        localStorage.removeItem("futfactos-jugador-game-state")
      }
    } else {
      // Si NO hay usuario logueado, la fuente principal es localStorage
      playedTodayFromSource = await hasPlayedGameToday("jugador") // Esta función ya usa localStorage para no logueados
    }

    setHasPlayed(playedTodayFromSource)
    setLastGameWon(wonFromSource)

    // Recuperar estado de la partida actual del día (si la recarga fue a mitad del juego)
    // Solo intentar cargar si 'hasPlayed' es verdadero (ya sea por BD o LS)
    const savedState = localStorage.getItem("futfactos-jugador-game-state")
    if (savedState && playedTodayFromSource) {
      const gameState = JSON.parse(savedState)
      const today = getTodayAsString()
      if (gameState.date === today) {
        // Asegurarse de que el estado local coincida con la victoria/derrota si se obtuvo de la BD
        if (currentUser && wonFromSource !== null && gameState.gameWon !== wonFromSource) {
          localStorage.removeItem("futfactos-jugador-game-state")
          setGameCompleted(false) // No mostrar el mensaje de completado detallado
        } else {
          setGuesses(gameState.guesses)
          setCurrentRow(gameState.currentRow)
          setGameWon(gameState.gameWon)
          setPointsAwarded(gameState.pointsAwarded || false)
          // Si el juego ya estaba completado al cargar, marcarlo
          if (gameState.gameCompleted) {
            setGameCompleted(true)
          }
        }
      } else {
        // Si el estado guardado es de un día anterior, limpiarlo
        localStorage.removeItem("futfactos-jugador-game-state")
        setGameCompleted(false) // Asegurarse de que no se muestre el mensaje de completado
      }
    } else if (savedState && !playedTodayFromSource) {
      // Si hay un savedState pero playedTodayFromSource es false (ej: jugó no logueado, ahora logueado)
      // Limpiarlo explícitamente para asegurar que se pueda jugar.
      localStorage.removeItem("futfactos-jugador-game-state")
      setGameCompleted(false)
    } else {
      setGameCompleted(false) // Por defecto, no mostrar el mensaje de completado detallado
    }

    setLoading(false)
  }

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameCompleted || hasPlayed) {
        // Si el juego ya está completado o ya jugó hoy, no permitir más entradas
        return
      }

      if (key === "ENTER") {
        if (currentGuess.length === (currentPlayer?.apellido?.length || 0)) {
          submitGuess()
        } else {
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
    [gameCompleted, hasPlayed, currentGuess, currentPlayer, submitGuess], // Agregado submitGuess como dependencia
  )

  // Event listener para el teclado físico
  useEffect(() => {
    const handlePhysicalKeyPress = (event: KeyboardEvent) => {
      // Evitar que el enter o backspace hagan scroll
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
    // Al hacer click en "Jugar Nuevo Desafío", forzar una recarga para iniciar un nuevo día
    // (el `clearPreviousDayData` al inicializar se encargará de esto)
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

  // Lógica de renderizado principal
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
          {/* Lógica de renderizado condicional principal */}
          {gameCompleted ? (
            // Si el juego está completado (porque se acaba de terminar o se cargó desde un estado completado)
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
            // Si no está gameCompleted, pero hasPlayed es true (es decir, ya jugó hoy y volvió a la página)
            <AlreadyPlayedMessage
              onPlayAgain={handlePlayAgain}
              gameType="jugador"
              playedToday={true}
              lastGameWon={lastGameWon}
            />
          ) : currentPlayer ? (
            // Si el juego no está completado y no ha jugado hoy, mostrar el juego en curso
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
            // Si no hay jugador disponible
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No hay jugador disponible para hoy</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
