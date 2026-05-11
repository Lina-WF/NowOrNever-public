import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax' as const,
  }
  const currentJWT = useCookie('jwt', cookieOptions)

  const isAuthed = computed(() => !!currentJWT.value)

  function setJwt(jwt: string) {
    currentJWT.value = jwt
  }

  function delJWT() {
    currentJWT.value = null
  }

  return { isAuthed, setJwt, delJWT }
})
