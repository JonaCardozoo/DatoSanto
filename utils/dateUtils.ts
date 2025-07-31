export function getGameDateString(): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  // Obtener partes bien separadas
  const parts = formatter.formatToParts(now)
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || "00"

  const year = getPart("year")
  const month = getPart("month")
  const day = getPart("day")
  const hour = parseInt(getPart("hour"))

  // Crear la fecha base
  const gameDate = new Date(`${year}-${month}-${day}T00:00:00`)
  if (hour >= 23) {
    gameDate.setDate(gameDate.getDate() + 1)
  }

  const dateStr = gameDate.toISOString().split("T")[0]
  console.log("🕒 Fecha de juego (ARG):", dateStr)
  return dateStr
}


// Función auxiliar para obtener la fecha real de hoy
export function getTodayAsString(): string {
  const today = new Date()
  return today.toISOString().split("T")[0] // YYYY-MM-DD
}

// Define los tipos de juego para un tipado fuerte
export const GAME_TYPES = {
  TRIVIA: "trivia",
  JUGADOR: "jugador",
  VIDEO: "video",
  EQUIPO: "equipo",
  
} as const

export type GameType = (typeof GAME_TYPES)[keyof typeof GAME_TYPES]

// Función para verificar si se ha jugado hoy (usa la fecha de juego que cambia a las 23:00)
export function hasPlayedToday(gameType: GameType): boolean {
  if (typeof window === "undefined") return false
  const gameDate = getGameDateString()
  const storageKey = `lastPlayed_${gameType}`
  const lastPlayed = localStorage.getItem(storageKey)
  const result = lastPlayed === gameDate

  return result
}

// Función para verificar si se puede jugar de nuevo
export function canPlayAgain(gameType: GameType): boolean {
  if (typeof window === "undefined") return false
  const lastPlayedDateString = localStorage.getItem(`lastPlayed_${gameType}`)
  const gameDateString = getGameDateString()

  if (!lastPlayedDateString) {
    return true // Si no hay registro, puede jugar
  }

  // Comparar las cadenas de fecha directamente
  const result = gameDateString > lastPlayedDateString
  
  return result
}

// Función para marcar un juego como jugado hoy
export function markAsPlayed(gameType: GameType): void {
  if (typeof window === "undefined") return
  const gameDateString = getGameDateString()
  localStorage.setItem(`lastPlayed_${gameType}`, gameDateString)
}

export function clearPreviousDayData(): void {
  const gameDate = getGameDateString()
  // Lista de todos los gameTypes para limpiar
  const allGameTypes: GameType[] = [GAME_TYPES.TRIVIA, GAME_TYPES.JUGADOR, GAME_TYPES.VIDEO]

  allGameTypes.forEach((gameType) => {
    const lastPlayedKey = `lastPlayed_${gameType}`
    const gameStateKey = `futfactos-${gameType}-game-state`

    const lastPlayed = localStorage.getItem(lastPlayedKey)
    if (lastPlayed && lastPlayed !== gameDate) {
      localStorage.removeItem(gameStateKey)
    }
  })
}

// Función para obtener el tiempo hasta el próximo reset (23:00)
export function getTimeUntilReset(): string {
  const now = new Date()
  const nextReset = new Date()
  
  // Si son antes de las 23:00, el próximo reset es hoy a las 23:00
  // Si son las 23:00 o después, el próximo reset es mañana a las 23:00
  if (now.getHours() < 23) {
    nextReset.setHours(23, 0, 0, 0)
  } else {
    nextReset.setDate(nextReset.getDate() + 1)
    nextReset.setHours(23, 0, 0, 0)
  }
  
  const diff = nextReset.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

// Función alternativa si quieres mantener getTimeUntilMidnight para compatibilidad
export function getTimeUntilMidnight(): string {
  return getTimeUntilReset()
}