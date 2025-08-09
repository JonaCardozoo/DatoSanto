"use client"

import { Button } from "@/components/ui/button"
import React, { useRef } from "react"
import FootballPitch from "../../components/football-pitch"
import GameControls from "../../components/game-controls"
import GameCompletedMessage from "../../components/GameCompletedMessage"
import PlayerSelection from "../../components/player-selection"
import { GiSoccerKick } from "react-icons/gi";
import {
  players,
  fixedSecondaryClubName,
  getDailyFormation,
  getDailyRandomClubChallenges,
  checkAndResetIfNewDay,
  type Player,
  type ClubChallenge,
  type PitchPosition,
  type GameState,
} from "@/lib/data/players"
import { GAME_TYPES, getTimeUntilReset, getGameDateString } from "@/utils/dateUtils"
import { markAsPlayedToday, awardPoints } from "@/utils/gameUtils"
import { getCurrentUser } from "@/utils/jwt-auth"
import GameHeader from "../../components/GameHeader"
import { ArrowLeft, Clock, HelpCircle, Play } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import GuestWarningModal from "@/components/GuestWarningModal"
import router from "next/router"
import OnceCompletedMessage from "@/components/OnceCompletedMessage"

const GAME_TYPE_EQUIPO = GAME_TYPES.EQUIPO
const GAME_STATE_KEY = `futfactos-${GAME_TYPE_EQUIPO}-game-state`
const MAX_HINTS = 3 // Máximo de pistas permitidas

export default function FootballGame() {
  const [guessedPlayers, setGuessedPlayers] = React.useState<Array<{ player: Player; assignedSlotId: string }>>([])
  const [message, setMessage] = React.useState("")
  const [currentChallengeIndex, setCurrentChallengeIndex] = React.useState(0)
  const [currentFormation, setCurrentFormation] = React.useState<PitchPosition[]>([])
  const [gameCompletedToday, setGameCompletedToday] = React.useState(false)
  const [timeToReset, setTimeToReset] = React.useState("")
  const [hintedPlayerName, setHintedPlayerName] = React.useState("")
  const [gameOutcome, setGameOutcome] = React.useState<"win" | "lose" | null>(null)
  const [hintsUsed, setHintsUsed] = React.useState(0) // Solo contador total de pistas
  const [user, setUser] = useState<any>(null)
  const [showGuestWarning, setShowGuestWarning] = useState(false)

  // Estados para el sistema de puntos y autenticación
  const [userLoggedIn, setUserLoggedIn] = React.useState(false)
  const [pointsAwarded, setPointsAwarded] = React.useState(false)
  const [currentUser, setCurrentUser] = React.useState<any>(null)

  // Nuevos estados para manejar selección múltiple
  const [showPlayerSelection, setShowPlayerSelection] = React.useState(false)
  const [multiplePlayersFound, setMultiplePlayersFound] = React.useState<Player[]>([])
  const [searchedName, setSearchedName] = React.useState("")

  // Estado para la animación de voltear
  const [flippingPlayer, setFlippingPlayer] = React.useState<string | null>(null)

  const isFirstRender = useRef(true)
  const dailyClubChallenges = useRef<ClubChallenge[]>([])

  // Función para verificar si el usuario está logueado
  const checkUserAuthentication = () => {
    const user = getCurrentUser()
    const isLoggedIn = !!user
    setUserLoggedIn(isLoggedIn)
    setCurrentUser(user)
    return isLoggedIn
  }

  const handleLogin = () => {
    router.push("/auth")
    setShowGuestWarning(false)
  }

  const handleCloseWarning = () => {
    setShowGuestWarning(false)
  }

  // Efecto para cargar el estado del juego al inicio
  React.useEffect(() => {
  setCurrentFormation(getDailyFormation())
  checkUserAuthentication()

  if (typeof window !== "undefined") {
    const gameDate = getGameDateString()
    const savedStateString = localStorage.getItem(GAME_STATE_KEY)
    
    // Cargar o generar desafíos diarios
    const savedChallengesString = localStorage.getItem(`dailyChallenges_${gameDate}`)
    if (savedChallengesString) {
      try {
        dailyClubChallenges.current = JSON.parse(savedChallengesString)
      } catch (e) {
        console.error("Error al parsear desafíos guardados. Generando nuevos.")
        dailyClubChallenges.current = getDailyRandomClubChallenges()
        localStorage.setItem(`dailyChallenges_${gameDate}`, JSON.stringify(dailyClubChallenges.current))
      }
    } else {
      dailyClubChallenges.current = getDailyRandomClubChallenges()
      localStorage.setItem(`dailyChallenges_${gameDate}`, JSON.stringify(dailyClubChallenges.current))
    }

    // Estado inicial por defecto
    let initialState: GameState = {
      guessedPlayers: [],
      currentChallengeIndex: 0,
      gameCompletedToday: false,
      gameOutcome: null,
      hintsUsed: 0,
      pointsAwarded: false,
      gameDate: gameDate, // ← IMPORTANTE: Asignar fecha actual
      dailyChallenges: dailyClubChallenges.current,
    }

    // Evaluar estado guardado y verificar cambio de día
    if (savedStateString) {
      try {
        const parsedState: GameState = JSON.parse(savedStateString)
        
        // ← AQUÍ ESTÁ LA NUEVA LÓGICA: Verificar cambio de día
        const checkedState = checkAndResetIfNewDay(parsedState)
        
        if (checkedState !== parsedState) {
          // Hubo un reset por cambio de día
          initialState = checkedState
          localStorage.removeItem(GAME_STATE_KEY) // Limpiar estado viejo
          localStorage.removeItem(`lastPlayed_${GAME_TYPE_EQUIPO}`) // Limpiar marcador de juego
          setMessage("¡Nuevo día! Comienza un nuevo desafío.")
        } else {
          // Mismo día, cargar estado guardado
          initialState = {
            ...parsedState,
            hintsUsed: parsedState.hintsUsed || 0,
            pointsAwarded: parsedState.pointsAwarded || false,
            gameDate: parsedState.gameDate || gameDate, // Asegurar que tenga fecha
          }

          if (parsedState.gameCompletedToday) {
            setMessage(`¡Ya jugaste hoy! Vuelve en ${getTimeUntilReset()} para un nuevo desafío.`)
          } else {
            setMessage("¡Bienvenido de nuevo! Continúa tu desafío.")
          }
        }
      } catch (e) {
        console.error("Error al parsear estado del juego. Reiniciando.")
        localStorage.removeItem(GAME_STATE_KEY)
        localStorage.removeItem(`lastPlayed_${GAME_TYPE_EQUIPO}`)
        setMessage("Error al cargar el juego. Se ha reiniciado.")
      }
    } else {
      // No hay estado guardado, verificar si ya jugó hoy
      const lastPlayedDateFromStorage = localStorage.getItem(`lastPlayed_${GAME_TYPE_EQUIPO}`)
      if (lastPlayedDateFromStorage === gameDate) {
        initialState.gameCompletedToday = true
        initialState.gameOutcome = "lose"
        setMessage(`¡Ya jugaste hoy! Vuelve en ${getTimeUntilReset()} para un nuevo desafío.`)
      } else {
        setMessage("¡Bienvenido! Adivina el jugador del día.")
      }
    }

    // Aplicar estado inicial
    setGuessedPlayers(initialState.guessedPlayers)
    setCurrentChallengeIndex(initialState.currentChallengeIndex)
    setGameCompletedToday(initialState.gameCompletedToday)
    setGameOutcome(initialState.gameOutcome ?? null)
    setHintsUsed(initialState.hintsUsed)
    setPointsAwarded(initialState.pointsAwarded || false)
  }

  const interval = setInterval(() => {
    setTimeToReset(getTimeUntilReset())
  }, 60 * 1000)

  setTimeToReset(getTimeUntilReset())

  return () => clearInterval(interval)
}, [])

React.useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false
    return
  }

  if (typeof window !== "undefined") {
    const gameState: GameState = {
      guessedPlayers,
      currentChallengeIndex,
      gameCompletedToday,
      gameOutcome,
      hintsUsed,
      pointsAwarded,
      dailyChallenges: dailyClubChallenges.current,
      gameDate: getGameDateString() // ← AGREGAR ESTA LÍNEA
    }
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState))
  }
}, [guessedPlayers, currentChallengeIndex, gameCompletedToday, gameOutcome, hintsUsed, pointsAwarded])

  // Usar la lista de desafíos aleatoria diaria
  const currentChallenge: ClubChallenge = dailyClubChallenges.current[currentChallengeIndex]
  const currentPrimaryClubName = currentChallenge?.primaryClubName
  const currentPrimaryClubLogo = currentChallenge?.primaryClubLogo
  const secondaryClubName = fixedSecondaryClubName

  const handleGuess = (playerName: string) => {
    if (gameCompletedToday) {
      setMessage(`¡Ya jugaste hoy! Vuelve en ${getTimeUntilReset()} para un nuevo desafío.`)
      return
    }

    const normalizedPlayerName = playerName.toLowerCase()

    // Buscar todos los jugadores que coincidan con el nombre
    const foundPlayers = players.filter(
      (p) => p.name.toLowerCase().includes(normalizedPlayerName) || normalizedPlayerName.includes(p.name.toLowerCase()),
    )

    if (foundPlayers.length === 0) {
      setMessage("Jugador no encontrado. Intenta de nuevo.")
      return
    }

    // Filtrar jugadores que cumplan con los criterios del juego
    const validPlayers = foundPlayers.filter((player) => {
      // 1. No debe estar ya adivinado
      const alreadyGuessed = guessedPlayers.some((gp) => gp.player.name === player.name)
      if (alreadyGuessed) return false

      // 2. Debe haber jugado en ambos clubes
      const playedForPrimaryClub = player.clubs.includes(currentPrimaryClubName)
      const playedForSecondaryClub = player.clubs.includes(secondaryClubName)
      if (!playedForPrimaryClub || !playedForSecondaryClub) return false

      // 3. Verificar si hay una posición disponible para él
      const occupiedSlotIds = guessedPlayers.map((gp) => gp.assignedSlotId)

      // PRIMERA OPCIÓN: Buscar slot exacto de su posición
      const exactMatchingSlots = currentFormation.filter((p) => p.positionKey === player.position)
      const hasExactAvailableSlot = exactMatchingSlots.some((slot) => !occupiedSlotIds.includes(slot.id))

      if (hasExactAvailableSlot) {
        return true
      }

      // SEGUNDA OPCIÓN: Si no hay slot exacto, buscar CUALQUIER slot disponible (jugador comodín)
      const anyAvailableSlot = currentFormation.filter((p) => p.type === "player").some((slot) => !occupiedSlotIds.includes(slot.id))

      return anyAvailableSlot
    })

    if (validPlayers.length === 0) {
      // Verificar qué condición específica falló para dar un mensaje más preciso
      const anyPlayerFound = foundPlayers.find((player) => {
        const alreadyGuessed = guessedPlayers.some((gp) => gp.player.name === player.name)
        return !alreadyGuessed
      })

      if (!anyPlayerFound) {
        setMessage(`${foundPlayers[0].name} ya ha sido adivinado.`)
      } else {
        const playedForBothClubs = foundPlayers.find((player) => {
          const playedForPrimaryClub = player.clubs.includes(currentPrimaryClubName)
          const playedForSecondaryClub = player.clubs.includes(secondaryClubName)
          return playedForPrimaryClub && playedForSecondaryClub
        })

        if (!playedForBothClubs) {
          setMessage(
            `${foundPlayers[0].name} no jugó en ${currentPrimaryClubName} y ${secondaryClubName} simultáneamente. Intenta de nuevo.`,
          )
        } else {
          setMessage(`No hay posiciones disponibles en esta formación.`)
        }
      }
      return
    }

    // Si hay múltiples jugadores válidos, mostrar selector
    if (validPlayers.length > 1) {
      setMultiplePlayersFound(validPlayers)
      setSearchedName(playerName)
      setShowPlayerSelection(true)
      setMessage(`Se encontraron ${validPlayers.length} jugadores con ese nombre. Selecciona cuál quieres usar:`)
      return
    }

    // Si solo hay un jugador válido, proceder normalmente
    processPlayerSelection(validPlayers[0])
  }

  const processPlayerSelection = (selectedPlayer: Player) => {
    const occupiedSlotIds = guessedPlayers.map((gp) => gp.assignedSlotId)

    // PRIMERA OPCIÓN: Buscar slot exacto de su posición
    const exactMatchingSlots = currentFormation.filter((p) => p.positionKey === selectedPlayer.position)
    const exactAvailableSlot = exactMatchingSlots.find((slot) => !occupiedSlotIds.includes(slot.id))

    let assignedSlot = exactAvailableSlot
    let isWildcard = false

    // SEGUNDA OPCIÓN: Si no hay slot exacto, usar cualquier slot disponible (comodín)
    if (!assignedSlot) {
      const anyAvailableSlot = currentFormation
        .filter((p) => p.type === "player")
        .find((slot) => !occupiedSlotIds.includes(slot.id))

      if (anyAvailableSlot) {
        assignedSlot = anyAvailableSlot
        isWildcard = true
      }
    }

    if (!assignedSlot) {
      setMessage(`No hay posiciones disponibles en esta formación.`)
      return
    }

    // PRIMERO: Agregar el jugador al estado
    const newGuessedPlayers = [...guessedPlayers, { player: selectedPlayer, assignedSlotId: assignedSlot.id }]
    setGuessedPlayers(newGuessedPlayers)

    // SEGUNDO: Iniciar animación de voltear
    setFlippingPlayer(assignedSlot.id)

    // TERCERO: Limpiar la animación después de que termine
    setTimeout(() => {
      setFlippingPlayer(null)
    }, 700)

    // Mensaje diferente para jugadores comodín
    if (isWildcard) {
      setMessage(`¡Correcto! ${selectedPlayer.name} (${selectedPlayer.position}) ha sido colocado como comodín en posición de ${assignedSlot.positionKey}.`)
    } else {
      setMessage(`¡Correcto! ${selectedPlayer.name} ha sido colocado en el campo como ${selectedPlayer.position}.`)
    }

    // Cerrar selector si estaba abierto
    setShowPlayerSelection(false)
    setMultiplePlayersFound([])
    setSearchedName("")

    // Verificar si se completó la formación
    if (newGuessedPlayers.length === currentFormation.filter((p) => p.type === "player").length) {
      setMessage(`¡Felicidades! Has completado la formación de hoy. Vuelve en ${timeToReset} para un nuevo desafío.`)
      setGameCompletedToday(true)
      setGameOutcome("win")

      // PRIMERO: Marcar como jugado en localStorage (método original)
      const gameDate = getGameDateString()
      localStorage.setItem(`lastPlayed_${GAME_TYPE_EQUIPO}`, gameDate)

      // SEGUNDO: Intentar otorgar puntos usando las nuevas utilidades
      if (userLoggedIn && !pointsAwarded) {
        const pointsGranted = awardPoints(GAME_TYPE_EQUIPO, 50)
        if (pointsGranted) {
          setPointsAwarded(true)
        }
      }

      // TERCERO: Guardar en Supabase (opcional, no bloquea el juego)
      markAsPlayedToday(GAME_TYPE_EQUIPO, true, {
        guessedPlayers: newGuessedPlayers,
        currentChallengeIndex,
        hintsUsed,
      }).catch((error) => {
        console.error("Error al guardar en Supabase:", error)
      })

      return
    }

    // Avanzar al siguiente desafío
    setTimeout(() => {
      const nextIndex = (currentChallengeIndex + 1) % dailyClubChallenges.current.length
      setCurrentChallengeIndex(nextIndex)
      setMessage(
        `¡Nuevo desafío! Adivina un jugador para ${dailyClubChallenges.current[nextIndex].primaryClubName} y ${secondaryClubName}.`,
      )
    }, 1500)
  }

  const handlePlayerSelect = (player: Player) => {
    processPlayerSelection(player)
  }

  const handleCancelSelection = () => {
    setShowPlayerSelection(false)
    setMultiplePlayersFound([])
    setSearchedName("")
    setMessage("Selección cancelada. Intenta con otro nombre.")
  }

  const handleGiveUp = () => {
    if (gameCompletedToday) {
      setMessage(`¡Ya jugaste hoy! Vuelve en ${getTimeUntilReset()} para un nuevo desafío.`)
      return
    }

    setMessage(`Te has rendido para ${currentPrimaryClubName} y ${secondaryClubName}. ¡Mejor suerte la próxima vez!`)
    setGameCompletedToday(true)
    setGameOutcome("lose")

    // PRIMERO: Marcar como jugado en localStorage (método original)
    const gameDate = getGameDateString()
    localStorage.setItem(`lastPlayed_${GAME_TYPE_EQUIPO}`, gameDate)

    // SEGUNDO: Guardar en Supabase (opcional, no bloquea el juego)
    markAsPlayedToday(GAME_TYPE_EQUIPO, false, {
      guessedPlayers,
      currentChallengeIndex,
      hintsUsed,
    }).catch((error) => {
      console.error("Error al guardar en Supabase:", error)
    })

    setTimeout(() => {
      const nextIndex = (currentChallengeIndex + 1) % dailyClubChallenges.current.length
      setCurrentChallengeIndex(nextIndex)
      setMessage(
        `¡Nuevo desafío! Adivina un jugador para ${dailyClubChallenges.current[nextIndex].primaryClubName} y ${secondaryClubName}.`,
      )
    }, 1500)
  }

  const handleShowHint = () => {
    if (gameCompletedToday) {
      setMessage(`¡Ya jugaste hoy! Vuelve en ${getTimeUntilReset()} para un nuevo desafío.`)
      return
    }

    if (hintsUsed >= MAX_HINTS) {
      setMessage(`Ya usaste todas las pistas disponibles (${MAX_HINTS}/${MAX_HINTS}).`)
      return
    }

    const occupiedSlotIds = guessedPlayers.map((gp) => gp.assignedSlotId)

    const potentialHints = players.filter((p) => {
      const playedForPrimaryClub = p.clubs.includes(currentPrimaryClubName)
      const playedForSecondaryClub = p.clubs.includes(secondaryClubName)
      const alreadyGuessed = guessedPlayers.some((gp) => gp.player.name === p.name)

      if (!playedForPrimaryClub || !playedForSecondaryClub || alreadyGuessed) {
        return false
      }

      // Verificar si hay slot exacto disponible
      const exactMatchingSlots = currentFormation.filter((pos) => pos.positionKey === p.position)
      const hasExactAvailableSlot = exactMatchingSlots.some((slot) => !occupiedSlotIds.includes(slot.id))

      if (hasExactAvailableSlot) {
        return true
      }

      // Verificar si hay CUALQUIER slot disponible (comodín)
      const anyAvailableSlot = currentFormation
        .filter((pos) => pos.type === "player")
        .some((slot) => !occupiedSlotIds.includes(slot.id))

      return anyAvailableSlot
    })

    if (potentialHints.length > 0) {
      const hint = potentialHints[Math.floor(Math.random() * potentialHints.length)]
      setHintedPlayerName(hint.name)
      setHintsUsed(hintsUsed + 1)
      const remainingHints = MAX_HINTS - (hintsUsed + 1)
      setMessage(
        `Pista: ¡Podría ser ${hint.name}! Intenta ingresarlo. (Pistas restantes: ${remainingHints}/${MAX_HINTS})`,
      )
    } else {
      setMessage("No hay pistas disponibles para este desafío en este momento.")
    }
  }

  const handleResetGame = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(GAME_STATE_KEY)
      localStorage.removeItem(`lastPlayed_${GAME_TYPE_EQUIPO}`)
    }
    setGuessedPlayers([])
    setCurrentChallengeIndex(0)
    setGameCompletedToday(false)
    setHintedPlayerName("")
    setGameOutcome(null)
    setShowPlayerSelection(false)
    setMultiplePlayersFound([])
    setSearchedName("")
    setHintsUsed(0)
    setPointsAwarded(false)
    setFlippingPlayer(null)
    setMessage("¡Juego reiniciado! Adivina un nuevo jugador.")
  }

  // Calcular si el botón de pista debe estar deshabilitado
  const isHintButtonDisabled = hintsUsed >= MAX_HINTS || gameCompletedToday

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <GameHeader />

      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al menú
          </Link>

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">Once del Día</h2>
            <p className="text-gray-300 text-lg mb-2">Ponete a prueba armando un once con estos equipos</p>
            {!user && (
              <p className="text-yellow-400 text-sm">
                💡{" "}
                <Link href="/auth" className="underline hover:text-yellow-300">
                  Iniciá sesión
                </Link>{" "}
                para ganar puntos y aparecer en el ranking
              </p>
            )}
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="mt-8 bg-gray-800/50 border border-gray-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-purple-400" />
                  Ayuda
                </h3>
                    <p className="flex items-center justify-center">
                      si no hay un jugador en la posición pedida (por ejemplo, un arquero que haya jugado en Patronato y Defensa),<br />
          podés usar a otro que haya pasado por ambos clubes, aunque juegue en otra posición.
                    </p>
              </div>
            </div>

          </div>
          {!user && (
            <GuestWarningModal isOpen={showGuestWarning} onClose={handleCloseWarning} onLogin={handleLogin} />
          )}
        </div>

        {/* Main Game Content */}
        {gameCompletedToday && gameOutcome !== null ? (
          /* Vista cuando el juego está terminado */
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="w-full max-w-2xl">
              <FootballPitch
                guessedPlayers={guessedPlayers}
                currentFormation={currentFormation}
                showPlayerNames={true}
                flippingPlayer={flippingPlayer}
              />
            </div>
            <OnceCompletedMessage
              isCorrect={gameOutcome === "win"}
              correctAnswer=""
              pointsAwarded={pointsAwarded && userLoggedIn}
              userLoggedIn={userLoggedIn}
              timeToReset={timeToReset}
            />
          </div>
        ) : (
          /* Vista durante el juego */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Panel de controles - Izquierda en desktop, arriba en mobile */}
            <div className="order-1 lg:order-1">
              <GameControls
                onGuess={handleGuess}
                onGiveUp={handleGiveUp}
                onShowHint={handleShowHint}
                message={message}
                currentClubName={currentPrimaryClubName}
                currentClubLogo={currentPrimaryClubLogo}
                hintedPlayerName={hintedPlayerName}
                isHintButtonDisabled={isHintButtonDisabled}
                disabled={showPlayerSelection}
                hintsUsed={hintsUsed}
                maxHints={MAX_HINTS}
              />
            </div>

            {/* Campo de fútbol - Derecha en desktop, abajo en mobile */}
            <div className="order-2 lg:order-2 flex justify-center">
              <FootballPitch
                guessedPlayers={guessedPlayers}
                currentFormation={currentFormation}
                showPlayerNames={true}
                flippingPlayer={flippingPlayer}
              />
            </div>
          </div>
        )}

        {/* Selector de jugadores múltiples - Modal overlay */}
        {showPlayerSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
              <PlayerSelection
                players={multiplePlayersFound}
                searchedName={searchedName}
                onPlayerSelect={handlePlayerSelect}
                onCancel={handleCancelSelection}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}