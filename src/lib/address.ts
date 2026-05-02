import { IAddress } from '~/config/types'

export function formatAddress(address: IAddress, type?: 'full' | 'short' | 'minimal') {
  switch (type) {
    case 'full':
      return `${address.street}, ${address.number} - ${address.neighborhood} - ${address.city}, ${address.state}`
    case 'short':
      return `${address.street}, ${address.number} - ${address.city}, ${address.state}`
    case 'minimal':
      return `${address.street}, ${address.number}`
    default:
      return `${address.street}, ${address.number} - ${address.neighborhood} - ${address.city}, ${address.state}`
  }
}
