<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'
import { useUsersStore } from '~/stores/users'
import SubmitBtn from '~/components/btns/submitBtn.vue'

definePageMeta({
  layout: 'login-layout',
})

const login = ref('')
const password = ref('')
const show = ref(false)
const error = ref(false)

const usersStore = useUsersStore()
const route = useRoute()

const runEnterAnimation = inject('animation')! as () => Promise<void>

async function onSubmit(event: SubmitEventPromise) {
  const { valid } = await event
  if (!valid) {
    return
  }
  else {
    const auth = await usersStore.logIn(login.value, password.value)
    if (auth) {
      await runEnterAnimation()

      const redirectPath = route.query.back ? String(route.query.back) : '/'
      navigateTo(redirectPath)
    }
    else {
      error.value = true
    }
  }
}
</script>

<template>
  <v-form
    fast-fail
    @submit.prevent="onSubmit"
  >
    <div class="title permanentDark">
      Вход
    </div>
    <v-text-field
      v-model="login"
      :rules="loginRules"
      label="Логин"
      variant="outlined"
      class="input text-permanentDark"
    />
    <v-text-field
      v-model="password"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="passwordRules"
      :type="show ? 'text' : 'password'"
      label="Пароль"
      variant="outlined"
      class="input text-permanentDark"
      @click:append="show = !show"
    />
    <div
      v-if="error"
    >
      <div class="text-permanentAccent alert">
        Неверный логин или пароль.
      </div>
    </div>
    <SubmitBtn
      :text="'Войти'"
      width="100%"
    />
  </v-form>
</template>

<style scoped>
.input :deep(.v-field--error .v-label.v-field-label){
  color: rgb(var(--v-theme-permanentAccent)) !important
}

.input :deep(.v-field--error .v-field__outline){
  color: rgb(var(--v-theme-permanentAccent)) !important
}

.input :deep(.v-messages){
  color: rgb(var(--v-theme-permanentAccent)) !important
}

.alert {
  font-size: 12px;
  text-align: center;
}

.input {
  padding-bottom: 4%;
}
</style>
