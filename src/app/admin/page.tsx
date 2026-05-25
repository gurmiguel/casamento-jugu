import Link from 'next/link'
import { H1, H3 } from '~/components/ui/typography'

export default function AdminPage() {
  const menu = [
    { href: '/admin/convidados', label: 'Lista de Convidados' },
    { href: '/admin/galeria', label: 'Galeria de fotos' },
  ]

  return (
    <div className="container flex flex-col flex-1">
      <H1 className="mb-8 font-medium">Admin</H1>

      <nav className="flex flex-1">
        <H3 as="ul" className="flex flex-col gap-4 list-disc ml-8">
          {menu.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="border-b-2 border-foreground hover:opacity-70">{item.label}</Link>
            </li>
          ))}
        </H3>
      </nav>
    </div>
  )
}
