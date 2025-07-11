import { getSupabaseClient } from "./supabase-browser"
import { getCurrentUser as getAuthCurrentUser } from "./jwt-auth"
import { getTodayAsString } from "./dateUtils" // Solo getTodayAsString
import type { GameType } from "./dateUtils" // Importar GameType para tipado

// Función para marcar un juego como jugado hoy
// Ahora esta función es la responsable de registrar la sesión en la BD y en localStorage
export async function markAsPlayedToday(
  gameType: GameType,
  won: boolean,
  attempts: number | null = null,
): Promise<void> {
  if (typeof window === "undefined") return // Asegurarse de que estamos en el cliente
  const todayDateString = getTodayAsString()
  const storageKey = `lastPlayed_${gameType}` // Clave consistente

  // 1. Actualizar localStorage (siempre)
  localStorage.setItem(storageKey, todayDateString)
  

  // 2. Registrar en la base de datos (si hay usuario logueado)
  const user = getAuthCurrentUser()
  

  if (user) {
    const supabase = getSupabaseClient()
    if (!supabase) {
      
      return
    }
    try {
      const sessionData = {
        user_id: user.id,
        game_type: gameType,
        date: todayDateString,
        completed: true,
        won: won,
        attempts: attempts, // Para juegos como Wordle
        answer: null, // Si aplica, se podría guardar la respuesta aquí
      }
      

      const { error } = await supabase.from("game_sessions").insert(sessionData)

      if (error) {
        console.error("❌ Error al guardar sesión de juego en 'game_sessions':", error)
        // Log the full error object for more details
        console.error("   - Supabase Error Details:", error.message, error.details, error.hint, error.code)
      } else {
        
      }
    } catch (error) {
      console.error("💥 Error en markAsPlayedToday (BD):", error)
    }
  } else {
    
  }
}

export async function awardPoints(gameType: GameType) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    
    return false
  }
  try {
    const user = getAuthCurrentUser()
    if (!user) {
      
      return false
    }

    const points = 10
    

    // La verificación de si ya jugó hoy se hace antes de llamar a awardPoints
    // en los componentes de página, usando hasPlayedGameToday.
    // awardPoints solo se llama si el juego fue ganado y el usuario está logueado.

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
      
    } else {
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
      
      
    }

    // NO LLAMAR markAsPlayed aquí. markAsPlayedToday lo hará.

    setTimeout(() => {
      if (typeof window !== "undefined" && (window as any).refreshUserProfile) {
        
        ;(window as any).refreshUserProfile()
      }
    }, 1000)

    return true
  } catch (error) {
    console.error("💥 Error en awardPoints:", error)
    return false
  }
}

// Esta función ahora es un alias para canPlayAgain negado, pero con la clave correcta
// Es mejor usar directamente canPlayAgain para la lógica de "puede jugar de nuevo"
// y hasPlayedGameToday para la verificación de si ya jugó hoy.
// Para consistencia con el nombre, la mantendremos, pero su uso principal debería ser hasPlayedGameToday.
export function hasPlayedToday(gameType: GameType): boolean {
  if (typeof window === "undefined") return false
  const lastPlayed = localStorage.getItem(`lastPlayed_${gameType}`)
  const today = getTodayAsString()
  const result = lastPlayed === today
  return result
}

export async function refreshUserProfile() {
  if (typeof window !== "undefined" && (window as any).refreshUserProfile) {
    
    await (window as any).refreshUserProfile()
  }
}

export async function hasPlayedGameToday(gameType: GameType): Promise<boolean> {
  const supabase = getSupabaseClient()
  const today = getTodayAsString()
  const user = getAuthCurrentUser() // Obtener el usuario logueado

  

  // Si hay un usuario logueado, SIEMPRE consultar la base de datos primero
  if (user) {
    if (!supabase) {
      
      return false
    }
    try {
      
      const { data, error } = await supabase
        .from("game_sessions")
        .select("id")
        .eq("user_id", user.id)
        .eq("game_type", gameType)
        .eq("date", today)
        .maybeSingle()

      if (error) {
        console.error(`❌ Error verificando ${gameType} en BD:`, error)
        return false
      }

      if (data) {
        // Sincronizar con localStorage si se encontró en BD (para futuras sesiones no logueadas)
        if (typeof window !== "undefined") {
          localStorage.setItem(`lastPlayed_${gameType}`, today)
        }
        return true
      }

      return false // No ha jugado en BD, puede jugar
    } catch (error) {
      console.error(`💥 Error en hasPlayedGameToday (BD) para ${gameType}:`, error)
      return false
    }
  } else {
    // Si NO hay usuario logueado, verificar solo en localStorage
    if (typeof window === "undefined") {
      return false
    }
    const localCheck = localStorage.getItem(`lastPlayed_${gameType}`) === today
    return localCheck
  }
}

export async function getCurrentUserProfile() {
  if (typeof window !== "undefined" && (window as any).getCurrentProfile) {
    return (window as any).getCurrentProfile()
  }
  return null
}

export async function getCurrentUser() {
  return getAuthCurrentUser()
}
