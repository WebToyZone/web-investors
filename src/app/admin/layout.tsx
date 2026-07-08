import type { Metadata } from 'next';
import { Bebas_Neue, Roboto, Roboto_Condensed } from 'next/font/google';
import '../globals.css';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const robotoCondensed = Roboto_Condensed({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admin | EOLO Investors',
  description: 'EOLO Investors content administration.',
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang='es'
      className={`${bebas.variable} ${roboto.variable} ${robotoCondensed.variable}`}
    >
      <body className='font-sans'>{children}</body>
    </html>
  );
}
