'use client'

import { atcb_action } from 'add-to-calendar-button-react'
import { addHours, formatDate } from 'date-fns'
import { CalendarPlus } from 'lucide-react'
import { MouseEvent } from 'react'
import { IAddress } from '~/config/types'
import { formatAddress } from '~/lib/address'
import { Button } from '../ui/button'

interface Props {
  datetime: Date
  durationInHours: number
  address: IAddress
}

export function AddToCalendar({ datetime, durationInHours, address }: Props) {

  function handleAddToCalendar(e: MouseEvent<HTMLButtonElement>) {
    atcb_action({
      name: 'Casamento Juliana e Gustavo',
      description: 'Casamento Juliana e Gustavo',
      availability: 'busy',
      startDate: formatDate(datetime, 'yyyy-MM-dd'),
      startTime: formatDate(datetime, 'HH:ss'),
      endDate: formatDate(datetime, 'yyyy-MM-dd'),
      endTime: formatDate(addHours(datetime, durationInHours), 'HH:ss'),
      timeZone: 'America/Sao_Paulo',
      options: ['Google', 'Outlook.com', 'Apple'],
      location: formatAddress(address, 'full') + ` - ${address.zipCode}`,
      listStyle: 'modal',
      lightMode: 'dark',
      language: 'pt',
      styleDark: [
        '--font: var(--font-sans)',
        '--serif: var(--font-serif)',
        '--list-close-text: var(--primary-foreground)',
        '--list-close-background: color-mix(in srgb, var(--primary), #000 20%)',
        '--list-background: var(--primary)',
        '--list-hover-background: color-mix(in srgb, var(--primary), #000 10%)',
      ].join(';'),
      customCss: '/add-to-calendar.custom.css',
      buttonStyle: 'custom',
      customLabels: {
        google: 'Google (Gmail)',
        outlookcom: 'Outlook',
      },
      hideBranding: true,
    }, e.currentTarget)
  }

  return (
    <Button variant="outline" size="lg" className="rounded-full text-sm font-medium sm:text-xl" onClick={handleAddToCalendar}>
      <CalendarPlus /> Adicione ao Calendário
    </Button>
  )
}
