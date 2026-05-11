import { defineStore } from 'pinia'
import { EVENTS_ID_QUERY, ADD_EVENT, DEL_EVENT } from '~/composables/querys'

export const useEventsStore = defineStore('events', () => {
  const { $apollo } = useNuxtApp()

  async function findEvents(id: number) {
    if (!useNuxtApp().$apollo?.defaultClient) {
      setTimeout(() => findEvents(id), 500)
      return
    }

    const res = await $apollo.defaultClient.query({
      query: EVENTS_ID_QUERY,
      variables: { id: id },
      fetchPolicy: 'network-only',
    })
    if (!res.data.events) return []
    return res.data.events.events.map((event: ProjEvent) => ({
      id: event.id,
      title: event.title,
      start: event.datetimeStart,
      end: event.datetimeEnd,
      color: event.color,
      raw: event,
    }))
  }

  async function newEvent(projectId: number, title: string, start: string, end: string, color: string, desc: ProjEventDesc) {
    try {
      const event = {
        title: title,
        datetimeStart: start,
        datetimeEnd: end,
        color: color,
        desc: desc,
      }
      const res = await $apollo.defaultClient.mutate({
        mutation: ADD_EVENT,
        variables: {
          projectId: projectId,
          event: event,
        },
      })
      return res.data.addEvent
    }
    catch (err) {
      const error = err as { graphQLErrors: { extensions: { code: number }, message: string }[] }
      return useRouter().push({
        path: '/error',
        state: { reason: error.graphQLErrors[0]?.message, code: error.graphQLErrors[0]?.extensions.code },
      })
    }
  }

  async function editEvent(projectId: number, eventId: number, title: string, start: string, end: string, color: string, desc: ProjEventDesc) {
    try {
      const event = {
        title: title,
        datetimeStart: start,
        datetimeEnd: end,
        color: color,
        desc: desc,
      }
      const res = await $apollo.defaultClient.mutate({
        mutation: EDIT_EVENT,
        variables: {
          projectId: projectId,
          eventId: eventId,
          event: event,
        },
      })
      return res.data.updateEvent
    }
    catch (err) {
      const error = err as { graphQLErrors: { extensions: { code: number }, message: string }[] }
      return useRouter().push({
        path: '/error',
        state: { reason: error.graphQLErrors[0]?.message, code: error.graphQLErrors[0]?.extensions.code },
      })
    }
  }

  async function delEvent(projectId: number, eventId: number) {
    try {
      const res = await $apollo.defaultClient.mutate({
        mutation: DEL_EVENT,
        variables: {
          projectId: projectId,
          eventId: eventId,
        },
      })
      return res.data.deleteEvent
    }
    catch (err) {
      const error = err as { graphQLErrors: { extensions: { code: number }, message: string }[] }
      return useRouter().push({
        path: '/error',
        state: { reason: error.graphQLErrors[0]?.message, code: error.graphQLErrors[0]?.extensions.code },
      })
    }
  }

  return { findEvents, newEvent, editEvent, delEvent }
})
