import './globals.css';

export const metadata = {
  title: 'FLIXES',
  description: 'Tu plataforma de streaming de contenido exclusivo',
  icons: {
    icon: '/favicon.ico?v=2',
    apple: '/apple-touch-icon.png?v=2',
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
