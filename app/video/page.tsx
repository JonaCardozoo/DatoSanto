"use client"
import { useState, useEffect, useMemo } from "react"
import { Play, Calendar, Clock } from "lucide-react"
import GameHeader from "@/components/GameHeader"
import VideoDelDiaGame from "@/components/VideoDelDiaGame"
import VideoCompletedMessage from "@/components/VideoCompletedMessage"
import AlreadyPlayedMessage from "@/components/AlreadyPlayedMessage"
import { getVideoDelDia } from "@/lib/data/videosDelDia"
import { awardPoints, hasPlayedGameToday, markAsPlayedToday } from "@/utils/gameUtils"
import { getCurrentUser as getAuthCurrentUser } from "@/utils/jwt-auth" // Renombrar para evitar conflicto
import { getSupabaseClient } from "@/utils/supabase-browser"
import { getTodayAsString } from "@/utils/dateUtils"
import Link from "next/link"

export default function VideoPage() {
  const [video, setVideo] = useState<any>(null) // Asegurar tipo para 'video'
  const [hasPlayed, setHasPlayed] = useState(false) // Indica si el usuario ya completó el juego HOY (determinado por DB si logueado, por LS si no)
  const [lastGameWon, setLastGameWon] = useState<boolean | null>(null) // Resultado de la última partida de hoy (de DB o LS)
  const [gameCompleted, setGameCompleted] = useState(false) // Indica si el juego actual de la sesión está completado y debe mostrar el resultado detallado
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [pointsAwarded, setPointsAwarded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null) // Mantener el estado local
  // Usar useMemo para estabilizar el objeto de usuario
  const memoizedCurrentUser = useMemo(() => getAuthCurrentUser(), [])
  const supabase = getSupabaseClient()

  useEffect(() => {
    const initializePage = async () => {
      try {
        setUser(memoizedCurrentUser) // Usar el objeto memoizado
        const todayVideo = getVideoDelDia()
        setVideo(todayVideo)

        const today = getTodayAsString()
        let localGameState = null
        const savedState = localStorage.getItem("futfactos-video-game-state")

        if (savedState) {
          try {
            const parsedState = JSON.parse(savedState)
            if (parsedState.date === today) {
              localGameState = parsedState
            } else {
              // El estado guardado es de un día anterior, limpiarlo
              localStorage.removeItem("futfactos-video-game-state")
            }
          } catch (e) {
            console.error("Error al parsear el estado local del juego de video:", e)
            localStorage.removeItem("futfactos-video-game-state") // Limpiar estado corrupto
          }
        }

        let dbGameSession = null
        if (memoizedCurrentUser && todayVideo) {
          // Verificar en la BD si hay una sesión de juego completada para hoy
          const { data, error } = await supabase
            .from("game_sessions")
            .select("won, completed") // Solo necesitamos 'won' y 'completed' para el juego de video
            .eq("user_id", memoizedCurrentUser.id)
            .eq("game_type", "video")
            .eq("date", today)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle()

          if (error) {
            console.error("❌ Error al obtener sesión de juego de video de la BD:", error)
          } else if (data && data.completed) {
            dbGameSession = data
          }
        }

        // Determinar el estado final del juego, priorizando la BD (si hay sesión completada) o localStorage
        let finalHasPlayed = false
        let finalLastGameWon: boolean | null = null
        let finalGameCompleted = false
        let finalSelectedAnswer: number | null = null
        let finalIsCorrect: boolean | null = null
        let finalPointsAwarded = false

        if (dbGameSession) {
          // El estado de la BD tiene precedencia si existe una sesión completada
          finalHasPlayed = true
          finalLastGameWon = dbGameSession.won
          finalGameCompleted = true
          finalIsCorrect = dbGameSession.won
          // Si se ganó y tenemos el video, podemos inferir la respuesta correcta
          if (dbGameSession.won && todayVideo) {
            finalSelectedAnswer = todayVideo.respuestaCorrecta
          } else if (localGameState?.selectedAnswer !== undefined) {
            // Si se perdió o no se ganó, y hay estado local, usamos la respuesta seleccionada local
            finalSelectedAnswer = localGameState.selectedAnswer
          }
          finalPointsAwarded = dbGameSession.won // Asumimos que los puntos se otorgan si se ganó vía DB
        } else if (localGameState && localGameState.gameCompleted) {
          // Si no hay sesión completada en la BD, pero existe un estado local completado para hoy
          finalHasPlayed = true
          finalLastGameWon = localGameState.isCorrect
          finalGameCompleted = true
          finalSelectedAnswer = localGameState.selectedAnswer
          finalIsCorrect = localGameState.isCorrect
          finalPointsAwarded = localGameState.pointsAwarded || false
        } else {
          // No se encontró un juego completado en la BD ni en el almacenamiento local para hoy
          finalHasPlayed = false
          finalGameCompleted = false
        }

        setHasPlayed(finalHasPlayed)
        setLastGameWon(finalLastGameWon)
        setGameCompleted(finalGameCompleted)
        setSelectedAnswer(finalSelectedAnswer)
        setIsCorrect(finalIsCorrect)
        setPointsAwarded(finalPointsAwarded)
      } catch (error) {
        console.error("💥 Error inicializando página de video:", error)
      } finally {
        setLoading(false)
      }
    }
    initializePage()
  }, [memoizedCurrentUser, supabase, video]) // Añadir 'video' como dependencia para que se re-ejecute si el video cambia

  const handleGameComplete = async (isCorrectResult: boolean, selectedAnswerIndex: number) => {
    try {
      setSelectedAnswer(selectedAnswerIndex)
      setIsCorrect(isCorrectResult)
      setGameCompleted(true)
      setLastGameWon(isCorrectResult)

      let awarded = false
      if (isCorrectResult) {
        const awardedPoints = await awardPoints("video")
        if (awardedPoints) {
          awarded = true
          setPointsAwarded(true)
        } else {
          console.warn("⚠️ No se pudieron otorgar puntos.")
        }
      }

      // Guardar el estado final de la partida en localStorage y DB (si hay usuario)
      // Usar la nueva firma de markAsPlayedToday con el payload específico del juego
      await markAsPlayedToday("video", isCorrectResult, {
        selectedAnswer: selectedAnswerIndex,
        isCorrect: isCorrectResult,
        pointsAwarded: awarded,
        gameCompleted: true, // Asegurarse de que esto se establezca explícitamente en el payload
      })

      // Forzar una actualización de hasPlayed después de completar el juego en la misma sesión
      const currentHasPlayedStatus = await hasPlayedGameToday("video")
      setHasPlayed(currentHasPlayedStatus)
    } catch (error) {
      console.error("Error al completar el juego de video:", error)
    }
  }

  const handlePlayAgain = () => {
    localStorage.removeItem("futfactos-video-game-state")
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <GameHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Cargando video del día...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <GameHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">No hay video disponible</h2>
              <p className="text-gray-300">No hay video del día para hoy. ¡Volvé mañana para un nuevo desafío!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GameHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-purple-600 rounded-full">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Video del Día</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Mirá los primeros segundos del video y adiviná de qué se trata
            </p>
            {!user && (
              <p className="text-yellow-400 text-sm mt-2">
                💡{" "}
                <Link href="/auth" className="underline">
                  Iniciá sesión
                </Link>{" "}
                para ganar puntos y aparecer en el ranking
              </p>
            )}
            <div className="mt-8 bg-gray-800/50 border border-gray-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-400" />
                ¿Cómo jugar?
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div className="space-y-2">
                  <p className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                      1
                    </span>
                    Presioná el Boton para ver los primeros {video.duracionPreview} segundos
                  </p>
                  <p className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                      2
                    </span>
                    El video se pausará automáticamente
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                      3
                    </span>
                    Elegí tu respuesta de las 4 opciones
                  </p>
                  <p className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                      4
                    </span>
                    El video continuará hasta el final
                  </p>
                </div>
              </div>
            </div>
          </div>
          {gameCompleted ? (
            // PRIORIDAD 1: Si el estado `gameCompleted` es true (se cargó o se acaba de jugar)
            <VideoCompletedMessage
              isCorrect={isCorrect!}
              correctAnswer={video.opciones[video.respuestaCorrecta]}
              selectedAnswer={selectedAnswer !== null ? video.opciones[selectedAnswer] : ""}
              userLoggedIn={!!user}
              pointsAwarded={pointsAwarded}
            />
          ) : hasPlayed ? (
            // PRIORIDAD 2: Si el estado `hasPlayed` es true (determinado por DB/LS) pero no hay `gameCompleted` detallado
            <>
              <AlreadyPlayedMessage
                onPlayAgain={handlePlayAgain}
                gameType="video"
                playedToday={true}
                lastGameWon={lastGameWon}
              />
            </>
          ) : (
            // PRIORIDAD 3: Si no ha jugado hoy, mostrar el juego
            <VideoDelDiaGame video={video} onGameComplete={handleGameComplete} userLoggedIn={!!user} disabled={false} />
          )}
        </div>
      </div>
    </div>
  )
}
