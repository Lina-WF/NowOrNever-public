<script setup lang="ts">
import { colorRules } from '~/composables/formRules'
import { VTextField } from 'vuetify/components'

const props = defineProps<{
  color: string
}>()

const emit = defineEmits<{
  (e: 'correct', value: string): void
}>()

const color = ref(props.color || '')
const showColor = ref(false)

const valid = computed(() => {
  return colorRules.every(rule => rule(color.value) === true)
})

watch([() => valid.value, () => color.value], (value, _) => {
  if (value) emit('correct', color.value)
})
</script>

<template>
  <v-text-field
    ref="dateStartRef"
    :model-value="color"
    :rules="colorRules"
    label="Цвет"
    variant="outlined"
    class="text-darktext"
    append-inner-icon="mdi-palette-outline"
    readonly
  >
    <v-menu
      v-model="showColor"
      :close-on-content-click="false"
      activator="parent"
      min-width="0"
      transition="fade-transition"
    >
      <v-color-picker
        v-model="color"
        mode="hex"
        class="bg-themewhite"
      />
    </v-menu>
  </v-text-field>
</template>

<style scoped>
</style>
