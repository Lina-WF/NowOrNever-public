<script setup lang="ts">
import ProjectForm from '~/components/form/projectForm.vue'

definePageMeta({
  middleware: ['admin-check', 'member-check'],
})

const projectsStore = useProjectsStore()
const usersStore = useUsersStore()

const route = useRoute()
const idParam = computed(() => +(route.params.projectId as string))

const proj = ref<Proj>(await projectsStore.findProject(idParam.value))

const members = computed(() => proj.value ? proj.value.members.filter((member: Member) => member.userId !== usersStore.user?.id).map(member => ({ userId: member.userId.toString(), part: member.part })) : [])
const part = computed(() => proj.value ? proj.value.members.find((member: Member) => member.userId === usersStore.user?.id)!.part : '')

const error = ref(false)

async function onSubmit(values: ProjectForm) {
  const formatedMembers = [...values.members, { userId: usersStore.user!.id, part: values.part }]
    .map(member => ({ userId: +member.userId, part: member.part }))
  const res = await projectsStore.editProject(idParam.value, { group: values.group, title: values.title }, values.link, formatedMembers)
  if (res) {
    navigateTo(`/project/${res.id}`)
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
      height="12vh"
      width="50vw"
      class="bg-transparent long-skeleton mx-auto mb-4"
    >
      <div class="title">
        Редактировать {{ proj.dance.group }} — {{ proj.dance.title }}
      </div>
    </v-skeleton-loader>
    <v-skeleton-loader
      :loading="!proj"
      type="image"
      height="60vh"
      width="80vw"
      class="bg-transparent long-skeleton mx-auto"
    >
      <ProjectForm
        :title="proj.dance.title"
        :group="proj.dance.group"
        :link="proj.link"
        :members="members"
        :part="part"
        :error="error"
        @submit="onSubmit($event)"
      />
    </v-skeleton-loader>
  </v-sheet>
</template>

<style scoped>
</style>
