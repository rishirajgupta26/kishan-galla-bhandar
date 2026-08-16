import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

// 🌟 SEO Optimized Metadata for Kishan Galla Bhandar & Seva Kendra 🌟
export const metadata: Metadata = {
  title: 'Kishan Galla Bhandar & Kishan Seva Kendra | Nawada',
  description: 'Wholesale and retail partner for cement, iron rod, seeds, and fertilizers in Nawada, Bihar. Proprietor: Bijendra Prasad.',
  keywords: ['Kishan Galla Bhandar', 'Kishan Seva Kendra', 'Nawada', 'Bihar', 'Cement Dealer', 'Iron Rods', 'Fertilizer Shop', 'Seeds', 'Wholesale'],
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#06182A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}