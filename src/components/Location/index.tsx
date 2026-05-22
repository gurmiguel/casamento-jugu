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
    <div className="px-6 w-full my-8 max-sm:px-0">
      <div className={`
        container mx-auto flex flex-col gap-8
        lg:flex-row lg:gap-16
      `}>
        <div className={`
          flex flex-1 flex-col justify-center
          md:rounded-4xl
          border-2 border-secondary/20 bg-card px-8 py-16
          md:px-16
          lg:aspect-square lg:flex-1/2
        `}>
          <div>
            <H5 className="mb-2 text-secondary">A Celebração</H5>
            <H2 className="mb-8 inline-block font-normal sm:mb-16" underline={false}>O Grande Dia</H2>
          </div>

          <ul className="grid grid-cols-4 items-center gap-12 sm:grid-cols-7">
            <li className="contents">
              <CalendarIcon className="size-12 text-secondary" />
              <div className="col-start-2 col-end-5 flex flex-col sm:col-end-8">
                <Strong variant="h5" className="mb-2 font-sans font-bold text-secondary uppercase">Quando</Strong>
                <Span variant="h3" className="font-normal">{Intl.DateTimeFormat('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }).format(date)}</Span>
                <Span variant="h4" className="font-normal">
                  Início da cerimônia às{' '}
                  <Strong variant="h3" className="-my-2 inline-block">{Intl.DateTimeFormat('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(date)}</Strong>
                </Span>
              </div>
            </li>
            <li className="contents">
              <MapPinIcon className="size-12 text-secondary" />
              <div className="col-start-2 col-end-5 flex flex-col sm:col-end-8">
                <Strong variant="h5" className="mb-2 font-sans font-bold text-secondary uppercase">Onde</Strong>
                <Span variant="h3" className="font-normal">{formatAddress(address, 'minimal')}</Span>
                <Span variant="h4" className="font-normal">
                  {address.city}, {address.state}
                </Span>
              </div>
            </li>
            <li className="contents">
              <SparkleIcon className="size-12 text-secondary" />
              <div className="col-start-2 col-end-5 flex flex-col sm:col-end-8">
                <Strong variant="h5" className="mb-2 font-sans font-bold text-secondary uppercase">Dicas</Strong>
                <Span variant="h4" className="leading-none font-normal">Vestimenta social, fresca e confortável. <small>Mulheres, evitem saltos muito finos.</small></Span>
              </div>
            </li>
          </ul>
        </div>
        <div id="map" className={`
          aspect-square flex-1 overflow-hidden rounded-4xl border-2
          border-secondary/20
          lg:flex-1/2
          max-w-full
          max-sm:rounded-none max-sm:border-none
        `}>
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
