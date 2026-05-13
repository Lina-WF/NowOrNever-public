import { defineStore } from 'pinia'

export const useSocketStore = defineStore('socket', () => {
  const socket = shallowRef<WebSocket | null>(null)
  const eventsListeners = new Set<(eventsId: number) => void>()
  const costumesListeners = new Set<(costumesId: number) => void>()
  const projectsListeners = new Set<(projectId: number) => void>()

  function onUpdateEvents(callback: (eventsId: number) => void) {
    eventsListeners.add(callback)
    return () => eventsListeners.delete(callback)
  }
  function onUpdateCostumes(callback: (costumesId: number) => void) {
    costumesListeners.add(callback)
    return () => costumesListeners.delete(callback)
  }
  function onUpdateProject(callback: (projectId: number) => void) {
    projectsListeners.add(callback)
    return () => projectsListeners.delete(callback)
  }

  function initSocket() {
    if (import.meta.server || socket.value) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`)

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (message.type === 'projects') {
        projectsListeners.forEach(cb => cb(+message.projectId))
      }

      if (message.type === 'events') {
        eventsListeners.forEach(cb => cb(+message.eventsId))
      }

      if (message.type === 'costumes') {
        costumesListeners.forEach(cb => cb(+message.costumesId))
      }
    }

    ws.onclose = () => {
      socket.value = null
      setTimeout(initSocket, 3000)
    }

    socket.value = ws
  }

  initSocket()

  return { onUpdateEvents, onUpdateCostumes, onUpdateProject }
})
