import { writeFileSync, mkdirSync, unlinkSync, existsSync } from 'node:fs'
import path from 'node:path'

export const uploadFile = async (event) => {
  const formData = await readMultipartFormData(event)

  if (verifyUser(event).id !== +formData[1].data.toString()) throw createError({ statusCode: 403, statusMessage: 'Ой, а у вас прав нет :(' })
  if (!formData || !formData[0]) throw createError({ statusCode: 400, statusMessage: 'Необходим файл' })

  const file = formData[0]
  const uploadDir = path.join(process.cwd(), 'storage')
  mkdirSync(uploadDir, { recursive: true })

  const fileName = `${Date.now()}-${file.filename}`
  const fullPath = path.join(uploadDir, fileName)

  writeFileSync(fullPath, file.data)

  return { link: `${fileName}` }
}

export const deleteFile = (fileName, userId, cookieId) => {
  if (+cookieId !== +userId) {
    console.log()
    const error = new Error('Ой, а у вас прав нет :(');
    (error).extensions = {
      code: 403,
    }
    throw error
  }

  if (!fileName) {
    const error = new Error('Необходим файл');
    (error).extensions = {
      code: 400,
    }
    throw error
  }

  const filePath = path.join(process.cwd(), 'storage', fileName)
  if (existsSync(filePath)) {
    try {
      unlinkSync(filePath)
      return { status: 'success', message: 'Файл удалён' }
    }
    catch {
      const error = new Error('Сервер устал');
      (error).extensions = {
        code: 500,
      }
      throw error
    }
  }
  else {
    const error = new Error('Файл не найден');
    (error).extensions = {
      code: 404,
    }
    throw error
  }
}
