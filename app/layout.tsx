import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

// 🌟 SEO Optimized Metadata for Kishan Galla Bhandar & Seva Kendra 🌟
export const metadata: Metadata = {
  title: 'Kishan Galla Bhandar & Seva Kendra | Best Cement Store Nawada',
  description: 'Top-rated cement store in Nawada and Roh. Trusted wholesale partner for Cement, Iron Rod (Sariya), Gitti, Balu, Bricks and Stone with dependable delivery.',
  keywords: [
    'cement store Nawada', 
    'best cement shop in Nawada', 
    'Kishan Galla Bhandar', 
    'Kishan Seva Kendra', 
    'building materials Roh Nawada', 
    'gitti balu shop near me', 
    'iron rod sariya supplier Bihar', 
    'top hardware shop Nawada'
  ],
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