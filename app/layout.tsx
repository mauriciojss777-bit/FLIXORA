import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flixxes',
  description: 'Tu plataforma de video',
  icons: {
    icon: '/favicon.ico', // O la ruta de tu logo, ej: '/icon.png'
    shortcut: '/favicon.ico',
    apple: '/icon.png', // Este es clave para cuando se guarda en dispositivos móviles (iPhone/Android)
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

