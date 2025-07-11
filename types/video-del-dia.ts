export interface VideoDelDia {
  id: string
  videoUrl: string
  pregunta: string
  opciones: string[]
  respuestaCorrecta: number
  fecha: string
  duracionPreview: number // en segundos, por defecto 5
}
