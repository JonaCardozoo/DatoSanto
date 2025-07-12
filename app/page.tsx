"use client"
import GameHeader from "@/components/GameHeader"
import GameCard from "@/components/GameCard"
import { Brain, User, Trophy, Target, Play } from "lucide-react"
import { Poppins } from 'next/font/google'


const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'] 
})

const games = [
  {
    id: "trivia",
    title: "Trivia del Día",
    description: "Ponete a prueba con preguntas sobre Patronato",
    icon: Brain,
    color: "from-red-600 to-red-800",
    href: "/trivia",
    difficulty: "Intermedio",
  },
  {
    id: "jugador",
    title: "Jugador del Día",
    description: "Adiviná el apellido del jugador en 5 intentos",
    icon: User,
    color: "from-blue-600 to-blue-800",
    href: "/jugador",
    difficulty: "Difícil",
  },
  {
    id: "video",
    title: "Video del Día",
    description: "Mirá el video y adiviná de qué se trata",
    icon: Play,
    color: "from-purple-600 to-purple-800",
    href: "/video",
    difficulty: "Fácil",
  }, 
  {
    id: "proximo1",
    title: "Próximamente",
    description: "Nuevo juego en desarrollo",
    icon: Trophy,
    color: "from-gray-600 to-gray-800",
    href: "#",
    difficulty: "Pronto",
    disabled: true,
  },
  {
    id: "proximo2",
    title: "Próximamente",
    description: "Otro juego increíble viene en camino",
    icon: Target,
    color: "from-gray-600 to-gray-800",
    href: "#",
    difficulty: "Pronto",
    disabled: true,
  },
]

export default function Home() {
  return (
    <div className={`${poppins.className} min-h-screen bg-black text-white`}>
      <GameHeader />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className={`${poppins.className} text-4xl md:text-5xl font-bold text-white mb-4`}>
              ELEGÍ TU <span className="text-red-600">DESAFÍO</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Demostrá tu conocimiento del más grande de Entre Ríos con nuestros juegos diarios
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>


        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 DatoSanto - Juegos diarios sobre la historia del Patrón</p>
          <p className="text-sm text-gray-500 mt-2">Desarrollado por: <a href="https://x.com/JonaCardozo185" className="text-gray-400 hover:underline">Jonatan Cardozo</a></p>
        </div>
      </footer>
    </div>
  )
}
