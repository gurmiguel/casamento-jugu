import { useEffect, useEffectEvent, useLayoutEffect, useState, useTransition, type ComponentProps, type SubmitEvent } from 'react'
import { toast } from 'sonner'
import { formatValidationError, type ServerActionResponse } from '~/lib/actions'
import { cn } from '~/lib/ui'
import { ConfirmationStatus, SelectInvitee } from '~/server/adapters/data/schemas'
import { Button } from '../ui/button'
import { ButtonGroup } from '../ui/button-group'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { JumpingDotsLoader } from '../ui/jumping-dots'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { H5 } from '../ui/typography'
import { useRouter } from 'next/navigation'

type InviteeData = Pick<SelectInvitee, 'id' | 'name' | 'inviteeType' | 'confirmationStatus'>
type InviteeStatusData = Pick<SelectInvitee, 'id' | 'confirmationStatus'>

interface Props {
  code: string | null
  open: boolean
  onOpenChange(open: boolean): void
  loadInvitees(params: {
    code: string
  }): Promise<ServerActionResponse<{ label: string, confirmationNotes: string | null, invitees: InviteeData[] }, keyof typeof params>>
  onSubmit(params: {
    code: string,
    invitees: InviteeStatusData[],
    notes: string
  }): Promise<ServerActionResponse<{ success: boolean, message?: string }, keyof typeof params>>
}

const buttons = [
  {
    status: ConfirmationStatus.CONFIRMED,
    label: 'Sim',
    className: 'hover:bg-success/70! hover:text-success-foreground data-[selected="true"]:bg-success data-[selected="true"]:text-success-foreground',
  },
  {
    status: ConfirmationStatus.REFUSED,
    label: 'Não',
    className: 'hover:bg-destructive/70! hover:text-destructive-foreground data-[selected="true"]:bg-destructive data-[selected="true"]:text-destructive-foreground',
  },
]

export function RSVPDialog({ code, open, onOpenChange, loadInvitees, onSubmit }: Props) {
  const router = useRouter()

  const [isLoadingInvite, startLoadingInvite] = useTransition()
  const [isSubmitting, startSubmitting] = useTransition()

  const [inviteData, setInviteData] = useState<{ label: string, invitees: InviteeData[] } | null>(null)

  const [statuses, setStatuses] = useState(new Array<InviteeStatusData>())
  const [notes, setNotes] = useState('')

  useLayoutEffect(() => {
    const _ = code
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInviteData(null)
    setNotes('')
  }, [code])

  const onOpenEvent = useEffectEvent((open: boolean, code: string | null) => {
    if (!open) return
    if (!code) return

    startLoadingInvite(async () => {
      const response = await loadInvitees({ code })

      if (!response.data) {
        const error = response.serverError ?? formatValidationError(response.validationErrors)

        toast.error('Erro ao carregar dados do convite', {
          description: error,
        })

        router.push('/', { scroll: false })
        return
      }

      setInviteData(response.data)
      setStatuses(response.data.invitees.map(invitee => ({
        id: invitee.id,
        confirmationStatus: invitee.confirmationStatus,
      })))
      setNotes(response.data.confirmationNotes ?? '')
    })

    return () => {
      setInviteData(null)
      setNotes('')
    }
  })

  useEffect(() => onOpenEvent(open, code), [open, code])

  function onStatusChange(id: number, status: ConfirmationStatus) {
    setStatuses(statuses => {
      const updated = statuses.filter(status => status.id !== id)

      if (!statuses.some(it => it.id === id && it.confirmationStatus === status))
        updated.push({ id, confirmationStatus: status })
      else
        updated.push({ id, confirmationStatus: ConfirmationStatus.PENDING })

      return updated
    })
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    console.log({code})
    if (!code) {
      const $code = e.currentTarget.elements.namedItem('code') as HTMLInputElement | null
      if (!$code?.value || $code.value.length < 6) {
        return toast.error('Informe o código do convite', {
          description: 'O código é composto por 6 caracteres.',
        })
      }

      router.replace(`/?code=${$code.value}`, { scroll: false })
      return
    }

    startSubmitting(async () => {
      const response = await onSubmit({ code, invitees: statuses, notes })

      if (!response.data) {
        const error = response.serverError ?? formatValidationError(response.validationErrors)

        toast.error('Erro ao confirmar presença', {
          description: error,
        })

        return
      }

      toast.success('Presença confirmada!', {
        description: response.data.message,
      })

      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center">
        <form onSubmit={handleSubmit} className="contents">
          {isLoadingInvite ? (
            <>
              <DialogHeader className="my-2">
                <DialogTitle>Confirme sua presença</DialogTitle>
              </DialogHeader>
              <JumpingDotsLoader className="mt-4 mb-16" color="var(--primary)" />
            </>
          ) : inviteData ? (
            <>
              <DialogHeader className="mt-2 pb-0">
                <DialogTitle>Confirme sua presença</DialogTitle>
                <DialogDescription className="max-w-10/12 mx-auto">
                    Confirme a presença de cada convidado.<br/>
                    Caso alguém não possa comparecer, por favor, responda o quanto antes.
                </DialogDescription>
              </DialogHeader>

              <div className="mx-4">
                <fieldset className="border rounded p-4">
                  <H5 as="legend" className="px-2 text-left">{inviteData.label}</H5>

                  <div className="flex flex-col gap-2 text-left">
                    <div className="flex flex-row -mt-4">
                      <div className="flex-1" />
                      <div className="px-2 text-primary font-semibold text-center">Confirmado?</div>
                    </div>
                    {inviteData.invitees.map(invitee => (
                      <div key={invitee.id} className="flex flex-row justify-between items-center">
                        <span className="font-semibold">{invitee.name}</span>

                        <ButtonGroup rounded>
                          {buttons.map(({ status, label, className }) => (
                            <ToggleableButton key={status}
                              variant="outline" size="xs"
                              className={cn('text-xs', className)}
                              data-selected={status === statuses.find(s => s.id === invitee.id)?.confirmationStatus}
                              unselectedClassName="hover:bg-transparent hover:text-foreground"
                              onClick={() => onStatusChange(invitee.id, status)}>{label}</ToggleableButton>
                          ))}
                        </ButtonGroup>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <label className="block mt-2 text-left">
                  <span>Observações</span>
                  <Textarea name="notes" value={notes} onChange={e => setNotes(e.target.value)} className="max-h-6 py-0 text-muted-foreground" />
                </label>
              </div>

              <DialogFooter>
                <DialogClose render={<Button variant="ghost">Cancelar</Button>} />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <JumpingDotsLoader size="sm" /> : 'Enviar'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader className="mt-2">
                <DialogTitle>Confirme sua presença</DialogTitle>
                <DialogDescription>
                  Insira o código do seu convite para continuar.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center mx-4">
                <label className="text-lg">Código do convite</label>
                <Input
                  name="code"
                  className={`
                    w-72 text-center uppercase text-5xl! font-[Arial]
                    h-auto tracking-[0.35rem]
                  `}
                  style={{ fontWeight: 'bold' }}
                  autoCapitalize="characters"
                  maxLength={6}
                  autoFocus
                />
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost">Cancelar</Button>} />
                <Button type="submit">Continuar</Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ToggleableButton({ unselectedClassName, ...props }: ComponentProps<typeof Button> & { unselectedClassName?: string }) {
  const [hasJustClicked, setHasJustClicked] = useState(false)

  return <Button {...props}
    className={state => {
      let className = typeof props.className === 'string' ? props.className : props.className?.(state)

      if (hasJustClicked && !(props as Record<string, unknown>)['data-selected']) {
        className = className?.split(' ').filter(cls => !cls.startsWith('hover:')).join(' ')
        className = cn(className, unselectedClassName)
      }

      return cn(className)
    }}
    onClick={e => {
      setHasJustClicked(true)
      props.onClick?.(e)
    }}
    onMouseLeave={e => {
      setHasJustClicked(false)
      props.onMouseLeave?.(e)
    }}
  />
}
