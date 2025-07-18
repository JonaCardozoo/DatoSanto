import type { VideoDelDia } from "@/types/video-del-dia"
import { getTodayAsString, getGameDateString } from "@/utils/dateUtils"


export const videosDelDia: VideoDelDia[] = [
  {
    id: "video-001",
    fecha: "2025-07-14",
    videoUrl: "/videos/videodeldia1.mp4",
    opciones: ["Se la pasa al compañero", "La tira afuera", "La clava al angulo", "Tapa el arquero"],
    respuestaCorrecta: 2, 

    duracionPreview: 5,
  },
  {
    id: "video-002",
    fecha: "2025-07-15",
    videoUrl: "/videos/videodeldia2.mp4",
    opciones: ["Tapa el arquero", "Gol al segundo palo", "Pega en el palo", "La tira por arriba"],
    respuestaCorrecta: 0, 
    duracionPreview: 5,
  },
  {
  id: "video-003",
    fecha: "2025-07-16",
    videoUrl: "/videos/videodeldia3.mp4",
    opciones: ["Pase al medio y gol", "Intercepta el defensor", "Pase al medio y la tira afuera", "Le pega al arco"],
    respuestaCorrecta: 0, 
    duracionPreview: 5,
  },
    {
  id: "video-004",
    fecha: "2025-07-17",
    videoUrl: "/videos/videodeldia4.mp4",
    opciones: ["Gol por arriba", "Pase al compañero", "Gol por abajo", "nose"],
    respuestaCorrecta: 0, 
    duracionPreview: 5,
  },
  {
  id: "video-005",
    fecha: "2025-07-18",
    videoUrl: "/videos/videodeldia5.mp4",
    opciones: ["Gol por arriba", "Pase al compañero", "Gol por abajo", "nose"],
    respuestaCorrecta: 0, 
    duracionPreview: 5,
  },
]

export function getVideoDelDia(fecha?: string): VideoDelDia | null {
  const targetDate = fecha || getGameDateString()

  // Buscar un video con esa fecha exacta
  const videoExacto = videosDelDia.find((video) => video.fecha === targetDate)
  if (videoExacto) return videoExacto

  // Buscar el más reciente hasta esa fecha
  const videosDisponibles = videosDelDia.filter(video => video.fecha <= targetDate)
  if (videosDisponibles.length > 0) {
    return videosDisponibles.sort((a, b) => b.fecha.localeCompare(a.fecha))[0]
  }

  return null
}





// Función para obtener todos los videos (para admin)
export function getAllVideos(): VideoDelDia[] {
  return videosDelDia
}

// Función para obtener video por ID
export function getVideoById(id: string): VideoDelDia | null {
  return videosDelDia.find((video) => video.id === id) || null
}
