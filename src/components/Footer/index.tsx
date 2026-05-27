import { H2, P, Strong } from '~/components/ui/typography'

export function Footer() {
  return (
    <footer className="bg-secondary/20 py-6 sm:py-10 text-center text-secondary-foreground">
      <div className={`
        container mx-auto flex flex-col items-center
        gap-4 px-6 text-muted-foreground
      `}>
        <H2 className="text-secondary font-calligraphy text-4xl text-shadow-sm/30 mb-1.5">Gustavo <small className="-mr-1 opacity-70">&</small> Juliana</H2>
        <P className="text-sm">
          Feito com amor para <Strong>Gustavo <span className="font-calligraphy">&amp;&nbsp;</span> Juliana</Strong> © 2026
        </P>
        <nav className="flex gap-4 sm:-mb-1 mb-1">
          <a href="/politica-de-privacidade" className="underline hover:text-primary">Política de Privacidade</a>
        </nav>
      </div>
    </footer>
  )
}
