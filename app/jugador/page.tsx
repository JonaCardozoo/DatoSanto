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
import { awardPoints, markAsPlayedToday, hasPlayedToday } from "@/utils/gameUtils"
import { getCurrentUser } from "@/utils/jwt-auth"
import type { Player } from "@/lib/data/jugadoresDelDia"
import GuestWarningModal from "@/components/GuestWarningModal"
import { useRouter } from "next/navigation"

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
<<<<<<< HEAD
  const [showGuestWarning, setShowGuestWarning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
=======
  const [pointsEarned, setPointsEarned] = useState(0)
  const [showGuestWarning, setShowGuestWarning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userPoints, setUserPoints] = useState(0)
>>>>>>> cdb9605 (juegos)

  const MAX_GUESSES = 5
  const router = useRouter()

<<<<<<< HEAD
=======
  // Sistema de puntos por intento
  const calculatePoints = (attempts: number): number => {
    const pointsTable: Record<number, number> = {
      1: 50,
      2: 40,
      3: 30,
      4: 20,
      5: 10
    }
    return pointsTable[attempts] || 0
  }

>>>>>>> cdb9605 (juegos)
  const handleLogin = () => {
    router.push("/auth")
    setShowGuestWarning(false)
  }

  const handleCloseWarning = () => {
    setShowGuestWarning(false)
  }

  useEffect(() => {
    if (!user && !loading) {
      setShowGuestWarning(true)
    }
  }, [user, loading])

  const submitGuess = useCallback(async () => {
<<<<<<< HEAD
=======

    

>>>>>>> cdb9605 (juegos)
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
<<<<<<< HEAD
      if (won && user) {
        awarded = await awardPoints("jugador")
=======
      let earnedPoints = 0
      
      if (won && user) {
        // Calcular puntos basado en el número de intentos
        earnedPoints = calculatePoints(newGuesses.length)
        setPointsEarned(earnedPoints)
        
        // Otorgar los puntos calculados
        awarded = await awardPoints("jugador", earnedPoints)
>>>>>>> cdb9605 (juegos)
        setPointsAwarded(awarded)
      }

      await markAsPlayedToday("jugador", won, {
        guesses: newGuesses,
        currentGuess: "",
        currentRow: newGuesses.length,
        gameWon: won,
        gameCompleted: true,
        pointsAwarded: awarded,
<<<<<<< HEAD
=======
        pointsEarned: earnedPoints,
>>>>>>> cdb9605 (juegos)
        hasPlayed: true,
        lastGameWon: won,
      })

      const played = await hasPlayedToday("jugador")
      setHasPlayed(played)
    }

    setCurrentGuess("")
  }, [currentPlayer, guesses, currentGuess, user, gameCompleted, hasPlayed])

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameCompleted || hasPlayed) return
      
      if (key === "ENTER") {
        if (currentGuess.length === (currentPlayer?.apellido?.length || 0)) {
          submitGuess()
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
    [gameCompleted, hasPlayed, currentGuess, currentPlayer, submitGuess]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (key === "ENTER" || key === "BACKSPACE") e.preventDefault()
      handleKeyPress(key)
    }

    if (!loading && !gameCompleted && !hasPlayed) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyPress, loading, gameCompleted, hasPlayed])

  const handlePlayAgain = () => {
    localStorage.removeItem("futfactos-jugador-game-state")
    window.location.reload()
  }

  const initializeGame = async () => {
    clearPreviousDayData()

    const currentUser = getCurrentUser()
    setUser(currentUser)

    const today = getTodayAsString()
    const todayPlayer = getPlayerForToday()
    setCurrentPlayer(todayPlayer)

    const savedState = localStorage.getItem("futfactos-jugador-game-state")
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        if (parsed.date === today) {
          setGuesses(parsed.guesses || [])
          setCurrentGuess(parsed.currentGuess || "")
          setCurrentRow(parsed.currentRow || 0)
          setGameWon(parsed.gameWon || false)
          setGameCompleted(parsed.gameCompleted || false)
          setPointsAwarded(parsed.pointsAwarded || false)
<<<<<<< HEAD
=======
          setPointsEarned(parsed.pointsEarned || 0)
>>>>>>> cdb9605 (juegos)
          setHasPlayed(parsed.hasPlayed || false)
          setLastGameWon(parsed.lastGameWon ?? null)
        } else {
          localStorage.removeItem("futfactos-jugador-game-state")
        }
      } catch (e) {
        console.error("❌ Error leyendo estado local:", e)
        localStorage.removeItem("futfactos-jugador-game-state")
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    initializeGame()
  }, [])

  // Guardar en localStorage cada vez que cambia algo relevante
  useEffect(() => {
    if (!currentPlayer || loading) return
    const today = getTodayAsString()
    const state = {
      date: today,
      guesses,
      currentGuess,
      currentRow,
      gameWon,
      gameCompleted,
      pointsAwarded,
<<<<<<< HEAD
=======
      pointsEarned,
>>>>>>> cdb9605 (juegos)
      hasPlayed,
      lastGameWon,
    }
    localStorage.setItem("futfactos-jugador-game-state", JSON.stringify(state))
<<<<<<< HEAD
  }, [guesses, currentGuess, currentRow, gameWon, gameCompleted, pointsAwarded, hasPlayed, lastGameWon, loading, currentPlayer])

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>
=======
  }, [guesses, currentGuess, currentRow, gameWon, gameCompleted, pointsAwarded, pointsEarned, hasPlayed, lastGameWon, loading, currentPlayer])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
>>>>>>> cdb9605 (juegos)
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
<<<<<<< HEAD
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">JUGADOR DEL DÍA</h2>
            <p className="text-gray-300 text-lg">Adiviná el apellido del jugador en 5 intentos</p>
            {!user && (
              <GuestWarningModal isOpen={showGuestWarning} onClose={handleCloseWarning} onLogin={handleLogin} />
            )}
          </div>
          {gameCompleted ? (
            <>
              <WordleGrid targetWord={currentPlayer!.apellido} guesses={guesses} currentGuess={currentGuess} currentRow={currentRow} maxGuesses={MAX_GUESSES} />
              <WordleKeyboard onKeyPress={handleKeyPress} guesses={guesses} targetWord={currentPlayer!.apellido} disabled={true} />
=======
        
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">JUGADOR DEL DÍA</h2>
            <p className="text-gray-300 text-lg mb-4">Adiviná el apellido del jugador en 5 intentos</p>
            
            {/* Sistema de puntos visible */}
            <div className="bg-gray-800/50 rounded-lg p-4 inline-block border border-gray-700">
              <h3 className="text-sm font-semibold text-orange-400 mb-3">🏆 Sistema de Puntos</h3>
              <div className="grid grid-cols-5 gap-3 text-xs">
                <div className="text-center">
                  <div className="bg-green-600 text-white px-2 py-1 rounded font-bold">50</div>
                  <div className="text-gray-300 mt-1">1er intento</div>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 text-white px-2 py-1 rounded font-bold">40</div>
                  <div className="text-gray-300 mt-1">2do intento</div>
                </div>
                <div className="text-center">
                  <div className="bg-purple-600 text-white px-2 py-1 rounded font-bold">30</div>
                  <div className="text-gray-300 mt-1">3er intento</div>
                </div>
                <div className="text-center">
                  <div className="bg-orange-600 text-white px-2 py-1 rounded font-bold">20</div>
                  <div className="text-gray-300 mt-1">4to intento</div>
                </div>
                <div className="text-center">
                  <div className="bg-red-600 text-white px-2 py-1 rounded font-bold">10</div>
                  <div className="text-gray-300 mt-1">5to intento</div>
                </div>
              </div>
            </div>

            {!user && (
              <GuestWarningModal 
                isOpen={showGuestWarning} 
                onClose={handleCloseWarning} 
                onLogin={handleLogin} 
              />
            )}
          </div>

          {gameCompleted ? (
            <>
              <WordleGrid 
                targetWord={currentPlayer!.apellido} 
                guesses={guesses} 
                currentGuess={currentGuess} 
                currentRow={currentRow} 
                maxGuesses={MAX_GUESSES} 
              />
              <WordleKeyboard 
                onKeyPress={handleKeyPress} 
                guesses={guesses} 
                targetWord={currentPlayer!.apellido} 
                disabled={true} 
              />
>>>>>>> cdb9605 (juegos)
              <WordleCompletedMessage 
                gameWon={gameWon} 
                targetWord={currentPlayer!.apellido} 
                playerName={currentPlayer!.nombre} 
                attempts={guesses.length} 
                maxAttempts={MAX_GUESSES} 
<<<<<<< HEAD
                pointsAwarded={pointsAwarded} 
=======
                pointsAwarded={pointsAwarded}
                pointsEarned={pointsEarned}
>>>>>>> cdb9605 (juegos)
                userLoggedIn={!!user}
                playerImageUrl={currentPlayer!.imageUrl}
              />
            </>
          ) : hasPlayed ? (
<<<<<<< HEAD
            <AlreadyPlayedMessage onPlayAgain={handlePlayAgain} gameType="jugador" playedToday={true} lastGameWon={lastGameWon} />
          ) : (
            <>
              <WordleGrid targetWord={currentPlayer!.apellido} guesses={guesses} currentGuess={currentGuess} currentRow={currentRow} maxGuesses={MAX_GUESSES} />
              <WordleKeyboard onKeyPress={handleKeyPress} guesses={guesses} targetWord={currentPlayer!.apellido} disabled={false} />
=======
            <AlreadyPlayedMessage 
              onPlayAgain={handlePlayAgain} 
              gameType="jugador" 
              playedToday={true} 
              lastGameWon={lastGameWon} 
            />
          ) : (
            <>
              <WordleGrid 
                targetWord={currentPlayer!.apellido} 
                guesses={guesses} 
                currentGuess={currentGuess} 
                currentRow={currentRow} 
                maxGuesses={MAX_GUESSES} 
              />
              <WordleKeyboard 
                onKeyPress={handleKeyPress} 
                guesses={guesses} 
                targetWord={currentPlayer!.apellido} 
                disabled={false} 
              />
>>>>>>> cdb9605 (juegos)
            </>
          )}
        </div>
      </main>
    </div>
  )
}