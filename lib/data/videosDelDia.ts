import type { VideoDelDia } from "@/types/video-del-dia"

// Videos del día con video de prueba real
export const videosDelDia: VideoDelDia[] = [
  {
    id: "video-001",
    videoUrl: "/videos/videodeldia1.mp4",
    pregunta: "¿Qué paso en este video?",
    opciones: ["Se la pasa al compañero", "La tira afuera", "Se la cuelga al arquero", "Offside"],
    respuestaCorrecta: 2, // Un conejo
    fecha: "2024-01-10",
    duracionPreview: 5,
  },
  {
    id: "video-002",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    pregunta: "¿Cuál es el tema principal de este video?",
    opciones: ["Animales", "Ciencia ficción", "Deportes", "Cocina"],
    respuestaCorrecta: 1, // Ciencia ficción
    fecha: "2024-01-11",
    duracionPreview: 6,
  },
]

// Función para obtener el video del día
export function getVideoDelDia(fecha?: string): VideoDelDia | null {
  const targetDate = fecha || new Date().toISOString().split("T")[0]
  return videosDelDia.find((video) => video.fecha === targetDate) || videosDelDia[0] // Fallback al primer video
}

// Función para obtener todos los videos (para admin)
export function getAllVideos(): VideoDelDia[] {
  return videosDelDia
}

// Función para obtener video por ID
export function getVideoById(id: string): VideoDelDia | null {
  return videosDelDia.find((video) => video.id === id) || null
}
