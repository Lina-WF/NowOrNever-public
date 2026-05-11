import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'
import { useAuthStore } from './auth'
import { USER_ID_QUERY, USER_LOGIN_QUERY, USERS_QUERY } from '../composables/querys'

export const useUsersStore = defineStore('users', () => {
  const { $apollo } = useNuxtApp()
  const authStore = useAuthStore()

  const user = ref<undefined | User>()

  if (import.meta.client) {
    nextTick(async () => {
      const saved = localStorage.getItem('user')
      if (saved) {
        user.value = JSON.parse(saved)
      }
    })
  }

  async function logIn(login: string, password: string) {
    const res = await $apollo.defaultClient.query({
      query: USER_LOGIN_QUERY,
      variables: { login: login, password: password },
    })
    if (res.data.userByLogin) {
      user.value = res.data.userByLogin
      authStore.setJwt(res.data.userByLogin.token)
      localStorage.setItem('user', JSON.stringify(res.data.userByLogin))
    }
    return authStore.isAuthed
  }

  function logOut() {
    user.value = undefined
    authStore.delJWT()
    localStorage.removeItem('user')
  }

  async function findUser(id: number) {
    const res = await $apollo.defaultClient.query({
      query: USER_ID_QUERY,
      variables: { id: id },
    })
    return res.data.userById
  }

  async function getUsers() {
    const res = await $apollo.defaultClient.query({
      query: USERS_QUERY,
    })
    return res.data.users
  }

  return { user, logIn, logOut, findUser, getUsers }
})
