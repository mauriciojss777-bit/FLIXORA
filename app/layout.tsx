import './globals.css';

export const metadata = {
  title: 'FLIXES',
  icons: {
    icon: '/icon_v2.png',
    apple: '/icon_v2.png',
  },
  openGraph: {
    images: ['/icon_v2.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
