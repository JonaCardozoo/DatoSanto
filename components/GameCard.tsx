"use client"

import { memo } from "react"
import { type LucideIcon, ArrowRight, Lock } from "lucide-react"
import Link from "next/link"

interface Game {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  href: string
  difficulty: string
  disabled?: boolean
}

interface GameCardProps {
  game: Game
}

function GameCard({ game }: GameCardProps) {
  const CardContent = (
    <div
      className={`relative overflow-hidden rounded-xl p-6 h-full border-2 transition-all duration-200 ${
        game.disabled
          ? "border-gray-700 bg-gray-900 cursor-not-allowed opacity-60"
          : "border-gray-600 bg-gradient-to-br hover:border-red-500 cursor-pointer hover:scale-[1.02] hover:-translate-y-1"
      } ${game.color}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-black/30 rounded-lg backdrop-blur-sm">
            {game.disabled ? <Lock className="w-8 h-8 text-gray-400" /> : <game.icon className="w-8 h-8 text-white" />}
          </div>
          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                game.disabled
                  ? "bg-gray-700 text-gray-400"
                  : game.difficulty === "Fácil"
                    ? "bg-green-500/20 text-green-300"
                    : game.difficulty === "Intermedio"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : game.difficulty === "Difícil"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-gray-500/20 text-gray-300"
              }`}
            >
              {game.difficulty}
            </span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-3">{game.title}</h3>
          <p className="text-gray-200 text-base leading-relaxed">{game.description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
          <span className="text-sm text-gray-300">{game.disabled ? "Próximamente" : "Disponible ahora"}</span>
          {!game.disabled && (
            <div className="flex items-center text-white transition-colors">
              <span className="text-sm font-medium mr-2">Jugar</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (game.disabled) {
    return <div>{CardContent}</div>
  }

  return (
    <Link href={game.href} className="block">
      {CardContent}
    </Link>
  )
}

export default memo(GameCard)
