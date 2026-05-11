import { defineStore } from 'pinia'
import { ADD_THING, COSTUMES_ID_QUERY, DEL_THING, EDIT_THING } from '~/composables/querys'

export const useCostumesStore = defineStore('costumes', () => {
  const { $apollo } = useNuxtApp()

  async function findCostumes(id: number) {
    if (!useNuxtApp().$apollo?.defaultClient) {
      setTimeout(() => findCostumes(id), 500)
      return
    }

    const res = await $apollo.defaultClient.query({
      query: COSTUMES_ID_QUERY,
      variables: { id: id },
      fetchPolicy: 'network-only',
    })
    if (!res.data.costumes) return []
    return res.data.costumes.costumes
  }

  async function newThing(projectId: number, userId: number, file: File, status: string) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId.toString())

      const { link } = await $fetch<{ link: string }>('/api/uploadFile', {
        method: 'POST',
        body: formData,
      })

      const res = await $apollo.defaultClient.mutate({
        mutation: ADD_THING,
        variables: {
          projectId: projectId,
          userId: userId,
          thing: { link: link, status: status },
        },
      })
      return res.data.addThing
    }
    catch (err) {
      const error = err as { data: { statusCode: number, statusMessage: string } }
      return useRouter().push({
        path: '/error',
        state: { reason: error.data.statusMessage, code: error.data.statusCode },
      })
    }
  }

  async function editThing(projectId: number, userId: number, thingId: number, file: File, prevFile: File, prevLink: string, status: string) {
    const link = ref(prevLink)
    if (prevFile !== file) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('userId', userId.toString())

        const { link: newLink } = await $fetch<{ link: string }>('/api/uploadFile', {
          method: 'POST',
          body: formData,
        })

        link.value = newLink
      }
      catch (err) {
        const error = err as { data: { statusCode: number, statusMessage: string } }
        return useRouter().push({
          path: '/error',
          state: { reason: error.data.statusMessage, code: error.data.statusCode },
        })
      }
    }

    try {
      const res = await $apollo.defaultClient.mutate({
        mutation: EDIT_THING,
        variables: {
          projectId: projectId,
          userId: userId,
          thingId: thingId,
          thing: { link: link.value, status: status },
        },
      })
      return res.data.updateThing
    }
    catch (err) {
      const error = err as { data: { statusCode: number, statusMessage: string } }
      return useRouter().push({
        path: '/error',
        state: { reason: error.data.statusMessage, code: error.data.statusCode },
      })
    }
  }

  async function delThing(projectId: number, userId: number, thingId: number) {
    try {
      const res = await $apollo.defaultClient.mutate({
        mutation: DEL_THING,
        variables: {
          projectId: projectId,
          userId: userId,
          thingId: thingId,
        },
      })
      return res.data.deleteThing
    }
    catch (err) {
      const error = err as { graphQLErrors: { extensions: { code: number }, message: string }[] }
      return useRouter().push({
        path: '/error',
        state: { reason: error.graphQLErrors[0]?.message, code: error.graphQLErrors[0]?.extensions.code },
      })
    }
  }

  return { findCostumes, newThing, editThing, delThing }
})
