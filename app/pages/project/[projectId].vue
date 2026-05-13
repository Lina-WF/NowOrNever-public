<script setup lang="ts">
import ListOfLinks from '~/components/lists/listOfLinks.vue'
import ListOfText from '~/components/lists/listOfText.vue'
import TwoColumns from '~/layouts/twoColumns.vue'
import DeleteWarning from '~/components/modals/deleteWarning.vue'

const route = useRoute()
const idParam = computed(() => +(route.params.projectId as string))

definePageMeta({
  middleware: 'member-check',
})

const projectsStore = useProjectsStore()
const membersStore = useMembersStore()
const usersStore = useUsersStore()
const socketStore = useSocketStore()

const proj = ref<Proj>(await projectsStore.findProject(idParam.value))

const members = ref(await membersStore.findMembers(idParam.value))
const sortedMembers = computed(() => members.value.length ? membersStore.sortMembers(members.value, usersStore.user) : [])

const projectThings = computed(() => proj.value
  ? [
      { id: 1, title: `${proj.value.dance.group} — ${proj.value.dance.title}`, subtitle: 'Видео', icon: 'mdi-play-circle-outline', href: proj.value.link },
      { id: 2, title: 'Расписание', icon: 'mdi-calendar-range-outline', link: `/events/${idParam.value}` },
      { id: 3, title: 'Костюмы', icon: 'mdi-hanger', link: `/costumes/${idParam.value}` }]
  : [])
const membersThings = computed(() => sortedMembers.value.map(member => ({ id: member!.id, title: member!.name, subtitle: member!.part })))

const dialog = ref(false)

onMounted(() => {
  const unsubscribe = socketStore.onUpdateProject(async (projectId) => {
    if (projectId === idParam.value) {
      proj.value = await projectsStore.findProject(idParam.value)
      if (!proj.value) {
        navigateTo({
          path: '/error',
          state: { reason: 'Проект не найден', code: 404 },
        }, { replace: true })
      }
      members.value = await membersStore.findMembers(idParam.value)
      if (members.value.filter(m => +m.id === +usersStore.user!.id).length !== 1) {
        navigateTo({
          path: '/error',
          state: { reason: 'Вы не участник проекта', code: 403 },
        })
      }
    }
  })

  onUnmounted(() => {
    unsubscribe()
  })
})
</script>

<template>
  <TwoColumns>
    <template #col1>
      <v-skeleton-loader
        :loading="!(proj && usersStore.user)"
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
          :things="[{ id: 1, title: 'Редактировать', icon: 'mdi-pencil-outline', link: `/project/editProject/${idParam}` }]"
        />
        <ListOfLinks
          v-if="usersStore.user?.role==='admin'"
          :color="'accent'"
          :things="[{ id: 1, title: 'Удалить', icon: 'mdi-delete-outline', link: '#' }]"
          @click="dialog = true"
        />
        <ListOfLinks
          :role="'prev'"
          :color="'secondary'"
          :things="[{ id: 1, title: 'Назад', link: '/' }]"
        />
        <DeleteWarning
          v-model="dialog"
          :element="'project'"
          :title="`${proj?.dance.group} — ${proj?.dance.title}`"
          @no="dialog=false"
          @yes="dialog=false; projectsStore.delProject(idParam); navigateTo('/')"
        />
      </v-skeleton-loader>
    </template>
    <template
      #col2
    >
      <v-skeleton-loader
        :loading="!members"
        type="image"
        height="70vh"
        class="bg-transparent long-skeleton"
      >
        <ListOfText
          :things="membersThings"
        />
      </v-skeleton-loader>
    </template>
  </TwoColumns>
</template>

<style scoped>
</style>
