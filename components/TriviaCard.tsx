"use client"

import { memo } from "react"
import { Check, X } from "lucide-react"
import type { Trivia } from "@/lib/data/triviasDelDia"

interface TriviaCardProps {
  trivia: Trivia
  onAnswerSelect: (answerIndex: number) => void
  selectedAnswer: number | null
  showResults: boolean
  disabled: boolean
}

function TriviaCard({ trivia, onAnswerSelect, selectedAnswer, showResults, disabled }: TriviaCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 md:p-8 border border-gray-700 shadow-2xl">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-6 leading-relaxed">{trivia.pregunta}</h3>

      <div className="space-y-3">
        {trivia.opciones.map((opcion, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === trivia.respuestaCorrecta
          const isWrong = showResults && isSelected && !isCorrect

          let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-medium "

          if (disabled) {
            if (isCorrect && showResults) {
              buttonClass += "bg-green-900 border-green-500 text-green-100"
            } else if (isWrong) {
              buttonClass += "bg-red-900 border-red-500 text-red-100"
            } else {
              buttonClass += "bg-gray-800 border-gray-600 text-gray-300"
            }
          } else {
            buttonClass += "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-red-500"
          }

          return (
            <button
              key={index}
              onClick={() => !disabled && onAnswerSelect(index)}
              disabled={disabled}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="text-base md:text-lg">{opcion}</span>
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
            </button>
          )
        })}
      </div>

      {!showResults && !disabled && <p className="text-gray-400 text-center mt-6 text-sm">Seleccioná tu respuesta</p>}
    </div>
  )
}

export default memo(TriviaCard)
