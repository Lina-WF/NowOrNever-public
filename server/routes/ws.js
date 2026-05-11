const peers = new Set()

export default defineWebSocketHandler({
  open(peer) {
    peers.add(peer)
  },
  close(peer) {
    peers.delete(peer)
  },
})

export function broadcast(message) {
  let payload
  if (typeof message === 'string') {
    payload = JSON.stringify({ type: message })
  }
  else {
    payload = JSON.stringify(message)
  }
  for (const peer of peers) {
    peer.send(payload)
  }
}

globalThis.broadcastWS = broadcast
