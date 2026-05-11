<script setup lang="ts">
defineProps<{
  focus: string
  focusTime: string
}>()

defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()
const idParam = computed(() => +(route.params.eventsId as string))
</script>

<template>
  <v-menu
    :close-on-content-click="false"
    location="center"
    transition="fade-transition"
  >
    <v-card
      min-width="350px"
      max-width="400px"
    >
      <v-toolbar
        color="themewhite"
        dark
      >
        <v-toolbar-title class="d-flex ma-0 justify-center">
          {{ (new Date(focus)).toLocaleDateString() }} {{ focusTime }}
        </v-toolbar-title>
      </v-toolbar>
      <div class="d-flex flex-column flex-grow-1">
        <v-divider
          color="secondary"
          thickness="1"
          opacity="1"
        />
      </div>
      <v-card-text class="bg-themewhite">
        <v-btn
          block
          color="secondary"
          :to="`/events/${idParam}/newEvent/${focus}_${focusTime}`"
          elevation="0"
          prepend-icon="mdi-plus"
        >
          Добавить
        </v-btn>
      </v-card-text>
      <v-card-actions class="bg-themewhite justify-center">
        <v-btn
          color="secondary"
          variant="text"
          width="100%"
          @click="$emit('close')"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<style scoped>
</style>
