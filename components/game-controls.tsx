"use client"

import React from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"
import { players } from "@/lib/data/players"

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
  const [filteredPlayers, setFilteredPlayers] = React.useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  // Sincronizar el input con el nombre de la pista cuando cambia
  React.useEffect(() => {
    if (hintedPlayerName) {
      setPlayerName(hintedPlayerName)
      setShowSuggestions(false) // Ocultar sugerencias cuando se muestra una pista
    }
  }, [hintedPlayerName])

  React.useEffect(() => {
    const query = playerName.trim()

    // Solo mostrar sugerencias si showSuggestions es true y hay 3+ caracteres
    if (showSuggestions && query.length >= 3) {
      const filtered = players
        .filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase())
        )
        .map(p => p.name)
      setFilteredPlayers([...new Set(filtered)])
    } else {
      setFilteredPlayers([])
    }
  }, [playerName, showSuggestions])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value)
    setShowSuggestions(true) // Mostrar sugerencias cuando el usuario escribe
  }

  const handleSelectPlayer = (name: string) => {
    setPlayerName(name)
    setShowSuggestions(false) // Ocultar sugerencias inmediatamente
    setFilteredPlayers([]) // Limpiar la lista por si acaso
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerName.trim() && !disabled) {
      onGuess(playerName.trim())
      setPlayerName("")
      setShowSuggestions(false)
    }
  }

  const handleInputFocus = () => {
    if (playerName.length >= 3) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Pequeño delay para permitir que el click en la sugerencia se ejecute
    setTimeout(() => {
      setShowSuggestions(false)
    }, 150)
  }

  const remainingHints = maxHints - hintsUsed

   return (
    <div
      className={`flex flex-col items-center space-y-6 p-6 bg-white rounded-lg shadow-md ${disabled ? "opacity-50" : ""}`}
    >
      {/* Club logo y nombre */}
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

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 w-full max-w-sm relative">
        <Input
          type="text"
          placeholder="APELLIDO DEL JUGADOR"
          value={playerName}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
          aria-label="Apellido del jugador"
          disabled={disabled}
        />

        {/* Lista de sugerencias */}
        {showSuggestions && filteredPlayers.length > 0 && (
          <ul className="absolute top-7 left-0 w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto z-10 shadow-lg">
            {filteredPlayers.map((name, i) => (
              <li
                key={i}
                onMouseDown={() => handleSelectPlayer(name)} // Usar onMouseDown en lugar de onClick
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-black"
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      
        {/* Botones */}
        <div className="grid grid-cols-1 gap-3 w-full">
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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

      {/* Mensaje */}
      {message && (
        <p className="text-center text-lg font-medium text-gray-700 mt-4" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  )
}