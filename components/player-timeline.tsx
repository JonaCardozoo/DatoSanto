import Image from "next/image"
import type { Club } from "@/lib/data/football-players"

interface PlayerTimelineProps {
  debutYear: number
  retirementYear: number
  clubs: Club[]
  revealedClubs: string[]
}

export default function PlayerTimeline({ debutYear, retirementYear, clubs, revealedClubs }: PlayerTimelineProps) {
  const totalClubs = clubs.length
  const maxVisibleClubs = 3 // Adjust based on desired layout, screenshot shows 3-4 circles

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex flex-col items-center">
        {/* Debut */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-riverPlateRed" />
          <span className="text-riverPlateRed font-bold text-sm">DEBUT = {debutYear}</span>
        </div>
        <div className="w-0.5 h-8 bg-riverPlateRed my-1" /> {/* Vertical line */}
        {/* Clubs */}
        {clubs.slice(0, maxVisibleClubs).map((club, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-riverPlateRed my-1" /> {/* Vertical line */}
            <div className="relative w-16 h-16 rounded-full border-2 border-riverPlateRed flex items-center justify-center bg-white overflow-hidden">
              {revealedClubs.includes(club.name) && club.logo ? (
                <Image
                  src={club.logo || "/placeholder.svg"}
                  alt={`${club.name} logo`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : revealedClubs.includes(club.name) ? (
                <span className="text-xs text-center font-semibold text-gray-700 p-1">{club.name}</span>
              ) : (
                <span className="text-2xl text-riverPlateRed font-bold">?</span>
              )}
            </div>
            {index < maxVisibleClubs - 1 && <div className="w-0.5 h-8 bg-riverPlateRed my-1" />}
          </div>
        ))}
        {totalClubs > maxVisibleClubs && (
          <>
            <div className="w-0.5 h-8 bg-riverPlateRed my-1" />
            <div className="w-16 h-16 rounded-full border-2 border-riverPlateRed flex items-center justify-center bg-white">
              <span className="text-2xl text-riverPlateRed font-bold">...</span>
            </div>
          </>
        )}
        <div className="w-0.5 h-8 bg-riverPlateRed my-1" /> {/* Vertical line */}
        {/* Retirement */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-riverPlateRed" />
          <span className="text-riverPlateRed font-bold text-sm">RETIRO = {retirementYear}</span>
        </div>
      </div>
    </div>
  )
}
