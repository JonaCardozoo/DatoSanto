import { getSupabaseClient } from "./supabase-browser"

export async function awardPoints(gameType: "trivia" | "jugador") {
  const supabase = getSupabaseClient()

  if (!supabase) {
    console.log("⚠️ Supabase no configurado - no se pueden otorgar puntos")
    return false
  }

  try {
    // Obtener usuario actual
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("❌ No hay usuario logueado para otorgar puntos")
      return false
    }

    const points = 10 // Siempre 10 puntos por juego ganado
    console.log(`🎯 Intentando otorgar ${points} puntos para ${gameType} al usuario: ${user.email}`)

    // Verificar si ya jugó hoy este juego específico
    const today = new Date().toISOString().split("T")[0]
    const gameKey = `${gameType}_${today}`

    // Verificar en localStorage primero (más rápido)
    if (typeof window !== "undefined") {
      const alreadyPlayed = localStorage.getItem(gameKey)
      if (alreadyPlayed === "completed") {
        console.log("❌ Ya jugó este juego hoy (localStorage)")
        return false
      }
    }

    // Verificar si el perfil existe y obtener datos actuales
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, points, games_won")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("❌ Error verificando perfil:", profileError)
      return false
    }

    let updatedProfile

    if (!existingProfile) {
      console.log("🆕 Perfil no existe, creando uno nuevo...")
      // Crear perfil nuevo con puntos
      const username = user.user_metadata?.username || user.email?.split("@")[0] || `Usuario${user.id.slice(0, 8)}`

      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            username: username,
            email: user.email,
            points: points,
            games_won: 1,
            created_at: new Date().toISOString(),
          },
        ])
        .select("id, username, points, games_won")
        .single()

      if (createError) {
        console.error("❌ Error creando perfil:", createError)
        return false
      }

      updatedProfile = newProfile
      console.log(`✅ Perfil creado con ${points} puntos:`, newProfile)
    } else {
      // Actualizar perfil existente
      const newPoints = (existingProfile.points || 0) + points
      const newGamesWon = (existingProfile.games_won || 0) + 1

      const { data: updated, error: updateError } = await supabase
        .from("profiles")
        .update({
          points: newPoints,
          games_won: newGamesWon,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select("id, username, points, games_won")
        .single()

      if (updateError) {
        console.error("❌ Error actualizando perfil:", updateError)
        return false
      }

      updatedProfile = updated
      console.log(`✅ Puntos otorgados exitosamente: +${points} puntos por ${gameType}`)
      console.log(`📊 Puntos totales: ${newPoints} | Juegos ganados: ${newGamesWon}`)
    }

    // Marcar como jugado hoy en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(gameKey, "completed")
      console.log(`✅ Marcado como jugado en localStorage: ${gameKey}`)
    }

    // Refrescar el perfil en el header con un pequeño delay
    setTimeout(() => {
      if (typeof window !== "undefined" && (window as any).refreshUserProfile) {
        console.log("🔄 Refrescando perfil en header...")
        ;(window as any).refreshUserProfile()
      }
    }, 1000)

    return true
  } catch (error) {
    console.error("💥 Error en awardPoints:", error)
    return false
  }
}

export function hasPlayedToday(gameType: "trivia" | "jugador"): boolean {
  if (typeof window === "undefined") return false

  const today = new Date().toISOString().split("T")[0]
  const gameKey = `${gameType}_${today}`
  const hasPlayed = localStorage.getItem(gameKey) === "completed"

  console.log(`🎮 Verificando si jugó ${gameType} hoy: ${hasPlayed ? "Sí" : "No"}`)
  return hasPlayed
}

export function markAsPlayedToday(gameType: "trivia" | "jugador"): void {
  if (typeof window === "undefined") return

  const today = new Date().toISOString().split("T")[0]
  const gameKey = `${gameType}_${today}`
  localStorage.setItem(gameKey, "completed")
  console.log(`✅ Marcado como jugado hoy: ${gameKey}`)
}

export async function refreshUserProfile() {
  if (typeof window !== "undefined" && (window as any).refreshUserProfile) {
    console.log("🔄 Refrescando perfil en header...")
    await (window as any).refreshUserProfile()
  }
}

export async function hasPlayedGameToday(gameType: "trivia" | "jugador"): Promise<boolean> {
  const supabase = getSupabaseClient()

  // Verificar en localStorage primero (más confiable)
  const today = new Date().toISOString().split("T")[0]
  const gameKey = `${gameType}_${today}`

  if (typeof window !== "undefined") {
    const localCheck = localStorage.getItem(gameKey) === "completed"
    if (localCheck) {
      console.log(`🎮 Ya jugó ${gameType} hoy (localStorage)`)
      return true
    }
  }

  // Si Supabase no está configurado, usar solo localStorage
  if (!supabase) {
    console.log("⚠️ Supabase no configurado, usando solo localStorage")
    return false
  }

  try {
    // Verificar si hay usuario logueado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("❌ No hay usuario logueado, usando localStorage")
      return false
    }

    // Verificar en la base de datos como respaldo
    const columnName = `${gameType}_last_played`
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(columnName)
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error(`❌ Error verificando ${gameType} en BD:`, profileError)
      return false
    }

    if (profile && profile[columnName] === today) {
      console.log(`🎮 Ya jugó ${gameType} hoy (BD)`)
      // Sincronizar con localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(gameKey, "completed")
      }
      return true
    }

    console.log(`✅ No ha jugado ${gameType} hoy`)
    return false
  } catch (error) {
    console.error(`💥 Error en hasPlayedGameToday para ${gameType}:`, error)
    return false
  }
}

export async function getCurrentUserProfile() {
  if (typeof window !== "undefined" && (window as any).getCurrentProfile) {
    return (window as any).getCurrentProfile()
  }
  return null
}

export async function getCurrentUser() {
  if (typeof window !== "undefined" && (window as any).getCurrentUser) {
    return (window as any).getCurrentUser()
  }
  return null
}
