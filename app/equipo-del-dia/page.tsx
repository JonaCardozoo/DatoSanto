"use client"

import { Button } from "@/components/ui/button"
import React, { useRef } from "react"
import FootballPitch from "../../components/football-pitch"
import GameControls from "../../components/game-controls"
import GameCompletedMessage from "../../components/GameCompletedMessage"
import PlayerSelection from "../../components/player-selection"
import {
  players,
  fixedSecondaryClubName,
  getDailyFormation,
  getDailyRandomClubChallenges,
  type Player,
  type ClubChallenge,
  type PitchPosition,
  type GameState,
} from "@/lib/data/players"
import { GAME_TYPES, getTimeUntilReset, getGameDateString } from "@/utils/dateUtils"
<<<<<<< HEAD
import { markAsPlayedToday, awardPoints } from "@/utils/gameUtils"
import { getCurrentUser } from "@/utils/jwt-auth"
=======
import { markAsPlayedToday, awardPoints } from "@/utils/gameUtils" // Asegúrate de que la ruta sea correcta
import { getCurrentUser } from "@/utils/jwt-auth" // Asegúrate de que la ruta sea correcta
>>>>>>> origin/Jona
import GameHeader from "../../components/GameHeader"

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
<<<<<<< HEAD
=======
  // dailyClubChallenges se inicializará desde localStorage o se generará
>>>>>>> origin/Jona
  const dailyClubChallenges = useRef<ClubChallenge[]>([])

  // Función para verificar si el usuario está logueado
  const checkUserAuthentication = () => {
    const user = getCurrentUser()
    const isLoggedIn = !!user
    setUserLoggedIn(isLoggedIn)
    setCurrentUser(user)
    return isLoggedIn
  }

  // Efecto para cargar el estado del juego al inicio
  React.useEffect(() => {
<<<<<<< HEAD
  setCurrentFormation(getDailyFormation())
  checkUserAuthentication()

  if (typeof window !== "undefined") {
    const gameDate = getGameDateString()
    const savedStateString = localStorage.getItem(GAME_STATE_KEY)
    const lastPlayedDateFromStorage = localStorage.getItem(`lastPlayed_${GAME_TYPE_EQUIPO}`)
    const savedChallengesString = localStorage.getItem(`dailyChallenges_${gameDate}`)


    // Cargar o generar desafíos diarios
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
    }

    // Evaluar estado guardado
    if (lastPlayedDateFromStorage && lastPlayedDateFromStorage !== gameDate) {
      localStorage.removeItem(GAME_STATE_KEY)
      localStorage.removeItem(`lastPlayed_${GAME_TYPE_EQUIPO}`)
      setMessage("¡Nuevo día! Comienza un nuevo desafío.")
    } else if (savedStateString) {
      try {
        const parsedState: GameState = JSON.parse(savedStateString)
        initialState = {
          ...parsedState,
          hintsUsed: parsedState.hintsUsed || 0,
          pointsAwarded: parsedState.pointsAwarded || false,
        }

        if (parsedState.gameCompletedToday) {
          setMessage(`¡Ya jugaste hoy! Vuelve en ${getTimeUntilReset()} para un nuevo desafío.`)
        } else {
          setMessage("¡Bienvenido de nuevo! Continúa tu desafío.")
        }
      } catch (e) {
        console.error("Error al parsear estado del juego. Reiniciando.")
        localStorage.removeItem(GAME_STATE_KEY)
        localStorage.removeItem(`lastPlayed_${GAME_TYPE_EQUIPO}`)
        setMessage("Error al cargar el juego. Se ha reiniciado.")
      }
    } else if (lastPlayedDateFromStorage === gameDate) {
      initialState.gameCompletedToday = true
      initialState.gameOutcome = "lose"
      setMessage(`¡Ya jugaste hoy! Vuelve en ${getTimeUntilReset()} para un nuevo desafío.`)
    } else {
      setMessage("¡Bienvenido! Adivina el jugador del día.")
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

=======
    setCurrentFormation(getDailyFormation())
    checkUserAuthentication()

    if (typeof window === "undefined") return // Asegurarse de que se ejecuta solo en el cliente

    const gameDate = getGameDateString()
    const savedStateString = localStorage.getItem(GAME_STATE_KEY)

    let loadedState: GameState | null = null
    if (savedStateString) {
      try {
        loadedState = JSON.parse(savedStateString)
      } catch (e) {
        console.error("Error al parsear el estado del juego de localStorage, se tratará como nuevo juego.", e)
        // Si el parseo falla, loadedState permanece null
      }
    }

    // --- DEBUGGING LOGS ---
    console.log("--- INICIO DE CARGA DE ESTADO ---")
    console.log("DEBUG: gameDate (actual):", gameDate)
    console.log("DEBUG: savedStateString (raw from localStorage):", savedStateString)
    console.log("DEBUG: loadedState (parsed):", loadedState)
    console.log("DEBUG: loadedState?.dailyChallenges?.length:", loadedState?.dailyChallenges?.length)
    console.log("DEBUG: loadedState?.date === gameDate:", loadedState?.date === gameDate)
    // --- FIN DEBUGGING LOGS ---

    // Determinar si debemos cargar un juego existente o iniciar uno nuevo
    const shouldLoadExistingGame =
      loadedState && // Hay un estado parseado
      loadedState.dailyChallenges &&
      loadedState.dailyChallenges.length > 0 && // Tiene desafíos válidos
      loadedState.date === gameDate // Y es para el día de juego actual

    console.log("DEBUG: shouldLoadExistingGame will be:", shouldLoadExistingGame)

    let currentDailyChallenges: ClubChallenge[] = []
    let currentChallengeIndexValue = 0
    let currentGuessedPlayers: Array<{ player: Player; assignedSlotId: string }> = []
    let currentHintsUsed = 0
    let currentGameCompletedToday = false
    let currentGameOutcome: "win" | "lose" | null = null
    let currentPointsAwarded = false

    if (shouldLoadExistingGame) {
      console.log("DEBUG: shouldLoadExistingGame es TRUE. Cargando estado existente.")
      currentDailyChallenges = loadedState!.dailyChallenges // Usamos '!' porque shouldLoadExistingGame ya verificó que no es null
      currentChallengeIndexValue = loadedState!.currentChallengeIndex
      currentGuessedPlayers = loadedState!.guessedPlayers
      currentHintsUsed = loadedState!.hintsUsed
      currentGameCompletedToday = loadedState!.gameCompletedToday
      currentGameOutcome = loadedState!.gameOutcome
      currentPointsAwarded = loadedState!.pointsAwarded
      setMessage(
        currentGameCompletedToday
          ? `¡Ya jugaste hoy! Vuelve en ${getTimeUntilReset()} para un nuevo desafío.`
          : "¡Bienvenido de nuevo! Continúa tu desafío.",
      )
    } else {
      console.log("DEBUG: shouldLoadExistingGame es FALSE. Iniciando un nuevo juego.")
      currentDailyChallenges = getDailyRandomClubChallenges()
      currentChallengeIndexValue = 0
      currentGuessedPlayers = []
      currentHintsUsed = 0
      currentGameCompletedToday = false
      currentGameOutcome = null
      currentPointsAwarded = false
      setMessage("¡Nuevo día! Comienza un nuevo desafío.")
      // NO ELIMINAR localStorage aquí. El siguiente useEffect lo sobrescribirá.
    }

    // Establecer el valor del useRef y los estados de React
    dailyClubChallenges.current = currentDailyChallenges
    console.log("DEBUG: dailyClubChallenges.current after init:", dailyClubChallenges.current)
    setGuessedPlayers(currentGuessedPlayers)
    setCurrentChallengeIndex(currentChallengeIndexValue)
    setGameCompletedToday(currentGameCompletedToday)
    setGameOutcome(currentGameOutcome)
    setHintsUsed(currentHintsUsed)
    setPointsAwarded(currentPointsAwarded)

    console.log("--- FIN DE CARGA DE ESTADO ---")

    const interval = setInterval(() => {
      setTimeToReset(getTimeUntilReset())
    }, 60 * 1000)

    setTimeToReset(getTimeUntilReset())

    return () => clearInterval(interval)
  }, []) // Array de dependencias vacío para que se ejecute solo en la carga inicial
>>>>>>> origin/Jona

  // Efecto para guardar el estado del juego cada vez que cambie
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
<<<<<<< HEAD
        dailyChallenges: dailyClubChallenges.current,
      }
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState))
=======
        dailyChallenges: dailyClubChallenges.current, // GUARDAR LOS DESAFÍOS DIARIOS
        date: getGameDateString(), // Asegurarse de guardar la fecha del juego
      }
      console.log("--- INTENTANDO GUARDAR ESTADO ---")
      console.log("Estado a guardar:", gameState)
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState))
      console.log("Estado guardado en localStorage (después de setItem):", localStorage.getItem(GAME_STATE_KEY))
      console.log("--- FIN INTENTO DE GUARDADO ---")
>>>>>>> origin/Jona
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

      // 3. Debe haber una posición disponible para él
      const matchingSlots = currentFormation.filter((p) => p.positionKey === player.position)
      const occupiedSlotIds = guessedPlayers.map((gp) => gp.assignedSlotId)
      const hasAvailableSlot = matchingSlots.some((slot) => !occupiedSlotIds.includes(slot.id))
      if (!hasAvailableSlot) return false

      return true
    })

<<<<<<< HEAD
=======
    console.log(
      "Valid players found:",
      validPlayers.map((p) => ({ name: p.name, position: p.position })),
    )

>>>>>>> origin/Jona
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
          setMessage(`Todas las posiciones para ${foundPlayers[0].name} ya están ocupadas en esta formación.`)
        }
      }
      return
    }

    // Si hay múltiples jugadores válidos, mostrar selector
    if (validPlayers.length > 1) {
<<<<<<< HEAD
=======
      console.log("Showing player selection with players:", validPlayers)
>>>>>>> origin/Jona
      setMultiplePlayersFound(validPlayers)
      setSearchedName(playerName)
      setShowPlayerSelection(true)
      setMessage(`Se encontraron ${validPlayers.length} jugadores con ese nombre. Selecciona cuál quieres usar:`)
      return
    }

    // Si solo hay un jugador válido, proceder normalmente
    processPlayerSelection(validPlayers[0])
  }

<<<<<<< HEAD
  const processPlayerSelection = (selectedPlayer: Player) => {
=======
  const processPlayerSelection = async (selectedPlayer: Player) => {
>>>>>>> origin/Jona
    // Encontrar slot disponible para el jugador seleccionado
    const matchingSlots = currentFormation.filter((p) => p.positionKey === selectedPlayer.position)
    const occupiedSlotIds = guessedPlayers.map((gp) => gp.assignedSlotId)
    const availableSlot = matchingSlots.find((slot) => !occupiedSlotIds.includes(slot.id))

    if (!availableSlot) {
      setMessage(`Todas las posiciones de ${selectedPlayer.position} ya están ocupadas en esta formación.`)
      return
    }

    // PRIMERO: Agregar el jugador al estado
    const newGuessedPlayers = [...guessedPlayers, { player: selectedPlayer, assignedSlotId: availableSlot.id }]
    setGuessedPlayers(newGuessedPlayers)

    // SEGUNDO: Iniciar animación de voltear
    setFlippingPlayer(availableSlot.id)

    // TERCERO: Limpiar la animación después de que termine
    setTimeout(() => {
      setFlippingPlayer(null)
    }, 700) // Un poco más de tiempo para que se vea bien

<<<<<<< HEAD
=======
    console.log("Estado de guessedPlayers después de setGuessedPlayers:", newGuessedPlayers)
>>>>>>> origin/Jona
    setMessage(`¡Correcto! ${selectedPlayer.name} ha sido colocado en el campo como ${selectedPlayer.position}.`)

    // Cerrar selector si estaba abierto
    setShowPlayerSelection(false)
    setMultiplePlayersFound([])
    setSearchedName("")

    // Verificar si se completó la formación
    if (newGuessedPlayers.length === currentFormation.filter((p) => p.type === "player").length) {
      setMessage(`¡Felicidades! Has completado la formación de hoy. Vuelve en ${timeToReset} para un nuevo desafío.`)
      setGameCompletedToday(true)
      setGameOutcome("win")

<<<<<<< HEAD
      // PRIMERO: Marcar como jugado en localStorage (método original)
      const gameDate = getGameDateString()
      localStorage.setItem(`lastPlayed_${GAME_TYPE_EQUIPO}`, gameDate)

      // SEGUNDO: Intentar otorgar puntos usando las nuevas utilidades
      if (userLoggedIn && !pointsAwarded) {
        const pointsGranted = awardPoints(GAME_TYPE_EQUIPO)
        if (pointsGranted) {
          setPointsAwarded(true)
        } else {
        }
      }

      // TERCERO: Guardar en Supabase (opcional, no bloquea el juego)
=======
      // Intentar otorgar puntos usando las nuevas utilidades
      if (userLoggedIn && !pointsAwarded) {
        awardPoints(GAME_TYPE_EQUIPO).then((pointsGranted) => {
          // Usar .then() para manejar la promesa
          if (pointsGranted) {
            setPointsAwarded(true)
            console.log("Puntos otorgados exitosamente")
          } else {
            console.log("No se pudieron otorgar puntos (ya otorgados o usuario no logueado)")
          }
        })
      }

      // Guardar en Supabase y marcar como jugado (esto también setea lastPlayed_equipo)
>>>>>>> origin/Jona
      markAsPlayedToday(GAME_TYPE_EQUIPO, true, {
        guessedPlayers: newGuessedPlayers,
        currentChallengeIndex,
        hintsUsed,
      }).catch((error) => {
        console.error("Error al guardar en Supabase:", error)
        // El juego continúa funcionando aunque falle Supabase
      })

      return
    }

    // Avanzar al siguiente desafío
    setTimeout(() => {
      const nextIndex = (currentChallengeIndex + 1) % dailyClubChallenges.current.length
      setCurrentChallengeIndex(nextIndex)
<<<<<<< HEAD
=======
      console.log("currentChallengeIndex después de setTimeout:", nextIndex)
>>>>>>> origin/Jona
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

<<<<<<< HEAD
  const handleGiveUp = () => {
=======
  const handleGiveUp = async () => {
>>>>>>> origin/Jona
    if (gameCompletedToday) {
      setMessage(`¡Ya jugaste hoy! Vuelve en ${getTimeUntilReset()} para un nuevo desafío.`)
      return
    }
    setMessage(`Te has rendido para ${currentPrimaryClubName} y ${secondaryClubName}. ¡Mejor suerte la próxima vez!`)
    setGameCompletedToday(true)
    setGameOutcome("lose")

<<<<<<< HEAD
    // PRIMERO: Marcar como jugado en localStorage (método original)
    const gameDate = getGameDateString()
    localStorage.setItem(`lastPlayed_${GAME_TYPE_EQUIPO}`, gameDate)

    // SEGUNDO: Guardar en Supabase (opcional, no bloquea el juego)
=======
    // Guardar en Supabase y marcar como jugado (esto también setea lastPlayed_equipo)
>>>>>>> origin/Jona
    markAsPlayedToday(GAME_TYPE_EQUIPO, false, {
      guessedPlayers,
      currentChallengeIndex,
      hintsUsed,
    }).catch((error) => {
      console.error("Error al guardar en Supabase:", error)
      // El juego continúa funcionando aunque falle Supabase
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

    // Solo verificar si ya se alcanzó el límite total de pistas
    if (hintsUsed >= MAX_HINTS) {
      setMessage(`Ya usaste todas las pistas disponibles (${MAX_HINTS}/${MAX_HINTS}).`)
      return
    }

    const potentialHints = players.filter((p) => {
      const playedForPrimaryClub = p.clubs.includes(currentPrimaryClubName)
      const playedForSecondaryClub = p.clubs.includes(secondaryClubName)
      const alreadyGuessed = guessedPlayers.some((gp) => gp.player.name === p.name)

      const matchingSlots = currentFormation.filter((pos) => pos.positionKey === p.position)
      const occupiedSlotIds = guessedPlayers.map((gp) => gp.assignedSlotId)
      const hasAvailableSlot = matchingSlots.some((slot) => !occupiedSlotIds.includes(slot.id))

      return playedForPrimaryClub && playedForSecondaryClub && !alreadyGuessed && hasAvailableSlot
    })

    if (potentialHints.length > 0) {
      const hint = potentialHints[Math.floor(Math.random() * potentialHints.length)]
      setHintedPlayerName(hint.name)
      setHintsUsed(hintsUsed + 1) // Incrementar contador de pistas
      const remainingHints = MAX_HINTS - (hintsUsed + 1)
      setMessage(
        `Pista: ¡Podría ser ${hint.name}! Intenta ingresarlo. (Pistas restantes: ${remainingHints}/${MAX_HINTS})`,
      )
    } else {
      setMessage("No hay pistas disponibles para este desafío en este momento.")
    }
  }

  const handleResetGame = () => {
<<<<<<< HEAD
    if (typeof window !== "undefined") {
      localStorage.removeItem(GAME_STATE_KEY)
      localStorage.removeItem(`lastPlayed_${GAME_TYPE_EQUIPO}`)
=======
    console.log("--- Reiniciando juego manualmente ---")
    if (typeof window !== "undefined") {
      localStorage.removeItem(GAME_STATE_KEY)
      localStorage.removeItem(`lastPlayed_${GAME_TYPE_EQUIPO}`)
      console.log("Juego reiniciado. localStorage limpiado.")
>>>>>>> origin/Jona
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
<<<<<<< HEAD
=======
    // Regenerar los desafíos diarios al reiniciar manualmente
    dailyClubChallenges.current = getDailyRandomClubChallenges()
>>>>>>> origin/Jona
    setMessage("¡Juego reiniciado! Adivina un nuevo jugador.")
  }

  // Calcular si el botón de pista debe estar deshabilitado
  const isHintButtonDisabled = hintsUsed >= MAX_HINTS || gameCompletedToday

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <GameHeader />

      {/* Panel de usuario */}
      {currentUser && (
        <div className="bg-gray-800 p-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="text-green-400">✓ {currentUser.email}</span>
            <span className="text-yellow-400">Logueado</span>
          </div>
        </div>
      )}

      {/* Vista cuando el juego está terminado */}
      {gameCompletedToday && gameOutcome !== null ? (
        <div className="flex flex-col items-center justify-center gap-8 p-8 min-h-[calc(100vh-120px)]">
          <FootballPitch
            guessedPlayers={guessedPlayers}
            currentFormation={currentFormation}
            showPlayerNames={false}
            flippingPlayer={flippingPlayer}
          />
          <GameCompletedMessage
            isCorrect={gameOutcome === "win"}
            correctAnswer=""
            pointsAwarded={pointsAwarded && userLoggedIn}
            userLoggedIn={userLoggedIn}
            timeToReset={timeToReset}
          />
        </div>
      ) : (
        /* Vista durante el juego */
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 p-8">
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
          <FootballPitch
            guessedPlayers={guessedPlayers}
            currentFormation={currentFormation}
            showPlayerNames={true}
            flippingPlayer={flippingPlayer}
          />

          {/* Selector de jugadores múltiples */}
          {showPlayerSelection && (
            <PlayerSelection
              players={multiplePlayersFound}
              searchedName={searchedName}
              onPlayerSelect={handlePlayerSelect}
              onCancel={handleCancelSelection}
            />
          )}
        </div>
      )}
<<<<<<< HEAD
=======

      
>>>>>>> origin/Jona
    </div>
  )
}
