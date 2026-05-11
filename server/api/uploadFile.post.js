import { uploadFile } from '../utils/files'

export default defineEventHandler(async (event) => {
  const link = await uploadFile(event)

  return link
})
