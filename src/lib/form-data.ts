import { set } from 'lodash'

export function formDataToObject<T extends object>(formData: FormData): T {
  const obj = {} as T

  for (const [key, value] of formData.entries()) {
    set(obj, key, value)
  }

  return obj
}
