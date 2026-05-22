import type { Metadata } from 'next'
import { fontCalligraphy, fontSans, fontSerif } from '~/config/theme'
import './globals.css'
import ReactDOM from 'react-dom'
import { Toaster } from '~/components/ui/sonner'
import { DialogProvider } from '~/components/Dialog/context'

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
    <html lang="pt-br" className={`
      ${fontSerif.variable}
      ${fontSans.variable}
      ${fontCalligraphy.variable}
      antialiased
    `}>
      <PreloadResources />
      <body>
        <DialogProvider>
          {children}
        </DialogProvider>
        <Toaster closeButton />
      </body>
    </html>
  )
}

function PreloadResources() {
  ReactDOM.preload('https://cdn.jsdelivr.net/npm/add-to-calendar-button@2.13.10/assets/css/atcb.min.css', { as: 'style' })

  return null
}
