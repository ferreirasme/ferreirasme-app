import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import { AnalyticsProvider } from '@/components/AnalyticsProvider'
import ThemeProvider from '@/components/ThemeProvider'
import { CartProvider } from '@/contexts/CartContext'

const ServiceWorkerRegistration = dynamic(
  () => import('@/components/ServiceWorkerRegistration'),
  { ssr: false }
)

const ResourcePrefetch = dynamic(
  () => import('@/components/ResourcePrefetch'),
  { ssr: false }
)

const PerformanceMonitor = dynamic(
  () => import('@/components/PerformanceMonitor'),
  { ssr: false }
)

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ferreiras.Me - Semijoias Exclusivas | Joias de Luxo com Design Único',
  description: 'Descubra a coleção exclusiva de semijoias Ferreiras.Me. Peças de luxo com design único, qualidade premium e elegância incomparável. Acessórios que contam histórias.',
  keywords: 'semijoias, joias exclusivas, semijoias de luxo, acessórios femininos, joias douradas, Ferreiras.Me, bijuterias premium, joias artesanais',
  authors: [{ name: 'Ferreiras.Me' }],
  creator: 'Ferreiras.Me',
  publisher: 'Ferreiras.Me',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ferreirasme.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ferreiras.Me - Semijoias Exclusivas | Joias de Luxo',
    description: 'Descubra a coleção exclusiva de semijoias Ferreiras.Me. Peças de luxo com design único, qualidade premium e elegância incomparável.',
    url: 'https://ferreirasme.com',
    siteName: 'Ferreiras.Me',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Ferreiras.Me - Semijoias Exclusivas',
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ferreiras.Me - Semijoias Exclusivas',
    description: 'Peças de luxo com design único e elegância incomparável.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'Ferreiras.Me',
    description: 'Semijoias exclusivas com design único, qualidade premium e elegância incomparável.',
    url: 'https://ferreirasme.com',
    logo: 'https://ferreirasme.com/logo.png',
    image: 'https://ferreirasme.com/logo.png',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressRegion: 'Brasil',
    },
    sameAs: [
      'https://www.instagram.com/ferreirasme/',
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/ComingSoon',
    },
  }

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#facc15" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${playfair.variable} ${montserrat.variable} font-sans`}>
        <ThemeProvider>
          <CartProvider>
            <AnalyticsProvider>
              {children}
              <ServiceWorkerRegistration />
              <ResourcePrefetch />
              <PerformanceMonitor />
            </AnalyticsProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}