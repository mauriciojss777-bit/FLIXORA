import './globals.css';

export const metadata = {
  title: 'FLIXES',
  icons: {
    icon: '/logo-nuevo.png',
    apple: '/logo-nuevo.png',
  },
  openGraph: {
    images: ['/logo-nuevo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
