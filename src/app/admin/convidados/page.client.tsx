'use client'

import { ComponentProps, useEffect, useEffectEvent, useMemo, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, Loader2 } from 'lucide-react'
import { FuseWorker } from 'fuse.js/worker'
import { InviteWithInvitees, InviteFormDialog } from './components/invite-form.dialog'
import { ConfirmationStatus, SelectInvite } from '~/server/adapters/data/schemas/rsvp'
import { deleteInviteAction, getInviteAction } from './actions'
import { toast } from 'sonner'
import { useMediaQuery } from 'usehooks-ts'
import { screens } from '~/config/theme'
import { cn } from '~/lib/ui'
import { H1 } from '~/components/ui/typography'
import { useDialog } from '~/contexts/dialog/context'
import { CountDetailsDialog } from './components/count-details.dialog'

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

  async function handleOpenAmountDetails() {
    dialog.open(<CountDetailsDialog />)
  }

  return (
    <div className={`
      flex flex-col flex-1 w-full max-w-5xl
      mx-auto px-4 py-8
    `}>
      <div className="flex justify-between items-center mb-8">
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

      <div className="border overflow-hidden max-sm:-mx-4">
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
                <tr key={inv.id} className="hover:bg-muted/50 transition-colors">
                  <td className="font-medium">{inv.label}</td>
                  <td className="text-center text-lg font-bold font-sans">{inv.invitedAmount}</td>
                  <td className="text-center">
                    <Badge variant={getStatusBadgeVariant(inv.confirmationStatus)} className="@max-md:text-[0.625rem]">
                      {getStatusLabel(inv.confirmationStatus)}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size={isSmall ? 'icon-xs' :'icon'} onClick={() => handleOpenEditInvite(inv.id)}>
                        {fetchingId === inv.id
                          ? <Loader2 className="size-4 animate-spin" />
                          : <EditIcon className="size-4" />}
                      </Button>
                      <Button variant="ghost" size={isSmall ? 'icon-xs' :'icon'} className="text-destructive hover:text-destructive" onClick={() => setInviteToDelete(inv.id)}>
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
    [ConfirmationStatus.CONFIRMED]: 'default',
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
