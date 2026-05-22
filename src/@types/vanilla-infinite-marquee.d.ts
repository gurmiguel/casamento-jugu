/// <reference types="vanilla-infinite-marquee/types/infinite-marquee.d.ts" />

declare module 'vanilla-infinite-marquee' {
  import InfiniteMarqueeType from 'vanilla-infinite-marquee/types'

  class InfiniteMarquee extends InfiniteMarqueeType {
    destroy(): void
  }
  export type InfiniteMarqueeOptions = ConstructorParameters<typeof InfiniteMarquee>[0]

  export default InfiniteMarquee
}
