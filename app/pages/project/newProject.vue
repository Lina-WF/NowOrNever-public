<script setup lang="ts">
import ProjectForm from '~/components/form/projectForm.vue'

definePageMeta({
  middleware: 'admin-check',
})

const usersStore = useUsersStore()
const projectsStore = useProjectsStore()

const error = ref(false)

async function onSubmit(values: ProjectForm) {
  const formatedMembers = [...values.members, { userId: usersStore.user!.id, part: values.part }]
    .map(member => ({ userId: +member.userId, part: member.part }))
  const res = await projectsStore.newProject({ group: values.group, title: values.title }, values.link, formatedMembers)
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
    <div class="title">
      Новый проект
    </div>
    <ProjectForm
      :error="error"
      @submit="onSubmit($event)"
    />
  </v-sheet>
</template>

<style scoped>
</style>
