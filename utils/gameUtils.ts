import { getGameDateString } from "./dateUtils" // Cambio aquí
import type { GameType } from "./dateUtils"
import { getSupabaseClient } from "./supabase-browser"
import { getCurrentUser as getAuthCurrentUser } from "./jwt-auth"

// Guardar estado local y marcar jugado hoy
export async function markAsPlayedToday(
  gameType: GameType,
  won: boolean,
  extraState: Record<string, any> = {}
): Promise<void> {
  if (typeof window === "undefined") return
  const gameDate = getGameDateString() // Cambio aquí

  localStorage.setItem(`lastPlayed_${gameType}`, gameDate) // Cambio aquí

  const gameStateKey = `futfactos-${gameType}-game-state`
  const existing = localStorage.getItem(gameStateKey)
  let state = {}

  if (existing) {
    try {
      state = JSON.parse(existing)
    } catch (e) {
      console.error("Error parsing existing game state from localStorage:", e)
    }
  }

  const newState = {
    ...state,
    date: gameDate, // Cambio aquí
    gameCompleted: true,
    gameWon: won,
    ...extraState, // aquí mezclamos el estado extra (como selectedAnswer, isCorrect, pointsAwarded)
  }

  localStorage.setItem(gameStateKey, JSON.stringify(newState))

  // Guardar en Supabase (igual que antes)
  const user = getAuthCurrentUser()
  if (!user) return

  const supabase = getSupabaseClient()
  if (!supabase) return

  try {
    const { error } = await supabase.from("game_sessions").insert({
      user_id: user.id,
      game_type: gameType,
      date: gameDate,
      completed: true,
      won,
      attempts: null,
      answer: null,
    })

    if (error) {
      console.error("Error guardando sesión en Supabase:", error)
    }
  } catch (err) {
    console.error("Error inesperado guardando sesión:", err)
  }
}


// Saber si ya jugó hoy (localStorage)
export function hasPlayedToday(gameType: GameType): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(`lastPlayed_${gameType}`) === getGameDateString() // Cambio aquí
}

// Otorgar puntos sólo una vez por día
export async function awardPoints(gameType: GameType): Promise<boolean> {
  const supabase = getSupabaseClient()
  const user = getAuthCurrentUser()
  if (!supabase || !user) return false

  const gameDate = getGameDateString() // Cambio aquí

  try {
    // Verificar si ya ganó hoy
    const { data: sessions, error: sessionsError } = await supabase
      .from("game_sessions")
      .select("id")
      .eq("user_id", user.id)
      .eq("game_type", gameType)
      .eq("date", gameDate) // Cambio aquí
      .eq("won", true)
      .limit(1)

    if (sessionsError) {
      console.error("Error verificando sesión ganada:", sessionsError)
      return false
    }

    if (sessions && sessions.length > 0) {
      // Ya ganó hoy, no otorgar puntos
      return false
    }

    // Otorgar puntos
    const points = 10

    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, points, games_won")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("Error buscando perfil:", profileError)
      return false
    }

    if (!existingProfile) {
      const username = user.user_metadata?.username || user.email?.split("@")[0] || `Usuario${user.id.slice(0, 8)}`
      const { error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username,
          email: user.email,
          points,
          games_won: 1,
          created_at: new Date().toISOString(),
        })
      if (error) return false
    } else {
      const { error } = await supabase
        .from("profiles")
        .update({
          points: existingProfile.points + points,
          games_won: existingProfile.games_won + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
      if (error) return false
    }

    // Refrescar perfil en frontend (si tienes función global)
    setTimeout(() => {
      if (typeof window !== "undefined" && (window as any).refreshUserProfile) {
        ;(window as any).refreshUserProfile()
      }
    }, 1000)

    return true
  } catch (err) {
    console.error("Error al otorgar puntos:", err)
    return false
  }
}