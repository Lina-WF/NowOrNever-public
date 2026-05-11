<script setup lang="ts">
import ListOfLinks from '~/components/lists/listOfLinks.vue'
import ListOfText from '~/components/lists/listOfText.vue'
import TwoColumns from '~/layouts/twoColumns.vue'
import { useProjectsStore } from '~/stores/projects'
import { useUsersStore } from '~/stores/users'

const usersStore = useUsersStore()
const projectsStore = useProjectsStore()
const socketStore = useSocketStore()

const projects = ref<Proj[]>([])
watch(() => usersStore.user, async (newUser) => {
  if (newUser?.id) {
    projects.value = await projectsStore.findUserProjects(newUser.id)
  }
},
{ immediate: true },
)

const projectThings = computed(() => projects.value.map(proj => ({ id: proj.id, title: proj.dance.title, subtitle: proj.dance.group, icon: 'mdi-star-four-points-outline', link: `/project/${proj.id}` })))
const userThings = computed(() => usersStore.user
  ? [
      { id: 1, title: usersStore.user.login, subtitle: 'Логин', icon: 'mdi-login-variant' },
      { id: 2, title: usersStore.user.email, subtitle: 'email', icon: 'mdi-email-outline' },
      { id: 3, title: usersStore.user.name, subtitle: 'Имя', icon: 'mdi-account-outline' },
      { id: 4, title: usersStore.user.role, subtitle: 'Роль', icon: 'mdi-badge-account-horizontal-outline' },
    ]
  : [])

onMounted(() => {
  const unsubscribe = socketStore.onUpdateProject(async (_) => {
    if (usersStore.user) projects.value = await projectsStore.findUserProjects(usersStore.user.id)
    else setTimeout(async () => projects.value = await projectsStore.findUserProjects(usersStore.user!.id), 3000)
  })

  onUnmounted(() => {
    unsubscribe()
  })
})
</script>

<template>
  <TwoColumns>
    <template
      #col1
    >
      <v-skeleton-loader
        :loading="!(projectsStore && usersStore.user)"
        type="image"
        height="70vh"
        class="bg-transparent long-skeleton"
      >
        <ListOfLinks
          :things="projectThings"
          role="next"
        />

        <ListOfLinks
          v-if="usersStore.user?.role==='admin'"
          :color="'secondary'"
          :role="'next'"
          class="animate__animated animate__headShake"
          :things="[{ id: 1, title: 'Новый проект', icon: 'mdi-plus', link: '/project/newProject' }]"
        >
          Новый проект
        </ListOfLinks>
      </v-skeleton-loader>
    </template>
    <template
      #col2
    >
      <v-skeleton-loader
        :loading="!usersStore.user"
        type="image"
        height="70vh"
        class="bg-transparent long-skeleton"
      >
        <ListOfText :things="userThings" />
      </v-skeleton-loader>
    </template>
  </TwoColumns>
</template>

<style scoped>
</style>
