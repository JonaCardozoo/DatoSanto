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
    const baseClass = "px-2 py-3 rounded font-bold text-sm transition-colors duration-200 "

    if (key === "ENTER" || key === "DEL") {
      return baseClass + "bg-gray-600 hover:bg-gray-500 text-white px-4"
    }

    switch (status) {
      case "correct":
        return baseClass + "bg-green-600 text-white"
      case "present":
        return baseClass + "bg-yellow-600 text-white"
      case "absent":
        return baseClass + "bg-gray-600 text-gray-300"
      default:
        return baseClass + "bg-gray-700 hover:bg-gray-600 text-white"
    }
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => !disabled && onKeyPress(key)}
              disabled={disabled}
              className={getKeyClass(key) + (disabled ? " opacity-60 cursor-not-allowed" : " cursor-pointer")}
            >
              {key === "DEL" ? <Delete className="w-4 h-4" /> : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default memo(WordleKeyboard)