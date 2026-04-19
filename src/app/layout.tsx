import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '3D Menu Demo | Experience Your Food Before You Order',
  description: 'Interactive AR Menu for Modern Restaurants - Preview your food in 3D before ordering',
  keywords: ['AR menu', '3D food', 'restaurant', 'interactive menu', 'food visualization'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
