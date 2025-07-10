"use client"

import Link from "next/link"
import { Trophy } from "lucide-react"
import AuthButton from "./AuthButton"

export default function GameHeader() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-b border-slate-700/50 shadow-2xl">
  <div className="container mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      {/* Logo Section */}
      <Link href="/" className="flex items-center space-x-3 group">

          <div className="w-12 h-12 hover:scale-110 transition-all duration-300 rounded-full bg-gradient-to-r from-red-600 to-red-600 group-hover:from-red-500 group-hover:to-red-500">
            <img src="/DATOSANTO.png" alt="Logo de tu aplicación" className="w-50 h-50 object-contain" />
          </div>
          
        
        {/* Si quieres agregar texto del logo, descomenta esto:
        <div className="hidden md:block">
          <span className="text-xl font-bold text-white">TuMarca</span>
        </div>
        */}
      </Link>

      {/* Navigation Section */}
      <div className="flex items-center space-x-4">
        <Link
          href="/rankings"
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 group"
        >
          <Trophy className="w-5 h-5 text-yellow-100 group-hover:text-white transition-colors" />
          <span className="hidden md:inline text-white font-medium">Rankings</span>
        </Link>
        
        <div className="relative">
          <AuthButton />
        </div>
      </div>
    </div>
  </div>
  
  {/* Opcional: línea decorativa inferior */}
  <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
</header>
  )
}
