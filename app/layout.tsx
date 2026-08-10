import './globals.css';

export const metadata = {
  title: 'FLIXES',
  description: 'Tu plataforma de streaming de contenido exclusivo',
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
