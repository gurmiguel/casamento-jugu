import { ComponentType, SVGProps } from 'react'

declare module '*.svg' {
  const component: ComponentType<SVGProps<SVGSVGElement>>

  export default component
}
