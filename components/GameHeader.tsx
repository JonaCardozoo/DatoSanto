"use client"

import Link from "next/link"
import { Trophy } from "lucide-react"
import AuthButton from "./AuthButton"

export default function GameHeader() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-b border-slate-700/50 shadow-2xl">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className=" w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:scale-110 transition-all duration-300 rounded-full bg-gradient-to-r from-red-600 to-red-600 group-hover:from-red-500 group-hover:to-red-500 flex items-center justify-center overflow-hidden">
              <img 
                src="/DATOSANTO.png" 
                alt="Logo de tu aplicación" 
                className="w-full h-full object-contain" 
              />
            </div>
            
            {/* Logo text - visible on larger screens */}
            <div className="hidden sm:block">
              <span className="text-sm sm:text-base md:text-lg font-bold text-white">
                DatoSanto
              </span>
            </div>
          </Link>

          {/* Navigation Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* Rankings Button */}
            <Link
              href="/rankings"
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 group"
            >
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-100 group-hover:text-white transition-colors flex-shrink-0" />
              <span className="text-white font-medium text-xs sm:text-sm md:text-base">
                <span className="hidden sm:inline">Rankings</span>
                <span className="sm:hidden">Top</span>
              </span>
            </Link>
            
            {/* Auth Button */}
            <div className="relative">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
      
      {/* Línea decorativa inferior */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
    </header>
  )
}