<script setup lang="ts">
import ThingForm from '~/components/form/thingForm.vue'

definePageMeta({
  middleware: 'member-check',
})

const usersStore = useUsersStore()
const costumesStore = useCostumesStore()
const projectsStore = useProjectsStore()
const route = useRoute()
const idParam = computed(() => +(route.params.costumesId as string))
const proj = ref(await projectsStore.findProject(idParam.value))

const error = ref(false)

async function onSubmit(values: ThingForm) {
  const res = await costumesStore.newThing(idParam.value, usersStore.user!.id, values.photo, values.status)
  if (res) {
    navigateTo(`/costumes/${idParam.value}`)
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
    <v-skeleton-loader
      :loading="!proj"
      type="image"
      height="10vh"
      width="400"
      class="bg-transparent long-skeleton mx-auto"
    >
      <div class="title">
        Новая вещь {{ proj.dance.group }} — {{ proj.dance.title }}
      </div>
    </v-skeleton-loader>
    <ThingForm
      :error="error"
      @submit="onSubmit($event)"
    />
  </v-sheet>
</template>

<style scoped>
</style>
