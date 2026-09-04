'use client'

import { FuseWorker } from 'fuse.js/worker'
import { EditIcon, Loader2, NotebookPenIcon, PlusIcon, SearchIcon, Share2Icon, TrashIcon } from 'lucide-react'
import { ComponentProps, useEffect, useEffectEvent, useMemo, useState } from 'react'

import { toast } from 'sonner'
import { useMediaQuery } from 'usehooks-ts'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { H1 } from '~/components/ui/typography'
import { screens } from '~/config/theme'
import { useDialog } from '~/contexts/dialog/context'
import { cn } from '~/lib/ui'
import { ConfirmationStatus, SelectInvite } from '~/server/adapters/data/schemas/rsvp'
import { deleteInviteAction, getInviteAction } from './actions'
import { CountDetailsDialog } from './components/count-details.dialog'
import { InviteFormDialog, InviteWithInvitees } from './components/invite-form.dialog'
import { generateInvitePdf } from './generate-invite-pdf'

interface Props {
  invites: SelectInvite[]
}

const statusFilters = [
  { value: 'ALL', label: 'Filtre pelo status' },
  ...Object.values(ConfirmationStatus).map(s => ({
    value: s,
    label: getStatusLabel(s),
  })),
]

type StatusFilter = typeof statusFilters[number]['value']

export function InvitesPagesComponent({ invites }: Props) {
  const dialog = useDialog()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingInvite, setEditingInvite] = useState<InviteWithInvitees | null>(null)
  const [fetchingId, setFetchingId] = useState<string | null>(null)

  const [inviteToDelete, setInviteToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [sharingId, setSharingId] = useState<string | null>(null)
  const [filteredInvites, setFilteredInvites] = useState(invites)

  const isSmall = useMediaQuery(`(max-width: ${screens.xs}px)`)

  const index = useMemo(() => new FuseWorker(invites, {
    keys: new Array<keyof typeof invites[number]>('code', 'label'),
  }), [invites])

  const onFilterEvent = useEffectEvent(async (search: string, statusFilter: StatusFilter) => {
    const results = await index.search(search)
    let items = results.map(({ item }) => item)
    if (statusFilter !== 'ALL')
      items = items.filter(it => it.confirmationStatus === statusFilter)
    setFilteredInvites(items)
  })
  useEffect(() => {
    onFilterEvent(search, statusFilter)
  }, [index, search, statusFilter])

  useEffect(() => {
    if (!index) return
    return () => {
      tryTerminateIndex(index)
    }
  }, [index])

  async function handleOpenEditInvite(id: string) {
    if (fetchingId !== null) return

    setFetchingId(id)
    try {
      const { data: invite } = await getInviteAction({ id })

      if (!invite) {
        toast.error('Ocorreu um erro ao buscar o convite')
        return
      }

      setEditingInvite(invite)
      setIsFormOpen(true)
    } finally {
      setFetchingId(null)
    }
  }

  const handleDelete = async () => {
    if (!inviteToDelete) return
    setIsDeleting(true)
    try {
      const res = await deleteInviteAction({ id: inviteToDelete })
      if (res?.data?.success) {
        toast.success('Convite excluído com sucesso!')
        setInviteToDelete(null)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleShareInvite(inv: SelectInvite) {
    if (sharingId !== null) return

    setSharingId(inv.id)
    try {
      const pdfBlob = await generateInvitePdf(inv.code)
      const fileName = `convite-${inv.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Convite de Casamento - ${inv.label}`,
        })
      } else {
        const url = URL.createObjectURL(pdfBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Download do convite iniciado!')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled share dialog
        return
      }
      console.error(error)
      toast.error('Erro ao gerar/compartilhar o convite')
    } finally {
      setSharingId(null)
    }
  }

  async function handleOpenAmountDetails() {
    dialog.open(<CountDetailsDialog />)
  }

  return (
    <div className={`
      flex flex-col flex-1 w-full max-w-5xl
      mx-auto px-4
      sm:py-8
    `}>
      <div className={`
        flex
        max-sm:flex-col max-sm:gap-2
        justify-between items-center mb-8
      `}>
        <div className="flex items-center gap-2">
          <H1 variant="h2" className="-mt-1">Convites</H1>
          <Button variant="ghost" onClick={handleOpenAmountDetails}>Contagem</Button>
        </div>

        <Button onClick={() => { setEditingInvite(null); setIsFormOpen(true) }}>
          <PlusIcon className="size-4 mr-2" />
          Novo Convite
        </Button>
      </div>

      <div className="flex gap-4 mb-6 max-sm:flex-col">
        <label className="relative flex-1 sm:max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por família ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </label>
        <div className="ml-auto">
          <Select
            value={statusFilter}
            items={statusFilters}
            onValueChange={v => setStatusFilter(v as typeof statusFilter)}
          >
            <SelectTrigger className="w-52">
              <SelectValue className="font-medium" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map(filter => (
                <SelectItem key={filter.value} value={filter.value}>{filter.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border overflow-hidden max-sm:-mx-3.5">
        <table className={`
          w-full text-sm text-left
          *:*:*:px-4 *:*:*:py-3
          @max-md:*:*:*:py-2 @max-md:*:*:*:px-2
        `}>
          {invites.length > 0 && (
            <thead className="bg-muted text-muted-foreground @max-md:text-xs font-medium text-center">
              <tr>
                <th className="w-full text-left">Família</th>
                <th className="@max-md:text-xs md:whitespace-nowrap">
                  Número de
                  <br className="@min-md:hidden" /> Convidados
                </th>
                <th>Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
          )}
          <tbody className="divide-y bg-white">
            {filteredInvites.length > 0 ? (
              filteredInvites.map(inv => (
                <tr key={inv.id} className="hover:bg-muted/50 transition-colors leading-none">
                  <td className="font-medium">
                    <div className="flex items-center">
                      {inv.label}
                      {inv.confirmationNotes && (
                        <Popover>
                          <PopoverTrigger
                            render={(
                              <span className="text-muted-foreground ml-auto">
                                <NotebookPenIcon className="size-4" />
                              </span>
                            )}
                            openOnHover
                          />
                          <PopoverContent className="block whitespace-pre-wrap leading-none text-xs">
                            <span className="text-muted">Observações:</span><br/>
                            {inv.confirmationNotes}
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </td>
                  <td className="text-center text-lg font-bold font-sans">{inv.invitedAmount}</td>
                  <td className="text-center">
                    <Badge variant={getStatusBadgeVariant(inv.confirmationStatus)} className="@max-md:text-[0.625rem]">
                      {getStatusLabel(inv.confirmationStatus)}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size={isSmall ? 'icon-xs' : 'icon'}
                        onClick={() => handleShareInvite(inv)}
                        disabled={sharingId === inv.id}
                        title="Compartilhar Convite (PDF)"
                      >
                        {sharingId === inv.id
                          ? <Loader2 className="size-4 animate-spin" />
                          : <Share2Icon className="size-4" />}
                      </Button>
                      <Button variant="ghost" size={isSmall ? 'icon-xs' :'icon'} onClick={() => handleOpenEditInvite(inv.id)} title="Editar/Visualizar">
                        {fetchingId === inv.id
                          ? <Loader2 className="size-4 animate-spin" />
                          : <EditIcon className="size-4" />}
                      </Button>
                      <Button variant="ghost" size={isSmall ? 'icon-xs' :'icon'} className="text-destructive hover:text-destructive" onClick={() => setInviteToDelete(inv.id)} title="Remover">
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={cn(
                  'text-center text-muted-foreground font-medium',
                  invites.length === 0 ? 'px-4! py-16! text-xl' : 'py-5.5!',
                )}>
                  Nenhum convite {invites.length > 0 ? 'encontrado' : 'cadastrado'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <InviteFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        invite={editingInvite}
      />

      <Dialog open={!!inviteToDelete} onOpenChange={(open) => !open && setInviteToDelete(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Excluir Convite</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este convite? Todos os convidados associados também serão excluídos. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteToDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getStatusBadgeVariant(status: ConfirmationStatus) {
  type BadgeVariant = ComponentProps<typeof Badge>['variant']
  const variants: Record<ConfirmationStatus, BadgeVariant> = {
    [ConfirmationStatus.CONFIRMED]: 'success',
    [ConfirmationStatus.PARTIALLY_CONFIRMED]: 'secondary',
    [ConfirmationStatus.REFUSED]: 'destructive',
    [ConfirmationStatus.PENDING]: 'outline',
  }
  return variants[status]
}

function getStatusLabel(status: ConfirmationStatus) {
  const labels: Record<ConfirmationStatus, string> = {
    [ConfirmationStatus.CONFIRMED]: 'Confirmado',
    [ConfirmationStatus.PARTIALLY_CONFIRMED]: 'Parcialmente',
    [ConfirmationStatus.REFUSED]: 'Recusado',
    [ConfirmationStatus.PENDING]: 'Pendente',
  }
  return labels[status]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tryTerminateIndex(index: InstanceType<typeof FuseWorker<any>>) {
  try {
    for (const [, handler] of index._pending)
      handler.resolve([])
    index.terminate()
  } catch {
    // noop
  }
}
