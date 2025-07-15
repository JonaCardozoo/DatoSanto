"use client"

import { motion } from "framer-motion"
import { Clock, Calendar } from "lucide-react"
import { canPlayAgain, GameType } from "@/utils/dateUtils"

interface AlreadyPlayedMessageProps {
  onPlayAgain: () => void
  gameType: GameType
  playedToday: boolean
  lastGameWon: boolean | null
}

export default function AlreadyPlayedMessage({ onPlayAgain, gameType }: AlreadyPlayedMessageProps) {
  const canPlay = canPlayAgain(gameType)

  if (canPlay) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-green-900/30 border-2 border-green-500 rounded-xl p-6 md:p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="flex justify-center mb-4"
        >
          <Calendar className="w-16 h-16 text-green-400" />
        </motion.div>

        <h3 className="text-2xl md:text-3xl font-bold text-green-100 mb-4">¡Nuevo desafío disponible!</h3>

        <p className="text-green-200 text-lg mb-6">Ya pasó un día desde tu última partida. ¡Podés jugar de nuevo!</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg transition-colors"
        >
          ¡Jugar Nuevo Desafío!
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 border-2 border-gray-600 rounded-xl p-6 md:p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        className="flex justify-center mb-4"
      >
        <Clock className="w-16 h-16 text-red-400" />
      </motion.div>

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ya jugaste hoy</h3>

      <p className="text-gray-300 text-lg mb-2">Volvé mañana a las 00:00 para un nuevo desafío</p>

      <p className="text-gray-400 text-base">¡Gracias por jugar DatoSanto!</p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6 pt-6 border-t border-gray-700"
      >
        <p className="text-sm text-gray-500">Mientras tanto, podés probar otros juegos ⚽</p>
      </motion.div>
    </motion.div>
  )
}
