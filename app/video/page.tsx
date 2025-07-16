"use client"

import { useState, useEffect, useMemo } from "react"
import { Play, Calendar, Clock } from "lucide-react"
import GameHeader from "@/components/GameHeader"
import VideoDelDiaGame from "@/components/VideoDelDiaGame"
import VideoCompletedMessage from "@/components/VideoCompletedMessage"
import AlreadyPlayedMessage from "@/components/AlreadyPlayedMessage"
import { getVideoDelDia } from "@/lib/data/videosDelDia"
import { awardPoints, hasPlayedToday, markAsPlayedToday } from "@/utils/gameUtils"
import { getCurrentUser as getAuthCurrentUser } from "@/utils/jwt-auth"
import { getSupabaseClient } from "@/utils/supabase-browser"
import { getTodayAsString, clearPreviousDayData } from "@/utils/dateUtils"
import Link from "next/link"

export default function VideoPage() {
  const [video, setVideo] = useState<any>(null)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [lastGameWon, setLastGameWon] = useState<boolean | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [pointsAwarded, setPointsAwarded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const memoizedCurrentUser = useMemo(() => getAuthCurrentUser(), [])
  const supabase = getSupabaseClient()

  useEffect(() => {
    const initializePage = async () => {
      clearPreviousDayData()

      try {
        setUser(memoizedCurrentUser)
        const today = getTodayAsString()
        const todayVideo = getVideoDelDia()
        setVideo(todayVideo)

        const savedState = localStorage.getItem("futfactos-video-game-state")
        let localGameState = null

        if (savedState) {
          try {
            const parsed = JSON.parse(savedState)
            if (parsed.date === today) {
              localGameState = parsed
            } else {
              localStorage.removeItem("futfactos-video-game-state")
            }
          } catch (e) {
            console.error("❌ Estado local corrupto:", e)
            localStorage.removeItem("futfactos-video-game-state")
          }
        }

        let dbGameSession = null
        if (memoizedCurrentUser) {
          const { data, error } = await supabase
            .from("game_sessions")
            .select("won, completed")
            .eq("user_id", memoizedCurrentUser.id)
            .eq("game_type", "video")
            .eq("date", today)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle()

          if (!error && data?.completed) {
            dbGameSession = data
          }
        }

        let finalHasPlayed = false
        let finalLastGameWon: boolean | null = null
        let finalGameCompleted = false
        let finalSelectedAnswer: number | null = null
        let finalIsCorrect: boolean | null = null
        let finalPointsAwarded = false

        if (dbGameSession) {
          finalHasPlayed = true
          finalLastGameWon = dbGameSession.won
          finalGameCompleted = true
          finalIsCorrect = dbGameSession.won
          if (dbGameSession.won && todayVideo) {
            finalSelectedAnswer = todayVideo.respuestaCorrecta
          } else if (localGameState?.selectedAnswer !== undefined) {
            finalSelectedAnswer = localGameState.selectedAnswer
          }
          finalPointsAwarded = dbGameSession.won
        } else if (localGameState?.gameCompleted) {
          finalHasPlayed = true
          finalLastGameWon = localGameState.isCorrect
          finalGameCompleted = true
          finalSelectedAnswer = localGameState.selectedAnswer
          finalIsCorrect = localGameState.isCorrect
          finalPointsAwarded = localGameState.pointsAwarded || false
        }

        setHasPlayed(finalHasPlayed)
        setLastGameWon(finalLastGameWon)
        setGameCompleted(finalGameCompleted)
        setSelectedAnswer(finalSelectedAnswer)
        setIsCorrect(finalIsCorrect)
        setPointsAwarded(finalPointsAwarded)
      } catch (error) {
        console.error("💥 Error al inicializar página de video:", error)
      } finally {
        setLoading(false)
      }
    }

    initializePage()
  }, [memoizedCurrentUser, supabase])

  const handleGameComplete = async (isCorrectResult: boolean, selectedAnswerIndex: number) => {
    try {
      setSelectedAnswer(selectedAnswerIndex)
      setIsCorrect(isCorrectResult)
      setGameCompleted(true)
      setLastGameWon(isCorrectResult)

      let awarded = false
      if (isCorrectResult) {
        const gotPoints = await awardPoints("video")
        awarded = gotPoints
        setPointsAwarded(gotPoints)
      }

      await markAsPlayedToday("video", isCorrectResult, {
        selectedAnswer: selectedAnswerIndex,
        isCorrect: isCorrectResult,
        pointsAwarded: awarded,
      })

      const currentHasPlayed = await hasPlayedToday("video")
      setHasPlayed(currentHasPlayed)
    } catch (error) {
      console.error("❌ Error al completar el juego de video:", error)
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
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando video del día...</p>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <GameHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-gray-800 border border-gray-600 rounded-xl p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No hay video disponible</h2>
            <p className="text-gray-300">Volvé mañana para un nuevo desafío 👀</p>
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
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                      1
                    </span>
                    Presioná el botón para ver los primeros {video.duracionPreview} segundos
                  </p>
                  <p className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </span>
                    El video se pausará automáticamente
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                      3
                    </span>
                    Elegí tu respuesta de las 4 opciones
                  </p>
                  <p className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                      4
                    </span>
                    El video continuará hasta el final
                  </p>
                </div>
              </div>
            </div>
          </div>
          {gameCompleted ? (
            <VideoCompletedMessage
              isCorrect={isCorrect!}
              correctAnswer={video.opciones[video.respuestaCorrecta]}
              selectedAnswer={selectedAnswer !== null ? video.opciones[selectedAnswer] : ""}
              userLoggedIn={!!user}
              pointsAwarded={pointsAwarded}
            />
          ) : hasPlayed ? (
            <AlreadyPlayedMessage
              onPlayAgain={handlePlayAgain}
              gameType="video"
              playedToday={true}
              lastGameWon={lastGameWon}
            />
          ) : (
            <VideoDelDiaGame
              video={video}
              onGameComplete={handleGameComplete}
              userLoggedIn={!!user}
              disabled={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
