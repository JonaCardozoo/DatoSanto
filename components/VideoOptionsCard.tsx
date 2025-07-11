"use client"

import { memo } from "react"
import { Check, X, Play, Lock } from "lucide-react"

interface VideoOptionsCardProps {
  pregunta: string
  opciones: string[]
  onAnswerSelect: (answerIndex: number) => void
  selectedAnswer: number | null
  showResults: boolean
  disabled: boolean
  correctAnswer: number
  canSelect: boolean
}

function VideoOptionsCard({
  pregunta,
  opciones,
  onAnswerSelect,
  selectedAnswer,
  showResults,
  disabled,
  correctAnswer,
  canSelect,
}: VideoOptionsCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 md:p-8 border border-gray-700 shadow-2xl">
      <div className="flex items-start space-x-3 mb-6">
        <Play className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
        <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">{pregunta}</h3>
      </div>

      <div className="space-y-3">
        {opciones.map((opcion, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === correctAnswer
          const isWrong = showResults && isSelected && !isCorrect

          let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-medium relative "

          if (showResults) {
            if (isCorrect) {
              buttonClass += "bg-green-900 border-green-500 text-green-100"
            } else if (isWrong) {
              buttonClass += "bg-red-900 border-red-500 text-red-100"
            } else {
              buttonClass += "bg-gray-800 border-gray-600 text-gray-300"
            }
          } else if (disabled || !canSelect) {
            buttonClass += "bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed"
          } else {
            buttonClass +=
              "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-red-500 cursor-pointer hover:scale-[1.02]"
          }

          return (
            <button
              key={index}
              onClick={() => canSelect && !disabled && onAnswerSelect(index)}
              disabled={disabled || !canSelect}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="text-base md:text-lg">{opcion}</span>
                <div className="flex items-center space-x-2">
                  {!canSelect && !showResults && <Lock className="w-5 h-5 text-gray-500" />}
                  {showResults && (
                    <div>
                      {isCorrect ? (
                        <Check className="w-6 h-6 text-green-400" />
                      ) : isWrong ? (
                        <X className="w-6 h-6 text-red-400" />
                      ) : null}
                    </div>
                  )}
                </div>
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
          <p className="text-yellow-400 text-sm animate-pulse">
            ⏰ Seleccioná tu respuesta para continuar viendo el video
          </p>
        )}
      </div>
    </div>
  )
}

export default memo(VideoOptionsCard)
