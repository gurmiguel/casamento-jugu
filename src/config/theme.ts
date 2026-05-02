import { Alegreya_SC, Alegreya_Sans, Imperial_Script } from 'next/font/google'

export const screens = {
  'xs': 410,
  'sm': 576,
  'md': 756,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1440,
}

export const fontSerif = Alegreya_SC({
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '500', '700'],
  preload: true,
})

export const fontSans = Alegreya_Sans({
  display: 'swap',
  variable: '--font-sans',
  weight: ['100', '400', '500', '700', '900'],
  preload: true,
})

export const fontCalligraphy = Imperial_Script({
  weight: ['400'],
  display: 'swap',
  variable: '--font-calligraphy',
})
