export interface Trivia {
  id: string
  fecha: string // YYYY-MM-DD
  pregunta: string
  opciones: string[]
  respuestaCorrecta: number // índice de la respuesta correcta
}

export const triviasDelDia: Trivia[] = [
  {
    id: "2024-01-01",
    fecha: "2024-01-01",
    pregunta: "¿En qué año ascendió Patronato de Paraná a Primera División por primera vez?",
    opciones: ["2010", "2012", "2014", "2015"],
    respuestaCorrecta: 1, // 2012
  },
  {
    id: "2024-01-02",
    fecha: "2024-01-02",
    pregunta: "¿Cuál es el apodo tradicional de Patronato de Paraná?",
    opciones: ["El Santo", "El Patrón", "Los Rojinegros", "El Decano"],
    respuestaCorrecta: 1, // El Patrón
  },
  {
    id: "2024-01-03",
    fecha: "2024-01-03",
    pregunta: "¿En qué provincia argentina se encuentra la ciudad de Paraná?",
    opciones: ["Santa Fe", "Entre Ríos", "Corrientes", "Buenos Aires"],
    respuestaCorrecta: 1, // Entre Ríos
  },
  {
    id: "2024-01-04",
    fecha: "2024-01-04",
    pregunta: "¿Cuál fue el primer equipo argentino en ganar la Copa Libertadores?",
    opciones: ["River Plate", "Boca Juniors", "Independiente", "Racing Club"],
    respuestaCorrecta: 2, // Independiente
  },
  {
    id: "2024-01-05",
    fecha: "2024-01-05",
    pregunta: "¿En qué año se fundó la AFA (Asociación del Fútbol Argentino)?",
    opciones: ["1893", "1901", "1905", "1910"],
    respuestaCorrecta: 0, // 1893
  },
  {
    id: "2024-01-06",
    fecha: "2024-01-06",
    pregunta: "¿Cuál es el estadio donde juega de local Patronato de Paraná?",
    opciones: [
      "Estadio Presbítero Bartolomé Grella",
      "Estadio Tomás Ducó",
      "Estadio José María Minella",
      "Estadio Ciudad de Paraná",
    ],
    respuestaCorrecta: 0, // Estadio Presbítero Bartolomé Grella
  },
  {
    id: "2024-01-07",
    fecha: "2024-01-07",
    pregunta: "¿Qué jugador argentino es conocido como 'La Pulga'?",
    opciones: ["Diego Maradona", "Lionel Messi", "Carlos Tevez", "Sergio Agüero"],
    respuestaCorrecta: 1, // Lionel Messi
  },
  {
    id: "2024-01-08",
    fecha: "2024-01-08",
    pregunta: "¿En qué Mundial Argentina ganó su primera Copa del Mundo?",
    opciones: ["México 1970", "Argentina 1978", "España 1982", "México 1986"],
    respuestaCorrecta: 1, // Argentina 1978
  },
  {
    id: "2024-01-09",
    fecha: "2024-01-09",
    pregunta: "¿Cuál es el clásico rival tradicional de Patronato en Entre Ríos?",
    opciones: [
      "Atlético Paraná",
      "Gimnasia y Esgrima de Concepción del Uruguay",
      "Central Entrerriano",
      "Sportivo Urquiza",
    ],
    respuestaCorrecta: 0, // Atlético Paraná
  },
  {
    id: "2024-01-10",
    fecha: "2024-01-10",
    pregunta: "¿Cuántas Copas América ha ganado la Selección Argentina?",
    opciones: ["14", "15", "16", "17"],
    respuestaCorrecta: 1, // 15
  },
]

export function getTriviaForToday(): Trivia | null {
  const today = new Date()
  const dateString = today.toISOString().split("T")[0] // YYYY-MM-DD

  // Buscar trivia específica para hoy
  let todayTrivia = triviasDelDia.find((trivia) => trivia.fecha === dateString)

  // Si no hay trivia específica para hoy, usar una basada en el día del año
  if (!todayTrivia) {
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
    )
    const triviaIndex = dayOfYear % triviasDelDia.length
    todayTrivia = triviasDelDia[triviaIndex]
  }

  return todayTrivia
}
