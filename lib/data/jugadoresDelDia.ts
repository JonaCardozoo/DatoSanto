export interface Player {
  id: string
  fecha: string // YYYY-MM-DD
  nombre: string
  apellido: string
  equipo: string
  posicion: string
}

export const jugadoresDelDia: Player[] = [
  {
    id: "2024-01-01",
    fecha: "2024-01-01",
    nombre: "Lionel",
    apellido: "MESSI",
    equipo: "Inter Miami",
    posicion: "Delantero",
  },
  {
    id: "2024-01-02",
    fecha: "2024-01-02",
    nombre: "Diego",
    apellido: "MARADONA",
    equipo: "Leyenda",
    posicion: "Mediocampista",
  },
  {
    id: "2024-01-03",
    fecha: "2024-01-03",
    nombre: "Juan Román",
    apellido: "RIQUELME",
    equipo: "Boca Juniors",
    posicion: "Mediocampista",
  },
  {
    id: "2024-01-04",
    fecha: "2024-01-04",
    nombre: "Gabriel",
    apellido: "BATISTUTA",
    equipo: "Fiorentina",
    posicion: "Delantero",
  },
  {
    id: "2024-01-05",
    fecha: "2024-01-05",
    nombre: "Javier",
    apellido: "ZANETTI",
    equipo: "Inter de Milán",
    posicion: "Defensor",
  },
  {
    id: "2024-01-06",
    fecha: "2024-01-06",
    nombre: "Carlos",
    apellido: "TEVEZ",
    equipo: "Boca Juniors",
    posicion: "Delantero",
  },
  {
    id: "2024-01-07",
    fecha: "2024-01-07",
    nombre: "Sergio",
    apellido: "AGUERO",
    equipo: "Manchester City",
    posicion: "Delantero",
  },
  {
    id: "2024-01-08",
    fecha: "2024-01-08",
    nombre: "Ángel",
    apellido: "DI MARIA",
    equipo: "Juventus",
    posicion: "Mediocampista",
  },
  {
    id: "2024-01-09",
    fecha: "2024-01-09",
    nombre: "Franco",
    apellido: "ARMANI",
    equipo: "River Plate",
    posicion: "Arquero",
  },
  {
    id: "2024-01-10",
    fecha: "2024-01-10",
    nombre: "Lautaro",
    apellido: "MARTINEZ",
    equipo: "Inter de Milán",
    posicion: "Delantero",
  },
  {
    id: "2024-01-11",
    fecha: "2024-01-11",
    nombre: "Paulo",
    apellido: "DYBALA",
    equipo: "AS Roma",
    posicion: "Delantero",
  },
  {
    id: "2024-01-12",
    fecha: "2024-01-12",
    nombre: "Emiliano",
    apellido: "MARTINEZ",
    equipo: "Aston Villa",
    posicion: "Arquero",
  },
]

export function getPlayerForToday(): Player | null {
  const today = new Date()
  const dateString = today.toISOString().split("T")[0] // YYYY-MM-DD

  // Buscar jugador específico para hoy
  let todayPlayer = jugadoresDelDia.find((player) => player.fecha === dateString)

  // Si no hay jugador específico para hoy, usar uno basado en el día del año
  if (!todayPlayer) {
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
    )
    const playerIndex = dayOfYear % jugadoresDelDia.length
    todayPlayer = jugadoresDelDia[playerIndex]
  }

  return todayPlayer
}
