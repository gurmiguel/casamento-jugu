import Link from 'next/link'
import { H1, H3 } from '~/components/ui/typography'

export default function AdminPage() {

  return (
    <div className="container flex flex-col flex-1">
      <H1 className="mb-8 font-medium">Admin</H1>

      <nav className="flex flex-1">
        <H3 as="ul" className="flex flex-col gap-4 list-disc ml-8">
          <li>
            <Link href="/admin/galeria" className="border-b-2 border-foreground hover:opacity-70">Galeria de fotos</Link>
          </li>
        </H3>
      </nav>
    </div>
  )
}
