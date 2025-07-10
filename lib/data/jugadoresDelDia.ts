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
    nombre: "Sebastián",
    apellido: "BÉRTOLI",
    equipo: "Patronato",
    posicion: "Arquero"
  },
  {
    id: "2024-01-02",
    fecha: "2024-01-02",
    nombre: "Diego",
    apellido: "JARA",
    equipo: "Patronato",
    posicion: "Delantero"
  },
  {
    id: "2024-01-03",
    fecha: "2024-01-03",
    nombre: "Marcelo",
    apellido: "GUZMÁN",
    equipo: "Patronato",
    posicion: "Volante"
  },
  {
    id: "2024-01-04",
    fecha: "2024-01-04",
    nombre: "Walter",
    apellido: "ANDRADE",
    equipo: "Patronato",
    posicion: "Defensor"
  },
  {
    id: "2024-01-05",
    fecha: "2024-01-05",
    nombre: "Lautaro",
    apellido: "GEMINIANI",
    equipo: "Patronato",
    posicion: "Defensor"
  },
  {
    id: "2024-01-06",
    fecha: "2024-01-06",
    nombre: "Cristian",
    apellido: "TARRAGONA",
    equipo: "Patronato",
    posicion: "Delantero"
  },
  {
    id: "2024-01-07",
    fecha: "2024-01-07",
    nombre: "Federico",
    apellido: "BRAVO",
    equipo: "Patronato",
    posicion: "Volante"
  },
  {
    id: "2024-01-08",
    fecha: "2024-01-08",
    nombre: "Facundo",
    apellido: "ALTAMIRANO",
    equipo: "Patronato",
    posicion: "Arquero"
  },
  {
    id: "2024-01-09",
    fecha: "2024-01-09",
    nombre: "Tiago",
    apellido: "BANEGA",
    equipo: "Patronato",
    posicion: "Volante"
  },
  {
    id: "2024-01-10",
    fecha: "2024-01-10",
    nombre: "Nicolás",
    apellido: "DOMINGO",
    equipo: "Patronato",
    posicion: "Volante"
  },
  {
    id: "2024-01-11",
    fecha: "2024-01-11",
    nombre: "Nazareno",
    apellido: "SOLÍS",
    equipo: "Patronato",
    posicion: "Delantero"
  },
  {
    id: "2024-01-12",
    fecha: "2024-01-12",
    nombre: "Pablo",
    apellido: "HOFSTETTER",
    equipo: "Patronato",
    posicion: "Delantero"
  },
    {
    id: "2024-01-13",
    fecha: "2024-01-13",
    nombre: "Matías",
    apellido: "GARRIDO",
    equipo: "Patronato",
    posicion: "Volante"
  },
  {
    id: "2024-01-14",
    fecha: "2024-01-14",
    nombre: "Iván",
    apellido: "FURIOS",
    equipo: "Patronato",
    posicion: "Defensor"
  },
  {
    id: "2024-01-15",
    fecha: "2024-01-15",
    nombre: "Fernando",
    apellido: "TELECHEA",
    equipo: "Patronato",
    posicion: "Delantero"
  },
  {
    id: "2024-01-17",
    fecha: "2024-01-17",
    nombre: "Bruno",
    apellido: "URRIBARRI",
    equipo: "Patronato",
    posicion: "Defensor"
  },
  {
    id: "2024-01-18",
    fecha: "2024-01-18",
    nombre: "Gabriel",
    apellido: "ÁVALOS",
    equipo: "Patronato",
    posicion: "Delantero"
  },
  {
    id: "2024-01-20",
    fecha: "2024-01-20",
    nombre: "Axel",
    apellido: "RODRÍGUEZ",
    equipo: "Patronato",
    posicion: "Delantero"
  },
  {
    id: "2024-01-22",
    fecha: "2024-01-22",
    nombre: "Justo",
    apellido: "GIANI",
    equipo: "Patronato",
    posicion: "Delantero"
  },
  {
    id: "2024-01-23",
    fecha: "2024-01-23",
    nombre: "Jorge",
    apellido: "VALDEZ CHAMORRO",
    equipo: "Patronato",
    posicion: "Volante"
  },
  {
    id: "2024-01-24",
    fecha: "2024-01-24",
    nombre: "Juan Cruz",
    apellido: "ESQUIVEL",
    equipo: "Patronato",
    posicion: "Delantero"
  },
  {
    id: "2024-01-25",
    fecha: "2024-01-25",
    nombre: "Lucas",
    apellido: "KRUSPKZY",
    equipo: "Patronato",
    posicion: "Defensor"
  },
  {
    id: "2024-01-26",
    fecha: "2024-01-26",
    nombre: "Ignacio",
    apellido: "RUSSO",
    equipo: "Patronato",
    posicion: "Delantero"
  },
  {
    id: "2024-01-27",
    fecha: "2024-01-27",
    nombre: "Matías",
    apellido: "PARDO",
    equipo: "Patronato",
    posicion: "Defensor"
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
