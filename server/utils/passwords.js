import { createHmac } from 'node:crypto'
import argon2 from 'argon2'

function PepperInput(event, password) {
  const config = useRuntimeConfig(event)

  return createHmac('sha256', config.passPepper)
    .update(password)
    .digest('hex')
}

export const encodePassword = async (event, password) => {
  return await argon2.hash(PepperInput(event, password))
}

export const decodePassword = async (event, passwordHash, password) => {
  try {
    return await argon2.verify(passwordHash, PepperInput(event, password))
  }
  catch {
    const error = new Error('Сервер устал');
    (error).extensions = {
      code: 500,
    }
    throw error
  }
}
