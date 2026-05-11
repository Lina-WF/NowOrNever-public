<script setup lang="ts">
import ThingForm from '~/components/form/thingForm.vue'

const costumesStore = useCostumesStore()
const usersStore = useUsersStore()
const projectsStore = useProjectsStore()

const route = useRoute()
const idCostumes = computed(() => +(route.params.costumesId as string))
const proj = ref(await projectsStore.findProject(idCostumes.value))
if (!proj.value) {
  navigateTo({
    path: '/error',
    state: { reason: 'Проект не найден', code: 404 },
  }, { replace: true })
}
const idThing = computed(() => +(route.params.thingId as string))
const costumes = ref(await costumesStore.findCostumes(idCostumes.value))
const costume = computed(() => costumes.value.length ? costumes.value.find((c: UserCostume) => usersStore.user ? +c.userId === +usersStore.user.id : []) : null)
const thing = computed(() => {
  if (!costume.value) return null
  const c = costume.value.things.find((t: Thing) => +t.id === idThing.value)
  if (c) return c
  navigateTo({
    path: '/error',
    state: { reason: 'Вещь не найдена', code: 404 },
  }, { replace: true })
  return null
})
const prevLink = computed(() => thing.value ? thing.value.link : '')

const error = ref(false)

async function onSubmit(values: ThingForm) {
  const res = await costumesStore.editThing(idCostumes.value, usersStore.user!.id, idThing.value, values.photo, values.prevPhoto!, prevLink.value, values.status)
  if (res) {
    navigateTo(`/costumes/${idCostumes.value}`)
  }
  else {
    error.value = true
  }
}
</script>

<template>
  <v-sheet
    class="mx-auto bg-transparent"
  >
    <div class="title">
      Редактировать вещь
    </div>
    <v-skeleton-loader
      :loading="!thing"
      type="image"
      height="60vh"
      width="80vw"
      class="bg-transparent long-skeleton mx-auto"
    >
      <ThingForm
        :editing-photo="thing.link"
        :editing-status="thing.status"
        :error="error"
        @submit="onSubmit($event)"
      />
    </v-skeleton-loader>
  </v-sheet>
</template>

<style scoped>
</style>
