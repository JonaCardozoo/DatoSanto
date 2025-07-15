import { getTodayAsString } from "./dateUtils"
import type { GameType } from "./dateUtils"
import { getSupabaseClient } from "./supabase-browser"
import { getCurrentUser as getAuthCurrentUser } from "./jwt-auth"

// 🔹 Marcar como jugado y guardar estado completo en localStorage (si está logueado también guarda en BD para puntos)
export async function markAsPlayedToday(
  gameType: GameType,
  won: boolean,
  attempts: number | null = null,
  guesses: string[] = [], // Añadido para guardar las adivinanzas
  pointsAwarded = false, // Añadido para guardar si se otorgaron puntos
): Promise<void> {
  if (typeof window === "undefined") return
  const today = getTodayAsString()

  // 1. Guardar en localStorage
  localStorage.setItem(`lastPlayed_${gameType}`, today)

  const gameStateKey = `futfactos-${gameType}-game-state`
  const existing = localStorage.getItem(gameStateKey)
  let state = {}

  if (existing) {
    try {
      state = JSON.parse(existing)
    } catch (e) {
      console.error("Error parsing existing game state from localStorage:", e)
      // Si el estado está corrupto, lo sobreescribimos
    }
  }

  const newState = {
    ...state, // Mantener cualquier otra propiedad que pudiera existir
    date: today,
    gameCompleted: true, // Marcar como completado al finalizar
    gameWon: won,
    currentRow: attempts || 0,
    pointsAwarded: pointsAwarded, // Usar el valor pasado
    guesses: guesses, // Guardar el array de adivinanzas
  }

  localStorage.setItem(gameStateKey, JSON.stringify(newState))

  // 2. Guardar en Supabase solo para tracking, si hay sesión
  const user = getAuthCurrentUser()
  if (!user) return

  const supabase = getSupabaseClient()
  if (!supabase) return

  try {
    const { error } = await supabase.from("game_sessions").insert({
      user_id: user.id,
      game_type: gameType,
      date: today,
      completed: true,
      won,
      attempts,
      answer: null, // Puedes guardar la respuesta si es necesario
    })

    if (error) {
      console.error("❌ Error al guardar sesión en Supabase:", error)
    }
  } catch (err) {
    console.error("💥 Error inesperado al guardar sesión:", err)
  }
}

// 🔹 Obtener si jugó hoy (solo localStorage)
export function hasPlayedToday(gameType: GameType): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(`lastPlayed_${gameType}`) === getTodayAsString()
}

// 🔹 Alternativa asíncrona (si querés dejarla por compatibilidad)
export async function hasPlayedGameToday(gameType: GameType): Promise<boolean> {
  return hasPlayedToday(gameType)
}

// 🔹 Otorgar puntos si ganó (requiere sesión activa)
export async function awardPoints(gameType: GameType): Promise<boolean> {
  const supabase = getSupabaseClient()
  const user = getAuthCurrentUser()
  if (!supabase || !user) return false

  try {
    const points = 10

    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, points, games_won")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("❌ Error buscando perfil:", profileError)
      return false
    }

    let updatedProfile = null
    if (!existingProfile) {
      const username = user.user_metadata?.username || user.email?.split("@")[0] || `Usuario${user.id.slice(0, 8)}`
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username,
          email: user.email,
          points,
          games_won: 1,
          created_at: new Date().toISOString(),
        })
        .select("*")
        .single()
      if (error) return false
      updatedProfile = data
    } else {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          points: existingProfile.points + points,
          games_won: existingProfile.games_won + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select("*")
        .single()
      if (error) return false
      updatedProfile = data
    }

    // Refrescar perfil (si se usa en frontend)
    setTimeout(() => {
      if (typeof window !== "undefined" && (window as any).refreshUserProfile) {
        ;(window as any).refreshUserProfile()
      }
    }, 1000)

    return true
  } catch (err) {
    console.error("💥 Error al otorgar puntos:", err)
    return false
  }
}

// 🔹 Funciones auxiliares
export async function getCurrentUserProfile() {
  if (typeof window !== "undefined" && (window as any).getCurrentProfile) {
    return (window as any).getCurrentProfile()
  }
  return null
}

export async function refreshUserProfile() {
  if (typeof window !== "undefined" && (window as any).refreshUserProfile) {
    await (window as any).refreshUserProfile()
  }
}

export function getCurrentUser() {
  return getAuthCurrentUser()
}
