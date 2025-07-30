import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
<<<<<<< HEAD
=======
import {Toaster} from "@/components/ui/toaster"
>>>>>>> cdb9605 (juegos)

export const metadata: Metadata = {
  title: "DatoSanto - Trivia sobre Patronato",
  description: "Juegos de trivia y adivinanzas sobre fútbol argentino",
    generator: 'Jonatan Cardozo'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        {/* Prevenir cache agresivo que puede causar problemas de sesión */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <link rel="shortcut icon" href="/DATOSANTO.ico" type="image/x-icon" />
      </head>
<<<<<<< HEAD
      <body className="min-h-screen  text-white">{children}</body>
=======
      <body className="min-h-screen  text-white">{children}
        <Toaster />
      </body>
>>>>>>> cdb9605 (juegos)
    </html>
  )
}
