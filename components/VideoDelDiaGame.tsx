"use client"

import { useState, useRef, useEffect, useCallback, memo } from "react"
import { Volume2, VolumeX, RotateCcw, Play } from "lucide-react" // Importar Play icon
import VideoOptionsCard from "./VideoOptionsCard"
import VideoCompletedMessage from "./VideoCompletedMessage"
import type { VideoDelDia } from "@/types/video-del-dia"

type PlaybackState = "idle" | "loading" | "playing_preview" | "paused_for_answer" | "playing_full" | "ended"

interface VideoDelDiaGameProps {
  video: VideoDelDia
  onGameComplete: (isCorrect: boolean, selectedAnswer: number) => void
  userLoggedIn?: boolean
  disabled?: boolean
}

function VideoDelDiaGame({ video, onGameComplete, userLoggedIn = false, disabled = false }: VideoDelDiaGameProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [playbackState, setPlaybackState] = useState<PlaybackState>("loading") // Nuevo estado de control
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  // Limpia cualquier timer de preview existente
  const clearPreviewTimer = useCallback(() => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current)
      previewTimerRef.current = null
    }
  }, [])

  // Establece un timer para pausar el video después del preview
  const setPreviewPauseTimer = useCallback(() => {
    clearPreviewTimer()
    const videoElement = videoRef.current
    if (videoElement && video.duracionPreview > 0) {

      previewTimerRef.current = setTimeout(() => {
        if (videoElement) {
          if (videoElement.paused) {
          } else {
            videoElement.pause()
          }
          setPlaybackState("paused_for_answer") // Establece el estado explícitamente
        }
      }, video.duracionPreview * 1000)
    
    }
  }, [clearPreviewTimer, video.duracionPreview, video.id, playbackState])

  // Efecto principal para manejar eventos del video
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration)
      setVideoLoaded(true)
      setPlaybackState("idle") // El video está cargado, listo para iniciar por interacción del usuario
    }

    const handleLoadedData = () => {
      setVideoLoaded(true)
      if (playbackState === "loading") {
        setPlaybackState("idle")
      }
    }

    const handleEnded = () => {
      const videoElement = videoRef.current
      if (videoElement) {
        // Solo establecer a 'ended' si el video realmente llegó al final (con una pequeña tolerancia)
        if (Math.abs(videoElement.currentTime - videoElement.duration) < 0.1) {
          clearPreviewTimer()
          setPlaybackState("ended") // Video ha terminado por completo
          if (selectedAnswer !== null && !gameCompleted) {
            setShowResults(true)
            setGameCompleted(true)
            const isCorrect = selectedAnswer === video.respuestaCorrecta
            onGameComplete(isCorrect, selectedAnswer)
          }
        } else {
          console.warn("⚠️ Video ended event fired prematurely or incorrectly. Not setting playbackState to 'ended'.")
          // Si el evento 'ended' se dispara pero el video no ha terminado,
          // y estábamos en el preview, volvemos al estado de pausa para respuesta.
          if (playbackState === "playing_preview") {
            setPlaybackState("paused_for_answer")
            videoElement.pause() // Asegurarse de que esté pausado
          }
        }
      }
    }

    const handleCanPlay = () => {
      setVideoLoaded(true)
      if (playbackState === "loading") {
        setPlaybackState("idle") // Asegurarse de que pase a idle si canplay es el primero en dispararse
      }
    }

    videoElement.addEventListener("timeupdate", handleTimeUpdate)
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata)
    videoElement.addEventListener("loadeddata", handleLoadedData)
    videoElement.addEventListener("ended", handleEnded)
    videoElement.addEventListener("canplay", handleCanPlay)

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate)
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata)
      videoElement.removeEventListener("loadeddata", handleLoadedData)
      videoElement.removeEventListener("ended", handleEnded)
      videoElement.removeEventListener("canplay", handleCanPlay)
      clearPreviewTimer()
    }
  }, [selectedAnswer, gameCompleted, onGameComplete, video.respuestaCorrecta, clearPreviewTimer, playbackState])

  // Función para iniciar la reproducción del preview (llamada por interacción del usuario)
  const startPreviewPlayback = useCallback(async () => {
    const videoElement = videoRef.current
    if (!videoElement || disabled || (playbackState !== "idle" && playbackState !== "paused_for_answer")) {
      return
    }

    setPlaybackState("playing_preview")
    videoElement.currentTime = 0 // Asegura que empiece desde el inicio

    // Esperar a que el video haya buscado la posición 0 antes de reproducir
    const seekPromise = new Promise<void>((resolve) => {
      const onSeeked = () => {
        videoElement.removeEventListener("seeked", onSeeked)
        resolve()
      }
      // Si el video ya está en 0, 'seeked' no se dispara, así que resolvemos inmediatamente.
      // De lo contrario, añadimos el listener y establecemos currentTime.
      if (videoElement.currentTime === 0) {
        resolve()
      } else {
        videoElement.addEventListener("seeked", onSeeked)
        videoElement.currentTime = 0 // Esto dispara el evento 'seeked' cuando termina
      }
    })

    try {
      await seekPromise // Esperar a que el video esté en el inicio
      await videoElement.play()
      setPreviewPauseTimer() // Establece el timer para la pausa
    } catch (error) {
      console.error("❌ Error al intentar reproducir preview:", error)
      // Si el autoplay falla (ej. por políticas del navegador), vuelve a idle
      setPlaybackState("idle")
    }
  }, [disabled, playbackState, setPreviewPauseTimer])

  const handleMuteToggle = () => {
    const videoElement = videoRef.current
    if (!videoElement || disabled) return

    videoElement.muted = !isMuted
    setIsMuted(!isMuted)

    // Si el video está en idle y el usuario interactúa (mute/unmute), intenta iniciar la reproducción del preview
    if (playbackState === "idle" && videoLoaded) {
      startPreviewPlayback()
    }
  }

  const handleAnswerSelect = async (answerIndex: number) => {
    const videoElement = videoRef.current
    if (disabled || selectedAnswer !== null || playbackState !== "paused_for_answer" || !videoElement) {
      return
    }

    setSelectedAnswer(answerIndex)
    clearPreviewTimer() // Limpiar el timer del preview

    setPlaybackState("playing_full") // Cambiar a estado de reproducción completa

    try {
      await videoElement.play()
    } catch (error) {
      console.error("❌ Error continuando video:", error)
      setPlaybackState("ended") // Si falla, consideramos que terminó
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0
  const previewPercentage = duration > 0 ? (video.duracionPreview / duration) * 100 : 0



  if (gameCompleted && showResults) {
    return (
      <VideoCompletedMessage
        isCorrect={selectedAnswer === video.respuestaCorrecta}
        correctAnswer={video.opciones[video.respuestaCorrecta]}
        selectedAnswer={selectedAnswer !== null ? video.opciones[selectedAnswer] : ""}
        userLoggedIn={userLoggedIn}
        pointsAwarded={selectedAnswer === video.respuestaCorrecta && userLoggedIn}
      />
    )
  }

  const showPlayButtonOverlay =
    (playbackState === "idle" || playbackState === "paused_for_answer") && videoLoaded && !disabled

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
        <video
          key={video.id}
          ref={videoRef}
          src={video.videoUrl}
          className="w-full aspect-video object-cover"
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          muted={isMuted} // Controlar mute con el estado
        />

        {/* Loading overlay */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Cargando video...</p>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Progress Bar */}
            <div className="relative w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${progressPercentage}%` }}
              />
              {/* Preview indicator */}
              {duration > 0 && (
                <div
                  className="absolute top-0 w-1 h-2 bg-yellow-400 rounded-full"
                  style={{ left: `${previewPercentage}%` }}
                  title={`Preview hasta ${video.duracionPreview}s`}
                />
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Solo botón de mute/unmute */}
                <button
                  onClick={handleMuteToggle}
                  disabled={disabled || !videoLoaded}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors disabled:opacity-50"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                </button>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Mensaje */}
              {playbackState === "paused_for_answer" && !disabled && (
                <div className="text-yellow-300 text-sm font-medium animate-pulse">
                  ¡Elegí tu respuesta para continuar!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón de Play/Replay Preview en el centro */}
        {showPlayButtonOverlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startPreviewPlayback} // Unificado para iniciar o reiniciar preview
              className="p-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-lg transition-colors flex items-center space-x-2 shadow-lg"
            >
              {playbackState === "idle" ? (
                <>
                  <Play className="w-8 h-8" />
                </>
              ) : (
                <>
                  <RotateCcw className="w-6 h-6" />
                  <span>Volver a ver preview</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Question and Options */}
      <VideoOptionsCard
        pregunta={video.pregunta}
        opciones={video.opciones}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={selectedAnswer}
        showResults={showResults}
        disabled={disabled || playbackState !== "paused_for_answer"} // Deshabilitar si no está en estado de pausa
        correctAnswer={video.respuestaCorrecta}
        canSelect={playbackState === "paused_for_answer"}
      />

      {/* Status Messages */}
      {playbackState === "loading" && (
        <div className="text-center p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
          <p className="text-blue-200">Cargando video...</p>
        </div>
      )}

      {playbackState === "idle" && !showPlayButtonOverlay && (
        <div className="text-center p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
          <p className="text-blue-200">El video está listo. Presiona el botón de Play para comenzar.</p>
        </div>
      )}

      {playbackState === "playing_preview" && (
        <div className="text-center p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
          <p className="text-blue-200">Mirando los primeros {video.duracionPreview} segundos del video...</p>
        </div>
      )}


      {playbackState === "playing_full" && (
        <div className="text-center p-4 bg-green-900/30 border border-green-500 rounded-lg">
          <p className="text-green-200">
            Respuesta seleccionada: <strong>{video.opciones[selectedAnswer!]}</strong>
          </p>
          <p className="text-green-300 text-sm mt-1">El video continuará hasta el final...</p>
        </div>
      )}
    </div>
  )
}

export default memo(VideoDelDiaGame)
