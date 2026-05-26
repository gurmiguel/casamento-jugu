import { Fragment, useEffect, useState, useTransition } from 'react'
import { Button } from '~/components/ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { getCountDetailsAction } from '../actions'
import { toast } from 'sonner'
import { JumpingDotsLoader } from '~/components/ui/jumping-dots'
import { H5, Strong } from '~/components/ui/typography'

type CountDetails = Awaited<ReturnType<typeof getCountDetailsAction>>['data']

export function CountDetailsDialog() {
  const [details, setDetails] = useState<CountDetails | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(() => {
      getCountDetailsAction()
        .then(({ data, serverError }) => {
          if (serverError) throw serverError
          setDetails(data)
        })
        .catch(error => {
          const message = error instanceof Error ? error.message : error as string
          toast.error('Erro ao buscar detalhes da contagem.', { description: message })
        })
    })
  }, [])

  const rows = details ? Object.entries(details).map(([type, value]) => ({
    type,
    label: getDetailsLabel(type as keyof typeof details),
    adults: value.adults,
    children: value.children,
  })) : []

  const total = rows.reduce((acc, row) => acc + row.adults + row.children, 0)

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalhes da Contagem</DialogTitle>
        <DialogDescription>
          Detalhes da contagem de convidados
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col">
        {isPending && <JumpingDotsLoader className="my-8" />}
        {details && (
          <>
            <table className="w-full *:*:*:px-4 *:*:*:py-2 border-t bg-white">
              <tbody className="divide-y">
                {rows.map(row => (
                  <Fragment key={row.type}>
                    <tr className="divide-x">
                      <td rowSpan={2}>{row.label}:</td>
                      <td className="text-center text-md">Adultos: <Strong>{row.adults}</Strong></td>
                    </tr>
                    <tr>
                      <td className="text-center text-md">Crianças: <Strong>{row.children}</Strong></td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t text-center bg-muted/20">
                  <td/>
                  <td className="py-4!">
                    <H5 as="span">Total: {total}</H5>
                  </td>
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>
      <DialogFooter className="-mt-6 items-center sm:justify-center">
        <DialogClose render={<Button variant="outline"/>}>Fechar</DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

function getDetailsLabel(type: keyof NonNullable<CountDetails>) {
  const labels: Record<typeof type, string> = {
    confirmed: 'Confirmados',
    pending: 'Pendentes',
    refused: 'Recusados',
  }
  return labels[type]
}
