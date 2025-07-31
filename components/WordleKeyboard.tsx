"use client"

import { memo } from "react"
import { Delete } from "lucide-react"

interface WordleKeyboardProps {
  onKeyPress: (key: string) => void
  guesses: string[]
  targetWord: string
  disabled: boolean
}

function WordleKeyboard({ onKeyPress, guesses, targetWord, disabled }: WordleKeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"],
  ]

  const getKeyStatus = (key: string) => {
    if (key === "ENTER" || key === "DEL") return ""

    const targetUpper = targetWord.toUpperCase()
    let status = ""

    for (const guess of guesses) {
      const guessUpper = guess.toUpperCase()
      const keyIndex = guessUpper.indexOf(key)

      if (keyIndex !== -1) {
        if (targetUpper[keyIndex] === key) {
          status = "correct"
          break
        } else if (targetUpper.includes(key)) {
          status = "present"
        } else {
          status = "absent"
        }
      }
    }

    return status
  }

  const getKeyClass = (key: string) => {
    const status = getKeyStatus(key)
    const baseClass =
      "rounded font-bold transition-colors duration-200 " +
      "text-xs sm:text-sm md:text-base " +       
      "px-3 py-2 sm:px-4 sm:py-3 md:px-3 md:py-4 " 

    if (key === "ENTER" || key === "DEL") {
      return baseClass + " bg-gray-600 hover:bg-gray-500 text-white"
    }

    switch (status) {
      case "correct":
        return baseClass + " bg-green-600 text-white"
      case "present":
        return baseClass + " bg-yellow-600 text-white"
      case "absent":
        return baseClass + " bg-gray-600 text-gray-300"
      default:
        return baseClass + " bg-gray-700 hover:bg-gray-600 text-white"
    }
  }

  return (
    <div className="flex flex-col items-center space-y-1 sm:space-y-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-1 sm:space-x-2">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => !disabled && onKeyPress(key)}
              disabled={disabled}
              className={getKeyClass(key) + (disabled ? " opacity-60 cursor-not-allowed" : " cursor-pointer")}
            >
              {key === "DEL" ? <Delete className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default memo(WordleKeyboard)
