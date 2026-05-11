<script setup lang="ts">
const props = defineProps<{
  element: 'project' | 'event' | 'thing'
  title?: string
}>()

defineEmits<{
  (e: 'no' | 'yes'): void
}>()

const elementToLabel = {
  project: 'проект',
  event: 'мероприятие',
  thing: 'вещь',
} as const

const cardText = ref(props.title ? elementToLabel[props.element] + ' ' + props.title : elementToLabel[props.element])
</script>

<template>
  <v-dialog
    width="auto"
  >
    <v-card
      max-width="400"
      prepend-icon="mdi-alert-outline"
      :text="`Вы действительно хотите удалить ${cardText}? Это действие нельзя будет отменить.`"
      :title="`Удаление элемента`"
      class="bg-themewhite"
    >
      <template #actions>
        <v-btn
          color="secondary"
          text="Нет"
          @click="$emit('no')"
        />
        <v-btn
          color="accent"
          text="Да"
          @click="$emit('yes')"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<style scope>
</style>
