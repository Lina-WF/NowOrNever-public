<script setup lang="ts">
import SubmitBtn from '~/components/btns/submitBtn.vue'
import RouteBtn from '~/components/btns/routeBtn.vue'
import BackWarning from '~/components/modals/backWarning.vue'

const props = defineProps<{
  error: boolean
  backLink: string
}>()

const error = ref(props.error)
const dialog = ref(false)
</script>

<template>
  <div v-if="error">
    Что-то пошло не так. Пожалуйста, попробуйте позже.
  </div>
  <div class="d-flex justify-center align-center">
    <RouteBtn
      :text="'Назад'"
      :link="'#'"
      @click="dialog = true"
    />
    <SubmitBtn
      :text="'Сохранить'"
      prepend-icon="mdi-check"
    />
    <BackWarning
      v-model="dialog"
      @no="dialog=false"
      @yes="dialog=false; navigateTo(backLink)"
    />
  </div>
</template>

<style scoped>
</style>
