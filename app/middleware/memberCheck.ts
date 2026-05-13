export default defineNuxtRouteMiddleware(async (to) => {
  const { costumesId, eventsId, projectId } = to.params
  const idParam = +(costumesId || eventsId || projectId as string)
  const projectsStore = useProjectsStore()
  const membersStore = useMembersStore()
  const headers = useRequestHeaders(['cookie'])
  const response = await $fetch<{ user: JWT }>('/api/me', {
    headers,
  })

  const proj = await projectsStore.findProject(idParam)
  if (!proj) {
    return navigateTo({
      path: '/error',
      state: { reason: 'Проект не найден', code: 404 },
    })
  }

  const members = await membersStore.findMembers(idParam)
  if (members.filter(m => +m.id === +response.user.id).length !== 1) {
    return navigateTo({
      path: '/error',
      state: { reason: 'Вы не участник проекта', code: 403 },
    })
  }
})
