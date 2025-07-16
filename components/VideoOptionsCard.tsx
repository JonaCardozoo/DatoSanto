"use client"

import { memo } from "react"
import { Check, X, Lock } from "lucide-react"

interface VideoOptionsCardProps {
  opciones: string[]
  onAnswerSelect: (answerIndex: number) => void
  selectedAnswer: number | null
  showResults: boolean
  disabled: boolean
  correctAnswer: number
  canSelect: boolean
}

function VideoOptionsCard({
  opciones,
  onAnswerSelect,
  selectedAnswer,
  showResults,
  disabled,
  correctAnswer,
  canSelect,
}: VideoOptionsCardProps) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opciones.map((opcion, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === correctAnswer
          const isWrong = showResults && isSelected && !isCorrect

          let buttonClass =
            "w-full px-6 py-4 text-center rounded-md font-semibold transition-all duration-200 text-sm md:text-base "

          if (showResults) {
            if (isCorrect) {
              buttonClass += "bg-green-900 border-green-500 text-green-100 border-2"
            } else if (isWrong) {
              buttonClass += "bg-red-900 border-red-500 text-red-100 border-2"
            } else {
              buttonClass += "bg-gray-800 border-gray-600 text-gray-300 border-2"
            }
          } else if (disabled || !canSelect) {
            buttonClass +=
              "bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed border-2"
          } else {
            buttonClass +=
              "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-yellow-400 cursor-pointer hover:scale-[1.02] border-2"
          }

          return (
            <button
              key={index}
              onClick={() => canSelect && !disabled && onAnswerSelect(index)}
              disabled={disabled || !canSelect}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span>{opcion}</span>
                {!canSelect && !showResults && (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
                {showResults && (
                  <>
                    {isCorrect && <Check className="w-6 h-6 text-green-400" />}
                    {isWrong && <X className="w-6 h-6 text-red-400" />}
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 text-center">
        {!canSelect && !showResults && (
          <p className="text-gray-400 text-sm flex items-center justify-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>{disabled ? "Juego completado" : "Mirá el video para poder elegir"}</span>
          </p>
        )}
        {canSelect && !showResults && (
          <p className="text-yellow-400 text-sm animate-pulse mt-4">
            ⏰ Seleccioná tu respuesta para continuar
          </p>
        )}
      </div>
    </div>
  )
}

export default memo(VideoOptionsCard)
