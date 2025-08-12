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
  fecha: "2025-08-06",
  pregunta: "¿En qué año Patronato ganó su primer campeonato oficial de la Liga Paranaense de Fútbol?",
  opciones: ["1928", "1932", "1942", "1950"],
  respuestaCorrecta: 2 // 1942
},
{
  id: "2",
  fecha: "2025-08-06",
  pregunta: "¿Qué director técnico logró el ascenso de Patronato a Primera División en 2015?",
  opciones: ["Facundo Sava", "Rubén Forestello", "Iván Delfino", "Diego Osella"],
  respuestaCorrecta: 2 // Iván Delfino
},
{
  id: "3",
  fecha: "2025-08-06",
  pregunta: "¿Contra qué equipo jugó Patronato su primer partido en Primera División y cuál fue el resultado?",
  opciones: [
    "San Lorenzo, empató 2-2",
    "River, empató 1-1",
    "Lanús, ganó 1-0",
    "Colón, perdió 3-2"
  ],
  respuestaCorrecta: 0 // San Lorenzo, empató 2-2
},
{
  id: "4",
  fecha: "2025-08-06",
  pregunta: "¿Quién fue el máximo goleador de Patronato en la temporada 2015 del Nacional B?",
  opciones: ["Matías Quiroga", "Diego Jara", "Leonardo Acosta", "Fernando Telechea"],
  respuestaCorrecta: 1 // Diego Jara
},
{
  id: "5",
  fecha: "2025-08-06",
  pregunta: "¿Qué arquero fue figura clave en la Copa Argentina 2022 atajando penales decisivos?",
  opciones: ["Julio Salvá", "Facundo Altamirano", "Federico Costa", "Matías Ibáñez"],
  respuestaCorrecta: 1 // Facundo Altamirano
},
{
  id: "6",
  fecha: "2025-08-06",
  pregunta: "¿Qué equipos eliminó Patronato para llegar a la final de la Copa Argentina 2022?",
  opciones: [
    "Tigre, Boca, River",
    "Banfield, River, Colón",
    "Gimnasia y Esgrima (LP), Boca, River",
    "Huracán, Vélez, Lanús"
  ],
  respuestaCorrecta: 2 // Gimnasia, River, Boca
},
{
  id: "7",
  fecha: "2025-08-06",
  pregunta: "¿Quién anotó el gol de la victoria en la final de la Copa Argentina 2022?",
  opciones: ["Jonás Acevedo", "Tiago Banega", "Esteban Espíndola", "Sebastián Medina"],
  respuestaCorrecta: 1 // Tiago Banega
},
{
  id: "8",
  fecha: "2025-08-06",
  pregunta: "¿En qué año Patronato jugó por primera vez un torneo internacional y cuál fue?",
  opciones: [
    "2020, Copa Sudamericana",
    "2021, Copa Libertadores",
    "2022, Copa Sudamericana",
    "2023, Copa Libertadores"
  ],
  respuestaCorrecta: 3 // 2023, Copa Libertadores
},
{
  id: "9",
  fecha: "2025-08-06",
  pregunta: "¿Cuál fue el grupo de Patronato en la Copa Libertadores 2023?",
  opciones: [
    "Grupo A: Boca, Colo Colo, Monagas",
    "Grupo E: Corinthians, Argentinos, Liverpool",
    "Grupo H: Atlético Nacional, Melgar, Olimpia",
    "Grupo C: Racing, Aucas, Flamengo"
  ],
  respuestaCorrecta: 2 // Grupo H: Atlético Nacional, Melgar, Olimpia
},
{
  id: "10",
  fecha: "2025-08-06",
  pregunta: "¿Cuál es el nombre completo del estadio de Patronato y en qué año fue inaugurado?",
  opciones: [
    "Estadio Grella, inaugurado en 1950",
    "Presbítero Bartolomé Grella, inaugurado en 1956",
    "Estadio Paraná, inaugurado en 1952",
    "Nuevo Estadio de Paraná, inaugurado en 1960"
  ],
  respuestaCorrecta: 1 // Presbítero Bartolomé Grella, inaugurado en 1956
},

{
  id: "11",
  fecha: "2025-08-06",
  pregunta: "¿Quién es el jugador con más partidos oficiales en la historia de Patronato?",
  opciones: ["Walter Andrade", "Sebastián Bértoli", "César Carignano", "Lucas Márquez"],
  respuestaCorrecta: 1 // Sebastián Bértoli :contentReference[oaicite:1]{index=1}
},
{
  id: "12",
  fecha: "2025-08-06",
  pregunta: "¿Cuántos partidos jugó Walter Saúl Andrade en Patronato antes de retirarse en 2020?",
  opciones: ["300", "350", "400", "418"],
  respuestaCorrecta: 3 // 418 partidos :contentReference[oaicite:2]{index=2}
},
{
  id: "13",
  fecha: "2025-08-06",
  pregunta: "¿En qué año Patronato fue fundado por el padre Bartolomé Grella?",
  opciones: ["1910", "1914", "1920", "1925"],
  respuestaCorrecta: 1 // 1914 :contentReference[oaicite:3]{index=3}
},
{
  id: "14",
  fecha: "2025-08-06",
  pregunta: "¿En qué año Patronato ascendió por primera vez a la Primera División (campeonato Nacional)?",
  opciones: ["1968", "1978", "1985", "1990"],
  respuestaCorrecta: 1 // 1978 :contentReference[oaicite:4]{index=4}
},

{
  id: "16",
  fecha: "2025-08-06",
  pregunta: "¿Contra qué equipo logró Patronato su primer victoria en la Copa Libertadores, con un 4‑1?",
  opciones: ["Atlético Nacional", "Melgar", "Olimpia", "Colón"],
  respuestaCorrecta: 1 // Melgar (Perú) 4‑1 :contentReference[oaicite:6]{index=6}
},
{
  id: "17",
  fecha: "2025-08-06",
  pregunta: "¿Cuántos títulos de la Liga Paranaense tiene Patronato según registros hasta 2023?",
  opciones: ["30", "32", "34", "36"],
  respuestaCorrecta: 1 // 32 títulos :contentReference[oaicite:7]{index=7}
},

{
  id: "19",
  fecha: "2025-08-06",
  pregunta: "¿Quién fue el técnico de Patronato cuando ganó la Copa Argentina 2022 y clasificó a Libertadores?",
  opciones: ["Iván Delfino", "Facundo Sava", "Mario Sciacqua", "Rubén Forestello"],
  respuestaCorrecta: 1 // Facundo Sava :contentReference[oaicite:9]{index=9}
},
{
  id: "20",
  fecha: "2025-08-06",
  pregunta: "¿Contra qué dos grandes eliminó Patronato para ganar la Copa Argentina 2022?",
  opciones: ["River y Boca", "River y San Lorenzo", "Boca y Estudiantes", "Vélez y Boca"],
  respuestaCorrecta: 0 // River y Boca :contentReference[oaicite:10]{index=10}
}


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