<script setup lang="ts">
import EventForm from '~/components/form/eventForm.vue'

definePageMeta({
  middleware: 'admin-check',
})

const eventsStore = useEventsStore()
const projectsStore = useProjectsStore()

const route = useRoute()
const idEvents = computed(() => +(route.params.eventsId as string))
const idEvent = computed(() => +(route.params.eventId as string))
const proj = ref(await projectsStore.findProject(idEvents.value))
if (!proj.value) {
  navigateTo({
    path: '/error',
    state: { reason: 'Проект не найден', code: 404 },
  }, { replace: true })
}
const events = ref(await eventsStore.findEvents(idEvents.value))
const event = computed(() => {
  const es = events.value.find((e: ProjEvent) => +e.id === idEvent.value)
  if (es) return es
  else {
    navigateTo({
      path: '/error',
      state: { reason: 'Мероприятие не найдено', code: 404 },
    }, { replace: true })
    return null
  }
})

const dateTime = computed(() => event.value
  ? {
      dateStart: event.value.start.split('T')[0],
      timeStart: event.value.start.split('T')[1],
      dateEnd: event.value.end.split('T')[0],
      timeEnd: event.value.end.split('T')[1],
    }
  : { dateStart: '',
      timeStart: '',
      dateEnd: '',
      timeEnd: '' },
)

const error = ref(false)

async function onSubmit(values: EventForm) {
  const res = await eventsStore.editEvent(idEvents.value,
    idEvent.value,
    values.title,
    values.dateTime.dateStart + 'T' + values.dateTime.timeStart, values.dateTime.dateEnd + 'T' + values.dateTime.timeEnd,
    values.color,
    {
      address: values.address,
      price: +values.price,
      comment: values.comment,
    })
  if (res) {
    navigateTo(`/events/${idEvents.value}`)
  }
  else {
    error.value = true
  }
}
</script>

<template>
  <v-sheet
    class="mx-auto"
    color="transparent"
  >
    <v-skeleton-loader
      :loading="!proj"
      type="image"
      height="10vh"
      width="400"
      class="bg-transparent long-skeleton mx-auto"
    >
      <div class="title">
        Редактировать мероприятие {{ proj.dance.group }} — {{ proj.dance.title }}
      </div>
    </v-skeleton-loader>
    <v-skeleton-loader
      :loading="!(proj && event)"
      type="image"
      height="60vh"
      width="80vw"
      class="bg-transparent long-skeleton mx-auto"
    >
      <EventForm
        :title="event?.title"
        :color="event?.color"
        :address="event?.raw?.desc.address"
        :price="+event?.raw?.desc.price"
        :comment="event?.raw?.desc.comment"
        :date-time="dateTime"
        :error="error"
        @submit="onSubmit($event)"
      />
    </v-skeleton-loader>
  </v-sheet>
</template>

<style scoped>
</style>
