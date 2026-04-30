import { IAddress } from '~/config/types'

export function formatAddress(address: IAddress, type?: 'full' | 'short') {
  switch (type) {
    case 'full':
      return `${address.street}, ${address.number} - ${address.neighborhood} - ${address.city}, ${address.state}`
    case 'short':
      return `${address.street}, ${address.number} - ${address.city}, ${address.state}`
    default:
      return `${address.street}, ${address.number} - ${address.neighborhood} - ${address.city}, ${address.state}`
  }
}
