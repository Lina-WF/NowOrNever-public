import { getCookie } from 'h3'
import jwt from 'jsonwebtoken'

export const verifyUser = (event) => {
  const cookie = getCookie(event, 'jwt')
  const config = useRuntimeConfig(event)

  if (!cookie) {
    const error = new Error('Cookie не найдены');
    (error).extensions = {
      code: 401,
    }
    throw error
  }

  try {
    const decoded = jwt.verify(cookie, config.jwtSecret)
    return decoded
  }
  catch {
    const error = new Error('Неверный токен');
    (error).extensions = {
      code: 401,
    }
    throw error
  }
}

export const verifyAdmin = (event) => {
  const user = verifyUser(event)
  if (user.role !== 'admin') {
    const error = new Error('Ой, а у вас прав нет :(');
    (error).extensions = {
      code: 403,
    }
    throw error
  }
  return user
}
