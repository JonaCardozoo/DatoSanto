"use client"

import { memo } from "react"

interface WordleGridProps {
  targetWord: string
  guesses: string[]
  currentGuess: string
  currentRow: number
  maxGuesses: number
}

function WordleGrid({ targetWord, guesses, currentGuess, currentRow, maxGuesses }: WordleGridProps) {
  const getLetterStatus = (letter: string, position: number, guess: string) => {
    const targetUpper = targetWord.toUpperCase()
    const guessUpper = guess.toUpperCase()
    const letterUpper = letter.toUpperCase()

    if (targetUpper[position] === letterUpper) {
      return "correct"
    } else if (targetUpper.includes(letterUpper)) {
      return "present"
    } else {
      return "absent"
    }
  }

  const getCellClass = (status: string, hasLetter: boolean) => {
    const baseClass =
      "w-12 h-12 md:w-14 md:h-14 border-2 rounded flex items-center justify-center font-bold text-lg md:text-xl transition-all duration-200 "

    switch (status) {
      case "correct":
        return baseClass + "bg-green-600 border-green-500 text-white"
      case "present":
        return baseClass + "bg-yellow-600 border-yellow-500 text-white"
      case "absent":
        return baseClass + "bg-gray-600 border-gray-500 text-white"
      default:
        // Para la fila actual, resaltar si tiene letra
        if (hasLetter) {
          return baseClass + "bg-gray-700 border-gray-500 text-white scale-105"
        }
        return baseClass + "bg-gray-800 border-gray-600 text-white"
    }
  }

  return (
    <div className="flex justify-center">
      <div className="grid gap-2" style={{ gridTemplateRows: `repeat(${maxGuesses}, 1fr)` }}>
        {Array.from({ length: maxGuesses }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {Array.from({ length: targetWord.length }).map((_, colIndex) => {
              let letter = ""
              let status = ""
              let hasLetter = false

              if (rowIndex < guesses.length) {
                // Fila completada
                letter = guesses[rowIndex][colIndex] || ""
                status = getLetterStatus(letter, colIndex, guesses[rowIndex])
              } else if (rowIndex === currentRow) {
                // Fila actual
                letter = currentGuess[colIndex] || ""
                hasLetter = !!letter
                status = ""
              }

              return (
                <div key={colIndex} className={getCellClass(status, hasLetter)}>
                  {letter}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(WordleGrid)
