import { getGameDateString } from "@/utils/dateUtils" // Importar getGameDateString

export type PlayerPosition = "PO" | "LI" | "CB" | "LD" | "MC" | "EI" | "DC" | "ED" | "DT"

export interface Player {
  name: string
  clubs: string[]
  position: PlayerPosition
  image: string
}

export const players: Player[] = [
  {
    name: "Julian Navas",
    clubs: [
      "Independiente Rivadavia",
      "Arsenal",
      "Central Cordoba",
      "Colón",
      "Patronato",
    ],
    position: "LD",
    image: "https://img.a.transfermarkt.technology/portrait/big/274970-1638749201.JPG?lm=1",
  },

  {
    name: "Gonzalo Espinoza",
    clubs: ["Racing Club", "Arsenal", "All Boys", "Patronato"],
    position: "ED",
    image: "https://arc-anglerfish-arc2-prod-copesa.s3.amazonaws.com/public/LY3ZVJCVCRBSHE43LWKPX4IH54.jpg",
  },
  {
    name: "Alan Sosa",
    clubs: ["Unión", "Tigre", "Patronato"],
    position: "PO",
    image: "https://img.a.transfermarkt.technology/portrait/header/545408-1727448128.jpg?lm=1",
  },
  {
    name: "Ian Escobar",
    clubs: ["Chacarita", "Talleres", "San Martin (SJ)", "Patronato", "Godoy Cruz", "Aldosivi", "Banfield"],
    position: "ED",
    image: "https://img.a.transfermarkt.technology/portrait/header/440164-1730308249.jpg?lm=1",
  },
  {
    name: "Santiago Galucci",
    clubs: ["San Martin (T)", "Patronato", "Central Cordoba"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/113129-1690407139.JPG?lm=1",
  },
  {
    name: "Marcos Enrique",
    clubs: ["Patronato", "Quilmes", "Instituto", "Velez Sarsfield"],
    position: "MC",
    image: "https://imagecache.365scores.com/image/upload/f_png,w_250,h_250,c_limit,q_auto:eco,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/Athletes/74348",
  },
  {
    name: "Alan Sombra",
    clubs: ["Patronato", "Chaco For Ever", "Huracan"],
    position: "EI",
    image: "https://lh4.googleusercontent.com/proxy/rK5EpgNXbbCnEKztjqx5-LnFVkaoB4ZYQDCHiY2fnb429vChxGhZ1k3Buuw7GNXNEFEJUEQqpr5NlHu0anrw6i1KRE8FdelyD2JS03klaLTpzLjQY3rI0fH5hsFIFx8QcRi3p5sSowBOgr1zG1id62Hkp5zXYpXyFeLb",
  },
  {
    name: "Emanuel Moreno",
    clubs: ["Patronato", "Agropecuario", "Quilmes", "Guillermo Brown", "Union de Santa Fe", "Los Andes", "Douglas Haig"],
    position: "MC",
    image: "https://cdn.soccerwiki.org/images/player/131869.png",
  },
  {
    name: "Walter Rueda",
    clubs: ["Patronato", "Almagro", "Atlanta"],
    position: "MC",
    image: "https://cdn.soccerwiki.org/images/player/131869.png",
  },
  {
    name: "Julian Marcioni",
    clubs: ["Patronato", "Newells", "Independiente Rivadavia", "Atlanta", "Platense", "Agropecuario"],
    position: "ED",
    image: "https://img.a.transfermarkt.technology/portrait/header/633041-1710508658.JPG?lm=1",
  },
  {
    name: "Matias Pardo",
    clubs: ["Patronato", "Moron", "San Martin (T)", "Atletico Rafaela"],
    position: "ED",
    image: "https://img.a.transfermarkt.technology/portrait/header/537093-1636335478.JPG?lm=1",
  },
  {
    name: "Federico Castro",
    clubs: ["Sarmiento de Junin", "Independiente Rivadavia", "Patronato"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/359042-1724873850.jpg?lm=1",
  },
  {
    name: "Joaquín Varela",
    clubs: ["Newell's Old Boys", "Godoy Cruz", "Riestra", "Patronato"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/553421-1720210535.JPG?lm=1",
  },
  {
    name: "Joel Ghirardello",
    clubs: ["Newell's Old Boys", "Patronato"],
    position: "LI",
    image: "https://imagecache.365scores.com/image/upload/f_png,w_250,h_250,c_limit,q_auto:eco,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/Athletes/125429",
  },
  {
    name: "Emiliano Purita",
    clubs: ["Arsenal", "Patronato"],
    position: "LD",
    image: "https://img.a.transfermarkt.technology/portrait/header/471638-1660328700.png?lm=1",
  },
  {
    name: "Gustavo Turraca",
    clubs: ["Aldosivi", "Patronato"],
    position: "MC",
    image: "https://imagecache.365scores.com/image/upload/f_png,w_64,h_64,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/Athletes/60905",
  },
  {
    name: "Emanuel Maciel",
    clubs: ["Aldosivi", "Patronato", "San Lorenzo"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/666330-1618687816.jpg?lm=1",
  },
  {
    name: "Ezequiel Gonzalez",
    clubs: ["Belgrano", "Patronato", "San Martin (SJ)"],
    position: "MC",
    image: "https://imagecache.365scores.com/image/upload/f_png,w_64,h_64,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/Athletes/90261",
  },
  {
    name: "Arnaldo Gonzalez",
    clubs: ["Central Cordoba", "Patronato", "Aldosivi"],
    position: "MC",
    image: "https://imagecache.365scores.com/image/upload/f_png,w_64,h_64,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/Athletes/40620",
  },
  {
    name: "Emanuel Dening",
    clubs: ["Newell's Old Boys", "Patronato", "San Martin (SJ)", "Tigre", "Patronato"],
    position: "ED",
    image: "https://img.a.transfermarkt.technology/portrait/header/124904-1711309639.png?lm=1",
  },
  {
    name: "Franco Coronel",
    clubs: ["Independiente Rivadavia", "Patronato"],
    position: "DC",
    image: "https://imagecache.365scores.com/image/upload/f_png,w_64,h_64,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/Athletes/108513",
  },
  {
    name: "Sergio Ojeda",
    clubs: ["Independiente", "Patronato"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/261240-1710427310.jpg?lm=1",
  },
  {
    name: "Lucas Kruspzky",
    clubs: ["Patronato", "Independiente", "Arsenal", "San Martin (SJ)", "Talleres", "Aldosivi"],
    position: "LI",
    image: "https://img.a.transfermarkt.technology/portrait/header/113131-1636333903.JPG?lm=1",
  },
  {
    name: "Facundo Cobos",
    clubs: ["Patronato", "Godoy Cruz"],
    position: "LI",
    image: "https://img.a.transfermarkt.technology/portrait/header/440146-1734109867.jpg?lm=1",
  },
  {
    name: "Martín Aruga",
    clubs: ["Patronato", "San Martin (SJ)"],
    position: "LI",
    image: "https://img.a.transfermarkt.technology/portrait/header/634811-1587313160.jpg?lm=1",
  },
  {
    name: "Matías Ruiz Diaz",
    clubs: ["Patronato", "Central Cordoba", "Independiente Rivadavia"],
    position: "LD",
    image: "https://img.a.transfermarkt.technology/portrait/header/535029-1724872599.jpg?lm=1",
  },
  {
    name: "Lautaro Geminiani",
    clubs: ["Patronato", "Sarmiento"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/267747-1734023502.jpg?lm=1",
  },
  {
    name: "Fabio Vazquez",
    clubs: ["Patronato", "Argentinos Juniors", "Sarmiento", "Instituto"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/230072-1636335351.JPG?lm=1",
  },
  {
    name: "Nicolas Domingo",
    clubs: ["Patronato", "River Plate", "Arsenal", "Banfield", "Independiente"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/39150-1637344131.JPG?lm=1",
  },
  {
    name: "Jorge Valdez Chamorro",
    clubs: ["Patronato", "Lanus", "Gimnasia",],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/189456-1717085156.png?lm=1",
  },
  {
    name: "Damián Arce",
    clubs: ["Patronato", "Union", "Instituto"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/423708-1722978604.jpg?lm=1",
  },
  {
    name: "Juan Cruz Esquivel",
    clubs: ["Patronato", "Talleres", "Platense", "Tigre", "Gimnasia"],
    position: "EI",
    image: "https://img.a.transfermarkt.technology/portrait/header/654819-1747071889.png?lm=1",
  },
  {
    name: "Nazareno Solis",
    clubs: ["Patronato", "Talleres", "Boca Juniors", "Aldosivi", "Huracan", "San Martin (SJ)"],
    position: "EI",
    image: "https://img.a.transfermarkt.technology/portrait/header/419660-1749136095.JPG?lm=1",
  },
  {
    name: "Enzo Diaz",
    clubs: ["Patronato", "Tigre"],
    position: "DC",
    image: "https://desdelaventana.com.ar/wp-content/uploads/2023/01/Captura-de-pantalla-2023-01-13-000656.jpg",
  },
  {
    name: "Ignacio Russo",
    clubs: ["Patronato", "Rosario Central", "Instituto", "Tigre"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/833130-1717079395.jpeg?lm=1",
  },
  {
    name: "Matías Mansilla",
    clubs: ["Patronato", "Estudiantes", "Central Cordoba",],
    position: "PO",
    image: "https://img.a.transfermarkt.technology/portrait/header/731722-1739826308.jpg?lm=1",
  },
  {
    name: "Carlos Quintana",
    clubs: ["Patronato", "Lanus", "Huracan", "Talleres", "Argentinos Juniors", "Rosario Central"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/54596-1742570498.png?lm=1",
  },
  {
    name: "Oliver Benitez",
    clubs: ["Patronato", "Gimnasia", "Tigre"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/107529-1678299989.jpg?lm=1",
  },
  {
    name: "Leonel Mosevich",
    clubs: ["Patronato", "Argentinos Juniors", "Instituto",],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/407517-1625835456.jpg?lm=1",
  },
  {
    name: "Francisco Alvarez",
    clubs: ["Patronato", "Talleres", "Argentinos Juniors"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/565766-1720122151.png?lm=1",
  },
  {
    name: "Juan Cruz Guasone",
    clubs: ["Patronato", "Estudiantes", "Sarmiento"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/832977-1638747305.JPG?lm=1",
  },
  {
    name: "Raúl Lozano",
    clubs: ["Patronato", "Huracan", "Platense"],
    position: "LD",
    image: "https://img.a.transfermarkt.technology/portrait/header/613093-1724876914.jpg?lm=1",
  },
  {
    name: "Franco Leys",
    clubs: ["Patronato", "Colon", "Sarmiento"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/300272-1638747535.JPG?lm=1",
  },
  {
    name: "Nicolás Castro",
    clubs: ["Patronato", "Sarmiento", "Arsenal", "Platense", "Atletico Tucuman"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/441160-1724864251.jpg?lm=1",
  },
  {
    name: "Justo Giani",
    clubs: ["Patronato", "Newell's Old Boys", "Atletico Tucuman", "Aldosivi"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/539164-1724864445.jpg?lm=1",
  },
  {
    name: "Sebastián Medina",
    clubs: ["Patronato", "Tigre"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/840774-1727449975.jpg?lm=1",
  },
  {
    name: "Diego Garcia",
    clubs: ["Patronato", "Talleres", "Estudiantes",],
    position: "EI",
    image: "https://img.a.transfermarkt.technology/portrait/header/409088-1742486710.jpg?lm=1",
  },

  {
    name: "Jonás Acevedo",
    clubs: ["Patronato", "Instituto", "Huracan"],
    position: "EI",
    image: "https://img.a.transfermarkt.technology/portrait/header/538530-1717079459.jpeg?lm=1",
  },
  {
    name: "José Barreto",
    clubs: ["Patronato", "Colon"],
    position: "EI",
    image: "https://www.zerozero.com.ar/img/jogadores/05/736605_med__20201228224100_jose_barreto.png",
  },
  {
    name: "Mauro Ortiz",
    clubs: ["Patronato", "Talleres"],
    position: "ED",
    image: "https://img.a.transfermarkt.technology/portrait/header/528398-1556629422.png?lm=1",
  },
  {
    name: "Jonathan Herrera",
    clubs: ["Patronato", "Independiente", "San Lorenzo"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/485880-1720462121.jpg?lm=1",
  },
  {
    name: "Axel Rodriguez",
    clubs: ["Patronato", "Instituto", "Atletico Tucuman", "Colon"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/397218-1748531368.jpg?lm=1",
  },
  {
    name: "Marcelo Estigarribia",
    clubs: ["Patronato", "Belgrano", "Atletico Tucuman", "Unión"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/610266-1724864721.jpg?lm=1",
  },
  {
    name: "Rolando Garcia Guerreño",
    clubs: ["Patronato", "Defensa y Justicia", "Godoy Cruz", "Union", "Lanús"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/127819-1636333807.JPG?lm=1",
  },
  {
    name: "Dylan Gissi",
    clubs: ["Patronato", "Defensa y Justicia", "Estudiantes", "Rosario Central", "Atletico Tucuman", "Banfield", "Arsenal"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/81056-1656882870.JPG?lm=1",
  },
  {
    name: "Gustavo Canto",
    clubs: ["Patronato", "Sarmiento", "Banfield", "Arsenal", "Central Cordoba", "Gimnasia y Esgrima (LP)"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/359970-1637344054.JPG?lm=1",
  },
  {
    name: "Martín Garay",
    clubs: ["Patronato", "Atletico Tucuman", "Tigre"],
    position: "LD",
    image: "https://img.a.transfermarkt.technology/portrait/header/696730-1727449005.jpg?lm=1",
  },
  {
    name: "Hector Canteros",
    clubs: ["Patronato", "Platense", "Velez Sarsfield"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/96255-1636335419.JPG?lm=1",
  },
  {
    name: "Lautaro Torres",
    clubs: ["Patronato", "Central Cordoba"],
    position: "MC",
    image: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcTeKAJfkFy_MmEAfA_RHF5NENYPdjkycOtuiimW6EyzQ0YyXJdpQLc8P83WXvs53LFK13u6Yj5P2Sgo48s",
  },
  {
    name: "Matias Palavecino",
    clubs: ["Patronato", "Belgrano"],
    position: "MC",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Universidad_Cat%C3%B3lica_-_Rosario_Central_20190313_20.jpg/1200px-Universidad_Cat%C3%B3lica_-_Rosario_Central_20190313_20.jpg",
  },
  {
    name: "Nicolas Delgadillo",
    clubs: ["Patronato", "Velez Sarsfield", "Platense", "Colon"],
    position: "EI",
    image: "https://img.a.transfermarkt.technology/portrait/header/372163-1740100691.jpg?lm=1",
  },
  {
    name: "Junior Arias",
    clubs: ["Patronato", "Talleres", "Banfield"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/268652-1739896503.jpg?lm=1",
  },
  {
    name: "Nicolas Franco",
    clubs: ["Patronato", "Aldosivi", "San Martin (SJ)"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/441421-1732823505.png?lm=1",
  },
  {
    name: "Sebastian Sosa Sanchez",
    clubs: ["Patronato", "Velez Sarfield", "Banfield"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/198851-1636335556.JPG?lm=1",
  },
  {
    name: "Neri Bandiera",
    clubs: ["Patronato", "Aldosivi"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/415544-1690388539.jpg?lm=1",
  },
  {
    name: "Daniel Sappa",
    clubs: ["Patronato", "Estudiantes", "Arsenal", "Belgrano"],
    position: "PO",
    image: "https://img.a.transfermarkt.technology/portrait/header/423438-1593365329.jpg?lm=1",
  },
  {
    name: "Federico Costa",
    clubs: ["Patronato", "San Martin (SJ)"],
    position: "CB",
    image: "https://laexcusadeportiva.com.ar/wp-content/uploads/2021/12/escudero.jpg_1536916664.jpg",
  },
  {
    name: "Matías Escudero",
    clubs: ["Patronato", "Talleres"],
    position: "CB",
    image: "https://www.ferrocarriloeste.org.ar/wp-content/uploads/2021/04/Federico_Costa.jpg",
  },
  {
    name: "Mathías Abero",
    clubs: ["Patronato", "Atletico Tucuman", "Tigre"],
    position: "LI",
    image: "https://img.a.transfermarkt.technology/portrait/header/142370-1721229544.jpg?lm=1",
  },
  {
    name: "Cristian Chimino",
    clubs: ["Patronato", "Arsenal", "Aldosivi", "Huracan"],
    position: "LD",
    image: "https://img.a.transfermarkt.technology/portrait/header/143951-1639159603.JPG?lm=1",
  },
  {
    name: "Dardo Miloc",
    clubs: ["Patronato", "Central Cordoba", "Arsenal", "Aldosivi", "Atletico Tucuman", "Gimnasia y Esgrima (LP)", "Sarmiento de Junin",],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/118375-1708009838.JPG?lm=1",
  },
  {
    name: "Pablo Cortizo",
    clubs: ["Patronato", "Independiente Rivadavia"],
    position: "MC",
    image: "https://imagecache.365scores.com/image/upload/f_png,w_64,h_64,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/Athletes/61272",
  },
  {
    name: "Gabriel Compagnucci",
    clubs: ["Patronato", "Unión", "Tigre", "Newell's Old Boys", "Belgrano"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/538608-1708944349.png?lm=1",
  },
  {
    name: "Fernando Luna",
    clubs: ["Patronato", "Independiente Rivadavia", "Arsenal",],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/386611-1697308275.jpeg?lm=1",
  },
  {
    name: "Santiago Rosales",
    clubs: ["Patronato", "Aldosivi", "Racing Club", "Gimnasia y Esgrima (LP)", "Central Cordoba"],
    position: "EI",
    image: "https://imagecache.365scores.com/image/upload/f_png,w_64,h_64,c_limit,q_auto:eco,dpr_3,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/Athletes/13451",
  },
  {
    name: "Cristian Tarragona",
    clubs: ["Patronato", "Arsenal", "Gimnasia y Esgrima (LP)", "Independiente Rivadavia", "Platense", "Velez Sarsfield", "San Lorenzo", "Talleres", "Unión"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/422698-1699915095.jpg?lm=1",
  },
  {
    name: "Hugo Silveira",
    clubs: ["Patronato", "Tigre"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/263052-1475692007.jpg?lm=1",
  },
  {
    name: "Agustín Sandona",
    clubs: ["Patronato", "Union"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/360339-1746286604.jpg?lm=1",
  },
  {
    name: "Nicolás Pantaleone",
    clubs: ["Patronato", "Tigre"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/282690-1733412402.jpg?lm=1",
  },
  {
    name: "Renzo Vera",
    clubs: ["Patronato", "Tigre", "Union", "San Martin (SJ)", "Independiente Rivadavia",],
    position: "CB",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbz75uzR0fqjrkp7YfIg14ilI01gxJhuteeQ&s",
  },
  {
    name: "Lucas Ceballos",
    clubs: ["Patronato", "Colon", "Godoy Cruz"],
    position: "CB",
    image: "https://img.vavel.com/lucas-ceballos-resumen-tdt-2016-3381771547.jpg",
  },
  {
    name: "Gastón Gil Romero",
    clubs: ["Patronato", "Estudiantes", "Rosario Central", "Belgrano", "Aldosivi", "Atletico Tucuman", "Independiente Rivadavia"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/222052-1738421860.png?lm=1",
  },
  {
    name: "Abel Peralta",
    clubs: ["Patronato", "Independiente Rivadavia"],
    position: "MC",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ92ry3PVpcIkD8bq6w-Hf6b1Y9x8Oq1uAhR4HWFzDbKb9KL-NHmXPsIdeWs_6axaAiE4&usqp=CAU",
  },
  {
    name: "Jacobo Mansilla",
    clubs: ["Patronato", "Tigre", "Newell's Old Boys", "Colon"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/55928-1722283765.jpg?lm=1",
  },
  {
    name: "Gabriel Carabajal",
    clubs: ["Patronato", "Talleres", "Godoy Cruz", "San Martin (SJ)", "Union", "Argentinos Juniors", "Newell's Old Boys", "Sarmiento de Junin"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/280157-1742329166.jpg?lm=1",
  },
  {
    name: "Mauricio Sperduti",
    clubs: ["Patronato", "Newell's Old Boys", "Arsenal", "Colon", "Banfield", "Independiente Rivadavia"],
    position: "ED",
    image: "https://img.a.transfermarkt.technology/portrait/header/55892-1496828124.jpg?lm=1",
  },
  {
    name: "Ignacio Cacheiro",
    clubs: ["Patronato", "Sarmiento de Junin"],
    position: "ED",
    image: "https://img.a.transfermarkt.technology/portrait/header/359040-1674658161.png?lm=1",
  },
  {
    name: "Facundo Barceló",
    clubs: ["Patronato", "San Martin (SJ)"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/259911-1706846039.jpg?lm=1",
  },
  {
    name: "Francisco Apaolaza",
    clubs: ["Patronato", "Estudiantes", "Arsenal", "Intituto"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/579979-1732810811.png?lm=1",
  },
  {
    name: "Ezequiel Rescaldani",
    clubs: ["Patronato", "Velez Sarsfield", "Talleres", "Arsenal", "San Martin (SJ)"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/164477-1468574035.jpg?lm=1",
  },
  {
    name: "Luca Sosa",
    clubs: ["Patronato", "Huracan", "Talleres", "Newell's Old Boys",],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/421718-1717333991.jpg?lm=1",
  },
  {
    name: "Rodrigo Arciero",
    clubs: ["Patronato", "Independiente Rivadavia", "Talleres", "Banfield"],
    position: "LD",
    image: "https://img.a.transfermarkt.technology/portrait/header/322649-1753194518.jpg?lm=1",
  },
  {
    name: "Martín Rivero",
    clubs: ["Patronato", "Rosario Central", "Aldosivi", "Union", "Belgrano", "San Martin (SJ)"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/77131-1710508239.JPG?lm=1",
  },
  {
    name: "Julián Marchioni",
    clubs: ["Patronato", "Estudiantes", "Independiente Rivadavia"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/323920-1695120324.png?lm=1",
  },
  {
    name: "Rodrigo Migone",
    clubs: ["Patronato", "Rosario Central"],
    position: "MC",
    image: "https://www.footballdatabase.eu/images/photos/players/a_248/248819.jpg",
  },
  {
    name: "Marcelo Guzman",
    clubs: ["Patronato", "Intituto"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/67814-1729199963.JPG?lm=1",
  },
  {
    name: "Mauricio Carrasco",
    clubs: ["Patronato", "Estudiantes", "Aldosivi"],
    position: "EI",
    image: "https://img.a.transfermarkt.technology/portrait/header/69801-1722428969.JPG?lm=1",
  },
  {
    name: "Maximiliano Nuñez",
    clubs: ["Patronato", "Estudiantes"],
    position: "ED",
    image: "https://img.a.transfermarkt.technology/portrait/header/s_83531_10511_2012_1.jpg?lm=1",
  },
  {
    name: "Sebastián Ribas",
    clubs: ["Patronato", "Lanús", "Rosario Central", "Central Cordoba"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/45577-1747241735.jpg?lm=1",
  },
  {
    name: "Adrián Balboa",
    clubs: ["Patronato", "Sarmiento de Junin", "Belgrano", "Union", "Racing Club"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/252209-1721144343.png?lm=1",
  },
  {
    name: "Gonzalo Di Renzo",
    clubs: ["Patronato", "Sarmiento de Junin"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/358425-1582927253.jpg?lm=1",
  },
  {
    name: "Matías Quiroga",
    clubs: ["Patronato", "Talleres", "Union", "Gimnasia y Esgrima (LP)", "Independiente Rivadavia"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/103456-1729199910.JPG?lm=1",
  },
  {
    name: "Abel Masuero",
    clubs: ["Patronato", "San Lorenzo", "Instituto", "Gimnasia y Esgrima (LP)", "San Martin (SJ)"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/s_56574_1184_2010_1.jpg?lm=1",
  },
  {
    name: "Damian Pacco",
    clubs: ["Patronato", "Belgrano"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/s_56574_1184_2010_1.jpg?lm=1",
  },
  {
    name: "Alejandro Gagliardi",
    clubs: ["Patronato", "Instituto","Rosario Central","Union"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/88071-1710508704.JPG?lm=1",
  },
    {
    name: "Fernando Telechea",
    clubs: ["Patronato", "Aldosivi","Tigre","Colon"],
    position: "DC",
    image: "https://tmssl.akamaized.net/images/foto/galerie/telechea-fernando-quilmes-2013-1722282554-143742.jpg",
  },
  {
    name: "Jonathan Ferrari",
    clubs: ["Patronato", "San Lorenzo","Rosario Central"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/87339-1690406726.JPG?lm=1",
  },
  {
    name: "Ezequiel Garre",
    clubs: ["Patronato", "Argentinos Juniors", "Huracan", "Tigre"],
    position: "LI",
    image: "https://www.zerozero.com.ar/img/jogadores/83/248083_med_ezequiel_garre.jpg",
  },
  {
    name: "Fernando de la Fuente",
    clubs: ["Patronato", "Racing Club", "San Martin (SJ)", "Intituto"],
    position: "MC",
    image: "https://www.sentimientopopular.cl/wp-content/uploads/2020/01/8F87E48C-4C97-4DE5-905F-68DA9521FF38.jpeg",
  },
   {
    name: "Marcos Quiroga",
    clubs: ["Patronato","Intituto"],
    position: "MC",
    image: "https://www.lavoz.com.ar/resizer/v2/ZDGYKJJE3JFKXLVKSNBANX5LAQ.jpg?auth=dc0490cf80d249f39c984c9f8230da9c850460fd2e99751442f0b55b18b70233&auth=dc0490cf80d249f39c984c9f8230da9c850460fd2e99751442f0b55b18b70233&quality=75&smart=true&width=980&height=551",
  },
  {
    name: "Diego Jara",
    clubs: ["Patronato","Union","Atletico Tucuman","Central Cordoba"],
    position: "DC",
    image: "https://media.elentrerios.com/concordia/fotos/2015/11/26/o_1448536581.jpg",
  },
   {
    name: "Ignacio Boggino",
    clubs: ["Patronato","Rosario Central"],
    position: "CB",
    image: "https://img.a.transfermarkt.technology/portrait/header/82463-1646344312.JPG?lm=1",
  },
  {
    name: "Lucas Mancinelli",
    clubs: ["Patronato", "Lanus"],
    position: "ED",
    image: "https://img.a.transfermarkt.technology/portrait/header/202761-1740588015.png",
  },
  {
    name: "Patricio Pablo Perez",
    clubs: ["Velez Sarsfield", "Patronato", "Chacarita", "San Martin (T)", "Defensa y Justicia"],
    position: "MC",
    image: "https://www.zerozero.com.ar/img/jogadores/74/73374_med_patricio_perez.jpg",
  },
  {
    name: "Leandro Becerra",
    clubs: ["Belgrano", "San Martin (SJ)", "Atletico Tucuman", "Defensa y Justicia", "Central Cordoba"],
    position: "MC",
    image: "https://alchetron.com/cdn/leandro-becerra-09751ebb-a625-46de-ac57-bb5f5b97e2b-resize-750.jpeg",
  },
  {
    name: "Fernando Fayart",
    clubs: ["Sarmiento de Junin", "Defensa y Justicia"],
    position: "DC",
    image: "https://www.zerozero.com.ar/img/jogadores/46/36846_med_fernando_fayart.gif",
  },
  {
    name: "Gabriel Avalos",
    clubs: ["Crucero del Norte", "Nueva Chicago", "Godoy Cruz", "Patronato", "Argentinos Juniors", "Independiente"],
    position: "DC",
    image:
      "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRlkBT2giNXxLd_nycPLp9cu4jq3mpZHEbbsNC1-OLpkUIaS6Shu3ERMJCPfc-nT8fzH2ntbG18vKmbN_s",
  },
  {
    name: "Lucas Barrios",
    clubs: ["Huracán", "Patronato", "Colo-Colo"],
    position: "DC",
    image: "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcS-rOEWFmcJ3U6R5YgYhzU-tsLY3ZA7iiXkjA3OswNyji_KWDlaI4oLTCDE2Uw7DMDCHGguI7PvLsO8ms8",
  },
  {
    name: "Luis Vazquez",
    clubs: ["Patronato", "Boca Juniors", "Club Anderlecht"],
    position: "DC",
    image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ4-8h-lI4_sO2P4D6-n0hr5QdoNBYZD481GY0NbeinRkJVpn0UAq87T-0TYquJlsnfd56koJUx973wUmS-GGiSYg",
  },
  {
    name: "Federico Bravo",
    clubs: ["Patronato", "Boca Juniors", "Atletico Tucuman", "Sarmiento de Junin", "San Martin de Tucuman"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/header/266775-1734109629.jpg?lm=1",
  },
  {
    name: "Julio César Toresani",
    clubs: ["Unión", "Instituto de Córdoba", "River Plate", "Boca Juniors", "Independiente", "Colón", "Patronato"],
    position: "MC",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtgyUiulssZ3qFdGBKavRKviMrfcjWjkDkJVRnHNwVOHYbWAAA3tslwyc4wcuBaSfaSuC5iNfW0UKov9zavy99wg",
  },
  {
    name: "Gabriel Gudiño",
    clubs: ["Patronato", "San Lorenzo", "Huracán", "Platense"],
    position: "MC",
    image: "https://cap.org.ar/wp-content/uploads/2023/08/Platense-Firmas-4-8-23-Dami-Marcovechio-14-scaled.jpg",
  },

  {
    name: "Damián Lemos",
    clubs: ["Patronato", "Nueva Chicago", "Aldosivi", "Lanús"],
    position: "LI",
    image: "https://elonce-media.elonce.com/fotos-super/2020/07/29/o_1596026859.jpg",
  },

  {
    name: "Ramón Sebastián Britez",
    clubs: ["Huracán", "Deportivo Mandiyu", "Banfield", "Nueva Chicago", "Atletico Tucuman", "Colón", "Patronato"],
    position: "LI",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Ram%C3%B3n_Sebasti%C3%A1n_Britez.jpg/250px-Ram%C3%B3n_Sebasti%C3%A1n_Britez.jpg",
  },
  {
    name: "Gaston Machin",
    clubs: ["Argentinos Juniors", "Independiente", "Newell's Old Boys", "Huracan", "Patronato", "Instituto"],
    position: "MC",
    image: "https://media.pilaradiario.com/p/688f5218237c9d189c05b77628fc96c8/adjuntos/352/imagenes/100/005/0100005760/1200x675/smart/machin-jugo-12-partidos-patronato-8-titular-y-entro-4-veces-el-banco.jpg",
  },
  {
    name: "Federico Mancinelli",
    clubs: ["Olimpo", "Huracán", "Patronato", "Sarmiento de Junin"],
    position: "CB",
    image: "https://media.tycsports.com/files/2020/06/16/103102/mancinelli.jpg",
  },
  {
    name: "Juan José Arraya",
    clubs: ["Huracan", "Patronato"],
    position: "MC",
    image: "https://img.lagaceta.com.ar/fotos/notas/2014/01/05/600x400_574600_20140105153120.webp",
  },
  {
    name: "Christian Norberto Corrales",
    clubs: ["Huracan", "Patronato", "Godoy Cruz", "Indepediente Rivadavia"],
    position: "PO",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLfJ-SR5cCOewobiqsE7SgImgUnWJWO1pDZfKgBJnIlg2sCRax0YRv4AytjjE5KxnAPOM0j3HOy88jfLiN5CHuFYQftULAixDcJMsu7MqDYsA1Y480jMAFcCkilFjfr1SJWE4u9OkBgmoQ/s400/Corrales+Christian+1.jpg",
  },
  {
    name: "Nestor Jorge Candedo",
    clubs: ["Huracán", "Patronato", "Atletico Tucuman"],
    position: "EI",
    image: "https://elpelotazoenlared.com.ar/galeria/fotos/2024/11/04/o_1730735908.jpg",
  },
  {
    name: "Carlos Ruben Fondacaro",
    clubs: ["Boca Juniors", "Patronato", "Tigre", "Atletico Tucuman"],
    position: "MC",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgG0pVG_QxuH6FDO0-a3csOrguF6ECZpHNGQSj9jqKdQ5zAMJHkUVkFSCPK03C8Je_9jNjrTOyzqXICee135KFRyXG1Wc3U7T2tB2gqH_7UjlWCW40RibyqBOWajcxM1B9kq86UMsaW1kZL/s1600/fondacaro-carlos-ruben.jpg",
  },
  {
    name: "Ivan Furios",
    clubs: ["Patronato", "Boca Juniors", "Chacarita Juniors", "Instituto de Córdoba", "Aldosivi", "Olimpo"],
    position: "CB",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Juan_Carlos_Castro.jpg/250px-Juan_Carlos_Castro.jpg",
  },
  {
    name: "Leandro Marin",
    clubs: ["Patronato", "Boca Juniors", "Tigre", "Arsenal"],
    position: "LD",
    image: "https://media.tycsports.com/files/2020/10/27/130187/leandro-marin.jpg",
  },
  {
    name: "Bruno Urribarri",
    clubs: ["Patronato", "Argentinos Juniors", "Colón", "River Plate", "Atletico Rafaela", "Tigre", "Boca Juniors"],
    position: "LD",
    image: "https://media.tycsports.com/files/2021/12/13/371480/bruno-urribarri_1440x810_wmk.jpg?v=1",
  },
  {
    name: "Julian Chicco",
    clubs: ["Patronato", "Boca Juniors", "Sarmiento", "Colón", "Sarmiento de Junin"],
    position: "MC",
    image: "https://www.laradio1029.com.ar/wp-content/uploads/2021/03/julichicco.jpg",
  },
  {
    name: "Esteban Orfano",
    clubs: ["Patronato", "Boca Juniors", "Atletico Rafaela", "Instituto", "Aldosivi"],
    position: "MC",
    image: "https://www.analisisdigital.com.ar/sites/default/files/inline/images/lib230618-052f03.jpg",
  },
  {
    name: "Pablo Ledesma",
    clubs: ["Patronato", "Talleres", "Boca Juniors", "Colón"],
    position: "MC",
    image: "https://media.lacapital.com.ar/p/667850b27de7fc3c3a023d55b033b707/adjuntos/205/imagenes/023/741/0023741946/1200x675/smart/pablo-ledesmajpg.jpg",
  },
  {
    name: "Gerardo Reinoso",
    clubs: ["Independiente", "River Plate", "Banfield", "Patronato", "Boca Juniors"],
    position: "MC",
    image: "https://www.memoriawanderers.cl/wp-content/uploads/2016/10/Gerardo-Reinoso.jpg",
  },
  {
    name: "Franco Miranda",
    clubs: ["Instituto", "River Plate", "Racing Club", "Patronato"],
    position: "LI",
    image: "https://media.diariouno.com.ar/p/43002ca70d39fda642378b4ddd0eec12/adjuntos/298/imagenes/005/729/0005729554/1200x675/smart/0003911399jpg.jpg",
  },
  {
    name: "Diego Martinez",
    clubs: ["Patronato", "River Plate", "Sarmieno de Junin", "Talleres"],
    position: "LI",
    image: "https://www.eldiario.com.ar/wp-content/uploads/2023/12/19-foto-2.jpg",
  },
  {
    name: "Gonzalo Asis",
    clubs: ["Patronato", "Platense", "Independiente"],
    position: "LD",
    image: "https://www.analisisdigital.com.ar/sites/default/files/styles/grande_900x507/public/imagenNoticiaDigital/gonzalo_asis.jpg.webp?itok=IxMcdLLP",
  },
  {
    name: "Sergio Ojeda",
    clubs: ["Patronato", "Olimpo", "Independiente"],
    position: "CB",
    image: "https://altoquedeportes.com.ar/wp-content/uploads/2023/12/sergioojeda-patronato-futbol-20231227-a.jpg",
  },
  {
    name: "Claudio Gonzalez",
    clubs: ["Patronato", "Talleres", "Independiente", "Rosario Central"],
    position: "CB",
    image: "https://enunabaldosa.com/wp-content/uploads/2015/06/jany.jpg",
  },
  {
    name: "Raúl Reula",
    clubs: ["Patronato", "Independiente"],
    position: "DC",
    image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Gabriel Graciani",
    clubs: ["Patronato", "Estudiantes", "Sarmiento de Junin", "Instituto","Independiente"],
    position: "DC",
    image: "https://img.a.transfermarkt.technology/portrait/header/43491-1679324786.JPG?lm=1",
  },
  {
    name: "Jorge Ortiz",
    clubs: ["San Lorenzo", "Independiente", "Arsenal", "Lanús", "Belgrano", "Tigre"],
    position: "MC",
    image: "https://img.a.transfermarkt.technology/portrait/big/55212-1496236148.jpg?lm=1",
  },
  {
    name: "Matias Ibañez",
    clubs: ["San Lorenzo", "Lanús", "Racing Club", "Patronato", "Colón"],
    position: "PO",
    image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR1PN_W35oL9ExdYv6RnCNqHd_Cxf3--Ga0mvyMmORf39M4zQkMa8UjxeKV8XXa1WHGFpe7MSHst1teYhBImuB3Pg",
  },
  {
    name: "Juan Sotelo",
    clubs: ["Talleres", "Arsenal", "Racing Club", "Patronato", "Defensa y Justicia",],
    position: "DC",
    image: "https://cdn.soccerwiki.org/images/player/37440.png",
  },
  {
    name: "German Berterame",
    clubs: ["Talleres", "Arsenal", "Racing Club", "Patronato"],
    position: "DC",
    image: "https://ovaciones.com/wp-content/uploads/2025/05/German-Berterame.jpg",
  },
  {
    name: "Nicolas Bertocchi",
    clubs: ["San lorenzo", "Aldosivi", "Union", "Defensa y Justicia", "Patronato", "Tigre", "San Martin de SJ"],
    position: "MC",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/11/Palestino_-_Deportes_Temuco%2C_2018-08-11_-_Nicol%C3%A1s_Bertochi_-_01.jpg",
  },
  {
    name: "Jonathan Herrera",
    clubs: ["Riestra", "San Lorenzo", "Independiente", "Patronato"],
    position: "DC",
    image: "https://imagecache.365scores.com/image/upload/f_png,w_250,h_250,c_limit,q_auto:eco,d_Athletes:default.png,r_max,c_thumb,g_face,z_0.65/Athletes/59623",
  },
  {
    name: "Facundo Altamirano",
    clubs: ["Banfield", "Patronato", "San Lorenzo"],
    position: "PO",
    image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQhu1b0pQ-LUTT1LXP1DWb3XbrJGzYVy1hWBwbSfKWmP9GkyXOl3fcB4ExSQ-dOweAfckryVm17P8_d8Ci3zPPqNA",
  },
  {
    name: "Tiago Banega",
    clubs: ["Patronato", "Racing Club", "Arsenal", "Unión"],
    position: "MC",
    image: "https://copaargentina.s3.amazonaws.com/images/m111417_crop169014_1024x576_proportional_16671869618DF1.jpeg",
  },
  {
    name: "Diego Martinez",
    clubs: ["Patronato", "Aldosivi", "San Lorenzo", "Defensa y Justicia", "Talleres"],
    position: "DC",
    image: "https://desdelaventana.com.ar/wp-content/uploads/0009/08/4754.jpg",
  },
  {
    name: "Blas Caceres",
    clubs: ["Patronato", "Vélez Sarsfield"],
    position: "MC",
    image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSFK28YYq0APLUTw4Ok_st6zVAhqUwewWJNEeAQqfYdnk9mUyGpf8PRxnHz-dPHFA7HqwDnPR_JUgkZtdQMZBKagw",
  },
  {
    name: "Sebastián Blazquez",
    clubs: ["Patronato", "Vélez Sarsfield", "Colón", "Huracan", "Belgrano"],
    position: "PO",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sebasti%C3%A1n_Bl%C3%A1zquez_2015.jpg/640px-Sebasti%C3%A1n_Bl%C3%A1zquez_2015.jpg",
  },
  {
    name: "Alan Bonansea",
    clubs: ["Patronato", "Rosario Central"],
    position: "DC",
    image: "https://i.postimg.cc/wvWtf25J/20250428-101627.jpg",
  },
]


export interface ClubChallenge {
  primaryClubName: string
  primaryClubLogo: string
}

export const clubChallenges: ClubChallenge[] = [
  {
    primaryClubName: "Huracán",
    primaryClubLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Emblema_oficial_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg/500px-Emblema_oficial_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg.png",
  },
  {
    primaryClubName: "Boca Juniors",
    primaryClubLogo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Boca_escudo.png",
  },
  {
    primaryClubName: "River Plate",
    primaryClubLogo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_River_Plate.png",
  },
  {
    primaryClubName: "Independiente",
    primaryClubLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Escudo_del_Club_Atl%C3%A9tico_Independiente.svg/1945px-Escudo_del_Club_Atl%C3%A9tico_Independiente.svg.png",
  },
  {
    primaryClubName: "Racing Club",
    primaryClubLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Escudo_de_Racing_Club_%282014%29.svg/800px-Escudo_de_Racing_Club_%282014%29.svg.png",
  },
  {
    primaryClubName: "San Lorenzo",
    primaryClubLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.svg/500px-Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.svg.png",
  },
  {
    primaryClubName: "Vélez Sarsfield",
    primaryClubLogo:
      "https://images.seeklogo.com/logo-png/34/2/club-atletico-velez-sarsfield-logo-png_seeklogo-348363.png",
  },
  {
    primaryClubName: "Estudiantes",
    primaryClubLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Escudo_del_Club_Estudiantes_de_La_Plata.svg/824px-Escudo_del_Club_Estudiantes_de_La_Plata.svg.png",
  },
  {
    primaryClubName: "Newell's Old Boys",
    primaryClubLogo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Newell%27s_Old_Boys_Escudo.png",
  },
  {
    primaryClubName: "Rosario Central",
    primaryClubLogo: "https://upload.wikimedia.org/wikipedia/commons/2/22/RosarioCentral.png",
  },
  {
    primaryClubName: "Lanús",
    primaryClubLogo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Lanus_2024.png",
  },
  {
    primaryClubName: "Argentinos Juniors",
    primaryClubLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Escudo_de_la_Asociaci%C3%B3n_Atl%C3%A9tica_Argentinos_Juniors.svg/2045px-Escudo_de_la_Asociaci%C3%B3n_Atl%C3%A9tica_Argentinos_Juniors.svg.png",
  },
  {
    primaryClubName: "Gimnasia y Esgrima (LP)",
    primaryClubLogo: "https://logodownload.org/wp-content/uploads/2020/05/gimnasia-y-esgrima-de-la-plata-logo-0.png",
  },
  {
    primaryClubName: "Talleres",
    primaryClubLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Escudo_Talleres_2015.svg/2048px-Escudo_Talleres_2015.svg.png",
  },
  {
    primaryClubName: "Banfield",
    primaryClubLogo: "https://upload.wikimedia.org/wikipedia/commons/4/42/Escudo_de_Banfield.png",
  },
  {
    primaryClubName: "Colón",
    primaryClubLogo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Escudo_del_Club_Atl%C3%A9tico_Col%C3%B3n.png",
  },
  {
    primaryClubName: "Unión",
    primaryClubLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Escudo_del_Club_Atl%C3%A9tico_Uni%C3%B3n.svg/1788px-Escudo_del_Club_Atl%C3%A9tico_Uni%C3%B3n.svg.png",
  },
  {
    primaryClubName: "Arsenal",
    primaryClubLogo: "https://logodownload.org/wp-content/uploads/2020/05/arsenal-fc-logo.png",
  },
  {
    primaryClubName: "Defensa y Justicia",
    primaryClubLogo: "https://upload.wikimedia.org/wikipedia/commons/1/15/Escudo_defensa_y_justicia.png",
  },
  {
    primaryClubName: "Tigre",
    primaryClubLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Escudo_del_Club_Atl%C3%A9tico_Tigre.svg/1667px-Escudo_del_Club_Atl%C3%A9tico_Tigre.svg.png",
  },
]

export const fixedSecondaryClubName = "Patronato"
export const fixedSecondaryClubLogo = "/placeholder.svg?height=50&width=50&text=Patronato"

export interface PitchPosition {
  id: string
  label: string
  top: string
  left: string
  type: "player" | "coach"
  positionKey: PlayerPosition
}

// --- Definición de Formaciones ---
export const formations: PitchPosition[][] = [
  // Formación 1: 4-4-2 (clásica)
  [
    { id: "PO", label: "PO", top: "10%", left: "50%", type: "player", positionKey: "PO" },
    { id: "LI", label: "LI", top: "30%", left: "15%", type: "player", positionKey: "LI" },
    { id: "CB1", label: "CB", top: "30%", left: "40%", type: "player", positionKey: "CB" }, // Cambiado de CT1 a CB1
    { id: "CB2", label: "CB", top: "30%", left: "60%", type: "player", positionKey: "CB" }, // Cambiado de CT2 a CB2
    { id: "LD", label: "LD", top: "30%", left: "85%", type: "player", positionKey: "LD" },
    { id: "MC1", label: "MC", top: "55%", left: "30%", type: "player", positionKey: "MC" },
    { id: "MC2", label: "MC", top: "55%", left: "70%", type: "player", positionKey: "MC" },
    { id: "EI", label: "EI", top: "65%", left: "15%", type: "player", positionKey: "EI" },
    { id: "ED", label: "ED", top: "65%", left: "85%", type: "player", positionKey: "ED" },
    { id: "DC1", label: "DC", top: "80%", left: "40%", type: "player", positionKey: "DC" },
    { id: "DC2", label: "DC", top: "80%", left: "60%", type: "player", positionKey: "DC" },
    { id: "DT", label: "DT", top: "10%", left: "95%", type: "coach", positionKey: "DT" },
  ],
  // Formación 2: 4-3-3 (ofensiva)
  [
    { id: "PO", label: "PO", top: "10%", left: "50%", type: "player", positionKey: "PO" },
    { id: "LI", label: "LI", top: "30%", left: "15%", type: "player", positionKey: "LI" },
    { id: "CB1", label: "CB", top: "30%", left: "40%", type: "player", positionKey: "CB" }, // Cambiado de CT1 a CB1
    { id: "CB2", label: "CB", top: "30%", left: "60%", type: "player", positionKey: "CB" }, // Cambiado de CT2 a CB2
    { id: "LD", label: "LD", top: "30%", left: "85%", type: "player", positionKey: "LD" },
    { id: "MC1", label: "MC", top: "55%", left: "30%", type: "player", positionKey: "MC" },
    { id: "MC2", label: "MC", top: "55%", left: "50%", type: "player", positionKey: "MC" },
    { id: "MC3", label: "MC", top: "55%", left: "70%", type: "player", positionKey: "MC" },
    { id: "EI", label: "EI", top: "80%", left: "25%", type: "player", positionKey: "EI" },
    { id: "DC", label: "DC", top: "80%", left: "50%", type: "player", positionKey: "DC" },
    { id: "ED", label: "ED", top: "80%", left: "75%", type: "player", positionKey: "ED" },
    { id: "DT", label: "DT", top: "10%", left: "95%", type: "coach", positionKey: "DT" },
  ],
  // Formación 3: 3-5-2 (con carrileros)
  [
    { id: "PO", label: "PO", top: "10%", left: "50%", type: "player", positionKey: "PO" },
    { id: "CB1", label: "CB", top: "30%", left: "30%", type: "player", positionKey: "CB" }, // Cambiado de CT1 a CB1
    { id: "CB2", label: "CB", top: "30%", left: "50%", type: "player", positionKey: "CB" }, // Cambiado de CT2 a CB2
    { id: "CB3", label: "CB", top: "30%", left: "70%", type: "player", positionKey: "CB" }, // Cambiado de CT3 a CB3
    { id: "LI", label: "LI", top: "50%", left: "10%", type: "player", positionKey: "LI" },
    { id: "LD", label: "LD", top: "50%", left: "90%", type: "player", positionKey: "LD" },
    { id: "MC1", label: "MC", top: "60%", left: "30%", type: "player", positionKey: "MC" },
    { id: "MC2", label: "MC", top: "60%", left: "50%", type: "player", positionKey: "MC" },
    { id: "MC3", label: "MC", top: "60%", left: "70%", type: "player", positionKey: "MC" },
    { id: "DC1", label: "DC", top: "80%", left: "40%", type: "player", positionKey: "DC" },
    { id: "DC2", label: "DC", top: "80%", left: "60%", type: "player", positionKey: "DC" },
    { id: "DT", label: "DT", top: "10%", left: "95%", type: "coach", positionKey: "DT" },
  ],
]

// Función para mezclar array usando algoritmo Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)) // Ahora usa Math.random() directamente
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Esta función ahora generará un orden aleatorio diferente en cada llamada
export function getDailyRandomClubChallenges(): ClubChallenge[] {
  return shuffleArray(clubChallenges)
}

export function getDailyFormation(): PitchPosition[] {
  const gameDateString = getGameDateString()
  const date = new Date(gameDateString)
  const dayOfMonth = date.getDate()
  const formationIndex = (dayOfMonth - 1) % formations.length
  return formations[formationIndex]
}

export interface GameState {
  guessedPlayers: { player: Player; assignedSlotId: string }[]
  currentChallengeIndex: number
  gameCompletedToday: boolean
  gameOutcome?: "win" | "lose" | null
  hintsUsed: number // Solo mantenemos el contador total de pistas
  pointsAwarded: boolean
  dailyChallenges: ClubChallenge[]
}
