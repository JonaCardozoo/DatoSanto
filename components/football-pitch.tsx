"use client"

import type React from "react"
import Image from "next/image"
import type { Player, PitchPosition } from "@/lib/data/players"
import { cn } from "@/lib/utils"

interface FootballPitchProps {
  guessedPlayers: { player: Player; assignedSlotId: string }[]
  currentFormation: PitchPosition[]
  showPlayerNames?: boolean
  flippingPlayer?: string | null
}

export default function FootballPitch({
  guessedPlayers,
  currentFormation,
  showPlayerNames = true,
  flippingPlayer = null,
}: FootballPitchProps) {
  return (
    <div className="relative w-full max-w-[500px] aspect-[5/6] bg-green-700 rounded-lg overflow-hidden shadow-lg border-4 border-white mx-auto my-4">
      {/* Field Lines */}
      <div className="absolute inset-0 border-2 border-white m-4 rounded-lg">
        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white" />
        {/* Center Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white" />
        {/* Penalty Boxes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-b-2 border-x-2 border-white" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-t-2 border-x-2 border-white" />
      </div>

      {/* Player Positions */}
      {currentFormation.map((pos) => {
        const playerAtSlot = guessedPlayers.find((gp) => gp.assignedSlotId === pos.id)
        const isFlipping = flippingPlayer === pos.id

        return (
          <div
            key={pos.id}
            className={cn(
              "absolute flex flex-col items-center justify-center w-[17%] h-[14%] rounded-full border-2",
              "transform -translate-x-1/2 -translate-y-1/2",
              "border-red-500 bg-red-500/20 shadow-lg",
              pos.type === "coach" ? "right-0 top-0 translate-x-1/2 -translate-y-1/2" : "",
            )}
            style={{ top: pos.top, left: pos.left }}
          >
            {/* Si hay jugador Y está flippeando, mostrar la animación */}
            {playerAtSlot && isFlipping ? (
              <div className="relative w-full h-full transition-transform duration-600 transform-style-preserve-3d rotate-y-180">
                {/* Cara frontal (vacía) */}
                <div className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center">
                  <UserIcon className="w-10 h-10 text-red-500" />
                  <span className="text-white text-xs font-bold mt-1">{pos.label}</span>
                </div>

                {/* Cara trasera (con jugador) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={playerAtSlot.player.image || "/placeholder.svg"}
                      alt={playerAtSlot.player.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover w-full h-full"
                    />
                    {showPlayerNames && (
                      <span className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 text-white text-xs font-bold whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                        {playerAtSlot.player.name.split(" ").pop()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : playerAtSlot ? (
              /* Si hay jugador pero NO está flippeando, mostrar directamente */
              <div className="relative w-full h-full">
                <Image
                  src={playerAtSlot.player.image || "/placeholder.svg"}
                  alt={playerAtSlot.player.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-full h-full"
                />
                {showPlayerNames && (
                  <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 text-white text-xs font-bold whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                    {playerAtSlot.player.name.split(" ").pop()}
                  </span>
                )}
              </div>
            ) : (
              /* Si NO hay jugador, mostrar vacío */
              <>
                <UserIcon className="w-10 h-10 text-red-500" />
                <span className="text-white text-xs font-bold mt-1">{pos.label}</span>
              </>
            )}
          </div>
        )
      })}

      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
