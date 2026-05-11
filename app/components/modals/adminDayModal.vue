<script setup lang="ts">
defineProps<{
  focus: string
}>()

defineEmits<{
  (e: 'go' | 'close'): void
}>()

const route = useRoute()
const idParam = computed(() => +(route.params.eventsId as string))
</script>

<template>
  <v-menu
    :close-on-content-click="false"
    location="end"
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
          {{ (new Date(focus)).toLocaleDateString() }}
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
          :to="`/events/${idParam}/newEvent/${focus}`"
          elevation="0"
          prepend-icon="mdi-plus"
        >
          Добавить
        </v-btn>
        <br>
        <v-btn
          block
          color="secondary"
          variant="outlined"
          @click="$emit('go')"
        >
          Перейти
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
