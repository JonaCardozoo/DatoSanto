"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"

interface GuessAreaProps {
  playerImage: string
  onGuess: (guess: string) => void
  onSurrender: () => void
  onHint: () => void
  onRevealClub: () => void
  hintsRemaining: number
  revealClubRemaining: number
  gameCompleted: boolean
}

export default function GuessArea({
  playerImage,
  onGuess,
  onSurrender,
  onHint,
  onRevealClub,
  hintsRemaining,
  revealClubRemaining,
  gameCompleted,
}: GuessAreaProps) {
  const [guess, setGuess] = useState("")

  const handleGuess = () => {
    if (guess.trim()) {
      onGuess(guess)
      setGuess("") // Clear input after guess
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGuess()
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-64 h-64 border-2 border-riverPlateRed flex flex-col items-center justify-center bg-white relative">
        <Image
          src={playerImage || "/placeholder.svg"}
          alt="Player to guess"
          width={200}
          height={200}
          className="object-contain"
        />
        <span className="absolute bottom-2 text-riverPlateRed font-bold text-lg">¿QUIÉN ES?</span>
      </div>

      {/* No lives section as per user request */}

      <div className="mt-8 w-full max-w-sm">
        <Input
          type="text"
          placeholder="INGRESA EL APELLIDO O NOMBRE COMPLETO"
          className="w-full text-center border-riverPlateRed focus:border-riverPlateRed focus:ring-riverPlateRed"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={gameCompleted}
        />
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button
            className="bg-riverPlateRed hover:bg-riverPlateRed/90 text-white font-bold"
            onClick={handleGuess}
            disabled={gameCompleted}
          >
            INTENTAR
          </Button>
          <Button
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold"
            onClick={onSurrender}
            disabled={gameCompleted}
          >
            RENDIRSE
          </Button>
          <Button
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold"
            onClick={onHint}
            disabled={hintsRemaining === 0 || gameCompleted}
          >
            PISTA ({hintsRemaining})
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold"
            onClick={onRevealClub}
            disabled={revealClubRemaining === 0 || gameCompleted}
          >
            REVELAR CLUB ({revealClubRemaining})
          </Button>
        </div>
      </div>
    </div>
  )
}
