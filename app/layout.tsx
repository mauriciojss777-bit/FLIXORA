import './globals.css';

export const metadata = {
  title: 'FLIXES',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    images: ['/icon.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
