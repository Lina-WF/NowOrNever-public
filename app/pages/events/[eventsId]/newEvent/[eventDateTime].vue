<script setup lang="ts">
import EventForm from '~/components/form/eventForm.vue'

definePageMeta({
  middleware: ['admin-check', 'member-check'],
})

const eventsStore = useEventsStore()
const projectsStore = useProjectsStore()

const route = useRoute()
const idParam = computed(() => +(route.params.eventsId as string))
const proj = ref(await projectsStore.findProject(idParam.value))
const error = ref(false)

async function onSubmit(values: EventForm) {
  const res = await eventsStore.newEvent(idParam.value,
    values.title,
    values.dateTime.dateStart + 'T' + values.dateTime.timeStart, values.dateTime.dateEnd + 'T' + values.dateTime.timeEnd,
    values.color,
    {
      address: values.address,
      price: +values.price,
      comment: values.comment,
    })
  if (res) {
    navigateTo(`/events/${idParam.value}`)
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
        Новое мероприятие {{ proj.dance.group }} — {{ proj.dance.title }}
      </div>
    </v-skeleton-loader>
    <EventForm
      :error="error"
      @submit="onSubmit($event)"
    />
  </v-sheet>
</template>

<style scoped>
</style>
