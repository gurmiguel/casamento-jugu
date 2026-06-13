'use client'

import { CheckCircleIcon, CopyIcon, HelpCircleIcon, PlusIcon, TrashIcon, XCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { formDataToObject } from '~/lib/form-data'
import { prettifyError } from '~/lib/zod'
import { ConfirmationStatus, InviteeType, SelectInvite, SelectInvitee } from '~/server/adapters/data/schemas/rsvp'
import { createInviteAction, updateInviteAction } from '../actions'
import { createInviteSchema, inviteSchema } from '../schemas'

export type InviteWithInvitees = SelectInvite & { invitees: SelectInvitee[] }

type InviteeData = Pick<SelectInvitee, 'name' | 'inviteeType'> & Partial<Pick<SelectInvitee, 'id' | 'confirmationStatus'>>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  invite?: InviteWithInvitees | null
}

const inviteeTypeOptions = Object.values(InviteeType).map(it => ({
  value: it,
  label: getInviteeTypeLabel(it),
}))

export function InviteFormDialog({ open, onOpenChange, invite }: Props) {
  const [invitees, setInvitees] = useState<Array<InviteeData>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validationSchema = invite ? inviteSchema : createInviteSchema

  useEffect(() => {
    if (!open) return

    if (invite) {
      setInvitees(invite.invitees.map(i => ({ id: i.id, name: i.name, inviteeType: i.inviteeType, confirmationStatus: i.confirmationStatus })))
    } else {
      setInvitees([{ name: '', inviteeType: InviteeType.ADULT }])
    }
  }, [open, invite])

  const handleAddInvitee = () => {
    setInvitees([...invitees, { name: '', inviteeType: InviteeType.ADULT }])
  }

  const handleRemoveInvitee = (index: number) => {
    setInvitees(invitees.filter((_, i) => i !== index))
  }

  const handleCopyCode = () => {
    if (invite?.code) {
      navigator.clipboard.writeText(invite.code)
      toast.success('Código copiado!')
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const { data, error } = await validationSchema.safeParseAsync(formDataToObject(formData))

    if (error) {
      toast.error(<div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: prettifyError(error) }} />)
      return
    }

    setIsSubmitting(true)

    try {
      const { label, invitees } = data
      if (invite) {
        const res = await updateInviteAction({ id: invite.id, label, invitees })
        if (res?.data?.success) {
          toast.success('Convite atualizado com sucesso!')
          onOpenChange(false)
        }
      } else {
        const res = await createInviteAction({ label, invitees: invitees })
        if (res?.data?.success) {
          toast.success('Convite criado com sucesso!')
          onOpenChange(false)
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{invite ? 'Editar Convite' : 'Novo Convite'}</DialogTitle>
          <DialogDescription>Preencha os dados do convite e a lista de convidados associados a ele.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mx-4">
            <div className="flex gap-2">
              <label className="flex flex-col flex-2/3">
                <div className="text-sm font-semibold">Família</div>
                <Input name="label" defaultValue={invite?.label} placeholder="Ex: Família Silva / João da Silva" />
              </label>

              {invite && (
                <label className="flex flex-col flex-1/3 basis-40">
                  <div className="text-sm font-semibold">Código do convite</div>
                  <div className="flex gap-2">
                    <InputGroup>
                      <InputGroupInput value={invite.code} readOnly className="pl-3 bg-muted/20 text-muted-foreground font-[Arial] uppercase" style={{ fontWeight: 'bold' }} />
                      <InputGroupAddon align="inline-end">
                        <Tooltip>
                          <TooltipTrigger render={
                            <Button variant="outline" size="icon" onClick={handleCopyCode} className="shrink-0">
                              <CopyIcon className="size-4" />
                            </Button>
                          } />
                          <TooltipContent>Copiar código</TooltipContent>
                        </Tooltip>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </label>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold">Convidados ({invitees.length})</label>
                <Tooltip>
                  <TooltipTrigger render={(
                    <Button variant="ghost" size="icon" onClick={handleAddInvitee}>
                      <PlusIcon className="size-4" />
                    </Button>
                  )} />
                  <TooltipContent>Adicionar</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex flex-col gap-3 sm:max-h-60 overflow-y-auto">
                {invitees.map((inv, i, { length }) => (
                  <div key={i} className="flex max-sm:flex-col gap-2 items-center overflow-hidden">
                    <input
                      type="hidden"
                      name={`invitees[${i}].id`}
                      defaultValue={inv.id}
                    />
                    <div className="flex flex-row-reverse items-center w-full sm:contents">
                      <Popover>
                        <PopoverTrigger render={(
                          <div className={`
                            flex items-center justify-center shrink-0 size-8
                            max-sm:mx-1
                          `}>
                            {inv.confirmationStatus && getConfirmationStatusIcon(inv.confirmationStatus)}
                          </div>
                        )} openOnHover />
                        {inv.confirmationStatus && <PopoverContent>{getConfirmationStatusLabel(inv.confirmationStatus)}</PopoverContent>}
                      </Popover>
                      <Input
                        name={`invitees[${i}].name`}
                        defaultValue={inv.name}
                        placeholder="Nome do convidado"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex w-full sm:contents">
                      <Select
                        name={`invitees[${i}].inviteeType`}
                        defaultValue={inv.inviteeType}
                        items={inviteeTypeOptions}
                      >
                        <SelectTrigger className="w-32 max-sm:w-auto max-sm:grow">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {inviteeTypeOptions.map(it => (
                            <SelectItem key={it.value} value={it.value}>{it.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Tooltip>
                        <TooltipTrigger render={(
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveInvitee(i)} className="text-destructive hover:text-destructive shrink-0">
                            <TrashIcon className="size-4" />
                          </Button>
                        )} />
                        <TooltipContent>Remover</TooltipContent>
                      </Tooltip>
                    </div>

                    {i < length - 1 && <div className={`
                      sm:hidden
                      h-px border-b border-muted border-dashed w-1/2
                      mt-2
                    `} />}
                  </div>
                ))}
                {invite?.confirmationNotes && (
                  <div className="flex flex-col mt-2">
                    <label className="text-sm font-semibold mb-2">Observações do convidado</label>
                    <div className={`
                      text-sm border-b border-input bg-muted/20 px-3
                      py-2 text-muted-foreground whitespace-pre-wrap
                    `}>
                      {invite.confirmationNotes}
                    </div>
                  </div>
                )}
                {invitees.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-2.5">Nenhum convidado adicionado</div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose render={(
              <Button variant="outline">Cancelar</Button>
            )} />
            <Button type="submit" disabled={isSubmitting || invitees.length === 0}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function getInviteeTypeLabel(type: InviteeType) {
  const labels: Record<InviteeType, string> = {
    [InviteeType.ADULT]: 'Adulto',
    [InviteeType.CHILD]: 'Criança (< 8 anos)',
  }
  return labels[type]
}

function getConfirmationStatusIcon(status?: ConfirmationStatus) {
  switch (status) {
    case ConfirmationStatus.CONFIRMED:
      return <CheckCircleIcon className="size-5 text-green-500" />
    case ConfirmationStatus.REFUSED:
      return <XCircleIcon className="size-5 text-red-500" />
    case ConfirmationStatus.PENDING:
    default:
      return <HelpCircleIcon className="size-5 text-muted-foreground" />
  }
}

function getConfirmationStatusLabel(status?: ConfirmationStatus) {
  switch (status) {
    case ConfirmationStatus.CONFIRMED:
      return 'Confirmado'
    case ConfirmationStatus.REFUSED:
      return 'Não irá'
    case ConfirmationStatus.PENDING:
    default:
      return 'Pendente'
  }
}
