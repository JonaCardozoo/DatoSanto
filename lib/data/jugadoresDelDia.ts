import { getGameDateString } from "../../utils/dateUtils" // Agregar import

export interface Player {
  id: string
  fecha: string // YYYY-MM-DD
  nombre: string
  apellido: string
  equipo: string
  posicion: string
  imageUrl: string
}

export const jugadoresDelDia: Player[] = [
  {
    id: "1",
    fecha: "2025-01-01",
    nombre: "Sebastián",
    apellido: "BERTOLI",
    equipo: "Patronato",
    posicion: "Arquero",
    imageUrl: "/images/jugadores/sebastian.png",
  },
  {
    id: "2",
    fecha: "2025-01-02",
    nombre: "Diego",
    apellido: "JARA",
    equipo: "Patronato",
    posicion: "Delantero",
    imageUrl: "/images/jugadores/diego.png",
  },
  {
    id: "3",
    fecha: "2025-01-03",
    nombre: "Marcelo",
    apellido: "GUZMAN",
    equipo: "Patronato",
    posicion: "Volante",
    imageUrl: "/images/jugadores/marcelo.png",
  },
  {
    id: "4",
    fecha: "2025-01-04",
    nombre: "Walter",
    apellido: "ANDRADE",
    equipo: "Patronato",
    posicion: "Defensor",
    imageUrl: "/images/jugadores/walter.png",
  },
  {
    id: "6",
    fecha: "2025-01-06",
    nombre: "Cristian",
    apellido: "TARRAGONA",
    equipo: "Patronato",
    posicion: "Delantero",
    imageUrl: "/images/jugadores/cristian.png",

  },
  {
    id: "7",
    fecha: "2025-01-05",
    nombre: "Lautaro",
    apellido: "GEMINIANI",
    equipo: "Patronato",
    posicion: "Defensor",
    imageUrl: "/images/jugadores/lautaro.png",
  },

  {
    id: "7",
    fecha: "2025-01-07",
    nombre: "Federico",
    apellido: "BRAVO",
    equipo: "Patronato",
    posicion: "Volante",
    imageUrl: "https://elonce-media.elonce.com/fotos-super/2019/03/03/o_1551650905.jpg",
  },
  {
    id: "8",
    fecha: "2025-01-08",
    nombre: "Facundo",
    apellido: "ALTAMIRANO",
    equipo: "Patronato",
    posicion: "Arquero",
    imageUrl: "https://media.tycsports.com/files/2022/10/29/498981/facundo-altamirano_862x485.webp?v=1",
  },
  {
    id: "9",
    fecha: "2025-01-09",
    nombre: "Tiago",
    apellido: "BANEGA",
    equipo: "Patronato",
    posicion: "Volante",
    imageUrl: "/images/jugadores/tiago.png",
  },
  {
    id: "10",
    fecha: "2025-01-10",
    nombre: "Nicolás",
    apellido: "DOMINGO",
    equipo: "Patronato",
    posicion: "Volante",
    imageUrl: "/images/jugadores/nicolas.png",
  },
  {
    id: "11",
    fecha: "2025-01-11",
    nombre: "Nazareno",
    apellido: "SOLIS",
    equipo: "Patronato",
    posicion: "Delantero",
    imageUrl: "/images/jugadores/nazareno.png",
  },
  {
    id: "12",
    fecha: "2025-01-12",
    nombre: "Pablo",
    apellido: "HOFSTETTER",
    equipo: "Patronato",
    posicion: "Delantero",
    imageUrl: "/images/jugadores/pablo.png",
  },
  {
    id: "13",
    fecha: "2025-01-13",
    nombre: "Matías",
    apellido: "GARRIDO",
    equipo: "Patronato",
    posicion: "Volante",
    imageUrl: "/images/jugadores/matias.png",
  },
  {
    id: "14",
    fecha: "2025-01-14",
    nombre: "Iván",
    apellido: "FURIOS",
    equipo: "Patronato",
    posicion: "Defensor",
    imageUrl: "/images/jugadores/ivan.png",
  },
  {
    id: "15",
    fecha: "2025-01-15",
    nombre: "Fernando",
    apellido: "TELECHEA",
    equipo: "Patronato",
    posicion: "Delantero",
    imageUrl: "/images/jugadores/fernando.png",
  },
  {
    id: "17",
    fecha: "2025-01-17",
    nombre: "Bruno",
    apellido: "URRIBARRI",
    equipo: "Patronato",
    posicion: "Defensor",
    imageUrl: "/images/jugadores/bruno.png",
  },
  {
    id: "18",
    fecha: "2025-01-18",
    nombre: "Gabriel",
    apellido: "ÁVALOS",
    equipo: "Patronato",
    posicion: "Delantero",
    imageUrl: "/images/jugadores/gabriel.png",
  },
  {
    id: "19",
    fecha: "2025-01-20",
    nombre: "Axel",
    apellido: "RODRIGUEZ",
    equipo: "Patronato",
    posicion: "Delantero",
    imageUrl: "/images/jugadores/axel.png",
  },
  {
    id: "20",
    fecha: "2025-01-22",
    nombre: "Justo",
    apellido: "GIANI",
    equipo: "Patronato",
    posicion: "Delantero",
    imageUrl: "/images/jugadores/axel.png",
  },
  {
    id: "21",
    fecha: "2025-01-23",
    nombre: "Jorge",
    apellido: "VALDEZ CHAMORRO",
    equipo: "Patronato",
    posicion: "Volante",
    imageUrl: "/images/jugadores/axel.png",
  },
  {
    id: "22",
    fecha: "2025-01-24",
    nombre: "Juan Cruz",
    apellido: "ESQUIVEL",
    equipo: "Patronato",
    posicion: "Delantero",
    imageUrl: "/images/jugadores/axel.png",
  },
  {
    id: "23",
    fecha: "2025-01-25",
    nombre: "Lucas",
    apellido: "KRUSPKZY",
    equipo: "Patronato",
    posicion: "Defensor",
    imageUrl: "/images/jugadores/axel.png",
  },
  {
    id: "24",
    fecha: "2025-01-26",
    nombre: "Ignacio",
    apellido: "RUSSO",
    equipo: "Patronato",
    posicion: "Delantero",
    imageUrl: "/images/jugadores/axel.png",
  },
  {
    id: "25",
    fecha: "2025-01-27",
    nombre: "Matías",
    apellido: "PARDO",
    equipo: "Patronato",
    posicion: "Defensor",
    imageUrl: "/images/jugadores/axel.png",
  },
]

export function getPlayerForToday(): Player | null {
  const gameDateString = getGameDateString() // Cambio aquí

  // Buscar jugador específico para hoy
  let todayPlayer = jugadoresDelDia.find((player) => player.fecha === gameDateString)

  // Si no hay jugador específico para hoy, usar uno basado en el día del año
  if (!todayPlayer) {
    // Crear fecha a partir del gameDateString para el fallback
    const gameDate = new Date(gameDateString + 'T00:00:00')
    const dayOfYear = Math.floor(
      (gameDate.getTime() - new Date(gameDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
    )
    const playerIndex = dayOfYear % jugadoresDelDia.length
    todayPlayer = jugadoresDelDia[playerIndex]
  }

  return todayPlayer
}