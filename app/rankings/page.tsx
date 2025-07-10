"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Trophy, Medal, Award, ChevronLeft, ChevronRight } from "lucide-react"
import GameHeader from "@/components/GameHeader"
import { getSupabaseClient } from "@/utils/supabase-browser"

interface RankingUser {
  id: string
  username: string
  points: number
  games_won: number
  position: number
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankingUser[]>([])
  const [currentUser, setCurrentUser] = useState<RankingUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)

  const supabase = getSupabaseClient()
  const USERS_PER_PAGE = 10

  useEffect(() => {
    if (supabase) {
      fetchRankings()
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [currentPage, supabase])

  const fetchRankings = async () => {
    if (!supabase) return

    try {
      // Obtener total de usuarios
      const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true })

      if (count) {
        setTotalUsers(count)
        setTotalPages(Math.ceil(count / USERS_PER_PAGE))
      }

      // Obtener rankings paginados
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, points, games_won")
        .order("points", { ascending: false })
        .order("games_won", { ascending: false })
        .range((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE - 1)

      if (error) throw error

      const rankingsWithPosition = data.map((user, index) => ({
        ...user,
        position: (currentPage - 1) * USERS_PER_PAGE + index + 1,
      }))

      setRankings(rankingsWithPosition)
    } catch (error) {
      console.error("Error fetching rankings:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentUser = async () => {
    if (!supabase) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Obtener datos del usuario actual
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, username, points, games_won")
          .eq("id", user.id)
          .maybeSingle()

        if (!profile) return

        // Obtener posición del usuario
        const { data: usersAbove } = await supabase
          .from("profiles")
          .select("id")
          .or(`points.gt.${profile.points},and(points.eq.${profile.points},games_won.gt.${profile.games_won})`)

        const position = (usersAbove?.length || 0) + 1

        setCurrentUser({
          ...profile,
          position,
        })
      }
    } catch (error) {
      console.error("Error fetching current user:", error)
    }
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />
      default:
        return (
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {position}
          </div>
        )
    }
  }

  const getPatronatoLogo = () => (
    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
      <span className="text-white font-bold text-xs">P</span>
    </div>
  )

  // Si Supabase no está configurado
  if (!supabase) {
    return (
      <div className="min-h-screen bg-black text-white">
        <GameHeader />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al menú
            </Link>
          </div>
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Rankings no disponibles</h2>
            <p className="text-gray-400">
              El sistema de rankings requiere configuración de Supabase. Por ahora podés jugar sin registrarte.
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <GameHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al menú
          </Link>
        </div>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">Rankings FutFactos</h2>
            <p className="text-gray-300 text-lg">Los mejores jugadores de la comunidad</p>
          </div>

          {/* Current User Card */}
          {currentUser && (
            <div className="bg-red-900/20 border-2 border-red-500 rounded-xl p-4">
              <h3 className="text-lg font-bold text-red-400 mb-3">Tu Posición</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(currentUser.position)}
                    {getPatronatoLogo()}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{currentUser.username}</div>
                    <div className="text-sm text-gray-400">{currentUser.games_won} juegos ganados</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-400">{currentUser.points} PTS</div>
                  <div className="text-sm text-gray-400">Posición #{currentUser.position}</div>
                </div>
              </div>
            </div>
          )}

          {/* Rankings List */}
          <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Tabla de Posiciones</h3>
              <p className="text-gray-400 text-sm mt-1">
                Cada juego ganado otorga 10 puntos • Total de jugadores: {totalUsers}
              </p>
            </div>

            <div className="divide-y divide-gray-700">
              {rankings.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 flex items-center justify-between hover:bg-gray-800 transition-colors ${
                    currentUser?.id === user.id ? "bg-red-900/10" : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(user.position)}
                      {getPatronatoLogo()}
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{user.username}</div>
                      <div className="text-sm text-gray-400">{user.games_won} juegos ganados</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-400">{user.points} PTS</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <div className="text-gray-400">
                  {currentPage} de {totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">¿Cómo funciona el sistema de puntos?</h3>
            <div className="space-y-2 text-gray-300">
              <p>
                • Cada juego ganado te otorga <strong className="text-red-400">10 puntos</strong>
              </p>
              <p>• Podés ganar puntos una vez por día en cada juego</p>
              <p>• Los rankings se actualizan en tiempo real</p>
              <p>• ¡Jugá todos los días para mantener tu posición!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
