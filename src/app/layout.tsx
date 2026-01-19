import type { Metadata } from 'next'
import { Alegreya_SC, Alegreya_Sans, Imperial_Script } from 'next/font/google'
import './globals.css'

const alegreyaSans = Alegreya_Sans({
  display: 'swap',
  variable: '--font-alegreya-sans',
  weight: ['100', '400', '700'],
})

const alegreyaSerif = Alegreya_SC({
  display: 'swap',
  variable: '--font-alegreya-serif',
  weight: ['400', '700'],
})

const fontCalligraphy = Imperial_Script({
  weight: ['400'],
  display: 'swap',
  variable: '--font-calligraphy',
})

export const metadata: Metadata = {
  title: 'Casamento - Juliana e Gustavo',
  description: 'Criamos este site para compartilhar informações sobre o nosso grande dia!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${alegreyaSerif.variable} ${alegreyaSans.variable} ${fontCalligraphy.variable} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  )
}
