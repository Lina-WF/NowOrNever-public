import { createReadStream, existsSync } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  verifyUser(event)

  const fileName = event.context.params?.file
  const filePath = join(process.cwd(), 'storage', fileName)

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, message: 'Файл не найден' })
  }

  return sendStream(event, createReadStream(filePath))
})
