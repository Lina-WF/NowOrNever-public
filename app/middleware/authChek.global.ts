export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const headers = useRequestHeaders(['cookie'])

  if (!authStore.isAuthed && to.path !== '/login') {
    return navigateTo({ path: '/login', query: { back: to.fullPath } })
  }
  if (authStore.isAuthed && to.path === '/login') {
    return navigateTo('/')
  }
  if (authStore.isAuthed) {
    const response = await $fetch<{ user: JWT }>('/api/me', {
      headers,
    })
    if (!response) {
      return navigateTo('/login')
    }
  }
})
