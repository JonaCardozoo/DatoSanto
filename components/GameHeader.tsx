"use client"

import Link from "next/link"
import { Trophy } from "lucide-react"
import AuthButton from "./AuthButton"

export default function GameHeader() {
  return (
    <header className="sticky top-0 z-50 bg-black border-b-2 border-red-600 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex-1">
            <h1
              className="text-4xl md:text-5xl font-black text-center text-red-600 tracking-wider"
              style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
            >
              FUTFACTOS
            </h1>
            <p className="text-center text-white text-sm md:text-base mt-2 font-semibold tracking-wide">
              LA TRIVIA DIARIA DEL FÚTBOL ARGENTINO
            </p>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/rankings"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="hidden md:inline text-white">Rankings</span>
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  )
}
