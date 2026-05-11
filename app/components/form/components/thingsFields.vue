<script setup lang="ts">
import { photoRules, statusRules } from '~/composables/formRules'

const props = defineProps<{
  photo: File | null
  status: string
}>()

const emit = defineEmits<{
  (e: 'correctPhoto', value: File): void
  (e: 'correctStatus', value: string): void
}>()

const photo = ref(props.photo)
const status = ref(props.status)

const validPhoto = computed(() => {
  if (photo.value) return photoRules.every(rule => rule(photo.value!) === true)
  else return false
})

const validStatus = computed(() => statusRules.every(rule => rule(status.value) === true))

watch([() => validPhoto.value, () => photo.value], (value, _) => {
  if (value) emit('correctPhoto', photo.value!)
})

watch([() => validStatus.value, () => status.value], (value, _) => {
  if (value) emit('correctStatus', status.value)
})
</script>

<template>
  <v-file-input
    v-model="photo"
    accept="image/*"
    label="Фото вещи"
    :multiple="false"
    prepend-icon=""
    append-inner-icon="mdi-paperclip"
    variant="outlined"
    class="text-darktext"
    :rules="photoRules"
  />
  <v-select
    v-model="status"
    :item-props="true"
    :items="['Найдено', 'Едет', 'На руках', 'Шьётся', 'Кастомится', 'Готово', 'Не подошло']"
    :list-props="{ bgColor: 'themewhite' }"
    label="Статус"
    :rules="statusRules"
    variant="outlined"
    class="text-darktext"
  />
</template>

<style scoped>
</style>
