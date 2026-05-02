import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const _inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'Chabano Properties — Immobilier Premium à Oran',
  description: 'Vous cherchez un appartement à Oran ? Chabane Chawki vous aide à acheter, vendre ou investir dans l\'immobilier à Oran avec une approche moderne et des résultats rapides.',
  keywords: 'immobilier Oran, appartement Oran, F3 Oran, vente appartement Oran, investissement immobilier Algérie, Chabano Properties',
  openGraph: {
    title: 'Chabano Properties — Immobilier Premium à Oran',
    description: 'Trouvez votre bien idéal à Oran avec Chabane Chawki, expert immobilier moderne.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${_playfair.variable} ${_inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
