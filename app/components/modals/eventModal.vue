<script setup lang="ts">
import DeleteWarning from './deleteWarning.vue'

const props = defineProps<{
  selectedEvent: CalendarProjEvent | undefined
}>()

defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()
const idParam = computed(() => +(route.params.eventsId as string))
const datetime = computed(() => {
  if (!(props.selectedEvent?.start && props.selectedEvent?.end)) return
  const start = new Date(props.selectedEvent.start)
  const end = new Date(props.selectedEvent.end)
  const dateOpt = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  } as const
  const timeOpt = { hour: '2-digit', minute: '2-digit' } as const

  if (start.toDateString() === end.toDateString()) return `${start.toLocaleDateString('ru-RU', dateOpt)}, ${start.toLocaleTimeString('ru-RU', timeOpt)} - ${end.toLocaleTimeString('ru-RU', timeOpt)}`
  else return `${start.toLocaleString('ru-RU', { ...dateOpt, ...timeOpt })} — ${end.toLocaleString('ru-RU', { ...dateOpt, ...timeOpt })}`
})

const usersStore = useUsersStore()
const eventsStore = useEventsStore()

const dialog = ref(false)
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
        :color="selectedEvent?.color"
        dark
      >
        <v-toolbar-title>{{ selectedEvent?.title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="bg-themewhite">
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-clock-outline"
            class="gradient-icon mr-4 mb-1"
          /><p>{{ datetime }}</p>
        </div>
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-map-marker-outline"
            class="gradient-icon mr-4 mb-1"
          /><p>{{ selectedEvent?.raw?.desc.address }}</p>
        </div>
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-cash-multiple"
            class="gradient-icon mr-4 mb-1"
          /><p>{{ selectedEvent?.raw?.desc.price }} ₽</p>
        </div>
        <div>
          <p>Комментарий:</p> <p class="bg-primary pa-2 rounded">
            {{ selectedEvent?.raw?.desc.comment }}
          </p>
        </div>
      </v-card-text>
      <v-card-actions class="bg-themewhite">
        <v-btn
          color="secondary"
          variant="text"
          @click="$emit('close')"
        >
          Закрыть
        </v-btn>
        <v-btn
          v-if="usersStore.user?.role === 'admin'"
          color="secondary"
          variant="text"
          @click="navigateTo(`/events/${idParam}/editEvent/${+selectedEvent!.id!}`)"
        >
          Редактировать
        </v-btn>
        <v-btn
          v-if="usersStore.user?.role === 'admin'"
          color="accent"
          variant="text"
          @click="dialog = true"
        >
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
    <DeleteWarning
      v-model="dialog"
      :element="'event'"
      :title="selectedEvent?.title + ' ' + datetime"
      @no="dialog=false"
      @yes="dialog=false; eventsStore.delEvent(idParam, +selectedEvent!.id!); $emit('close');"
    />
  </v-menu>
</template>

<style scoped>
</style>
