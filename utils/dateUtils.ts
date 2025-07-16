// Función para obtener la "fecha de juego" actual (cambia a las 23:00)
export function getGameDateString(): string {
  const now = new Date()
  const gameDate = new Date(now)
  
  // Si son antes de las 23:00, usamos la fecha actual
  // Si son las 23:00 o después, usamos la fecha del día siguiente
  if (now.getHours() >= 23) {
    gameDate.setDate(gameDate.getDate() + 1)
  }
  
  return gameDate.toISOString().split("T")[0] // YYYY-MM-DD
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