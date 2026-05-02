import { CalendarIcon, MapPinIcon, SparkleIcon } from 'lucide-react'
import { IAddress } from '~/config/types'
import { formatAddress } from '~/lib/address'
import { H2, H5, Span, Strong } from '../ui/typography'

interface Props {
  date: Date
  address: IAddress
}

export function Location({ date, address }: Props) {
  return (
    <div className="px-6">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16">
        <div className="flex-1 lg:flex-1/2 flex flex-col justify-center border-2 border-secondary/20 rounded-4xl px-8 py-16 md:px-16 bg-card lg:aspect-square">
          <div>
            <H5 className="text-secondary mb-2">A Celebração</H5>
            <H2 className="font-normal inline-block sm:mb-16 mb-8" underline={false}>O Grande Dia</H2>
          </div>

          <ul className="grid grid-cols-4 sm:grid-cols-7 gap-12 items-center">
            <li className="contents">
              <CalendarIcon className="size-12 text-secondary" />
              <div className="col-start-2 col-end-5 sm:col-end-8 flex flex-col">
                <Strong style="h5" className="font-sans font-bold uppercase text-secondary mb-2">Quando</Strong>
                <Span style="h3" className="font-normal">{Intl.DateTimeFormat('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }).format(date)}</Span>
                <Span style="h4" className="font-normal">
                  Início da cerimônia às{' '}
                  <Strong style="h3" className="inline-block -my-2">{Intl.DateTimeFormat('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(date)}</Strong>
                </Span>
              </div>
            </li>
            <li className="contents">
              <MapPinIcon className="size-12 text-secondary" />
              <div className="col-start-2 col-end-5 sm:col-end-8 flex flex-col">
                <Strong style="h5" className="font-sans font-bold uppercase text-secondary mb-2">Onde</Strong>
                <Span style="h3" className="font-normal">{formatAddress(address, 'minimal')}</Span>
                <Span style="h4" className="font-normal">
                  {address.city}, {address.state}
                </Span>
              </div>
            </li>
            <li className="contents">
              <SparkleIcon className="size-12 text-secondary" />
              <div className="col-start-2 col-end-5 sm:col-end-8 flex flex-col">
                <Strong style="h5" className="font-sans font-bold uppercase text-secondary mb-2">Dicas</Strong>
                <Span style="h4" className="font-normal leading-none">Vestimenta social, fresca e confortável. <small>Mulheres, evitem saltos muito finos.</small></Span>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex-1 lg:flex-1/2 border-2 border-secondary/20 rounded-4xl aspect-square overflow-hidden">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              `${address.label ? address.label + ', ' : ''}${formatAddress(address, 'full')}`,
            )}&t=m&z=17&ie=UTF8&iwloc=near&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
