'use client'

import Link from 'next/link'
import { H1, H3 } from '~/components/ui/typography'
import { refreshProducts } from './actions'
import { toast } from 'sonner'
import { RefreshCwIcon } from 'lucide-react'
import { useTransition } from 'react'

export default function AdminPage() {
  const [pendingRefreshProducts, startRefreshProducts] = useTransition()

  function handleRefreshProducts() {
    startRefreshProducts(async () => {
      try {
        await refreshProducts()
        toast.success('Produtos atualizados com sucesso')
      } catch (error) {
        console.error(error)
        toast.error('Erro ao atualizar produtos')
      }
    })
  }

  const menu = [
    { href: '/admin/convidados', label: 'Lista de Convidados' },
    { href: '/admin/galeria', label: 'Galeria de fotos' },
    { onClick: handleRefreshProducts, label: <><RefreshCwIcon className="data-[loading=true]:animate-spin" data-loading={pendingRefreshProducts} /> Atualizar lista de presentes</> },
  ]

  return (
    <div className="container flex flex-col flex-1">
      <H1 className="mb-8 font-medium">Admin</H1>

      <nav className="flex flex-1">
        <H3 as="ul" className="flex flex-col gap-4 list-disc ml-8">
          {menu.map((item, i) => (
            <li key={i}>
              {item.href
                ? <Link href={item.href} className="border-b-2 border-foreground hover:opacity-70">{item.label}</Link>
                : <button
                  className="border-b-2 border-foreground hover:opacity-70 cursor-pointer"
                  onClick={() => item.onClick && item.onClick()}
                >{item.label}</button>
              }
            </li>
          ))}
        </H3>
      </nav>
    </div>
  )
}
