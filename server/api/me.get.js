import { verifyUser } from '../utils/auth'
import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const user = verifyUser(event)

  return { user }
})
