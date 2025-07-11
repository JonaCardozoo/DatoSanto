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

// Función para verificar si se ha jugado hoy (solo usa localStorage)
export function hasPlayedToday(gameType: GameType): boolean {
  if (typeof window === "undefined") return false // Asegurarse de que estamos en el cliente
  const today = getTodayAsString()
  const storageKey = `lastPlayed_${gameType}` // Clave consistente
  const lastPlayed = localStorage.getItem(storageKey)
  const result = lastPlayed === today

  return result
}

// Función para verificar si se puede jugar de nuevo (solo usa localStorage)
export function canPlayAgain(gameType: GameType): boolean {
  if (typeof window === "undefined") return false // Asegurarse de que estamos en el cliente
  const lastPlayedDateString = localStorage.getItem(`lastPlayed_${gameType}`) // Clave consistente
  const todayDateString = getTodayAsString()


  if (!lastPlayedDateString) {
    return true // Si no hay registro, puede jugar
  }

  // Comparar las cadenas de fecha directamente
  const result = todayDateString > lastPlayedDateString
  
  return result
}

// Función para marcar un juego como jugado hoy en localStorage
export function markAsPlayed(gameType: GameType): void {
  if (typeof window === "undefined") return // Asegurarse de que estamos en el cliente
  const todayDateString = getTodayAsString()
  localStorage.setItem(`lastPlayed_${gameType}`, todayDateString) // Clave consistente
  
}

export function clearPreviousDayData(): void {
  const today = getTodayAsString()
  // Lista de todos los gameTypes para limpiar
  const allGameTypes: GameType[] = [GAME_TYPES.TRIVIA, GAME_TYPES.JUGADOR, GAME_TYPES.VIDEO]

  allGameTypes.forEach((gameType) => {
    const lastPlayedKey = `lastPlayed_${gameType}` // Clave consistente
    const gameStateKey = `futfactos-${gameType}-game-state` // Clave para el estado detallado

    const lastPlayed = localStorage.getItem(lastPlayedKey)
    if (lastPlayed && lastPlayed !== today) {
      
      localStorage.removeItem(gameStateKey) // Limpiar el estado detallado
      // No remover lastPlayedKey aquí, ya que se sobrescribirá al jugar o se usará para canPlayAgain
      // si el usuario no logueado vuelve al día siguiente.
    }
  })
  
}

export function getTimeUntilMidnight(): string {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0) // Próxima medianoche
  const diff = midnight.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}
