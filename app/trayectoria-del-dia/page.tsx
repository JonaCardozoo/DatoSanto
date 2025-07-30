"use client"

import { useState, useEffect } from "react"
import PlayerTimeline from "../../components/player-timeline"
import GuessArea from "../../components/guess-area"
import { type Player, getRandomPlayer } from "@/lib/data/football-players"
import { GAME_TYPES } from "@/utils/dateUtils" // Assuming GameType is defined here
import { markAsPlayedToday, awardPoints, hasPlayedToday } from "@/utils/gameUtils"
import { useToast } from "@/hooks/use-toast" // Assuming useToast exists

const GAME_TYPE = GAME_TYPES.TRAYECTORIA
const MAX_HINTS = 2
const MAX_REVEAL_CLUBS = 1

export default function WhoIsItGame() {
  const { toast } = useToast()
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [revealedClubs, setRevealedClubs] = useState<string[]>([])
  const [hintsUsed, setHintsUsed] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)

  useEffect(() => {
    // Check if already played today
    if (hasPlayedToday(GAME_TYPE)) {
      setGameCompleted(true)
      toast({
        title: "Juego completado",
        description: "Ya has jugado hoy. Vuelve mañana para un nuevo desafío.",
      })
      return
    }

    // Select a random player for the day
    // In a real app, you might fetch a daily player from a backend
    setCurrentPlayer(getRandomPlayer())
  }, [toast])

  const hintsRemaining = MAX_HINTS - hintsUsed
  const revealClubRemaining = MAX_REVEAL_CLUBS - (revealedClubs.length > 0 ? 1 : 0)

  const handleGuess = async (guess: string) => {
    if (!currentPlayer) return

    const normalizedGuess = guess.toLowerCase().trim()
    const normalizedAnswer = currentPlayer.answer.toLowerCase().trim()

    if (normalizedGuess === normalizedAnswer) {
      setGameWon(true)
      setGameCompleted(true)
      toast({
        title: "¡Felicidades!",
        description: `¡Has adivinado! Es ${currentPlayer.name}.`,
        variant: "default",
      })
      await markAsPlayedToday(GAME_TYPE, true, { player: currentPlayer.id })
      await awardPoints(GAME_TYPE, 20) // Award 20 points for winning
    } else {
      toast({
        title: "Intento fallido",
        description: "Esa no es la respuesta correcta. ¡Sigue intentando!",
        variant: "destructive",
      })
    }
  }

  const handleSurrender = async () => {
    if (!currentPlayer) return
    setGameWon(false)
    setGameCompleted(true)
    toast({
      title: "Te has rendido",
      description: `El jugador era ${currentPlayer.name}. ¡Mejor suerte la próxima!`,
      variant: "destructive",
    })
    await markAsPlayedToday(GAME_TYPE, false, { player: currentPlayer.id })
  }

  const handleHint = () => {
    if (!currentPlayer || hintsUsed >= MAX_HINTS) return

    const nextHint = currentPlayer.hints[currentHintIndex]
    if (nextHint) {
      toast({
        title: "Pista",
        description: nextHint,
        variant: "default",
      })
      setHintsUsed(hintsUsed + 1)
      setCurrentHintIndex(currentHintIndex + 1)
    } else {
      toast({
        title: "No hay más pistas",
        description: "Has usado todas las pistas disponibles.",
        variant: "warning",
      })
    }
  }

  const handleRevealClub = () => {
    if (!currentPlayer || revealedClubs.length >= MAX_REVEAL_CLUBS) return

    const unrevealedClubs = currentPlayer.clubs.filter((club) => !revealedClubs.includes(club.name))

    if (unrevealedClubs.length > 0) {
      const clubToReveal = unrevealedClubs[0] // Reveal the first unrevealed club
      setRevealedClubs([...revealedClubs, clubToReveal.name])
      toast({
        title: "Club revelado",
        description: `El jugador jugó en: ${clubToReveal.name}`,
        variant: "default",
      })
    } else {
      toast({
        title: "No hay más clubes para revelar",
        description: "Todos los clubes han sido revelados o no hay más disponibles.",
        variant: "warning",
      })
    }
  }

  if (!currentPlayer) {
    return <div className="flex items-center justify-center min-h-screen">Cargando jugador...</div>
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="lg:w-1/2 flex justify-center p-4">
        <PlayerTimeline
          debutYear={currentPlayer.debutYear}
          retirementYear={currentPlayer.retirementYear}
          clubs={currentPlayer.clubs}
          revealedClubs={revealedClubs}
        />
      </div>
      <div className="lg:w-1/2 flex justify-center p-4">
        <GuessArea
          playerImage={currentPlayer.image}
          onGuess={handleGuess}
          onSurrender={handleSurrender}
          onHint={handleHint}
          onRevealClub={handleRevealClub}
          hintsRemaining={hintsRemaining}
          revealClubRemaining={revealClubRemaining}
          gameCompleted={gameCompleted}
        />
      </div>
    </div>
  )
}
