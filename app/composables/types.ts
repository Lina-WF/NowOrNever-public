export type JWT = {
  id: number
  login: string
  role: string
}

export type User = {
  id: number
  login: string
  email: string
  name: string
  role: string
}

export type Dance = {
  group: string
  title: string
}

export type Member = {
  userId: number
  part: string
}

export type NamedMember = {
  id: number
  name: string
  part: string
}

export type Proj = {
  id: number
  dance: Dance
  members: Member[]
  link: string
}

export type ProjEventDesc = {
  address: string
  price: number
  comment: string
}

export type ProjEvent = {
  id: number
  title: string
  datetimeStart: string
  datetimeEnd: string
  color: string
  desc: ProjEventDesc
}

export type ProjEvents = {
  id: number
  events: ProjEvent[]
}

export type Thing = {
  id: number
  link: string
  status: string
}

export type UserCostume = {
  userId: number
  things: Thing[]
}

export type Costumes = {
  id: number
  costumes: UserCostume[]
}

export type CalendarProjEvent = {
  id?: string | number
  title?: string
  start?: Date | string
  end?: Date | string | number
  color?: string
  raw?: ProjEvent
}

export type CalendarTimeSlot = {
  date: string
  time: string
  hour: number
  minute: number
  weekday: number
  hasDay: boolean
  hasTime: boolean
  past: boolean
  present: boolean
  future: boolean
}

export type ProjectForm = {
  title: string
  group: string
  link: string
  part: string
  members: { userId: string, part: string }[]
}

export type EventForm = {
  title: string
  dateTime: { dateStart: string, timeStart: string, dateEnd: string, timeEnd: string }
  color: string
  address: string
  price: number
  comment: string
}

export type ThingForm = {
  photo: File
  prevPhoto: File | null
  status: string
}

export type GraphQLErrorResponse = {
  graphQLErrors: Array<{
    message: string
    extensions: { code: number }
  }>
}
