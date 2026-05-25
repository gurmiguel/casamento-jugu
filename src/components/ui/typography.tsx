import { cva, VariantProps } from 'class-variance-authority'
import { FunctionComponent, JSX } from 'react'
import { twMerge } from '~/lib/ui'

const typographyVariants = cva('relative', {
  variants: {
    variant: {
      h1: 'text-4xl/8 -tracking-wider lg:text-6xl/12',
      h2: 'text-3xl font-medium tracking-tight lg:text-4xl',
      h3: 'text-2xl font-medium tracking-tight lg:text-3xl',
      h4: 'text-xl/tight font-medium lg:text-2xl',
      h5: 'text-lg/tight font-medium lg:text-xl leading-none',
      h6: '',
      p: '',
      strong: 'font-semibold',
      em: 'italic',
      small: 'text-sm',
      span: 'text-base',
    },
    underline: {
      true: `
        after:absolute after:top-full after:abs-center-x after:mt-2 after:h-px
        after:w-20 after:bg-[currentColor] after:opacity-40 after:content-[""]
      `,
    },
  },
  defaultVariants: {
    variant: 'span',
    underline: false,
  },
})

type TypographyVariants = VariantProps<typeof typographyVariants>
type TypographyProps = TypographyVariants & JSX.IntrinsicElements['p'] & { as?: NonNullable<TypographyVariants['variant']> | keyof JSX.IntrinsicElements }

type Variants = NonNullable<TypographyProps['variant']>

export const Typography = ({
  variant,
  underline,
  as,
  className,
  ...props
}: TypographyProps) => {
  variant ??= 'span'
  let Component = as as Variants
  Component ??= variant
  return (
    <Component {...props} className={twMerge(typographyVariants({ variant, underline, className, ...props }))} />
  )
}

export const typography = (variants: TypographyVariants, className?: string) => twMerge(typographyVariants({ ...variants, className }))

function withTypography(as: Variants, defaultProps?: Partial<TypographyProps>) {
  const Component: FunctionComponent<TypographyProps> = (props) => <Typography as={as as Variants} variant={as as Variants} {...defaultProps} {...props} />

  Component.displayName = as[0].toUpperCase() + as.slice(1)
  return Component
}

export const H1 = withTypography('h1')
export const H2 = withTypography('h2', { underline: true })
export const H3 = withTypography('h3')
export const H4 = withTypography('h4')
export const H5 = withTypography('h5')
export const P = withTypography('p')
export const Strong = withTypography('strong')
export const Em = withTypography('em')
export const Small = withTypography('small')
export const Span = withTypography('span')
export const NoWrap = withTypography('span', { className: 'whitespace-nowrap' })
