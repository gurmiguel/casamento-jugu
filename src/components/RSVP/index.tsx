'use client'

import { formatDate, subMonths } from 'date-fns'
import { useRef, useState, type ComponentProps } from 'react'
import { Button } from '../ui/button'
import { H2, P } from '../ui/typography'
import { RSVPDialog } from './RSVPDialog'
import { ViewAwareContainer } from '../utilitary/view-aware-container'
import { useMediaQuery } from 'usehooks-ts'
import { screens } from '~/config/theme'
import { isElementInViewport } from '~/lib/ui'

type RSVPDialogProps = ComponentProps<typeof RSVPDialog>

interface Props extends Pick<RSVPDialogProps, 'loadInvitees' | 'onSubmit'> {
  date: Date
  code?: string
}

export function RSVP({ date, code, loadInvitees, onSubmit }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isMedium = useMediaQuery(`only screen and (min-width: ${screens.md+1}px)`)

  const dueDate = subMonths(date, 1)
  const [today] = useState(() => new Date())
  const isAfterDueDate = today > dueDate

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [isStickyHidden, setStickyHidden] = useState(true)

  function openRSVPDialog() {
    if (buttonRef.current && !isElementInViewport(buttonRef.current)) {
      buttonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
    setIsDialogOpen(true)
  }

  return (
    <>
      <section className="mt-12 py-8 sm:py-16 bg-accent/60">
        <div className="container mx-auto text-center">
          <div className={`
            flex flex-col items-center border-border rounded-lg
            w-132 max-w-11/12 mx-auto py-12
            sm:shadow-sm/30 sm:bg-accent
          `}>
            <H2 className="mb-4" underline={false}>RSVP</H2>
            {isAfterDueDate ? (
              <>
                <P className="text-muted-foreground">
                A data limite para confirmação já passou!<br/>
                Por favor entre em contato com os noivos para confirmar sua presença.
                </P>
              </>
            ) : (
              <>
                <P className="mb-6 text-lg">Confirme sua presença até o dia {formatDate(dueDate, 'dd/MM/yyyy')}</P>
                <ViewAwareContainer onIntersect={entry => setStickyHidden(entry.isIntersecting || entry.boundingClientRect.top < 0)}>
                  <Button ref={buttonRef} size="lg" className="rounded-full text-md" onClick={openRSVPDialog}>Confirmar presença</Button>
                </ViewAwareContainer>
              </>
            )}
          </div>
        </div>
      </section>

      {!isAfterDueDate && (
        <>
          <div className={`
            flex justify-center
            lg:hidden
            data-[hidden=true]:hidden
            sticky bottom-0 z-10 py-2
            not-data-[hidden=true]:animate-in
            slide-in-from-bottom-full duration-300
          `} data-hidden={isStickyHidden}>
            <Button
              size={isMedium ? 'xl' : 'lg'}
              className="relative min-w-70 rounded-full text-md sm:text-lg"
              onClick={openRSVPDialog}
            >Confirmar Presença</Button>
          </div>
        </>
      )}

      <RSVPDialog code={code ?? null}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        loadInvitees={loadInvitees}
        onSubmit={onSubmit}
      />
    </>
  )
}
