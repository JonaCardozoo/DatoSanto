"use client"

import React from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"

interface GameControlsProps {
  onGuess: (playerName: string) => void
  onGiveUp: () => void
  onShowHint: () => void
  message: string
  currentClubName: string
  currentClubLogo: string
  hintedPlayerName: string
  isHintButtonDisabled: boolean
  disabled?: boolean
  hintsUsed: number
  maxHints: number
}

export default function GameControls({
  onGuess,
  onGiveUp,
  onShowHint,
  message,
  currentClubName,
  currentClubLogo,
  hintedPlayerName,
  isHintButtonDisabled,
  disabled = false,
  hintsUsed,
  maxHints,
}: GameControlsProps) {
  const [playerName, setPlayerName] = React.useState("")

  // Sincronizar el input con el nombre de la pista cuando cambia
  React.useEffect(() => {
    if (hintedPlayerName) {
      setPlayerName(hintedPlayerName)
    }
  }, [hintedPlayerName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerName.trim() && !disabled) {
      onGuess(playerName.trim())
      setPlayerName("") // Clear input after guess
    }
  }

  const remainingHints = maxHints - hintsUsed

  return (
    <div
      className={`flex flex-col items-center space-y-6 p-6 bg-white rounded-lg shadow-md ${disabled ? "opacity-50" : ""}`}
    >
      <div className="flex flex-col items-center space-y-2">
        <Image
          src={currentClubLogo || "/placeholder.svg"}
          alt={`${currentClubName} Logo`}
          width={80}
          height={80}
          className="object-contain"
        />
        <h2 className="text-2xl font-bold text-red-600 uppercase">{currentClubName}</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 w-full max-w-sm">
        <Input
          type="text"
          placeholder="APELLIDO DEL JUGADOR"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
          aria-label="Apellido del jugador"
          disabled={disabled}
        />
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            disabled={disabled}
          >
            ENVIAR
          </Button>
          <Button
            type="button"
            onClick={onGiveUp}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold py-2 px-4 rounded bg-transparent"
            disabled={disabled}
          >
            RENDIRSE
          </Button>
          <Button
            type="button"
            onClick={onShowHint}
            disabled={isHintButtonDisabled || disabled}
            variant="outline"
            className={`col-span-2 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold py-2 px-4 rounded bg-transparent flex items-center justify-center space-x-2 ${
              isHintButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>{hintsUsed >= maxHints ? "SIN PISTAS" : `MOSTRAR PISTA (${remainingHints})`}</span>
          </Button>
        </div>
      </form>

      {message && (
        <p className="text-center text-lg font-medium text-gray-700 mt-4" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  )
}
