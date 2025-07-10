export function getTodayAsString(): string {
  const today = new Date()
  return today.toISOString().split("T")[0] // YYYY-MM-DD
}

export function hasPlayedToday(gameType = ""): boolean {
  const today = getTodayAsString()
  const storageKey = gameType ? `futfactos-${gameType}-last-played` : "futfactos-last-played"
  const lastPlayed = localStorage.getItem(storageKey)
  return lastPlayed === today
}

export function canPlayAgain(gameType = ""): boolean {
  const today = getTodayAsString()
  const storageKey = gameType ? `futfactos-${gameType}-last-played` : "futfactos-last-played"
  const lastPlayed = localStorage.getItem(storageKey)
  return lastPlayed !== today
}

export function clearPreviousDayData(): void {
  const today = getTodayAsString()

  // Limpiar datos de trivia
  const lastPlayedTrivia = localStorage.getItem("futfactos-trivia-last-played")
  if (lastPlayedTrivia && lastPlayedTrivia !== today) {
    localStorage.removeItem("futfactos-trivia-game-state")
  }

  // Limpiar datos de jugador
  const lastPlayedJugador = localStorage.getItem("futfactos-jugador-last-played")
  if (lastPlayedJugador && lastPlayedJugador !== today) {
    localStorage.removeItem("futfactos-jugador-game-state")
  }
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
