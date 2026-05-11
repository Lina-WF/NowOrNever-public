import { z } from 'zod'

type ValidationRule<T> = (v: T) => true | string

const zodRule = (schema: z.ZodTypeAny) => (v: string | number | File) => {
  const result = schema.safeParse(v)
  return result.success || result.error.errors[0]?.message || 'Ошибка валидации'
}

export const groupRules = [
  zodRule(z.string().min(1, 'Введите название группы')),
]

export const songTitleRules = [
  zodRule(z.string().min(1, 'Введите название песни')),
]

export const linkRules = [
  zodRule(z.string().min(1, 'Введите ссылку').url('Некорректный формат ссылки')),
]

export const memberRules: ValidationRule<string>[] = [
  zodRule(
    z.preprocess(
      val => (val === null ? '' : val),
      z.string().min(1, 'Выберите участника'),
    ),
  ),
]

export const loginRules = [
  zodRule(z.string().min(6, 'Минимум 6 символов').max(20, 'Слишком длинный логин')),
]

export const passwordRules = [
  zodRule(z.string().min(6, 'Минимум 6 символов')),
]

export const partRules = [
  zodRule(z.string().min(1, 'Введите партию')),
]

export const colorRules = [
  zodRule(z.string().min(1, 'Выберите цвет')),
]

export const eventTitleRules = [
  zodRule(z.string().min(1, 'Введите название мероприятия')),
]

export const statusRules = [
  zodRule(z.string().min(1, 'Выберите статус')),
]

export const photoRules = [
  zodRule(z.instanceof(File, { message: 'Выберите фото' })
    .refine(file => file.size > 0, 'Файл не должен быть пустым')),
]

export const ISOFormat = (val: string) => {
  if (val) {
    const date = new Date(val)
    if (date.getFullYear()) return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
    else return ''
  }
  else return ''
}

export const TimeFormat = (val: string) => {
  if (!val) return ''
  const parts = val.trim().split(':')
  if (parts.length < 2) return ''

  const hours = +parts[0]!
  const minutes = +parts[1]!

  const isValid
    = !isNaN(hours) && hours >= 0 && hours <= 23
      && !isNaN(minutes) && minutes >= 0 && minutes <= 59

  if (isValid) {
    return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0')
  }

  return ''
}
