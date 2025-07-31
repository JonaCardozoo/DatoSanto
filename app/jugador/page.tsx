"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import GameHeader from "@/components/GameHeader"
import WordleGrid from "@/components/WordleGrid"
import WordleKeyboard from "@/components/WordleKeyboard"
import WordleCompletedMessage from "@/components/WordleCompletedMessage"
import AlreadyPlayedMessage from "@/components/AlreadyPlayedMessage"
import GuestWarningModal from "@/components/GuestWarningModal"

import { getTodayAsString, clearPreviousDayData } from "@/utils/dateUtils"
import { getPlayerForToday } from "@/lib/data/jugadoresDelDia"
import { awardPoints, markAsPlayedToday, hasPlayedToday } from "@/utils/gameUtils"
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
  const [pointsEarned, setPointsEarned] = useState(0)
  const [showGuestWarning, setShowGuestWarning] = useState(false)

  const MAX_GUESSES = 5
  const router = useRouter()

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
      let earnedPoints = 0

      if (won && user) {
        earnedPoints = calculatePoints(newGuesses.length)
        awarded = await awardPoints("jugador", earnedPoints)
        setPointsAwarded(awarded)
        setPointsEarned(earnedPoints)
      }

      await markAsPlayedToday("jugador", won, {
        guesses: newGuesses,
        currentGuess: "",
        currentRow: newGuesses.length,
        gameWon: won,
        gameCompleted: true,
        pointsAwarded: awarded,
        pointsEarned: earnedPoints,
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
          setPointsEarned(parsed.pointsEarned || 0)
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
      pointsEarned,
      hasPlayed,
      lastGameWon,
    }
    localStorage.setItem("futfactos-jugador-game-state", JSON.stringify(state))
  }, [guesses, currentGuess, currentRow, gameWon, gameCompleted, pointsAwarded, pointsEarned, hasPlayed, lastGameWon, loading, currentPlayer])

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

        <div className="text-center mb-8">
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
            <WordleCompletedMessage
              gameWon={gameWon}
              targetWord={currentPlayer!.apellido}
              playerName={currentPlayer!.nombre}
              attempts={guesses.length}
              maxAttempts={MAX_GUESSES}
              pointsAwarded={pointsAwarded}
              pointsEarned={pointsEarned}
              userLoggedIn={!!user}
              playerImageUrl={currentPlayer!.imageUrl}
              
            />
          </>
        ) : hasPlayed ? (
          <AlreadyPlayedMessage onPlayAgain={handlePlayAgain} gameType="jugador" playedToday={true} lastGameWon={lastGameWon} />
        ) : (
          <>
            <WordleGrid targetWord={currentPlayer!.apellido} guesses={guesses} currentGuess={currentGuess} currentRow={currentRow} maxGuesses={MAX_GUESSES} />
            <WordleKeyboard onKeyPress={handleKeyPress} guesses={guesses} targetWord={currentPlayer!.apellido} disabled={false} />
          </>
        )}
      </main>
    </div>
  )
}
