import type { VideoDelDia } from "@/types/video-del-dia"


export const videosDelDia: VideoDelDia[] = [
  {
    id: "video-001",
    fecha: "2025-01-01",
    videoUrl: "/videos/videodeldia1.mp4",
    pregunta: "¿Qué paso en este video?",
    opciones: ["Se la pasa al compañero", "La tira afuera", "La clava al angulo", "Tapa el arquero"],
    respuestaCorrecta: 2, 

    duracionPreview: 5,
  },
  {
    id: "video-002",
    fecha: "2025-01-02",
    videoUrl: "/videos/videodeldia2.mp4",
    pregunta: "¿Que finaliza la jugada?",
    opciones: ["Tapa el arquero", "Gol al segundo palo", "Pega en el palo", "La tira por arriba"],
    respuestaCorrecta: 0, 
    duracionPreview: 5,
  },
]

// Función para obtener el video del día
export function getVideoDelDia(fecha?: string): VideoDelDia | null {
  const targetDate = fecha || new Date().toLocaleDateString('en-CA')
  
  // Buscar video exacto para la fecha
  const videoExacto = videosDelDia.find((video) => video.fecha === targetDate)
  if (videoExacto) return videoExacto
  
  // Si no hay video exacto, buscar el más reciente disponible
  const videosDisponibles = videosDelDia.filter(video => video.fecha <= targetDate)
  if (videosDisponibles.length > 0) {
    return videosDisponibles.sort((a, b) => b.fecha.localeCompare(a.fecha))[0]
  }
  
  return videosDelDia[0] // Fallback
}

// Función para obtener todos los videos (para admin)
export function getAllVideos(): VideoDelDia[] {
  return videosDelDia
}

// Función para obtener video por ID
export function getVideoById(id: string): VideoDelDia | null {
  return videosDelDia.find((video) => video.id === id) || null
}
