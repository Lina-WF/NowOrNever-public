export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  const headers = useRequestHeaders(['cookie'])

  if (!authStore.isAuthed) {
    return navigateTo('/login')
  }

  try {
    const response = await $fetch<{ user: JWT }>('/api/me', {
      headers,
    })
    if (response.user?.role !== 'admin') {
      return navigateTo({
        path: '/error',
        state: { reason: 'Ой, а у вас прав нет :(', code: 403 },
      })
    }
  }
  catch (err) {
    const error = err as { data: { statusCode: number, statusMessage: string } }
    return navigateTo({
      path: '/error',
      state: { reason: error.data.statusMessage, code: error.data.statusCode },
    })
  }
})
