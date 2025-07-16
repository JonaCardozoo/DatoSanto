import { getGameDateString } from "../../utils/dateUtils"  // Agregar import

export interface Trivia {
  id: string
  fecha: string // YYYY-MM-DD
  pregunta: string
  opciones: string[]
  respuestaCorrecta: number // índice de la respuesta correcta
}

export const triviasDelDia: Trivia[] = [
  {
    id: "1",
    fecha: "2025-01-01",
    pregunta: "¿En qué año ascendió Patronato de Paraná a Primera División por primera vez?",
    opciones: ["2010", "2012", "2014", "2015"],
    respuestaCorrecta: 3, 
  },
{
    id: "2",
    fecha: "2025-01-02",
    pregunta: "¿Quién fue el arquero histórico de Patronato, símbolo del ascenso y la permanencia?",
    opciones: ["Daniel Sappa", "Sebastián Bértoli", "Facundo Altamirano", "Matias Mansilla"],
    respuestaCorrecta: 1 // Sebastián Bértoli
  },
  {
    id: "3",
    fecha: "2025-01-04",
    pregunta: "¿Qué delantero fue clave en la B Nacional y luego pasó a Unión?",
    opciones: ["Cristian Tarragona", "Diego Jara", "Gabriel Ávalos", "Axel Rodríguez"],
    respuestaCorrecta: 1 // Diego Jara
  },

  {
    id: "4",
    fecha: "2025-01-7",
    pregunta: "¿Qué delantero paraguayo jugó en Patronato y luego pasó a Argentinos Juniors?",
    opciones: ["Gabriel Ávalos", "Diego Jara", "Cristian Tarragona", "Tiago Banega"],
    respuestaCorrecta: 0 // Gabriel Ávalos
  },
  {
    id: "5",
    fecha: "2025-01-08",
    pregunta: "¿Cuál es el clásico rival tradicional de Patronato en Entre Ríos?",
    opciones: [
      "Atlético Paraná",
      "Gimnasia y Esgrima de Concepción del Uruguay",
      "Peñarol",
      "Sportivo Urquiza",
    ],
    respuestaCorrecta: 0, // Atlético Paraná
  },
    {
    id: "6",
    fecha: "2025-01-03",
    pregunta: "¿Qué título ganó Patronato en 2022?",
    opciones: ["Superliga", "Copa Argentina", "Primera Nacional", "Copa de la Liga"],
    respuestaCorrecta: 1 // Copa Argentina
  },
    {
    id: "8",
    fecha: "2025-01-10",
    pregunta: "¿Qué jugador de Patronato usó la camiseta número 10 durante la Copa Libertadores?",
    opciones: ["Jorge Valdez Chamorro", "Nazareno Solís", "Tiago Banega", "Juan Cruz Esquivel"],
    respuestaCorrecta: 0 // Jorge Valdez Chamorro
  },
    {
    id: "9",
    fecha: "2025-01-05",
    pregunta: "¿Qué equipo eliminó Patronato en semifinales de la Copa Argentina 2022?",
    opciones: ["Boca Juniors", "Racing Club", "San Lorenzo", "River Plate"],
    respuestaCorrecta: 0 // Boca Juniors
  },
  
  {
    id: "10",
    fecha: "2025-01-09",
    pregunta: "¿Quién es el jugador con más partidos disputados en la historia de Patronato?",
    opciones: ["Walter Andrade", "Sebastián Bértoli", "César Carignano", "Marcelo Guzmán"],
    respuestaCorrecta: 1 // Sebastián Bértoli
  },
]

export function getTriviaForToday(): Trivia | null {
  const gameDateString = getGameDateString() // Cambio aquí

  // Buscar trivia específica para hoy
  let todayTrivia = triviasDelDia.find((trivia) => trivia.fecha === gameDateString)

  // Si no hay trivia específica para hoy, usar una basada en el día del año
  if (!todayTrivia) {
    // Crear fecha a partir del gameDateString para el fallback
    const gameDate = new Date(gameDateString + 'T00:00:00')
    const dayOfYear = Math.floor(
      (gameDate.getTime() - new Date(gameDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
    )
    const triviaIndex = dayOfYear % triviasDelDia.length
    todayTrivia = triviasDelDia[triviaIndex]
  }

  return todayTrivia
}