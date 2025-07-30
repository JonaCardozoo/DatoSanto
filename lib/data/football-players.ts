export interface Club {
  name: string
  logo?: string // Path to logo image, e.g., "/logos/river-plate.png"
}

export interface Player {
  id: string
  name: string // Full name of the player
  debutYear: number
  retirementYear: number
  clubs: Club[]
  hints: string[] // General hints about the player
  answer: string // The exact string to match for the answer (e.g., "Lionel Messi")
  image: string // Path to player image
}

export const footballPlayers: Player[] = [
  {
    id: "alfredo-di-stefano",
    name: "Alfredo Di Stéfano",
    debutYear: 1945,
    retirementYear: 1966,
    clubs: [
      { name: "River Plate", logo: "/placeholder.svg?height=64&width=64" },
      { name: "Huracán" },
      { name: "Millonarios" },
      { name: "Real Madrid" },
      { name: "Espanyol" },
    ],
    hints: [
      "Conocido como 'La Saeta Rubia'.",
      "Ganó 5 Copas de Europa consecutivas.",
      "Jugó para las selecciones de Argentina, Colombia y España.",
    ],
    answer: "Alfredo Di Stéfano",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "diego-maradona",
    name: "Diego Maradona",
    debutYear: 1976,
    retirementYear: 1997,
    clubs: [
      { name: "Argentinos Juniors" },
      { name: "Boca Juniors" },
      { name: "Barcelona" },
      { name: "Napoli" },
      { name: "Sevilla" },
      { name: "Newell's Old Boys" },
    ],
    hints: [
      "Campeón del Mundo en 1986.",
      "Considerado uno de los mejores de la historia.",
      "Famoso por la 'Mano de Dios'.",
    ],
    answer: "Diego Maradona",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "lionel-messi",
    name: "Lionel Messi",
    debutYear: 2003,
    retirementYear: 2025, // Placeholder for active player
    clubs: [{ name: "Barcelona" }, { name: "Paris Saint-Germain" }, { name: "Inter Miami" }],
    hints: [
      "Ganador de múltiples Balones de Oro.",
      "Capitán de la selección argentina.",
      "Considerado por muchos el mejor de todos los tiempos.",
    ],
    answer: "Lionel Messi",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export function getRandomPlayer(): Player {
  const randomIndex = Math.floor(Math.random() * footballPlayers.length)
  return footballPlayers[randomIndex]
}
