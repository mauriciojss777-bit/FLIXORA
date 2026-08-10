import './globals.css';

export const metadata = {
  title: 'FLIXES',
  description: 'Tu plataforma de streaming de contenido exclusivo',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png', // Usamos este icono, que es el que mejor funciona
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
