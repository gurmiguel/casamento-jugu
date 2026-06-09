
export type ServerActionResponse<TData, TInput extends string | number | symbol = keyof TData> = {
  data: TData
  validationErrors?: never
  serverError?: never
} | {
  data?: never
  validationErrors?: {
    formErrors?: string[]
    fieldErrors: {
      [K in TInput]?: string[]
    }
  }
  serverError?: string
}

export function formatValidationError(validationErrors: Required<ServerActionResponse<object>>['validationErrors'] | undefined) {
  const errors = new Array<string>()

  if (validationErrors?.formErrors)
    errors.push(...validationErrors.formErrors)

  if (validationErrors?.fieldErrors)
    errors.push(...Object.values(validationErrors.fieldErrors).flatMap(x => x as string[]))

  return errors.join('\n')
}
